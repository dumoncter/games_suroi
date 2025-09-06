"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gas = void 0;
const constants_1 = require("../../common/src/constants");
const hitbox_1 = require("../../common/src/utils/hitbox");
const math_1 = require("../../common/src/utils/math");
const random_1 = require("../../common/src/utils/random");
const vector_1 = require("../../common/src/utils/vector");
const config_1 = require("./utils/config");
const gasStages_1 = require("./data/gasStages");
const mapPings_1 = require("../../common/src/definitions/mapPings");
const misc_1 = require("./utils/misc");
class Gas {
    stage = 0;
    state = 0 /* GasState.Inactive */;
    currentDuration = 0;
    countdownStart = 0;
    completionRatio = 0;
    finalStage = false;
    oldPosition;
    newPosition;
    currentPosition;
    oldRadius;
    newRadius;
    currentRadius;
    dps = 0;
    _lastDamageTimestamp;
    dirty = false;
    completionRatioDirty = false;
    _doDamage = false;
    get doDamage() { return this._doDamage; }
    game;
    mapSize;
    constructor(game) {
        this.game = game;
        this.mapSize = (this.game.map.width + this.game.map.height) / 2;
        const firstStage = gasStages_1.GasStages[0];
        this.oldRadius = firstStage.oldRadius * this.mapSize;
        this.newRadius = firstStage.newRadius * this.mapSize;
        this.currentRadius = firstStage.oldRadius * this.mapSize;
        this.oldPosition = (0, vector_1.Vec)(game.map.width / 2, game.map.height / 2);
        this.newPosition = vector_1.Vec.clone(this.oldPosition);
        this.currentPosition = vector_1.Vec.clone(this.oldPosition);
        this._lastDamageTimestamp = this.game.now;
    }
    tick() {
        if (this.state !== 0 /* GasState.Inactive */) {
            this.completionRatio = (this.game.now - this.countdownStart) / (1000 * this.currentDuration);
            this.completionRatioDirty = true;
        }
        this._doDamage = false;
        if (this.game.now - this._lastDamageTimestamp >= 1000) {
            this._lastDamageTimestamp = this.game.now;
            this._doDamage = true;
            if (this.state === 2 /* GasState.Advancing */) {
                this.currentPosition = vector_1.Vec.lerp(this.oldPosition, this.newPosition, this.completionRatio);
                this.currentRadius = math_1.Numeric.lerp(this.oldRadius, this.newRadius, this.completionRatio);
            }
        }
    }
    scaledDamage(position) {
        const distIntoGas = math_1.Geometry.distance(position, this.currentPosition) - this.currentRadius;
        return this.dps + math_1.Numeric.clamp(distIntoGas - constants_1.GameConstants.gas.unscaledDamageDist, 0, Infinity) * constants_1.GameConstants.gas.damageScaleFactor;
    }
    advanceGasStage() {
        const gas = config_1.Config.gas;
        if (gas?.disabled)
            return;
        const currentStage = gasStages_1.GasStages[this.stage + 1];
        if (currentStage === undefined)
            return;
        const duration = gas?.forceDuration !== undefined && currentStage.duration !== 0
            ? gas.forceDuration
            : currentStage.duration;
        this.stage++;
        this.state = currentStage.state;
        this.currentDuration = duration;
        this.completionRatio = 1;
        this.countdownStart = this.game.now;
        this.finalStage = currentStage.finalStage ?? false;
        // Hunted Mode: Bunker doors
        if (this.game.mode.unlockStage !== undefined && this.stage === this.game.mode.unlockStage) {
            const doors = this.game.unlockableDoors;
            for (let i = 0, len = doors.length; i < len; i++) {
                const obstacle = doors[i];
                (0, misc_1.runOrWait)(this.game, () => {
                    if (obstacle.door !== undefined) {
                        obstacle.door.locked = false;
                        obstacle.interact();
                    }
                    this.game.mapPings.push({
                        definition: mapPings_1.MapPings.fromString("unlock_ping"),
                        position: obstacle.position
                    });
                }, i * 250);
            }
        }
        if (this.game.mode.forcedGoldAirdropStage !== undefined && this.stage === this.game.mode.forcedGoldAirdropStage) {
            this.game.summonAirdrop(this.game.map.getRandomPosition(new hitbox_1.CircleHitbox(15), {
                maxAttempts: 500,
                spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
                collides: position => math_1.Geometry.distanceSquared(position, this.currentPosition) >= this.newRadius ** 2
            }) ?? this.newPosition, true);
        }
        if (currentStage.state === 1 /* GasState.Waiting */) {
            this.oldPosition = vector_1.Vec.clone(this.newPosition);
            if (currentStage.newRadius !== 0) {
                const { width, height } = this.game.map;
                if (gas?.forcePosition) {
                    const [x, y] = typeof gas.forcePosition === "boolean" ? [width / 2, height / 2] : gas.forcePosition;
                    this.newPosition = (0, vector_1.Vec)(x, y);
                }
                else {
                    const { oldRadius, newRadius } = currentStage;
                    const { x, y } = (0, random_1.randomPointInsideCircle)(this.oldPosition, (oldRadius - newRadius) * this.mapSize);
                    const radius = newRadius * 0.75; // ensure at least 75% of the safe zone will be inside map bounds
                    this.newPosition = (0, vector_1.Vec)(math_1.Numeric.clamp(x, radius, width - radius), math_1.Numeric.clamp(y, radius, height - radius));
                }
            }
            else {
                this.newPosition = vector_1.Vec.clone(this.oldPosition);
            }
            this.currentPosition = vector_1.Vec.clone(this.oldPosition);
            this.currentRadius = currentStage.oldRadius * this.mapSize;
        }
        this.oldRadius = currentStage.oldRadius * this.mapSize;
        this.newRadius = currentStage.newRadius * this.mapSize;
        this.dps = currentStage.dps;
        this.dirty = true;
        this.completionRatioDirty = true;
        if (currentStage.summonAirdrop) {
            this.game.summonAirdrop(this.game.map.getRandomPosition(new hitbox_1.CircleHitbox(15), {
                maxAttempts: 500,
                spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
                collides: position => math_1.Geometry.distanceSquared(position, this.currentPosition) >= this.newRadius ** 2
            }) ?? this.newPosition);
        }
        // Start the next stage
        if (duration !== 0) {
            this.game.addTimeout(() => this.advanceGasStage(), duration * 1000);
        }
    }
    isInGas(position) {
        return math_1.Geometry.distanceSquared(position, this.currentPosition) >= this.currentRadius ** 2;
    }
    getDef() {
        return gasStages_1.GasStages[this.stage];
    }
}
exports.Gas = Gas;
//# sourceMappingURL=gas.js.map