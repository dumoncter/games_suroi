"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emote = void 0;
class Emote {
    definition;
    player;
    playerID;
    constructor(definition, player) {
        this.definition = definition;
        this.player = player;
        this.playerID = player.id;
    }
}
exports.Emote = Emote;
//# sourceMappingURL=emote.js.map