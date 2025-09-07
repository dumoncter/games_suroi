"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
const bullets_1 = require("../../../common/src/definitions/bullets");
const baseBullet_1 = require("../../../common/src/utils/baseBullet");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const math_1 = require("../../../common/src/utils/math");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../common/src/utils/random");
const vector_1 = require("../../../common/src/utils/vector");
const layer_1 = require("../../../common/src/utils/layer");
class Bullet extends baseBullet_1.BaseBullet {
    game;
    sourceGun;
    shooter;
    clipDistance;
    reflected = false;
    finalPosition;
    constructor(game, source, shooter, options) {
        const definition = bullets_1.Bullets.fromString(options.idString);
        const variance = definition.rangeVariance;
        super({
            ...options,
            rotation: math_1.Angle.normalize(options.rotation),
            source: definition,
            sourceID: shooter.id,
            variance: variance ? (0, random_1.randomFloat)(0, variance) : undefined
        });
        this.clipDistance = options.rangeOverride ?? this.definition.range;
        this.game = game;
        this.sourceGun = source;
        this.shooter = shooter;
        this.layer = options.layer ?? shooter.layer;
        this.finalPosition = vector_1.Vec.add(this.position, vector_1.Vec.scale(this.direction, this.maxDistance));
        this.shotFX = options.shotFX ?? false;
        this.lastShot = options.lastShot ?? false;
    }
    update() {
        const lineRect = hitbox_1.RectangleHitbox.fromLine(this.position, vector_1.Vec.add(this.position, vector_1.Vec.scale(this.velocity, this.game.dt)));
        const { grid, dt, map: { width: mapWidth, height: mapHeight } } = this.game;
        // Bullets from dead players should not deal damage so delete them
        // Also delete bullets out of map bounds
        if (this.shooter.dead
            || this.position.x < 0 || this.position.x > mapWidth
            || this.position.y < 0 || this.position.y > mapHeight) {
            this.dead = true;
            return [];
        }
        const records = [];
        const definition = this.definition;
        const objects = grid.intersectsHitbox(lineRect, this.layer);
        const damageMod = (this.modifiers?.damage ?? 1) / (this.reflectionCount + 1);
        for (const collision of this.updateAndGetCollisions(dt, objects)) {
            const object = collision.object;
            const { isObstacle, isProjectile } = object;
            if (isObstacle && object.definition.isStair) {
                object.handleStairInteraction(this);
                continue;
            }
            // We check for projectiles first, not obstacles, otherwise stuff like tables or bushes won't be damaged by bullets.
            if (isProjectile && !(0, layer_1.adjacentOrEquivLayer)(object, this.layer))
                continue;
            const { point, normal } = collision.intersection;
            const reflected = (collision.reflected
                && this.reflectionCount < 3
                && !definition.noReflect
                && (definition.onHitExplosion === undefined || !definition.explodeOnImpact));
            let rotation;
            if (reflected || definition.onHitExplosion || definition.onHitProjectile) {
                /*
                    nudge the bullet

                    if the bullet reflects, we do this to ensure that it doesn't re-collide
                    with the same obstacle instantly

                    if it doesn't, then we do this to avoid having the obstacle eat the
                    explosion, thereby shielding others from its effects
                */
                rotation = 2 * Math.atan2(normal.y, normal.x) - this.rotation;
                this.position = vector_1.Vec.add(point, (0, vector_1.Vec)(Math.sin(rotation), -Math.cos(rotation)));
            }
            else {
                // atan2 is expensive so we avoid the above calculation if possible
                this.position = point;
            }
            if (collision.dealDamage) {
                const damageAmount = (definition.teammateHeal
                    && this.game.isTeamMode
                    && this.shooter.isPlayer
                    && object.isPlayer
                    && object.teamID === this.shooter.teamID
                    && object.id !== this.shooter.id)
                    ? -definition.teammateHeal
                    : definition.damage;
                records.push({
                    object,
                    damage: damageMod * damageAmount * (isObstacle ? (this.modifiers?.dtc ?? 1) * definition.obstacleMultiplier : 1),
                    weapon: this.sourceGun,
                    source: this.shooter,
                    position: this.position
                });
                if (this.sourceGun.definition.defType === objectDefinitions_1.DefinitionType.Gun
                    && this.shooter.isPlayer
                    && this.shooter.hasPerk("precision_recycling" /* PerkIds.PrecisionRecycling */)) {
                    if (object.isPlayer) {
                        this.shooter.tryRefund(this.sourceGun);
                    }
                    else {
                        this.shooter.bulletTargetHitCount = 0;
                        this.shooter.targetHitCountExpiration?.kill();
                        this.shooter.targetHitCountExpiration = undefined;
                    }
                }
            }
            this.collidedIDs.add(object.id);
            // We check here for obstacles, after the collision was done, in order to damage tables and bushes.
            // think of it as bullet penetration.
            if (isObstacle && object.definition.noCollisions)
                continue;
            if (reflected) {
                this.reflect(rotation ?? 0);
                this.reflected = true;
            }
            this.dead = true;
            break;
        }
        return records;
    }
    reflect(direction) {
        this.game.addBullet(this.sourceGun, this.shooter, {
            idString: this.definition.idString,
            position: vector_1.Vec.clone(this.position),
            rotation: direction,
            layer: this.layer,
            reflectionCount: this.reflectionCount + 1,
            variance: this.rangeVariance,
            modifiers: this.modifiers,
            rangeOverride: this.clipDistance,
            saturate: this.saturate,
            thin: this.thin,
            shotFX: false
        });
    }
}
exports.Bullet = Bullet;
//# sourceMappingURL=bullet.js.map