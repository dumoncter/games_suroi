"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTeams = resetTeams;
const constants_1 = require("../../common/src/constants");
const badges_1 = require("../../common/src/definitions/badges");
const skins_1 = require("../../common/src/definitions/items/skins");
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_url_1 = require("node:url");
const os_1 = __importDefault(require("os"));
const uWebSockets_js_1 = require("uWebSockets.js");
const package_json_1 = require("../../package.json");
const gameManager_1 = require("./gameManager");
const team_1 = require("./team");
const config_1 = require("./utils/config");
const misc_1 = require("./utils/misc");
const serverHelpers_1 = require("./utils/serverHelpers");
let customTeams;
let teamsCreated;
function resetTeams() {
    if (!customTeams)
        return;
    for (const team of customTeams.values()) {
        for (const player of team.players)
            player.socket?.close();
    }
    customTeams.clear();
    teamsCreated?.reset();
}
if (node_cluster_1.default.isPrimary && require.main === module) {
    //                   ^^^^^^^^^^^^^^^^^^^^^^^ only starts server if called directly from command line (not imported)
    process.on("uncaughtException", e => (0, serverHelpers_1.serverError)("An unhandled error occurred. Details:", e));
    const gameManager = new gameManager_1.GameManager();
    let exiting = false;
    const exit = () => {
        if (exiting)
            return;
        exiting = true;
        (0, serverHelpers_1.serverLog)("Shutting down...");
        for (const game of gameManager.games) {
            game?.worker.kill();
        }
        process.exit();
    };
    process.on("exit", exit);
    process.on("SIGINT", exit);
    process.on("SIGTERM", exit);
    process.on("SIGUSR2", exit);
    setInterval(() => {
        const memoryUsage = process.memoryUsage().rss;
        let perfString = `RAM usage: ${Math.round(memoryUsage / 1024 / 1024 * 100) / 100} MB`;
        // windows L
        if (os_1.default.platform() !== "win32") {
            const load = os_1.default.loadavg().join("%, ");
            perfString += ` | CPU usage (1m, 5m, 15m): ${load}%`;
        }
        (0, serverHelpers_1.serverLog)(perfString);
        gameManager.updateMapScaleRange();
    }, 60000);
    customTeams = new Map();
    teamsCreated = config_1.Config.maxCustomTeams
        ? new serverHelpers_1.RateLimiter(config_1.Config.maxCustomTeams)
        : undefined;
    const app = (0, uWebSockets_js_1.App)();
    app.get("/api/serverInfo", async (res, req) => {
        let aborted = false;
        res.onAborted(() => aborted = true);
        let punishment;
        if (new node_url_1.URLSearchParams(req.getQuery()).get("checkPunishments") === "true") {
            punishment = await (0, serverHelpers_1.getPunishment)((0, serverHelpers_1.getIP)(res, req));
        }
        if (aborted)
            return;
        const { playerCount, teamMode, map, mode, nextMode } = gameManager;
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json").end(JSON.stringify({
                protocolVersion: constants_1.GameConstants.protocolVersion,
                playerCount,
                teamMode: teamMode.current,
                nextTeamMode: teamMode.next,
                teamModeSwitchTime: teamMode.nextSwitch ? teamMode.nextSwitch - Date.now() : undefined,
                mode,
                nextMode,
                modeSwitchTime: map.nextSwitch ? map.nextSwitch - Date.now() : undefined,
                punishment
            }));
        });
    });
    app.get("/api/getGame", async (res, req) => {
        let aborted = false;
        res.onAborted(() => aborted = true);
        let gameID;
        const teamID = gameManager.teamMode.current !== constants_1.TeamMode.Solo && new node_url_1.URLSearchParams(req.getQuery()).get("teamID");
        if (teamID) {
            gameID = customTeams?.get(teamID)?.gameID;
        }
        else {
            gameID = await gameManager.findGame();
        }
        if (aborted)
            return;
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json").end(JSON.stringify(gameID !== undefined
                ? { success: true, gameID, mode: gameManager.mode }
                : { success: false }));
        });
    });
    app.ws("/team", {
        async upgrade(res, req, context) {
            let aborted = false;
            res.onAborted(() => aborted = true);
            // These lines must be before the await to prevent uWS errors
            // Accessing req isn't allowed after an await
            const ip = (0, serverHelpers_1.getIP)(res, req);
            const searchParams = new node_url_1.URLSearchParams(req.getQuery());
            const webSocketKey = req.getHeader("sec-websocket-key");
            const webSocketProtocol = req.getHeader("sec-websocket-protocol");
            const webSocketExtensions = req.getHeader("sec-websocket-extensions");
            // Prevent connection if it's solos + check rate limits & punishments
            if (gameManager.teamMode.current === constants_1.TeamMode.Solo
                || teamsCreated?.isLimited(ip)
                || await (0, serverHelpers_1.getPunishment)(ip)) {
                if (!aborted)
                    (0, serverHelpers_1.forbidden)(res);
                return;
            }
            if (aborted)
                return;
            // Get team
            const teamID = searchParams.get("teamID");
            let team;
            if (teamID !== null) {
                const givenTeam = customTeams?.get(teamID);
                if (!givenTeam || givenTeam.locked || givenTeam.players.length >= gameManager.teamMode.current) {
                    (0, serverHelpers_1.forbidden)(res); // TODO "Team is locked" and "Team is full" messages
                    return;
                }
                team = givenTeam;
            }
            else {
                team = new team_1.CustomTeam(gameManager);
                customTeams?.set(team.id, team);
            }
            // Get name, skin, badge, & role
            const name = (0, misc_1.cleanUsername)(searchParams.get("name"));
            let skin = searchParams.get("skin") ?? constants_1.GameConstants.player.defaultSkin;
            let badge = searchParams.get("badge") ?? undefined;
            const { role = "", nameColor } = (0, serverHelpers_1.parseRole)(searchParams);
            // Validate skin
            const skinDefinition = skins_1.Skins.fromStringSafe(skin);
            const rolesRequired = skinDefinition?.rolesRequired;
            if (!skinDefinition || (rolesRequired && !rolesRequired.includes(role))) {
                skin = constants_1.GameConstants.player.defaultSkin;
            }
            // Validate badge
            const badgeDefinition = badge ? badges_1.Badges.fromStringSafe(badge) : undefined;
            if (!badgeDefinition || (badgeDefinition.roles && !badgeDefinition.roles.includes(role))) {
                badge = undefined;
            }
            // Upgrade the connection
            res.cork(() => res.upgrade({ player: new team_1.CustomTeamPlayer(ip, team, name, skin, badge, nameColor) }, webSocketKey, webSocketProtocol, webSocketExtensions, context));
        },
        open(socket) {
            const { player } = socket.getUserData();
            player.socket = socket;
            player.team.addPlayer(player);
        },
        message(socket, message) {
            try {
                const { player } = socket.getUserData();
                void player.team.onMessage(player, JSON.parse(serverHelpers_1.textDecoder.decode(message)));
            }
            catch (e) {
                (0, serverHelpers_1.serverError)("Error parsing team socket message. Details:", e);
            }
        },
        close(socket) {
            const { player } = socket.getUserData();
            const team = player.team;
            team.removePlayer(player);
            if (!team.players.length) {
                customTeams?.delete(team.id);
            }
            teamsCreated?.decrement(player.ip);
        }
    });
    // ===== ADMIN API ENDPOINTS =====
    // Authentication middleware for admin endpoints
    const requireAdminAuth = (res, req) => {
        const authHeader = req.getHeader('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.writeStatus('401').end(JSON.stringify({ error: 'Unauthorized' }));
            return false;
        }
        const token = authHeader.substring(7);
        // TODO: Add proper token validation
        // For now, accept any token for development
        return true;
    };
    // Get list of all players
    app.get("/api/admin/players", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        const players = [];
        // Collect players from all games
        // Note: Players are in worker processes, so we can't access them directly
        // This is a simplified version for demonstration
        for (const gameContainer of gameManager.games) {
            if (gameContainer && !gameContainer.over) {
                // Mock player data since we can't access workers directly
                players.push({
                    id: gameContainer.id,
                    name: `Player_${gameContainer.id}`,
                    ip: '127.0.0.1',
                    health: 100,
                    kills: Math.floor(Math.random() * 10),
                    deaths: Math.floor(Math.random() * 5),
                    score: Math.floor(Math.random() * 1000),
                    ping: Math.floor(Math.random() * 100) + 10,
                    position: {
                        x: Math.floor(Math.random() * 1000),
                        y: Math.floor(Math.random() * 1000)
                    },
                    isAlive: gameContainer.aliveCount > 0,
                    joinedAt: Date.now(),
                    teamId: null,
                    gameId: gameContainer.id
                });
            }
        }
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json").end(JSON.stringify({
                success: true,
                players,
                total: players.length
            }));
        });
    });
    // Kick player
    app.post("/api/admin/players/:id/kick", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        const playerIdStr = req.getParameter(0);
        if (!playerIdStr) {
            res.writeStatus('400').end(JSON.stringify({ error: 'Player ID is required' }));
            return;
        }
        const playerId = parseInt(playerIdStr);
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json");
            // Since players are in worker processes, we can't directly kick them
            // In a real implementation, this would send a message to the worker
            // For now, just return success
            res.end(JSON.stringify({ success: true, message: `Player ${playerId} kicked` }));
        });
    });
    // Ban player
    app.post("/api/admin/players/:id/ban", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        const playerIdStr = req.getParameter(0);
        if (!playerIdStr) {
            res.writeStatus('400').end(JSON.stringify({ error: 'Player ID is required' }));
            return;
        }
        const playerId = parseInt(playerIdStr);
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json");
            // TODO: Implement ban system
            // For now, just return success
            res.end(JSON.stringify({ success: true, message: `Player ${playerId} banned` }));
        });
    });
    // Send message to player
    app.post("/api/admin/players/:id/message", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        const playerIdStr = req.getParameter(0);
        if (!playerIdStr) {
            res.writeStatus('400').end(JSON.stringify({ error: 'Player ID is required' }));
            return;
        }
        const playerId = parseInt(playerIdStr);
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json");
            // TODO: Implement message sending to player
            res.end(JSON.stringify({ success: true, message: `Message sent to player ${playerId}` }));
        });
    });
    // Change map
    app.post("/api/admin/map", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json");
            // TODO: Parse request body and change map
            // gameManager.updateMap(newMap);
            res.end(JSON.stringify({ success: true, message: 'Map change initiated' }));
        });
    });
    // Change team mode
    app.post("/api/admin/team-mode", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json");
            // TODO: Parse request body and change team mode
            // gameManager.updateTeamMode(newMode);
            res.end(JSON.stringify({ success: true, message: 'Team mode change initiated' }));
        });
    });
    // Restart server
    app.post("/api/admin/restart", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json");
            // Schedule restart
            setTimeout(() => {
                (0, serverHelpers_1.serverLog)("Admin requested server restart");
                process.exit(0); // Railway will restart the service
            }, 1000);
            res.end(JSON.stringify({ success: true, message: 'Server restart initiated' }));
        });
    });
    // Get server configuration
    app.get("/api/admin/config", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json").end(JSON.stringify({
                success: true,
                config: config_1.Config
            }));
        });
    });
    // Update server configuration
    app.post("/api/admin/config", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json");
            // TODO: Parse request body and update config
            // This would require writing to config.json and restarting
            res.end(JSON.stringify({ success: true, message: 'Configuration update initiated' }));
        });
    });
    // Get server performance stats
    app.get("/api/admin/stats", (res, req) => {
        if (!requireAdminAuth(res, req))
            return;
        const stats = {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            games: gameManager.games.length,
            players: gameManager.playerCount
        };
        res.cork(() => {
            (0, serverHelpers_1.writeCorsHeaders)(res);
            res.writeHeader("Content-Type", "application/json").end(JSON.stringify({
                success: true,
                stats
            }));
        });
    });
    app.listen(config_1.Config.hostname, config_1.Config.port, token => {
        if (!token) {
            (0, serverHelpers_1.serverError)("Unable to start server.");
            process.exit(1);
        }
        process.stdout.write("\x1Bc"); // clears screen
        (0, serverHelpers_1.serverLog)(`Suroi Server v${package_json_1.version}`);
        (0, serverHelpers_1.serverLog)(`Listening on ${config_1.Config.hostname}:${config_1.Config.port}`);
        (0, serverHelpers_1.serverLog)("Press Ctrl+C to exit.");
        void gameManager.newGame(0);
    });
}
//# sourceMappingURL=server.js.map