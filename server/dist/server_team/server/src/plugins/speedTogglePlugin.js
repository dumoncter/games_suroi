"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../../common/src/constants");
const pluginManager_1 = require("../pluginManager");
/**
 * Plugin to toggle the player speed when sending an emote
 */
class SpeedTogglePlugin extends pluginManager_1.GamePlugin {
    initListeners() {
        this.on("player_did_emote", ({ player }) => {
            const baseSpeed = constants_1.GameConstants.player.baseSpeed;
            if (player.baseSpeed === baseSpeed) {
                player.baseSpeed = 12 * baseSpeed;
            }
            else {
                player.baseSpeed = baseSpeed;
            }
        });
    }
}
exports.default = SpeedTogglePlugin;
//# sourceMappingURL=speedTogglePlugin.js.map