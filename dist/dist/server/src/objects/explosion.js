"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explosion = void 0;
const constants_1 = require("../../../common/src/constants");
const explosions_1 = require("../../../common/src/definitions/explosions");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const math_1 = require("../../../common/src/utils/math");
const random_1 = require("../../../common/src/utils/random");
const vector_1 = require("../../../common/src/utils/vector");
const decal_1 = require("./decal");
class Explosion {
    game;
    position;
    source;
    layer;
    weapon;
    damageMod;
    objectsToIgnore;
    definition;
    constructor(game, definition, position, source, layer, weapon, damageMod = 1, objectsToIgnore = new Set()) {
        this.game = game;
        this.position = position;
        this.source = source;
        this.layer = layer;
        this.weapon = weapon;
        this.damageMod = damageMod;
        this.objectsToIgnore = objectsToIgnore;
        this.definition = explosions_1.Explosions.reify(definition);
    }
    explode() {
        const definition = this.definition;
        // List of all near objects
        const objects = this.game.grid.intersectsHitbox(new hitbox_1.CircleHitbox(definition.radius.max * 2, this.position), this.layer);
        const damagedObjects = new Set();
        const step = Math.acos(1 - ((constants_1.GameConstants.explosionRayDistance / definition.radius.max) ** 2) / 2);
        for (let angle = -Math.PI; angle < Math.PI; angle += step) {
            // All objects that collided with this line
            const lineCollisions = [];
            const lineEnd = vector_1.Vec.add(this.position, vector_1.Vec.fromPolar(angle, definition.radius.max));
            for (const object of objects) {
                if (object.dead
                    || !object.hitbox
                    || ![
                        constants_1.ObjectCategory.Building,
                        constants_1.ObjectCategory.Obstacle,
                        constants_1.ObjectCategory.Player,
                        constants_1.ObjectCategory.Loot,
                        constants_1.ObjectCategory.Projectile
                    ].some(type => object.type === type))
                    continue;
                // check if the object hitbox collides with a line from the explosion center to the explosion max distance
                const intersection = object.hitbox.intersectsLine(this.position, lineEnd);
                if (intersection) {
                    lineCollisions.push({
                        pos: intersection.point,
                        object,
                        squareDistance: math_1.Geometry.distanceSquared(this.position, intersection.point)
                    });
                }
            }
            // sort by closest to the explosion center to prevent damaging objects through walls
            lineCollisions.sort((a, b) => a.squareDistance - b.squareDistance);
            const { min, max } = definition.radius;
            for (const collision of lineCollisions) {
                const object = collision.object;
                const { isPlayer, isObstacle, isBuilding, isLoot, isProjectile } = object;
                if (!damagedObjects.has(object.id)) {
                    damagedObjects.add(object.id);
                    const dist = Math.sqrt(collision.squareDistance);
                    if (isPlayer || isObstacle || isBuilding) {
                        object.damage({
                            amount: this.damageMod * definition.damage
                                * (isObstacle ? definition.obstacleMultiplier : 1)
                                * (isPlayer ? object.mapPerkOrDefault("low_profile" /* PerkIds.LowProfile */, ({ explosionMod }) => explosionMod, 1) : 1)
                                * ((dist > min) ? (max - dist) / (max - min) : 1),
                            source: this.source,
                            weaponUsed: this
                        });
                    }
                    else if (isLoot || isProjectile) {
                        if (isProjectile)
                            object.damage({ amount: definition.damage });
                        const multiplier = isProjectile ? 0.002 : 0.01;
                        object.push(math_1.Angle.betweenPoints(object.position, this.position), (max - dist) * multiplier);
                    }
                }
                if ((isObstacle
                    && !object.definition.noCollisions
                    && !object.definition.isStair
                    && !this.objectsToIgnore.has(object)) || (isBuilding && !object.definition.noCollisions)) {
                    /*
                        an Obstacle with collisions will "eat" an explosion, protecting
                        the objects further from the explosion than itself ("behind" it;
                        this is what the break statement achieves); however, this is not
                        the case for stairs. stairs have collisions, but do not protect
                        those within them. and so for stairs, the show must go on
                    */
                    break;
                }
            }
        }
        for (let i = 0, count = definition.shrapnelCount; i < count; i++) {
            this.game.addBullet(this, this.source, {
                position: this.position,
                rotation: (0, random_1.randomRotation)(),
                layer: this.layer
            });
        }
        if (!definition.decal)
            return;
        const decal = new decal_1.Decal(this.game, definition.decal, this.position, (0, random_1.randomRotation)(), this.layer);
        this.game.grid.addObject(decal);
        if (definition.decalFadeTime === undefined)
            return;
        this.game.addTimeout(() => this.game.grid.removeObject(decal), definition.decalFadeTime);
    }
}
exports.Explosion = Explosion;
//# sourceMappingURL=explosion.js.map