"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = exports.GameContainer = exports.WorkerMessages = void 0;
const constants_1 = require("../../common/src/constants");
const random_1 = require("../../common/src/utils/random");
const node_cluster_1 = __importDefault(require("node:cluster"));
const uWebSockets_js_1 = require("uWebSockets.js");
const game_1 = require("./game");
const server_1 = require("./server");
const config_1 = require("./utils/config");
const misc_1 = require("./utils/misc");
const serverHelpers_1 = require("./utils/serverHelpers");
var WorkerMessages;
(function (WorkerMessages) {
    WorkerMessages[WorkerMessages["UpdateTeamMode"] = 0] = "UpdateTeamMode";
    WorkerMessages[WorkerMessages["UpdateMap"] = 1] = "UpdateMap";
    WorkerMessages[WorkerMessages["UpdateMapOptions"] = 2] = "UpdateMapOptions";
    WorkerMessages[WorkerMessages["NewGame"] = 3] = "NewGame";
})(WorkerMessages || (exports.WorkerMessages = WorkerMessages = {}));
class GameContainer {
    id;
    worker;
    promiseCallbacks = [];
    _data = {
        aliveCount: 0,
        allowJoin: false,
        over: false,
        startedTime: -1
    };
    get aliveCount() { return this._data.aliveCount; }
    get allowJoin() { return this._data.allowJoin; }
    get over() { return this._data.over; }
    get startedTime() { return this._data.startedTime; }
    constructor(id, gameManager, resolve) {
        this.id = id;
        this.promiseCallbacks.push(resolve);
        this.worker = node_cluster_1.default.fork({
            id,
            teamMode: gameManager.teamMode.current,
            map: gameManager.map.current,
            mapScaleRange: gameManager.mapScaleRange
        }).on("message", (data) => {
            this._data = { ...this._data, ...data };
            if (data.allowJoin === true) { // This means the game was just created
                gameManager.creating = undefined;
                for (const resolve of this.promiseCallbacks)
                    resolve(this);
                this.promiseCallbacks.length = 0;
            }
        });
    }
    sendMessage(message) {
        this.worker.send(message);
    }
}
exports.GameContainer = GameContainer;
class GameManager {
    games = [];
    creating;
    get playerCount() {
        return this.games.filter(g => !g?.over).reduce((a, b) => (a + (b?.aliveCount ?? 0)), 0);
    }
    teamMode;
    map;
    mode;
    nextMode;
    mapScaleRange = -1;
    constructor() {
        const stringToTeamMode = (teamMode) => {
            switch (teamMode) {
                case "solo":
                default: return constants_1.TeamMode.Solo;
                case "duo": return constants_1.TeamMode.Duo;
                case "squad": return constants_1.TeamMode.Squad;
            }
        };
        let teamModeSchedule;
        if (typeof config_1.Config.teamMode === "string") {
            teamModeSchedule = stringToTeamMode(config_1.Config.teamMode);
        }
        else {
            const { rotation, cron } = config_1.Config.teamMode;
            teamModeSchedule = { rotation: rotation.map(t => stringToTeamMode(t)), cron };
        }
        const humanReadableTeamModes = {
            [constants_1.TeamMode.Solo]: "solos",
            [constants_1.TeamMode.Duo]: "duos",
            [constants_1.TeamMode.Squad]: "squads"
        };
        this.teamMode = new serverHelpers_1.Switcher("teamMode", teamModeSchedule, teamMode => {
            for (const game of this.games) {
                game?.sendMessage({ type: WorkerMessages.UpdateTeamMode, teamMode });
            }
            (0, server_1.resetTeams)();
            (0, serverHelpers_1.serverLog)(`Switching to ${humanReadableTeamModes[teamMode] ?? `team mode ${teamMode}`}`);
        });
        this.map = new serverHelpers_1.Switcher("map", config_1.Config.map, (map, nextMap) => {
            this.mode = (0, misc_1.modeFromMap)(map);
            this.nextMode = (0, misc_1.modeFromMap)(nextMap);
            for (const game of this.games) {
                game?.sendMessage({ type: WorkerMessages.UpdateMap, map });
            }
            (0, server_1.resetTeams)();
            (0, serverHelpers_1.serverLog)(`Switching to "${map}" map`);
        });
        this.mode = (0, misc_1.modeFromMap)(this.map.current);
        this.nextMode = this.map.next ? (0, misc_1.modeFromMap)(this.map.next) : undefined;
    }
    async findGame() {
        if (this.creating)
            return this.creating.id;
        const eligibleGames = this.games.filter((g) => g !== undefined
            && g.allowJoin
            && g.aliveCount < (config_1.Config.maxPlayersPerGame ?? Infinity));
        return (eligibleGames.length
            ? (0, random_1.pickRandomInArray)(eligibleGames)
            : await this.newGame(undefined))?.id;
    }
    async newGame(id) {
        return new Promise(resolve => {
            if (this.creating) {
                this.creating.promiseCallbacks.push(resolve);
            }
            else if (id !== undefined) {
                (0, serverHelpers_1.serverLog)(`Creating new game with ID ${id}`);
                const game = this.games[id];
                if (!game) {
                    this.creating = this.games[id] = new GameContainer(id, this, resolve);
                }
                else if (game.over) {
                    game.promiseCallbacks.push(resolve);
                    game.sendMessage({ type: WorkerMessages.NewGame });
                    this.creating = game;
                }
                else {
                    (0, serverHelpers_1.serverWarn)(`Game with ID ${id} already exists`);
                    resolve(game);
                }
            }
            else {
                const maxGames = config_1.Config.maxGames;
                for (let i = 0; i < maxGames; i++) {
                    const game = this.games[i];
                    (0, serverHelpers_1.serverLog)("Game", i, "exists:", !!game, "over:", game?.over ?? "-", "runtime:", game ? `${Math.round((Date.now() - (game.startedTime ?? 0)) / 1000)}s` : "-", "aliveCount:", game?.aliveCount ?? "-");
                    if (!game || game.over) {
                        void this.newGame(i).then(resolve);
                        return;
                    }
                }
                (0, serverHelpers_1.serverWarn)("Unable to create new game, no slots left");
                resolve(undefined);
            }
        });
    }
    updateMapScaleRange() {
        const mapScaleRanges = config_1.Config.mapScaleRanges;
        if (!mapScaleRanges)
            return;
        const playerCount = this.playerCount;
        this.mapScaleRange = -1;
        for (let i = 0, len = mapScaleRanges.length; i < len; i++) {
            const { minPlayers, maxPlayers } = mapScaleRanges[i];
            if (playerCount < minPlayers || playerCount > maxPlayers)
                continue;
            this.mapScaleRange = i;
        }
        for (const game of this.games) {
            game?.sendMessage({ type: WorkerMessages.UpdateMapOptions, mapScaleRange: this.mapScaleRange });
        }
    }
}
exports.GameManager = GameManager;
if (!node_cluster_1.default.isPrimary) {
    const data = process.env;
    const id = parseInt(data.id);
    let teamMode = parseInt(data.teamMode);
    let map = data.map;
    let mapOptions = data.mapScaleRange ? config_1.Config.mapScaleRanges?.[parseInt(data.mapScaleRange)] : undefined;
    let game = new game_1.Game(id, teamMode, map, mapOptions);
    process.on("uncaughtException", e => {
        game.error("An unhandled error occurred. Details:", e);
        game.kill();
    });
    process.on("message", (message) => {
        switch (message.type) {
            case WorkerMessages.UpdateTeamMode: {
                teamMode = message.teamMode;
                break;
            }
            case WorkerMessages.UpdateMap: {
                map = message.map;
                game.kill();
                break;
            }
            case WorkerMessages.UpdateMapOptions: {
                mapOptions = config_1.Config.mapScaleRanges?.[message.mapScaleRange];
                break;
            }
            case WorkerMessages.NewGame: {
                game.kill();
                game = new game_1.Game(id, teamMode, map, mapOptions);
                game.setGameData({ allowJoin: true });
                break;
            }
        }
    });
    setInterval(() => {
        const memoryUsage = process.memoryUsage().rss;
        game.log(`RAM usage: ${Math.round(memoryUsage / 1024 / 1024 * 100) / 100} MB`);
    }, 60000);
    const { maxSimultaneousConnections, maxJoinAttempts } = config_1.Config;
    const simultaneousConnections = maxSimultaneousConnections
        ? new serverHelpers_1.RateLimiter(maxSimultaneousConnections)
        : undefined;
    const joinAttempts = maxJoinAttempts
        ? new serverHelpers_1.RateLimiter(maxJoinAttempts.count, maxJoinAttempts.duration)
        : undefined;
    (0, uWebSockets_js_1.App)().ws("/play", {
        async upgrade(res, req, context) {
            let aborted = false;
            res.onAborted(() => aborted = true);
            if (!game.allowJoin) {
                (0, serverHelpers_1.forbidden)(res);
                return;
            }
            // These lines must be before the await to prevent uWS errors
            // Accessing req isn't allowed after an await
            const ip = (0, serverHelpers_1.getIP)(res, req);
            const searchParams = new URLSearchParams(req.getQuery());
            const webSocketKey = req.getHeader("sec-websocket-key");
            const webSocketProtocol = req.getHeader("sec-websocket-protocol");
            const webSocketExtensions = req.getHeader("sec-websocket-extensions");
            if (simultaneousConnections?.isLimited(ip)) {
                game.warn(ip, "exceeded maximum simultaneous connections");
                (0, serverHelpers_1.forbidden)(res);
                return;
            }
            if (joinAttempts?.isLimited(ip)) {
                game.warn(ip, "exceeded maximum join attempts");
                (0, serverHelpers_1.forbidden)(res);
                return;
            }
            joinAttempts?.increment(ip);
            const punishment = await (0, serverHelpers_1.getPunishment)(ip);
            if (aborted)
                return;
            if (punishment) {
                (0, serverHelpers_1.forbidden)(res);
                return;
            }
            const { role, isDev, nameColor } = (0, serverHelpers_1.parseRole)(searchParams);
            res.cork(() => res.upgrade({
                ip,
                teamID: searchParams.get("teamID") ?? undefined,
                autoFill: Boolean(searchParams.get("autoFill")),
                role,
                isDev,
                nameColor,
                lobbyClearing: searchParams.get("lobbyClearing") === "true",
                weaponPreset: searchParams.get("weaponPreset") ?? ""
            }, webSocketKey, webSocketProtocol, webSocketExtensions, context));
        },
        open(socket) {
            const data = socket.getUserData();
            data.player = game.addPlayer(socket);
            if (data.player === undefined)
                return;
            simultaneousConnections?.increment(data.ip);
            // data.player.sendGameOverPacket(false); // uncomment to test game over screen
        },
        message(socket, message) {
            try {
                game.onMessage(socket.getUserData().player, message);
            }
            catch (e) {
                console.warn("Error parsing message:", e);
            }
        },
        close(socket) {
            const { player, ip } = socket.getUserData();
            if (player)
                game.removePlayer(player);
            if (ip)
                simultaneousConnections?.decrement(ip);
        }
    }).listen(config_1.Config.hostname, config_1.Config.port + id + 1, () => {
        game.setGameData({ allowJoin: true });
        game.log(`Listening on ${config_1.Config.hostname}:${config_1.Config.port + id + 1}`);
    });
}
//# sourceMappingURL=gameManager.js.map