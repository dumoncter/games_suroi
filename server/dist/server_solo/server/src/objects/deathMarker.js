"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeathMarker = void 0;
const constants_1 = require("../../../../common/src/constants");
const hitbox_1 = require("../../../../common/src/utils/hitbox");
const gameObject_1 = require("./gameObject");
class DeathMarker extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.DeathMarker) {
    fullAllocBytes = 1;
    partialAllocBytes = 12;
    hitbox;
    player;
    isNew = true;
    constructor(player, layer) {
        super(player.game, player.position);
        this.player = player;
        this.layer = layer;
        this.hitbox = hitbox_1.RectangleHitbox.fromRect(5, 5, player.position);
        this.game.addTimeout(() => {
            this.isNew = false;
            this.setPartialDirty();
        }, 100);
    }
    get data() {
        return {
            position: this.position,
            isNew: this.isNew,
            playerID: this.player.id,
            layer: this.layer
        };
    }
    damage() { }
}
exports.DeathMarker = DeathMarker;
//# sourceMappingURL=deathMarker.js.map