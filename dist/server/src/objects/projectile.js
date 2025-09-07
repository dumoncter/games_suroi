"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
const constants_1 = require("../../../common/src/constants");
const perks_1 = require("../../../common/src/definitions/items/perks");
const throwables_1 = require("../../../common/src/definitions/items/throwables");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const layer_1 = require("../../../common/src/utils/layer");
const math_1 = require("../../../common/src/utils/math");
const terrain_1 = require("../../../common/src/utils/terrain");
const vector_1 = require("../../../common/src/utils/vector");
const gameObject_1 = require("./gameObject");
const random_1 = require("../../../common/src/utils/random");
class Projectile extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.Projectile) {
    fullAllocBytes = 16;
    partialAllocBytes = 16;
    definition;
    source;
    halloweenSkin;
    activated = false;
    throwerTeamID = 0;
    tintIndex = 0;
    health;
    owner;
    get position() { return this.hitbox.position; }
    set position(pos) { this.hitbox.position = pos; }
    _lastPosition;
    inAir = false;
    hitbox = new hitbox_1.CircleHitbox(0);
    _height;
    _velocity;
    _velocityZ;
    _angularVelocity;
    _fuseTime;
    _obstaclesBelow = new Set();
    constructor(game, params) {
        super(game, params.position);
        this.layer = params.layer;
        this.rotation = params.rotation ?? 0;
        this.definition = throwables_1.Throwables.reify(params.definition);
        this.position = params.position;
        this._lastPosition = this.position;
        this.hitbox.radius = this.definition.hitboxRadius;
        this.health = this.definition.health ?? Infinity;
        this.damageable = this.definition.c4 ?? false;
        this.owner = params.owner;
        this.source = params.source;
        if (this.owner.isPlayer) {
            this.throwerTeamID = this.owner.teamID ?? 0;
            this.tintIndex = this.owner.colorIndex;
        }
        this.halloweenSkin = params.halloweenSkin ?? false;
        this._height = params.height;
        this._velocity = params.velocity;
        this._fuseTime = params.fuseTime ?? this.definition.fuseTime;
        // add +/- 10% variation to angular velocity to prevent every throwable from ending in the same position
        const vel = this.definition.physics.initialAngularVelocity;
        this._angularVelocity = vel + (0, random_1.randomFloat)(vel / -10, vel / 10);
        this._velocityZ = this.definition.physics.initialZVelocity;
    }
    update() {
        if (!this.definition.c4 || this.activated) {
            this._fuseTime -= this.game.dt;
        }
        if (this._fuseTime < 0) {
            this._detonate();
            return;
        }
        const initialLastPosition = vector_1.Vec.clone(this.position);
        const dt = this.game.dt / 1000;
        const objects = this.game.grid.intersectsHitbox(hitbox_1.RectangleHitbox.fromLine(this._lastPosition, this.position), this.layer);
        const collisions = [];
        for (const object of objects) {
            if (!(object.isBuilding || object.isObstacle || object.isPlayer)
                || object.dead
                || !object.hitbox
                || object === this.owner
                || !(0, layer_1.equivLayer)(object, this)
                || (object.isObstacle && object.definition.noCollisions))
                continue;
            const hitbox = object.hitbox;
            const hitboxes = hitbox.type === hitbox_1.HitboxType.Group ? hitbox.hitboxes : [hitbox];
            for (const hitbox of hitboxes) {
                const intersection = hitbox.getIntersection(this.hitbox);
                if (intersection) {
                    const position = vector_1.Vec.sub(this.position, vector_1.Vec.scale(intersection.dir, intersection.pen));
                    collisions.push({
                        position,
                        normal: intersection.dir,
                        object,
                        distance: math_1.Geometry.distanceSquared(this._lastPosition, position)
                    });
                }
            }
            const lineIntersection = hitbox.intersectsLine(this._lastPosition, this.position);
            if (lineIntersection) {
                const position = vector_1.Vec.add(lineIntersection.point, vector_1.Vec.scale(vector_1.Vec.normalize(vector_1.Vec.sub(lineIntersection.point, this._lastPosition)), -this.hitbox.radius / 5));
                collisions.push({
                    position,
                    normal: lineIntersection.normal,
                    object,
                    distance: math_1.Geometry.distanceSquared(this._lastPosition, position),
                    isLine: true
                });
            }
        }
        collisions.sort((a, b) => a.distance - b.distance);
        for (const collision of collisions) {
            const { object } = collision;
            if (!object.hitbox)
                continue;
            if (object.isObstacle || object.isBuilding) {
                if (object.isObstacle && object.definition.isStair) {
                    object.handleStairInteraction(this);
                    continue;
                }
                const height = object.height;
                if (this._height >= height) {
                    this._obstaclesBelow.add(object);
                    continue;
                }
                if (this._obstaclesBelow.has(object))
                    continue;
            }
            if (collision.isLine) {
                this.position = collision.position;
            }
            if (!this.inAir)
                continue;
            if ((object.isObstacle || object.isPlayer) && this.definition.impactDamage) {
                const damage = this.definition.impactDamage
                    * (object.isPlayer ? 1 : this.definition.obstacleMultiplier ?? 1);
                object.damage({ amount: damage, source: this.owner, weaponUsed: this.source });
                // forcing a detonation seems to be broken, so we modify the fuse time
                if (this.owner.isPlayer && this.owner.hasPerk("demo_expert" /* PerkIds.DemoExpert */)) {
                    this._fuseTime = -1;
                }
            }
            if (object.dead)
                continue;
            this.hitbox.resolveCollision(object.hitbox);
            this._reflect(collision.normal);
            break;
        }
        // only decrease projectile height if its not on top of an obstacle that has a height smaller than it
        let height = this._height;
        let sittingOnObstacle = false;
        // find obstacle with highest height
        for (const obstacle of this._obstaclesBelow) {
            if (!obstacle.hitbox?.collidesWith(this.hitbox) || obstacle.dead) {
                this._obstaclesBelow.delete(obstacle);
                continue;
            }
            height = math_1.Numeric.max(height, obstacle.height);
            if (this._height <= obstacle.height) {
                sittingOnObstacle = true;
            }
        }
        const lastHeight = this._height;
        if (this._height === 0 || sittingOnObstacle) {
            this._height = height;
        }
        else {
            if (this._height > 0) {
                this._velocityZ -= constants_1.GameConstants.projectiles.gravity * dt;
            }
            this._height += this._velocityZ * dt;
            this._height = math_1.Numeric.clamp(this._height, 0, constants_1.GameConstants.projectiles.maxHeight);
        }
        const onFloor = this._height <= 0;
        const onWater = onFloor && !!terrain_1.FloorTypes[this.game.map.terrain.getFloor(this.position, this.layer)].overlay;
        const drag = this.definition.physics.drag ?? constants_1.GameConstants.projectiles.drag;
        // apply more friction based on being on top of something (ground or obstacle) or on water
        let speedDrag = drag.air;
        if (onWater)
            speedDrag = drag.water;
        else if (onFloor || sittingOnObstacle)
            speedDrag = drag.ground;
        this.inAir = !onFloor && !sittingOnObstacle;
        this._velocity = vector_1.Vec.scale(this._velocity, 1 / (1 + dt * speedDrag));
        this._lastPosition = vector_1.Vec.clone(this.position);
        this.position = vector_1.Vec.add(this.position, vector_1.Vec.scale(this._velocity, dt));
        this.position.x = math_1.Numeric.clamp(this.position.x, 0, this.game.map.width);
        this.position.y = math_1.Numeric.clamp(this.position.y, 0, this.game.map.height);
        const lastRotation = this.rotation;
        this.rotation = math_1.Angle.normalize(this.rotation + this._angularVelocity * dt);
        this._angularVelocity *= (1 / (1 + dt * 1.2));
        if (!vector_1.Vec.equals(this.position, initialLastPosition)
            || !math_1.Numeric.equals(this.rotation, lastRotation)
            || !math_1.Numeric.equals(this._height, lastHeight)) {
            this.game.grid.updateObject(this);
            this.setPartialDirty();
        }
        else if (!this.activated && this.definition.summonAirdrop) {
            this.activated = true;
            this.game.summonAirdrop(this.position);
        }
    }
    detonated = false;
    _detonate() {
        if (this.detonated)
            return;
        this.detonated = true;
        const { explosion, particles, spookyParticles, decal } = this.definition.detonation;
        const game = this.game;
        if (explosion !== undefined) {
            game.addExplosion(explosion, this.position, this.owner, this.layer, this.source, this.halloweenSkin ? perks_1.PerkData["plumpkin_bomb" /* PerkIds.PlumpkinBomb */].damageMod : 1, this._obstaclesBelow);
        }
        const effectiveParticles = (this.halloweenSkin && spookyParticles) ? spookyParticles : particles;
        if (effectiveParticles !== undefined) {
            game.addSyncedParticles(effectiveParticles, this.position, this.layer);
        }
        if (decal !== undefined) {
            game.addDecal(decal, this.position, this.rotation, this.layer);
        }
        this.game.removeProjectile(this);
    }
    _reflect(normal) {
        const length = vector_1.Vec.len(this._velocity);
        const direction = vector_1.Vec.scale(this._velocity, 1 / length);
        const dot = vector_1.Vec.dotProduct(direction, normal);
        const newDir = vector_1.Vec.add(vector_1.Vec.scale(normal, dot * -2), direction);
        this._velocity = vector_1.Vec.scale(newDir, length * 0.3);
    }
    get data() {
        return {
            position: this.position,
            rotation: this.rotation,
            layer: this.layer,
            height: this._height,
            full: {
                definition: this.definition,
                halloweenSkin: this.halloweenSkin,
                activated: this.activated,
                c4: {
                    throwerTeamID: this.throwerTeamID,
                    tintIndex: this.tintIndex
                }
            }
        };
    }
    push(angle, speed) {
        this._velocity = vector_1.Vec.add(this._velocity, vector_1.Vec.fromPolar(angle, speed * 1000));
        if (!this.definition.physics.noSpin)
            this._angularVelocity = 10;
    }
    activateC4() {
        if (!this.definition.c4) {
            throw new Error("Tried to activate non c4 projectile");
        }
        if (this.inAir)
            return false;
        this.activated = true;
        this.setDirty();
        return true;
    }
    damage({ amount }) {
        if (!this.health)
            return;
        this.health = this.health - amount;
        if (this.health <= 0) {
            this.destroy();
            this.game.removeProjectile(this);
        }
    }
    destroy() {
        if (this.dead)
            return;
        this.dead = true;
        if (this.owner.isPlayer) {
            this.owner.c4s.delete(this);
            this.owner.dirty.activeC4s = true;
        }
    }
}
exports.Projectile = Projectile;
//# sourceMappingURL=projectile.js.map