"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../../../common/src/utils/vector");
const pluginManager_1 = require("../pluginManager");
/**
 * Plugin to teleport a player to a map ping when they send one
 */
class TeleportPlugin extends pluginManager_1.GamePlugin {
    initListeners() {
        this.on("player_did_map_ping", ({ player, position }) => {
            player.position = vector_1.Vec.clone(position);
            player.updateObjects = true;
            player.setPartialDirty();
        });
    }
}
exports.default = TeleportPlugin;
//# sourceMappingURL=teleportPlugin.js.map