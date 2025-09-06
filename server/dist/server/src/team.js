"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTeamPlayer = exports.CustomTeam = exports.Team = void 0;
const misc_1 = require("../../common/src/utils/misc");
const random_1 = require("../../common/src/utils/random");
class Team {
    id;
    _players = [];
    get players() { return this._players; }
    _indexMapping = new Map();
    kills = 0;
    autoFill;
    constructor(id, autoFill = true) {
        this.id = id;
        this.autoFill = autoFill;
    }
    addPlayer(player) {
        player.colorIndex = this.getNextAvailableColorIndex();
        this._indexMapping.set(player, this._players.push(player) - 1);
        this.setDirty();
    }
    removePlayer(player) {
        const index = this._indexMapping.get(player);
        const exists = index !== undefined;
        if (exists) {
            this._players.splice(index, 1);
            this._indexMapping.delete(player);
            /*
                [a, b, c, d, e, f] // -> player array
                [
                    a -> 0,
                    b -> 1,
                    c -> 2,
                    d -> 3,
                    e -> 4,
                    f -> 5
                ]

                remove player c

                [a, b, d, e, f]
                [
                    a -> 0,
                    b -> 1,
                    c -> 2,
                    d -> 3,
                    e -> 4,
                    f -> 5
                ]

                now we just need to refresh the mappings, but we skip 0, 1, and 2

                [a, b, d, e, f]
                [
                    a -> 0,
                    b -> 1,
                    d -> 3 - 1,
                    e -> 4 - 1,
                    f -> 5 - 1
                ]

                which gives
                [a, b, d, e, f]
                [
                    a -> 0,
                    b -> 1,
                    d -> 2,
                    e -> 3,
                    f -> 4
                ]

                which is correct

                this obviously only works with a specific configuration of the array and map (that
                being the one used in the example), but since we control the insertion of data into
                those collections, we can ensure that it always finds itself in such a configuration
                (which also just so happens to be the easiest and simplest)

                it could possibly to use a sparse array with a list of vacant indices in order to
                minimize array resizes with push and splice, but i can't be bothered to implement that
                haha
            */
            for (const [player, mapped] of this._indexMapping.entries()) { // refresh mapping
                if (mapped <= index)
                    continue;
                this._indexMapping.set(player, mapped - 1);
                this.reassignColorIndexes();
            }
        }
        return exists;
    }
    setDirty() {
        for (const player of this.players) {
            player.dirty.teammates = true;
        }
    }
    // Team color indexes must be checked and updated in order not to have duplicates.
    getNextAvailableColorIndex() {
        const existingIndexes = this.players.map(player => player.colorIndex);
        let newIndex = 0;
        while (existingIndexes.includes(newIndex)) {
            newIndex++;
        }
        return newIndex;
    }
    reassignColorIndexes() {
        this.players.forEach((player, index) => {
            player.colorIndex = index;
        });
    }
    hasLivingPlayers() {
        return this.players.some(player => !player.dead && !player.disconnected);
    }
    getLivingPlayers() {
        return this.players.filter(player => !player.dead && !player.disconnected);
    }
}
exports.Team = Team;
class CustomTeam {
    gameManager;
    static _idChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    static _idCharMax = this._idChars.length - 1;
    id;
    players = [];
    autoFill = false;
    locked = false;
    forceStart = false;
    gameID;
    resetTimeout;
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.id = Array.from({ length: 4 }, () => CustomTeam._idChars.charAt((0, random_1.random)(0, CustomTeam._idCharMax))).join("");
    }
    addPlayer(player) {
        this.players.push(player);
        player.sendMessage({
            type: 0 /* CustomTeamMessages.Join */,
            teamID: this.id,
            isLeader: player.isLeader,
            autoFill: this.autoFill,
            locked: this.locked,
            forceStart: this.forceStart
        });
        this._publishPlayerUpdate();
    }
    removePlayer(player) {
        (0, misc_1.removeFrom)(this.players, player);
        if (!this.players.length) {
            clearTimeout(this.resetTimeout);
            return;
        }
        this._publishPlayerUpdate();
    }
    async onMessage(player, message) {
        if (!message)
            return;
        switch (message.type) {
            case 2 /* CustomTeamMessages.Settings */: {
                if (!player.isLeader)
                    break; // Only leader can change settings
                if (message.autoFill !== undefined)
                    this.autoFill = message.autoFill;
                if (message.locked !== undefined)
                    this.locked = message.locked;
                if (message.forceStart !== undefined) {
                    this.forceStart = player.ready = message.forceStart;
                    this._publishPlayerUpdate();
                }
                this._publishMessage({
                    type: 2 /* CustomTeamMessages.Settings */,
                    autoFill: this.autoFill,
                    locked: this.locked,
                    forceStart: this.forceStart
                });
                break;
            }
            case 3 /* CustomTeamMessages.KickPlayer */: {
                if (!player.isLeader)
                    break;
                const id = message.playerId;
                const toRemove = this.players[id];
                if (!toRemove || toRemove.isLeader)
                    break;
                toRemove.socket?.end(1000, "kicked");
                this.players.splice(id, 1);
                this._publishPlayerUpdate();
                break;
            }
            case 4 /* CustomTeamMessages.Start */: {
                if (player.isLeader && this.forceStart) {
                    await this._startGame();
                }
                else {
                    player.ready = !player.ready;
                    if (this.players.every(p => p.ready)) {
                        await this._startGame();
                    }
                }
                this._publishPlayerUpdate();
                break;
            }
        }
    }
    async _startGame() {
        const result = await this.gameManager.findGame();
        if (result === undefined)
            return;
        this.gameID = result;
        clearTimeout(this.resetTimeout);
        this.resetTimeout = setTimeout(() => this.gameID = undefined, 10000);
        for (const player of this.players) {
            player.ready = false;
        }
        this._publishMessage({ type: 5 /* CustomTeamMessages.Started */ });
    }
    _publishPlayerUpdate() {
        const players = [];
        for (let id = 0, len = this.players.length; id < len; id++) {
            const p = this.players[id];
            players.push({
                id,
                isLeader: p.isLeader,
                ready: p.ready,
                name: p.name,
                skin: p.skin,
                badge: p.badge,
                nameColor: p.nameColor
            });
        }
        for (const player of this.players) {
            player.sendMessage({
                type: 1 /* CustomTeamMessages.Update */,
                players,
                isLeader: player.isLeader,
                ready: player.ready,
                forceStart: this.forceStart
            });
        }
    }
    _publishMessage(message) {
        for (const player of this.players) {
            player.sendMessage(message);
        }
    }
}
exports.CustomTeam = CustomTeam;
class CustomTeamPlayer {
    ip;
    team;
    name;
    skin;
    badge;
    nameColor;
    get id() { return this.team.players.indexOf(this); }
    get isLeader() { return this.id === 0; }
    socket;
    ready = false;
    constructor(ip, team, name, skin, badge, nameColor) {
        this.ip = ip;
        this.team = team;
        this.name = name;
        this.skin = skin;
        this.badge = badge;
        this.nameColor = nameColor;
    }
    sendMessage(message) {
        this.socket?.send(JSON.stringify(message));
    }
}
exports.CustomTeamPlayer = CustomTeamPlayer;
//# sourceMappingURL=team.js.map