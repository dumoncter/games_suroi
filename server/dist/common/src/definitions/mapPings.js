"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPings = void 0;
const objectDefinitions_1 = require("../utils/objectDefinitions");
const gamePing = (idString, color, ignoreExpiration = false) => ({
    idString,
    name: idString,
    defType: objectDefinitions_1.DefinitionType.MapPing,
    showInGame: false,
    ignoreExpiration,
    lifetime: 20,
    isPlayerPing: false,
    color,
    sound: idString
});
const playerPing = (idString, ignoreExpiration = false) => ({
    idString,
    name: idString,
    defType: objectDefinitions_1.DefinitionType.MapPing,
    showInGame: true,
    ignoreExpiration,
    lifetime: 120,
    isPlayerPing: true,
    color: 0xffffff,
    sound: idString
});
exports.MapPings = new objectDefinitions_1.ObjectDefinitions([
    gamePing("airdrop_ping", 0x00ffff, true),
    gamePing("unlock_ping", 0xff0000, true),
    playerPing("arrow_ping", true),
    playerPing("gift_ping"),
    playerPing("heal_ping"),
    playerPing("warning_ping")
]);
//# sourceMappingURL=mapPings.js.map