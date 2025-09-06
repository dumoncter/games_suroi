"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBullet = void 0;
const bullets_1 = require("../definitions/bullets");
const layer_1 = require("./layer");
const math_1 = require("./math");
const objectDefinitions_1 = require("./objectDefinitions");
const vector_1 = require("./vector");
class BaseBullet {
    _oldPosition;
    position;
    initialPosition;
    rotation;
    layer;
    initialLayer;
    velocity;
    direction;
    maxDistance;
    maxDistanceSquared;
    reflectionCount;
    shotFX = false;
    lastShot = false;
    sourceID;
    collidedIDs = new Set();
    rangeVariance;
    dead = false;
    definition;
    canHitShooter;
    modifiers;
    saturate;
    thin;
    split;
    constructor(options) {
        this.initialPosition = vector_1.Vec.clone(options.position);
        this._oldPosition = this.position = options.position;
        this.rotation = options.rotation;
        this.layer = this.initialLayer = options.layer;
        this.reflectionCount = options.reflectionCount ?? 0;
        this.sourceID = options.sourceID;
        this.rangeVariance = options.variance ?? 0;
        this.definition = bullets_1.Bullets.reify(options.source);
        this.modifiers = options.modifiers === undefined || Object.keys(options.modifiers).length === 0
            ? undefined
            : options.modifiers;
        let range = (this.modifiers?.range ?? 1) * this.definition.range;
        if (this.definition.allowRangeOverride && options.rangeOverride !== undefined) {
            range = math_1.Numeric.clamp(options.rangeOverride, 0, range);
        }
        this.maxDistance = (range * (this.rangeVariance + 1)) / (this.reflectionCount + 1);
        this.maxDistanceSquared = this.maxDistance ** 2;
        this.direction = (0, vector_1.Vec)(Math.sin(this.rotation), -Math.cos(this.rotation));
        this.velocity = vector_1.Vec.scale(this.direction, (this.modifiers?.speed ?? 1) * this.definition.speed * (this.rangeVariance + 1));
        this.canHitShooter = this.definition.shrapnel || this.reflectionCount > 0;
        this.saturate = options.saturate ?? false;
        this.thin = options.thin ?? false;
        this.split = options.split ?? false;
        this.shotFX = options.shotFX ?? false;
        this.lastShot = options.lastShot ?? false;
    }
    /**
     * Update the bullet and check for collisions
     * @param delta The delta time between ticks
     * @param objects An iterable containing objects to check for collision
     * @returns An array containing the objects that the bullet collided and the intersection data for each,
     * sorted by closest to furthest
     */
    updateAndGetCollisions(delta, objects) {
        const oldPosition = this._oldPosition = vector_1.Vec.clone(this.position);
        this.position = vector_1.Vec.add(this.position, vector_1.Vec.scale(this.velocity, delta));
        if (math_1.Geometry.distanceSquared(this.initialPosition, this.position) > this.maxDistanceSquared) {
            this.dead = true;
            this.position = vector_1.Vec.add(this.initialPosition, vector_1.Vec.scale(this.direction, this.maxDistance));
        }
        if (this.definition.noCollision)
            return [];
        const collisions = [];
        for (const object of objects) {
            const { isPlayer, isObstacle, isBuilding } = object;
            if (((isObstacle || isBuilding) && (object.definition.noBulletCollision
                || !(0, layer_1.equivLayer)(object, this)))
                || (isPlayer && !(0, layer_1.adjacentOrEqualLayer)(this.layer, object.layer))
                || !object.damageable
                || object.dead
                || this.collidedIDs.has(object.id)
                || (object.id === this.sourceID && !this.canHitShooter))
                continue;
            if (isPlayer) {
                const getIntersection = (surface) => {
                    const pointA = vector_1.Vec.add(object.position, vector_1.Vec.rotate(surface.pointA, object.rotation));
                    const pointB = vector_1.Vec.add(object.position, vector_1.Vec.rotate(surface.pointB, object.rotation));
                    const point = math_1.Collision.lineIntersectsLine(oldPosition, this.position, pointA, pointB);
                    if (!point)
                        return null;
                    const s = vector_1.Vec.sub(pointA, pointB);
                    const normal = vector_1.Vec.normalize((0, vector_1.Vec)(-s.y, s.x));
                    return { point, normal };
                };
                const activeDef = object.activeItemDefinition;
                const backDef = object.backEquippedMelee;
                if (activeDef.defType === objectDefinitions_1.DefinitionType.Melee && activeDef.reflectiveSurface) {
                    const intersection = getIntersection(activeDef.reflectiveSurface);
                    if (intersection) {
                        collisions.push({
                            intersection: intersection,
                            object,
                            dealDamage: false,
                            reflected: true,
                            reflectedMeleeDefinition: activeDef
                        });
                    }
                }
                if (backDef?.onBack?.reflectiveSurface) {
                    const intersection = getIntersection(backDef?.onBack.reflectiveSurface);
                    if (intersection) {
                        collisions.push({
                            intersection: intersection,
                            object,
                            dealDamage: false,
                            reflected: true,
                            reflectedMeleeDefinition: backDef
                        });
                    }
                }
            }
            const intersection = object.hitbox?.intersectsLine(oldPosition, this.position);
            if (intersection) {
                collisions.push({
                    intersection,
                    object,
                    dealDamage: true,
                    reflected: ((object.isObstacle || object.isBuilding)
                        && object.definition.reflectBullets) ?? false
                });
            }
        }
        // Sort by closest to initial position
        collisions.sort((a, b) => math_1.Geometry.distanceSquared(a.intersection.point, this.initialPosition)
            - math_1.Geometry.distanceSquared(b.intersection.point, this.initialPosition));
        return collisions;
    }
    serialize(stream) {
        bullets_1.Bullets.writeToStream(stream, this.definition);
        stream.writePosition(this.initialPosition);
        stream.writeRotation2(this.rotation);
        stream.writeLayer(this.layer);
        stream.writeFloat(this.rangeVariance, 0, 1, 4);
        stream.writeUint8(this.reflectionCount);
        stream.writeObjectId(this.sourceID);
        // don't care about damage
        // don't care about dtc
        const { speed, range, tracer: { opacity, width, length } = {} } = this.modifiers ?? {};
        const hasMods = this.modifiers !== undefined;
        const speedMod = speed !== undefined;
        const rangeMod = range !== undefined;
        const traceOpacityMod = opacity !== undefined;
        const traceWidthMod = width !== undefined;
        const traceLengthMod = length !== undefined;
        stream.writeBooleanGroup2(hasMods, speedMod, rangeMod, traceOpacityMod, traceWidthMod, traceLengthMod, this.saturate, this.thin, this.split, this.shotFX, this.lastShot);
        if (hasMods) {
            /*
                some overrides aren't sent for performance, space, and security
                reasons; if the client doesn't use value X, then don't send it for
                those three reasons
            */
            if (speedMod) {
                stream.writeFloat(speed, 0, 4, 1);
            }
            if (rangeMod) {
                stream.writeFloat(range, 0, 4, 1);
            }
            if (traceOpacityMod) {
                stream.writeFloat(opacity, 0, 4, 1);
            }
            if (traceWidthMod) {
                stream.writeFloat(width, 0, 4, 1);
            }
            if (traceLengthMod) {
                stream.writeFloat(length, 0, 4, 1);
            }
        }
        if (this.definition.allowRangeOverride) {
            stream.writeFloat(this.maxDistance, 0, this.definition.range * (this.modifiers?.range ?? 1), 2);
        }
    }
    static deserialize(stream) {
        const source = bullets_1.Bullets.readFromStream(stream);
        const position = stream.readPosition();
        const rotation = stream.readRotation2();
        const layer = stream.readLayer();
        const variance = stream.readFloat(0, 1, 4);
        const reflectionCount = stream.readUint8();
        const sourceID = stream.readObjectId();
        const [hasMods, speedMod, rangeMod, traceOpacityMod, traceWidthMod, traceLengthMod, saturate, thin, split, shotFX, lastShot] = stream.readBooleanGroup2();
        const modifiers = hasMods
            ? {
                get damage() {
                    console.warn("damage modifier is not sent to the client; accessing it is a mistake");
                    return 1;
                },
                get dtc() {
                    console.warn("dtc modifier is not sent to the client; accessing it is a mistake");
                    return 1;
                },
                speed: speedMod ? stream.readFloat(0, 4, 1) : undefined,
                range: rangeMod ? stream.readFloat(0, 4, 1) : undefined,
                tracer: {
                    opacity: traceOpacityMod ? stream.readFloat(0, 4, 1) : undefined,
                    width: traceWidthMod ? stream.readFloat(0, 4, 1) : undefined,
                    length: traceLengthMod ? stream.readFloat(0, 4, 1) : undefined
                }
            }
            : undefined;
        const rangeOverride = source.allowRangeOverride ? stream.readFloat(0, source.range * (modifiers?.range ?? 1), 2) : undefined;
        return {
            source,
            position,
            rotation,
            layer,
            variance,
            reflectionCount,
            sourceID,
            rangeOverride,
            modifiers,
            saturate,
            thin,
            split,
            shotFX,
            lastShot
        };
    }
}
exports.BaseBullet = BaseBullet;
//# sourceMappingURL=baseBullet.js.map