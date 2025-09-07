"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parachute = void 0;
const constants_1 = require("../../../common/src/constants");
const killPacket_1 = require("../../../common/src/packets/killPacket");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const math_1 = require("../../../common/src/utils/math");
const gameObject_1 = require("./gameObject");
class Parachute extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.Parachute) {
    fullAllocBytes = 8;
    partialAllocBytes = 4;
    _height = 1;
    get height() { return this._height; }
    hitbox = new hitbox_1.CircleHitbox(10);
    endTime = Date.now() + constants_1.GameConstants.airdrop.fallTime;
    _airdrop;
    constructor(game, position, airdrop) {
        super(game, position);
        this.hitbox.position = position;
        this._airdrop = airdrop;
    }
    update() {
        if (this._height < 0) {
            this.game.removeObject(this);
            this.game.airdrops.splice(this.game.airdrops.indexOf(this._airdrop), 1);
            const crate = this.game.map.generateObstacle(this._airdrop.type, this.position);
            if (!crate)
                return;
            this.game.pluginManager.emit("airdrop_landed", this._airdrop);
            // Spawn smoke
            this.game.addSyncedParticles("airdrop_smoke_particle", crate.position, crate.layer);
            // Crush damage
            for (const object of this.game.grid.intersectsHitbox(crate.hitbox, crate.layer)) {
                if (object.hitbox?.collidesWith(crate.hitbox)) {
                    switch (true) {
                        case object.isPlayer: {
                            object.piercingDamage({
                                amount: constants_1.GameConstants.airdrop.damage,
                                source: killPacket_1.DamageSources.Obstacle,
                                weaponUsed: crate
                            });
                            break;
                        }
                        case object.isObstacle: {
                            object.damage({
                                amount: Infinity,
                                source: crate
                            });
                            break;
                        }
                        case object.isBuilding && object.scopeHitbox?.collidesWith(crate.hitbox): {
                            object.damageCeiling(Infinity);
                            break;
                        }
                    }
                }
            }
            // loop again to make sure loot added by destroyed obstacles is checked
            for (const loot of this.game.grid.intersectsHitbox(this.hitbox, this.layer)) {
                if (loot.isLoot && this.hitbox.collidesWith(loot.hitbox)) {
                    if (loot.hitbox.collidesWith(crate.hitbox)) {
                        loot.hitbox.resolveCollision(crate.hitbox);
                    }
                    loot.push(math_1.Angle.betweenPoints(this.position, loot.position), -0.03);
                }
            }
            return;
        }
        const elapsed = this.endTime - this.game.now;
        this._height = math_1.Numeric.lerp(0, 1, elapsed / constants_1.GameConstants.airdrop.fallTime);
        this.setPartialDirty();
    }
    get data() {
        return {
            height: this._height,
            full: {
                position: this.position
            }
        };
    }
    damage() { }
}
exports.Parachute = Parachute;
//# sourceMappingURL=parachute.js.map