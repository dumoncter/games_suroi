"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("../../../../common/src/utils/misc");
const vector_1 = require("../../../../common/src/utils/vector");
const obstacle_1 = require("../objects/obstacle");
const pluginManager_1 = require("../pluginManager");
/**
 * Plugin to help place objects when developing buildings
 */
class PlaceObjectPlugin extends pluginManager_1.GamePlugin {
    obstacleToPlace = "house_column";
    _playerToObstacle = new misc_1.ExtendedMap();
    initListeners() {
        this.on("player_did_join", ({ player }) => {
            const obstacle = new obstacle_1.Obstacle(player.game, this.obstacleToPlace, player.position);
            this._playerToObstacle.set(player, obstacle);
            this.game.grid.addObject(obstacle);
        });
        this.on("player_disconnect", player => {
            this._playerToObstacle.ifPresent(player, obstacle => {
                this.game.grid.removeObject(obstacle);
                this._playerToObstacle.delete(player);
            });
        });
        this.on("player_did_emote", ({ player }) => {
            this._playerToObstacle.ifPresent(player, obstacle => {
                obstacle.rotation += 1;
                obstacle.rotation %= 4;
                this.updateObstacle(obstacle);
            });
        });
        this.on("player_update", player => {
            this._playerToObstacle.ifPresent(player, obstacle => {
                const position = vector_1.Vec.add(player.position, (0, vector_1.Vec)(Math.cos(player.rotation) * player.distanceToMouse, Math.sin(player.rotation) * player.distanceToMouse));
                obstacle.position = position;
                obstacle.layer = player.layer;
                this.updateObstacle(obstacle);
                player.game.grid.updateObject(obstacle);
            });
        });
        this.on("player_start_attacking", player => {
            this._playerToObstacle.ifPresent(player, obstacle => {
                const map = this.game.map;
                const round = (n) => Math.round(n * 100) / 100;
                console.log(`{ idString: "${obstacle.definition.idString}", position: Vec(${round(obstacle.position.x - map.width / 2)}, ${round(obstacle.position.y - map.height / 2)}), rotation: ${obstacle.rotation} },`);
                // console.log(`Vec(${round(position.x - map.width / 2)}, ${round(position.y - map.height / 2)}),`);
            });
        });
    }
    updateObstacle(obstacle) {
        obstacle.setDirty();
        const def = obstacle.definition;
        obstacle.hitbox = def.hitbox.transform(obstacle.position, obstacle.scale, obstacle.rotation);
        obstacle.spawnHitbox = def.spawnHitbox ? def.spawnHitbox.transform(obstacle.position, obstacle.scale, obstacle.rotation) : obstacle.hitbox;
    }
}
exports.default = PlaceObjectPlugin;
//# sourceMappingURL=placeObjectPlugin.js.map