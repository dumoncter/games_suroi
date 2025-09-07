"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const constants_1 = require("../../../common/src/constants");
const bullets_1 = require("../../../common/src/definitions/bullets");
const perks_1 = require("../../../common/src/definitions/items/perks");
const loots_1 = require("../../../common/src/definitions/loots");
const mapPings_1 = require("../../../common/src/definitions/mapPings");
const modes_1 = require("../../../common/src/definitions/modes");
const obstacles_1 = require("../../../common/src/definitions/obstacles");
const syncedParticles_1 = require("../../../common/src/definitions/syncedParticles");
const joinedPacket_1 = require("../../../common/src/packets/joinedPacket");
const packet_1 = require("../../../common/src/packets/packet");
const packetStream_1 = require("../../../common/src/packets/packetStream");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const logging_1 = require("../../../common/src/utils/logging");
const math_1 = require("../../../common/src/utils/math");
const misc_1 = require("../../../common/src/utils/misc");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../common/src/utils/random");
const suroiByteStream_1 = require("../../../common/src/utils/suroiByteStream");
const vector_1 = require("../../../common/src/utils/vector");
const gasStages_1 = require("./data/gasStages");
const maps_1 = require("./data/maps");
const gas_1 = require("./gas");
const gunItem_1 = require("./inventory/gunItem");
const map_1 = require("./map");
const bullet_1 = require("./objects/bullet");
const decal_1 = require("./objects/decal");
const explosion_1 = require("./objects/explosion");
const loot_1 = require("./objects/loot");
const parachute_1 = require("./objects/parachute");
const player_1 = require("./objects/player");
const projectile_1 = require("./objects/projectile");
const syncedParticle_1 = require("./objects/syncedParticle");
const pluginManager_1 = require("./pluginManager");
const team_1 = require("./team");
const config_1 = require("./utils/config");
const grid_1 = require("./utils/grid");
const idAllocator_1 = require("./utils/idAllocator");
const lootHelpers_1 = require("./utils/lootHelpers");
const misc_2 = require("./utils/misc");
const mapIndicator_1 = require("./objects/mapIndicator");
class Game {
    id;
    map;
    gas;
    grid;
    pluginManager = new pluginManager_1.PluginManager(this);
    modeName;
    mode;
    partialDirtyObjects = new Set();
    fullDirtyObjects = new Set();
    updateObjects = false;
    livingPlayers = new Set();
    connectedPlayers = new Set();
    spectatablePlayers = [];
    /**
     * New players created this tick
     */
    newPlayers = [];
    /**
    * Players deleted this tick
    */
    deletedPlayers = [];
    /**
     * Packets created this tick that will be sent to all players
     */
    packets = [];
    teamMode;
    isTeamMode;
    teams = new (class SetArray extends Set {
        _valueCache;
        get valueArray() {
            return this._valueCache ??= Array.from(super.values());
        }
        add(value) {
            super.add(value);
            this._valueCache = undefined;
            return this;
        }
        delete(value) {
            const ret = super.delete(value);
            this._valueCache = undefined;
            return ret;
        }
        clear() {
            super.clear();
            this._valueCache = undefined;
        }
        values() {
            const iterator = this.values();
            this._valueCache ??= Array.from(iterator);
            return iterator;
        }
    })();
    _nextTeamID = -1;
    get nextTeamID() { return ++this._nextTeamID; }
    customTeams = new globalThis.Map();
    explosions = [];
    emotes = [];
    unlockableDoors = [];
    /**
     * All bullets that currently exist
     */
    bullets = new Set();
    /**
     * All bullets created this tick
     */
    newBullets = [];
    /**
     * All airdrops
     */
    airdrops = [];
    /**
     * All planes this tick
     */
    planes = [];
    /**
     * All map pings this tick
     */
    mapPings = [];
    mapIndicatorIDAllocator = new idAllocator_1.IDAllocator(8);
    get nextMapIndicatorID() {
        return this.mapIndicatorIDAllocator.takeNext();
    }
    mapIndicators = [];
    killLeader;
    killLeaderDirty = false;
    _spawnableItemTypeCache = [];
    _spawnableLoots;
    get spawnableLoots() {
        return this._spawnableLoots ??= (0, lootHelpers_1.getSpawnableLoots)(this.modeName, this.map.mapDef, this._spawnableItemTypeCache);
    }
    _allItemsTypeCache = [];
    _allLoots;
    get allLoots() {
        return this._allLoots ??= (0, lootHelpers_1.getAllLoots)(this._allItemsTypeCache);
    }
    _timeouts = new Set();
    addTimeout(callback, delay = 0) {
        const timeout = new misc_1.Timeout(callback, this.now + delay);
        this._timeouts.add(timeout);
        return timeout;
    }
    _started = false;
    _stopped = false;
    startedTime = Number.MAX_VALUE; // Default of Number.MAX_VALUE makes it so games that haven't started yet are joined first
    allowJoin = false;
    over = false;
    get aliveCount() {
        return this.livingPlayers.size;
    }
    aliveCountDirty = false;
    spawnWindow;
    /**
     * The value of `Date.now()`, as of the start of the tick.
     */
    _now = Date.now();
    get now() { return this._now; }
    startTimeout;
    _start = this._now;
    get start() { return this._start; }
    idealDt = 1000 / (config_1.Config.tps ?? constants_1.GameConstants.tps);
    /**
     * Game Tick delta time
     */
    _dt = this.idealDt;
    get dt() { return this._dt; }
    _tickTimes = [];
    _idAllocator = new idAllocator_1.IDAllocator(16);
    /**
     * **Warning**: This is a getter _with side effects_! Make
     * sure to either use the id returned by this getter or
     * to return it.
     */
    get nextObjectID() {
        return this._idAllocator.takeNext();
    }
    constructor(id, teamMode, map, mapOptions = {}) {
        this.id = id;
        this.teamMode = teamMode;
        this.isTeamMode = this.teamMode > constants_1.TeamMode.Solo;
        this.updateGameData({
            aliveCount: 0,
            allowJoin: false,
            over: false,
            startedTime: Number.MAX_VALUE // Makes it so games that haven't started yet are joined first
        });
        this.mode = modes_1.Modes[this.modeName = (0, misc_2.modeFromMap)(map)];
        this.spawnWindow = mapOptions.gameSpawnWindow ?? gasStages_1.GAME_SPAWN_WINDOW;
        void this.pluginManager.loadPlugins();
        const { width, height } = maps_1.Maps[map.split(":")[0]];
        this.grid = new grid_1.Grid(this, width, height);
        this.map = new map_1.GameMap(this, map, mapOptions);
        this.gas = new gas_1.Gas(this);
        this.pluginManager.emit("game_created", this);
        this.log(`Created in ${Date.now() - this._start} ms`);
        // Bots are now handled by separate AI client
        // No longer spawning bots on server side
        // Start the tick loop
        this.tick();
    }
    log(...message) {
        logging_1.Logger.log((0, logging_1.styleText)(`[Game ${this.id}]`, logging_1.ColorStyles.foreground.green.normal), ...message);
    }
    warn(...message) {
        logging_1.Logger.log((0, logging_1.styleText)(`[Game ${this.id}] [WARNING]`, logging_1.ColorStyles.foreground.yellow.normal), ...message);
    }
    error(...message) {
        logging_1.Logger.log((0, logging_1.styleText)(`[Game ${this.id}] [ERROR]`, logging_1.ColorStyles.foreground.red.normal), ...message);
    }
    onMessage(player, message) {
        if (!player)
            return;
        const packetStream = new packetStream_1.PacketStream(new suroiByteStream_1.SuroiByteStream(message));
        while (true) {
            const packet = packetStream.deserialize();
            if (packet === undefined)
                break;
            switch (packet.type) {
                case packet_1.PacketType.Join:
                    this.activatePlayer(player, packet);
                    break;
                case packet_1.PacketType.Input:
                    // Ignore input packets from players that haven't finished joining, dead players, or if the game is over
                    if (!player.joined || player.dead || this.over)
                        break;
                    player.processInputs(packet);
                    break;
                case packet_1.PacketType.Spectate:
                    player.spectate(packet);
                    break;
            }
        }
    }
    tick() {
        const now = Date.now();
        this._dt = now - this._now;
        this._now = now;
        // execute timeouts
        for (const timeout of this._timeouts) {
            if (timeout.killed) {
                this._timeouts.delete(timeout);
                continue;
            }
            if (this.now > timeout.end) {
                timeout.callback();
                this._timeouts.delete(timeout);
            }
        }
        for (const loot of this.grid.pool.getCategory(constants_1.ObjectCategory.Loot)) {
            loot.update();
        }
        for (const parachute of this.grid.pool.getCategory(constants_1.ObjectCategory.Parachute)) {
            parachute.update();
        }
        for (const projectile of this.grid.pool.getCategory(constants_1.ObjectCategory.Projectile)) {
            projectile.update();
        }
        for (const syncedParticle of this.grid.pool.getCategory(constants_1.ObjectCategory.SyncedParticle)) {
            syncedParticle.update();
        }
        // Update bullets
        let records = [];
        for (const bullet of this.bullets) {
            records = records.concat(bullet.update());
            if (bullet.dead) {
                if (!bullet.reflected) {
                    const { onHitExplosion } = bullet.definition;
                    if (onHitExplosion) {
                        this.addExplosion(onHitExplosion, bullet.position, bullet.shooter, bullet.layer, bullet.sourceGun instanceof gunItem_1.GunItem ? bullet.sourceGun : undefined);
                    }
                }
                this.bullets.delete(bullet);
            }
        }
        /*
            Do the damage after updating all bullets
            This is to make sure bullets hitting the same object on the same tick will all die so
            they don't de-sync with the client

            Example: a shotgun insta-killing a crate—on the client all bullets will hit the crate,
            while on the server, the usual approach of dealing damage on-update would cause some
            bullets to pass through unhindered since the crate would have been destroyed by the
            first pellets.
        */
        for (const { object, damage, source, weapon, position } of records) {
            object.damage({
                amount: damage,
                source,
                weaponUsed: weapon,
                position: position
            });
            const { onHitProjectile, enemySpeedMultiplier, removePerk } = weapon.definition.ballistics;
            if (onHitProjectile
                && !("definition" in object
                    && (object.definition.noCollisions || object.definition.noBulletCollision))) {
                const proj = this.addProjectile({
                    owner: source,
                    position,
                    definition: onHitProjectile,
                    height: 0,
                    velocity: (0, vector_1.Vec)(0, 0),
                    layer: object.layer,
                    rotation: (0, random_1.randomRotation)()
                });
                if (object.isPlayer) {
                    (object.stuckProjectiles ??= new Map()).set(proj, math_1.Angle.betweenPoints(position, object.position) - object.rotation);
                }
            }
            if (enemySpeedMultiplier
                && object.isPlayer
                && source.isPlayer
                && (!this.isTeamMode || object.teamID !== source.teamID || object.id === source.id)) {
                object.effectSpeedMultiplier = enemySpeedMultiplier.multiplier;
                object.effectSpeedTimeout?.kill();
                object.effectSpeedTimeout = this.addTimeout(() => object.effectSpeedMultiplier = 1, enemySpeedMultiplier.duration);
            }
            if (object.isPlayer && removePerk) {
                object.removePerk(removePerk);
                if (removePerk === "infected" /* PerkIds.Infected */) { // evil
                    const immunity = perks_1.PerkData["immunity" /* PerkIds.Immunity */];
                    object.addPerk(immunity);
                    object.immunityTimeout?.kill();
                    object.immunityTimeout = this.addTimeout(() => object.removePerk(immunity), immunity.duration);
                    object.setDirty();
                }
            }
            if (object.isPlayer && source.isPlayer && source.hasPerk("hollow_points" /* PerkIds.HollowPoints */)) {
                (source.recentlyHitPlayers ??= new Map())
                    .set(object, this.now);
                (source.highlightedIndicators ??= new Map())
                    .set(object, new mapIndicator_1.MapIndicator(this, "player_indicator", object.position));
            }
        }
        // Handle explosions
        for (const explosion of this.explosions) {
            explosion.explode();
        }
        // Update gas
        this.gas.tick();
        // First loop over players: movement, animations, & actions
        for (const player of this.livingPlayers) {
            player.update();
        }
        // Serialize dirty objects
        for (const partialObject of this.partialDirtyObjects) {
            if (this.fullDirtyObjects.has(partialObject))
                continue;
            partialObject.serializePartial();
        }
        for (const fullObject of this.fullDirtyObjects) {
            fullObject.serializeFull();
        }
        // Second loop over players: calculate visible objects & send updates
        for (const player of this.connectedPlayers) {
            player.secondUpdate();
        }
        // Third loop over players: clean up after all packets have been sent
        for (const player of this.connectedPlayers) {
            player.postPacket();
        }
        for (const indicator of this.mapIndicators) {
            if (indicator.dead) {
                this.mapIndicatorIDAllocator.give(indicator.id);
                (0, misc_1.removeFrom)(this.mapIndicators, indicator);
                continue;
            }
            indicator.positionDirty = false;
            indicator.definitionDirty = false;
        }
        // Reset everything
        this.fullDirtyObjects.clear();
        this.partialDirtyObjects.clear();
        this.newBullets.length = 0;
        this.explosions.length = 0;
        this.emotes.length = 0;
        this.newPlayers.length = 0;
        this.deletedPlayers.length = 0;
        this.packets.length = 0;
        this.planes.length = 0;
        this.mapPings.length = 0;
        this.killLeaderDirty = false;
        this.aliveCountDirty = false;
        this.gas.dirty = false;
        this.gas.completionRatioDirty = false;
        this.updateObjects = false;
        // Winning logic
        if (this._started
            && !this.over
            && (config_1.Config.minTeamsToStart ?? 2) > 1
            && (this.isTeamMode
                ? this.aliveCount <= this.teamMode && new Set([...this.livingPlayers].map(p => p.teamID)).size <= 1
                : this.aliveCount <= 1)
            && this.now - this.startedTime > 5000) {
            for (const player of this.livingPlayers) {
                const { movement } = player;
                movement.up = movement.down = movement.left = movement.right = false;
                player.attacking = false;
                player.sendEmote(player.loadout.emotes[6], true);
                player.sendGameOverPacket(true);
                this.pluginManager.emit("player_did_win", player);
            }
            this.pluginManager.emit("game_end", this);
            this.setGameData({ allowJoin: false, over: true });
            // End the game in 1 second
            this.addTimeout(() => {
                for (const player of this.connectedPlayers) {
                    player.disconnect("Game ended");
                }
                this._stopped = true;
                this.log("Ended");
            }, 1000);
        }
        // Record performance and start the next tick
        // THIS TICK COUNTER IS WORKING CORRECTLY!
        // It measures the time it takes to calculate a tick, not the time between ticks.
        const tickTime = Date.now() - now;
        this._tickTimes.push(tickTime);
        if (this._tickTimes.length >= 200) {
            const mspt = math_1.Statistics.average(this._tickTimes);
            const stddev = math_1.Statistics.stddev(this._tickTimes);
            this.log(`ms/tick: ${mspt.toFixed(2)} ± ${stddev.toFixed(2)} | Load: ${((mspt / this.idealDt) * 100).toFixed(1)}%`);
            this._tickTimes.length = 0;
        }
        this.pluginManager.emit("game_tick", this);
        if (!this._stopped) {
            setTimeout(this.tick.bind(this), this.idealDt - (Date.now() - now));
        }
    }
    setGameData(data) {
        for (const [key, value] of Object.entries(data)) {
            // HACK this is kinda really fkin dumb, i dunno why this isn't working
            this[key] = value;
        }
        this.updateGameData(data);
    }
    updateGameData(data) {
        process.send?.(data);
    }
    kill() {
        for (const player of this.connectedPlayers) {
            player.disconnect("Game killed");
        }
        this.setGameData({
            allowJoin: false,
            over: true
        });
        this._stopped = true;
        this.log("Killed");
    }
    updateKillLeader(player) {
        const killLeader = this.killLeader;
        if (player.kills > (killLeader?.kills ?? (constants_1.GameConstants.player.killLeaderMinKills - 1))
            && !player.dead
            && player !== killLeader) {
            this.killLeader = player;
            this.killLeaderDirty = true;
        }
        else if (player === killLeader) {
            this.killLeaderDirty = true;
        }
    }
    findNewKillLeader() {
        let mostKills = constants_1.GameConstants.player.killLeaderMinKills - 1;
        let newKillLeader;
        for (const player of this.livingPlayers) {
            if (player.kills > mostKills) {
                mostKills = player.kills;
                newKillLeader = player;
            }
            else if (player.kills === mostKills) { // multiple players with the same kills means no leader
                newKillLeader = undefined;
            }
        }
        this.killLeader = newKillLeader;
        this.killLeaderDirty = true;
    }
    addPlayer(socket) {
        const rejectedBy = this.pluginManager.emit("player_will_connect");
        if (rejectedBy) {
            socket?.end(1000, `Connection rejected by server plugin '${rejectedBy.constructor.name}'`);
            return;
        }
        let spawnPosition;
        let spawnLayer;
        let team;
        if (this.isTeamMode) {
            const { teamID, autoFill } = socket?.getUserData() ?? {};
            if (teamID) {
                team = this.customTeams.get(teamID);
                if (!team // team doesn't exist
                    || (team.players.length && !team.hasLivingPlayers()) // team isn't empty but has no living players
                    || team.players.length >= this.teamMode // team is full
                ) {
                    this.teams.add(team = new team_1.Team(this.nextTeamID, autoFill));
                    this.customTeams.set(teamID, team);
                }
            }
            else {
                const vacantTeams = this.teams.valueArray.filter(team => team.autoFill
                    && team.players.length < this.teamMode
                    && team.hasLivingPlayers());
                if (vacantTeams.length) {
                    team = (0, random_1.pickRandomInArray)(vacantTeams);
                }
                else {
                    this.teams.add(team = new team_1.Team(this.nextTeamID));
                }
            }
        }
        const spawnOptions = !config_1.Config.spawn || config_1.Config.spawn.mode === "default"
            ? this.map.mapDef.spawn ?? { mode: "random" }
            : config_1.Config.spawn;
        switch (spawnOptions.mode) {
            case "random": {
                const hitbox = new hitbox_1.CircleHitbox(5);
                const gasPosition = this.gas.newPosition;
                const gasRadius = this.gas.newRadius ** 2;
                const teamPosition = this.isTeamMode && team
                    ? (0, random_1.pickRandomInArray)(team.getLivingPlayers())?.position
                    : undefined;
                let foundPosition = false;
                const maxTries = 200;
                const spawnDistance = 160;
                const distanceInterval = 20;
                const reduceDistanceAmount = 10;
                for (let tries = 0; !foundPosition && tries < maxTries; tries++) {
                    const position = this.map.getRandomPosition(hitbox, {
                        maxAttempts: 500,
                        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
                        getPosition: this.isTeamMode && teamPosition
                            ? () => (0, random_1.randomPointInsideCircle)(teamPosition, 20, 10)
                            : undefined,
                        collides: position => math_1.Geometry.distanceSquared(position, gasPosition) >= gasRadius
                    });
                    // Break if the above code couldn't find a valid position, as it's unlikely that subsequent loops will
                    if (!position)
                        break;
                    spawnPosition = position;
                    const minSpawnDist = math_1.Numeric.clamp(spawnDistance - (Math.floor(tries / distanceInterval) * reduceDistanceAmount), 0, spawnDistance);
                    foundPosition = true;
                    const radiusHitbox = new hitbox_1.CircleHitbox(minSpawnDist, spawnPosition);
                    for (const object of this.grid.intersectsHitbox(radiusHitbox)) {
                        if (object.isPlayer
                            && !object.dead
                            && (!this.isTeamMode || !team?.players.includes(object))) {
                            foundPosition = false;
                        }
                    }
                }
                // Spawn on top of a random teammate if a valid position couldn't be found
                if (!foundPosition && teamPosition)
                    spawnPosition = teamPosition;
                break;
            }
            case "fixed":
            default: {
                const [x, y, layer] = spawnOptions?.position ?? [];
                const position = (0, vector_1.Vec)(x ?? this.map.width / 2, y ?? this.map.height / 2);
                if (spawnOptions?.radius) {
                    spawnPosition = (0, random_1.randomPointInsideCircle)(position, spawnOptions.radius);
                }
                else {
                    spawnPosition = position;
                }
                spawnLayer = layer ?? constants_1.Layer.Ground;
                break;
            }
        }
        // this should never happen
        spawnPosition ??= (0, vector_1.Vec)(0, 0);
        // Player is added to the players array when a JoinPacket is received from the client
        const player = new player_1.Player(this, socket, spawnPosition, spawnLayer, team);
        this.pluginManager.emit("player_did_connect", player);
        return player;
    }
    // Called when a JoinPacket is sent by the client
    activatePlayer(player, packet) {
        if (player.joined)
            return;
        const rejectedBy = this.pluginManager.emit("player_will_join", { player, joinPacket: packet });
        if (rejectedBy) {
            player.disconnect(`Connection rejected by server plugin '${rejectedBy.constructor.name}'`);
            return;
        }
        if (packet.protocolVersion !== constants_1.GameConstants.protocolVersion) {
            player.disconnect(`Invalid game version (expected ${constants_1.GameConstants.protocolVersion}, was ${packet.protocolVersion})`);
            return;
        }
        player.name = (0, misc_2.cleanUsername)(packet.name);
        player.isMobile = packet.isMobile;
        const skin = packet.skin;
        if (skin.defType === objectDefinitions_1.DefinitionType.Skin
            && !skin.hideFromLoadout
            && (skin.rolesRequired === undefined
                || skin.rolesRequired.includes(player.role))) {
            player.loadout.skin = skin;
        }
        const badge = packet.badge;
        if (!badge?.roles?.length || (player.role !== undefined && badge.roles.includes(player.role))) {
            player.loadout.badge = badge;
        }
        player.loadout.emotes = packet.emotes;
        this.livingPlayers.add(player);
        this.spectatablePlayers.push(player);
        this.connectedPlayers.add(player);
        this.newPlayers.push(player);
        this.grid.addObject(player);
        player.setDirty();
        this.aliveCountDirty = true;
        this.updateObjects = true;
        this.updateGameData({ aliveCount: this.aliveCount });
        player.joined = true;
        player.sendPacket(joinedPacket_1.JoinedPacket.create({
            teamMode: this.teamMode,
            teamID: player.teamID ?? 0,
            emotes: player.loadout.emotes
        }));
        player.sendData(this.map.buffer);
        this.addTimeout(() => { player.disableInvulnerability(); }, 5000);
        if ((this.isTeamMode ? this.teams.size : this.aliveCount) >= (config_1.Config.minTeamsToStart ?? 2)
            && !this._started
            && this.startTimeout === undefined) {
            this.startTimeout = this.addTimeout(() => {
                this._started = true;
                this.setGameData({ startedTime: this.now });
                this.gas.advanceGasStage();
                this.addTimeout(() => {
                    this.log("Preventing new players from joining");
                    this.setGameData({ allowJoin: false });
                }, (this.spawnWindow * 1000) - 3000);
                // Bots are already spawned in constructor
            }, 3000);
        }
        this.log(`"${player.name}" joined`);
        // Access log to store usernames for this connection
        if (config_1.Config.apiServer) {
            const username = player.name;
            if (username) {
                fetch(`${config_1.Config.apiServer.url}/accesslog/${player.ip || "none"}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": config_1.Config.apiServer.apiKey || "none"
                    },
                    body: JSON.stringify({ username })
                }).catch(console.error);
            }
        }
        this.pluginManager.emit("player_did_join", { player, joinPacket: packet });
    }
    // Bot methods removed - bots now handled by separate AI client
    checkGameStart() {
        if ((this.isTeamMode ? this.teams.size : this.aliveCount) >= (config_1.Config.minTeamsToStart ?? 2)
            && !this._started
            && this.startTimeout === undefined) {
            this.startTimeout = this.addTimeout(() => {
                this._started = true;
                this.setGameData({ startedTime: this.now });
                this.gas.advanceGasStage();
                this.addTimeout(() => {
                    this.log("Preventing new players from joining");
                    this.setGameData({ allowJoin: false });
                }, (this.spawnWindow * 1000) - 3000);
                this.log("Game started with bots!");
            }, 3000);
        }
    }
    // spawnBots method removed - bots now handled by separate AI client
    removePlayer(player, reason) {
        if (player.disconnected)
            return;
        player.disconnected = true;
        this.aliveCountDirty = true;
        this.connectedPlayers.delete(player);
        this.log(`"${player.name}" left`);
        if (player === this.killLeader) {
            this.findNewKillLeader();
        }
        if (player.canDespawn) {
            this.livingPlayers.delete(player);
            this.removeObject(player);
            this.deletedPlayers.push(player.id);
            (0, misc_1.removeFrom)(this.spectatablePlayers, player);
            this.updateGameData({ aliveCount: this.aliveCount });
            if (this.isTeamMode) {
                const team = player.team;
                if (team) {
                    team.removePlayer(player);
                    if (!team.players.length)
                        this.teams.delete(team);
                }
                player.teamWipe();
                player.beingRevivedBy?.action?.cancel();
            }
        }
        else {
            player.rotation = 0;
            player.movement.up = player.movement.down = player.movement.left = player.movement.right = false;
            player.attacking = false;
            player.setPartialDirty();
            if (this.isTeamMode && this.now - player.joinTime < 10000) {
                player.team?.removePlayer(player);
            }
        }
        if (player.spectating !== undefined) {
            player.spectating.spectators.delete(player);
        }
        if (this.aliveCount < 2) {
            this.startTimeout?.kill();
            this.startTimeout = undefined;
        }
        try {
            if (reason) {
                player.socket?.end(1000, reason);
            }
            else {
                player.socket?.close();
            }
        }
        catch {
            // not a really big deal if we can't close the socket (when does this ever fail?)
        }
        this.pluginManager.emit("player_disconnect", player);
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /**
     * Adds a `Loot` item to the game world
     * @param definition The type of loot to add. Prefer passing `LootDefinition` if possible
     * @param position The position to spawn this loot at
     * @param count Optionally define an amount of this loot (note that this does not equate spawning
     * that many `Loot` objects, but rather how many the singular `Loot` object will contain)
     * @returns The created loot object
     */
    addLoot(definition, position, layer, { count, pushVel, jitterSpawn = true, data } = {}) {
        const args = {
            position,
            layer,
            count,
            pushVel,
            jitterSpawn,
            data
        };
        definition = loots_1.Loots.reify(definition);
        if (this.pluginManager.emit("loot_will_generate", {
            definition,
            ...args
        }))
            return;
        const loot = new loot_1.Loot(this, definition, jitterSpawn
            ? vector_1.Vec.add(position, (0, random_1.randomPointInsideCircle)((0, vector_1.Vec)(0, 0), constants_1.GameConstants.lootSpawnMaxJitter))
            : position, layer, {
            count,
            pushVel,
            data
        });
        this.grid.addObject(loot);
        this.pluginManager.emit("loot_did_generate", { loot, ...args });
        return loot;
    }
    removeLoot(loot) {
        loot.dead = true;
        if (loot.mapIndicator)
            loot.mapIndicator.dead = true;
        this.removeObject(loot);
    }
    addBullet(source, shooter, options) {
        const reference = source instanceof gunItem_1.GunItem && source.definition.isDual
            ? loots_1.Loots.fromString(source.definition.singleVariant)
            : source.definition;
        const idString = options.idString ?? `${reference.idString}_bullet`;
        const def = bullets_1.Bullets.fromString(idString);
        let range = def.range * (options.modifiers?.range ?? 1);
        if (def.allowRangeOverride && options.rangeOverride !== undefined) {
            range = math_1.Numeric.clamp(options.rangeOverride, 0, range);
        }
        if (range < 0)
            return;
        const bullet = new bullet_1.Bullet(this, source, shooter, {
            ...options,
            idString
        });
        this.bullets.add(bullet);
        this.newBullets.push(bullet);
        return bullet;
    }
    addExplosion(type, position, source, layer, weapon, damageMod = 1, objectsToIgnore) {
        const explosion = new explosion_1.Explosion(this, type, position, source, layer, weapon, damageMod, objectsToIgnore);
        this.explosions.push(explosion);
        return explosion;
    }
    addProjectile(params) {
        const projectile = new projectile_1.Projectile(this, params);
        this.grid.addObject(projectile);
        return projectile;
    }
    removeProjectile(projectile) {
        projectile.destroy();
        this.removeObject(projectile);
    }
    addSyncedParticle(definition, position, endPosition, layer = 0, creatorID) {
        const syncedParticle = new syncedParticle_1.SyncedParticle(this, syncedParticles_1.SyncedParticles.reify(definition), position, endPosition, layer, creatorID);
        this.grid.addObject(syncedParticle);
        return syncedParticle;
    }
    removeSyncedParticle(syncedParticle) {
        this.removeObject(syncedParticle);
        syncedParticle.dead = true;
    }
    addSyncedParticles(def, position, layer) {
        const { idString, spawner, velocity: { duration } } = syncedParticles_1.SyncedParticles.reify(def);
        if (!spawner) {
            throw new Error("Attempted to spawn synced particles without a spawner");
        }
        const { count, radius, staggering } = spawner;
        const spawnParticles = (amount = 1) => {
            for (let i = 0; i++ < amount; i++) {
                const endPosition = (0, random_1.randomPointInsideCircle)(position, radius);
                if (duration) {
                    this.addSyncedParticle(idString, position, endPosition, layer);
                }
                else {
                    this.addSyncedParticle(idString, endPosition, undefined, layer);
                }
            }
        };
        if (staggering) {
            const { delay, initialAmount = 0 } = staggering;
            spawnParticles(initialAmount);
            for (let i = initialAmount, j = 1; i < count; i++, j++) {
                this.addTimeout(() => spawnParticles(1), j * delay);
            }
        }
        else {
            spawnParticles(count);
        }
    }
    addDecal(def, position, rotation, layer) {
        const decal = new decal_1.Decal(this, def, position, rotation, layer);
        this.grid.addObject(decal);
        return decal;
    }
    /**
     * Delete an object and give the id back to the allocator
     * @param object The object to delete
     */
    removeObject(object) {
        this.grid.removeObject(object);
        this._idAllocator.give(object.id);
        this.updateObjects = true;
    }
    summonAirdrop(position, forceGold = false) {
        if (this.pluginManager.emit("airdrop_will_summon", { position }))
            return;
        const paddingFactor = 1.25;
        const crateDef = obstacles_1.Obstacles.fromString(`airdrop_crate_locked${forceGold ? "_force" : ""}`);
        const crateHitbox = (crateDef.spawnHitbox ?? crateDef.hitbox).clone();
        let thisHitbox = crateHitbox.clone();
        let collided = true;
        let attempts = 0;
        let randomInt;
        while (collided) {
            if (attempts === 500) {
                switch (true) {
                    case position.x < this.map.height / 2 && position.y < this.map.height / 2:
                        randomInt = [1, 2, 3][Math.floor(Math.random() * 3)];
                        break;
                    case position.x > this.map.height / 2 && position.y < this.map.height / 2:
                        randomInt = [1, 4, 5][Math.floor(Math.random() * 3)];
                        break;
                    case position.x < this.map.height / 2 && position.y > this.map.height / 2:
                        randomInt = [3, 6, 7][Math.floor(Math.random() * 3)];
                        break;
                    case position.x > this.map.height / 2 && position.y > this.map.height / 2:
                        randomInt = [4, 6, 8][Math.floor(Math.random() * 3)];
                        break;
                }
            }
            if (randomInt !== undefined) {
                const distance = crateHitbox.toRectangle().max.x * 2 * paddingFactor;
                switch (randomInt) {
                    case 1:
                        position.y = position.y + distance;
                        break;
                    case 2:
                        position.x = position.x + distance;
                        position.y = position.y + distance;
                        break;
                    case 3:
                        position.x = position.x + distance;
                        break;
                    case 4:
                        position.x = position.x - distance;
                        break;
                    case 5:
                        position.x = position.x - distance;
                        position.y = position.y + distance;
                        break;
                    case 6:
                        position.y = position.y - distance;
                        break;
                    case 7:
                        position.y = position.y - distance;
                        position.x = position.x + distance;
                        break;
                    case 8:
                        position.y = position.y - distance;
                        position.x = position.x - distance;
                        break;
                }
            }
            attempts++;
            collided = false;
            for (const airdrop of this.airdrops) {
                thisHitbox = crateHitbox.transform(position);
                const thatHitbox = (airdrop.type.spawnHitbox ?? airdrop.type.hitbox).transform(airdrop.position);
                thatHitbox.scale(paddingFactor);
                if (vector_1.Vec.equals(thisHitbox.getCenter(), thatHitbox.getCenter())) {
                    /*
                        when dealing with airdrops exactly superimposed, the normal collision
                        method makes them line up all in one direction; ideally, we'd want them
                        to scatter around the original point. to influence the collider, we'll
                        nudge one of the hitboxes
                    */
                    thisHitbox = thisHitbox.transform(vector_1.Vec.fromPolar((0, random_1.randomRotation)(), 0.01));
                }
                if (thisHitbox.collidesWith(thatHitbox)) {
                    collided = true;
                    if (attempts >= 500)
                        continue;
                    thisHitbox.resolveCollision(thatHitbox);
                }
                position = thisHitbox.getCenter();
            }
            thisHitbox = crateHitbox.transform(position);
            {
                const padded = thisHitbox.clone();
                padded.scale(paddingFactor);
                for (const object of this.grid.intersectsHitbox(padded, constants_1.Layer.Ground)) {
                    let hitbox;
                    if (object.isObstacle
                        && !object.dead
                        && object.definition.indestructible
                        && ((hitbox = object.spawnHitbox.clone()).scale(paddingFactor), hitbox.collidesWith(thisHitbox))) {
                        collided = true;
                        if (attempts >= 500)
                            continue;
                        thisHitbox.resolveCollision(object.spawnHitbox);
                    }
                    position = thisHitbox.getCenter();
                }
            }
            thisHitbox = crateHitbox.transform(position);
            {
                const padded = thisHitbox.clone();
                padded.scale(paddingFactor);
                // second loop, buildings
                for (const object of this.grid.intersectsHitbox(thisHitbox, constants_1.Layer.Ground)) {
                    if ((object.isBuilding
                        && object.scopeHitbox
                        && (object.definition.wallsToDestroy === undefined || object.definition.hasDamagedCeiling))) {
                        const hitbox = object.scopeHitbox.clone();
                        hitbox.scale(paddingFactor);
                        if (!thisHitbox.collidesWith(hitbox))
                            continue;
                        collided = true;
                        if (attempts >= 500)
                            continue;
                        thisHitbox.resolveCollision(object.scopeHitbox);
                    }
                    position = thisHitbox.getCenter();
                }
            }
            thisHitbox = crateHitbox.transform(position);
            const { min, max } = thisHitbox.toRectangle();
            const width = max.x - min.x;
            const height = max.y - min.y;
            position.x = math_1.Numeric.clamp(position.x, width, this.map.width - width);
            position.y = math_1.Numeric.clamp(position.y, height, this.map.height - height);
        }
        const direction = (0, random_1.randomRotation)();
        const planePos = vector_1.Vec.add(position, vector_1.Vec.fromPolar(direction, -constants_1.GameConstants.maxPosition));
        const airdrop = { position, type: crateDef };
        this.airdrops.push(airdrop);
        this.planes.push({ position: planePos, direction });
        this.addTimeout(() => {
            const parachute = new parachute_1.Parachute(this, position, airdrop);
            this.grid.addObject(parachute);
            this.mapPings.push({
                definition: mapPings_1.MapPings.fromString("airdrop_ping"),
                position
            });
        }, constants_1.GameConstants.airdrop.flyTime);
        this.pluginManager.emit("airdrop_did_summon", { airdrop, position });
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map