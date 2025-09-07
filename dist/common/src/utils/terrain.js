"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.River = exports.Terrain = exports.FloorTypes = void 0;
const hitbox_1 = require("./hitbox");
const math_1 = require("./math");
const random_1 = require("./random");
const vector_1 = require("./vector");
exports.FloorTypes = {
    grass: {
        debugColor: 0x005500
    },
    stone: {
        debugColor: 0x121212
    },
    wood: {
        debugColor: 0x7f5500
    },
    log: {
        debugColor: 0x452e00
    },
    sand: {
        debugColor: 0xff5500
    },
    metal: {
        debugColor: 0x808080
    },
    carpet: {
        debugColor: 0x32a868
    },
    water: {
        debugColor: 0x00ddff,
        speedMultiplier: 0.72,
        overlay: true,
        particles: true
    },
    void: {
        debugColor: 0x77390d
    }
};
function jaggedRectangle(hitbox, spacing, variation, random) {
    const topLeft = vector_1.Vec.clone(hitbox.min);
    const topRight = (0, vector_1.Vec)(hitbox.max.x, hitbox.min.y);
    const bottomRight = vector_1.Vec.clone(hitbox.max);
    const bottomLeft = (0, vector_1.Vec)(hitbox.min.x, hitbox.max.y);
    if (variation === 0) {
        return [
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        ];
    }
    const points = [];
    variation = variation / 2;
    const getVariation = () => random.get(-variation, variation);
    for (let x = topLeft.x + spacing; x < topRight.x; x += spacing) {
        points.push((0, vector_1.Vec)(x, topLeft.y + getVariation()));
    }
    for (let y = topRight.y + spacing; y < bottomRight.y; y += spacing) {
        points.push((0, vector_1.Vec)(topRight.x + getVariation(), y));
    }
    for (let x = bottomRight.x - spacing; x > bottomLeft.x; x -= spacing) {
        points.push((0, vector_1.Vec)(x, bottomRight.y + getVariation()));
    }
    for (let y = bottomLeft.y - spacing; y > topLeft.y; y -= spacing) {
        points.push((0, vector_1.Vec)(bottomLeft.x + getVariation(), y));
    }
    return points;
}
class Terrain {
    width;
    height;
    cellSize = 64;
    floors = new Map();
    rivers;
    beachHitbox;
    grassHitbox;
    groundRect;
    _grid = [];
    constructor(width, height, oceanSize, beachSize, seed, rivers) {
        this.width = Math.floor(width / this.cellSize);
        this.height = Math.floor(height / this.cellSize);
        for (let x = 0; x <= this.width; x++) {
            this._grid[x] = [];
            for (let y = 0; y <= this.height; y++) {
                this._grid[x][y] = {
                    rivers: [],
                    floors: []
                };
            }
        }
        // generate beach and grass
        const beachPadding = oceanSize + beachSize;
        const random = new random_1.SeededRandom(seed);
        const spacing = 16;
        const beachRect = this.groundRect = new hitbox_1.RectangleHitbox((0, vector_1.Vec)(oceanSize, oceanSize), (0, vector_1.Vec)(width - oceanSize, height - oceanSize));
        const grassRect = new hitbox_1.RectangleHitbox((0, vector_1.Vec)(beachPadding, beachPadding), (0, vector_1.Vec)(width - beachPadding, height - beachPadding));
        this.beachHitbox = new hitbox_1.PolygonHitbox(jaggedRectangle(beachRect, spacing, math_1.Numeric.min(8, 2 * oceanSize), random));
        this.grassHitbox = new hitbox_1.PolygonHitbox(jaggedRectangle(grassRect, spacing, math_1.Numeric.min(8, 2 * beachSize), random));
        const point = (0, vector_1.Vec)(0, 0);
        math_1.Geometry.distanceSquared(point, (0, vector_1.Vec)(Math.max(-point.x, 0, point.x - width), Math.max(-point.y, 0, point.y - height)));
        this.rivers = rivers;
        // add rivers
        for (const river of rivers) {
            const rect = river.bankHitbox.toRectangle();
            const min = this._roundToCells(rect.min);
            const max = this._roundToCells(rect.max);
            for (let x = min.x; x <= max.x; x++) {
                for (let y = min.y; y <= max.y; y++) {
                    const min = (0, vector_1.Vec)(x * this.cellSize, y * this.cellSize);
                    const rect = new hitbox_1.RectangleHitbox(min, vector_1.Vec.add(min, (0, vector_1.Vec)(this.cellSize, this.cellSize)));
                    // only add it to cells it collides with
                    if (river.bankHitbox.collidesWith(rect)) {
                        this._grid[x][y].rivers.push(river);
                    }
                }
            }
        }
    }
    addFloor(type, hitbox, layer) {
        this.floors.set(hitbox, { floorType: type, layer });
        // get the bounds of the hitbox
        const rect = hitbox.toRectangle();
        // round it to the grid cells
        const min = this._roundToCells(rect.min);
        const max = this._roundToCells(rect.max);
        // add it to all grid cells that it intersects
        for (let x = min.x; x <= max.x; x++) {
            for (let y = min.y; y <= max.y; y++) {
                this._grid[x][y].floors.push({ type, hitbox, layer });
            }
        }
    }
    getFloor(position, layer) {
        const pos = this._roundToCells(position);
        let floor = "water" /* FloorNames.Water */;
        const isInsideMap = this.beachHitbox.isPointInside(position);
        if (isInsideMap) {
            if (layer) {
                /*
                    grass and sand only exist on layer 0; on other
                    layers, it's the void
                */
                floor = "void" /* FloorNames.Void */;
            }
            else {
                if (this.grassHitbox.isPointInside(position)) {
                    // TODO Detect mode somehow
                    floor = "grass" /* FloorNames.Grass */; // this.game.modeName === "winter" ? FloorNames.Sand : FloorNames.Grass;
                }
                else {
                    floor = "sand" /* FloorNames.Sand */;
                }
            }
        }
        const cell = this._grid[pos.x][pos.y];
        // rivers need to be clipped inside the map polygon
        if (isInsideMap) {
            for (const river of cell.rivers) {
                if (river.bankHitbox.isPointInside(position)) {
                    floor = "sand" /* FloorNames.Sand */;
                }
                if (river.waterHitbox?.isPointInside(position)) {
                    floor = "water" /* FloorNames.Water */;
                    break;
                }
            }
        }
        for (const floor of cell.floors) {
            if (floor.hitbox.isPointInside(position) && floor.layer === layer) {
                return floor.type;
            }
        }
        /*
            if no floor was found at this position, then it's either the ocean (layer 0)
            or the void (all other floors)
        */
        return layer ? "void" /* FloorNames.Void */ : floor;
    }
    /**
     * Get rivers near a position
     */
    getRiversInPosition(position) {
        const pos = this._roundToCells(position);
        return this._grid[pos.x][pos.y].rivers;
    }
    /**
     * Get rivers near a hitbox
     */
    getRiversInHitbox(hitbox, ignoreTrails = false) {
        const rivers = new Set();
        const rect = hitbox.toRectangle();
        const min = this._roundToCells(rect.min);
        const max = this._roundToCells(rect.max);
        for (let x = min.x; x <= max.x; x++) {
            for (let y = min.y; y <= max.y; y++) {
                for (const river of this._grid[x][y].rivers) {
                    if (ignoreTrails && river.isTrail)
                        continue;
                    rivers.add(river);
                }
            }
        }
        return Array.from(rivers);
    }
    _roundToCells(vector) {
        return (0, vector_1.Vec)(math_1.Numeric.clamp(Math.floor(vector.x / this.cellSize), 0, this.width), math_1.Numeric.clamp(Math.floor(vector.y / this.cellSize), 0, this.height));
    }
}
exports.Terrain = Terrain;
function catmullRomDerivative(t, p0, p1, p2, p3) {
    return 0.5 * (p2 - p0 + 2 * t * (2 * p0 - 5 * p1 + 4 * p2 - p3) + 3 * t * t * (3 * p1 - 3 * p2 + p3 - p0));
}
function catmullRom(t, p0, p1, p2, p3) {
    const tSquared = t * t;
    return 0.5 * (2 * p1 + t * (p2 - p0) + tSquared * (2 * p0 - 5 * p1 + 4 * p2 - p3) + tSquared * t * (3 * p1 - 3 * p2 + p3 - p0));
}
function clipRayToPoly(point, direction, polygon) {
    const end = vector_1.Vec.add(point, direction);
    if (!polygon.isPointInside(end)) {
        const t = math_1.Collision.rayIntersectsPolygon(point, direction, polygon.points);
        if (t) {
            return vector_1.Vec.scale(direction, t);
        }
    }
    return direction;
}
class River {
    width;
    points;
    bankWidth;
    waterHitbox;
    bankHitbox;
    isTrail;
    waterWidths = [];
    bankWidths = [];
    constructor(width, points, otherRivers, bounds, isTrail) {
        this.width = width;
        this.points = points;
        this.isTrail = isTrail;
        const isRiver = !isTrail;
        const length = this.points.length - 1;
        this.bankWidth = isRiver ? math_1.Numeric.clamp(this.width * 0.75, 12, 20) : this.width;
        const waterPoints = new Array(length * 2);
        const bankPoints = new Array(length * 2);
        const endsOnMapBounds = !bounds.isPointInside(this.points[this.points.length - 1]);
        for (let i = 0; i < this.points.length; i++) {
            const current = this.points[i];
            const normal = this.getNormal(i / length);
            let bankWidth = this.bankWidth;
            // find closest colliding river to adjust the bank width and clip this river
            let collidingRiver = null;
            for (const river of otherRivers) {
                if (river.isTrail !== isTrail)
                    continue;
                const length = vector_1.Vec.len(vector_1.Vec.sub(river.getPosition(river.getClosestT(current)), current));
                if (length < river.width * 2) {
                    bankWidth = math_1.Numeric.max(bankWidth, river.bankWidth);
                }
                if ((i === 0 || i === this.points.length - 1) && length < 48) {
                    collidingRiver = river;
                }
            }
            let width = this.width;
            const end = 2 * (math_1.Numeric.max(1 - i / length, i / length) - 0.5);
            // increase river width near map bounds
            if (isRiver && (i < (this.points.length / 2) || endsOnMapBounds)) {
                width = (1 + end ** 3 * 1.5) * this.width;
            }
            const calculatePoints = (width, hitbox, points) => {
                let ray1 = vector_1.Vec.scale(normal, width);
                let ray2 = vector_1.Vec.scale(normal, -width);
                if (hitbox) {
                    ray1 = clipRayToPoly(current, ray1, hitbox);
                    ray2 = clipRayToPoly(current, ray2, hitbox);
                }
                points[i] = vector_1.Vec.add(current, ray1);
                points[this.points.length + length - i] = vector_1.Vec.add(current, ray2);
            };
            if (isRiver) {
                this.waterWidths.push(width);
                calculatePoints(width, collidingRiver?.waterHitbox, waterPoints);
            }
            this.bankWidths.push(width + bankWidth);
            calculatePoints(width + bankWidth, collidingRiver?.bankHitbox, bankPoints);
        }
        this.waterHitbox = isRiver ? new hitbox_1.PolygonHitbox(waterPoints) : undefined;
        this.bankHitbox = new hitbox_1.PolygonHitbox(bankPoints);
    }
    getControlPoints(t) {
        const count = this.points.length;
        t = math_1.Numeric.clamp(t, 0, 1);
        // go away
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
        const i = ~~(t * (count - 1));
        const i1 = i === count - 1 ? i - 1 : i;
        const i2 = i1 + 1;
        const i0 = i1 > 0 ? i1 - 1 : i1;
        const i3 = i2 < count - 1 ? i2 + 1 : i2;
        return {
            pt: t * (count - 1) - i1,
            p0: this.points[i0],
            p1: this.points[i1],
            p2: this.points[i2],
            p3: this.points[i3]
        };
    }
    getTangent(t) {
        const { pt, p0, p1, p2, p3 } = this.getControlPoints(t);
        return {
            x: catmullRomDerivative(pt, p0.x, p1.x, p2.x, p3.x),
            y: catmullRomDerivative(pt, p0.y, p1.y, p2.y, p3.y)
        };
    }
    getNormal(t) {
        const tangent = this.getTangent(t);
        const vec = vector_1.Vec.normalizeSafe(tangent, (0, vector_1.Vec)(1, 0));
        return (0, vector_1.Vec)(-vec.y, vec.x);
    }
    getPosition(t) {
        const { pt, p0, p1, p2, p3 } = this.getControlPoints(t);
        return {
            x: catmullRom(pt, p0.x, p1.x, p2.x, p3.x),
            y: catmullRom(pt, p0.y, p1.y, p2.y, p3.y)
        };
    }
    getClosestT(position) {
        let closestDistSq = Number.MAX_VALUE;
        let closestSegIdx = 0;
        for (let i = 0; i < this.points.length - 1; i++) {
            const distSq = math_1.Collision.distanceToLine(position, this.points[i], this.points[i + 1]);
            if (distSq < closestDistSq) {
                closestDistSq = distSq;
                closestSegIdx = i;
            }
        }
        const idx0 = closestSegIdx;
        const idx1 = idx0 + 1;
        const s0 = this.points[idx0];
        const s1 = this.points[idx1];
        const seg = vector_1.Vec.sub(s1, s0);
        const t = math_1.Numeric.clamp(vector_1.Vec.dotProduct(vector_1.Vec.sub(position, s0), seg) / vector_1.Vec.dotProduct(seg, seg), 0, 1);
        const len = this.points.length - 1;
        const tMin = math_1.Numeric.clamp((idx0 + t - 0.1) / len, 0, 1);
        const tMax = math_1.Numeric.clamp((idx0 + t + 0.1) / len, 0, 1);
        // Refine closest point by testing near the closest segment point
        let nearestT = (idx0 + t) / len;
        let nearestDistSq = Number.MAX_VALUE;
        const kIter = 8;
        for (let i = 0; i <= kIter; i++) {
            const testT = math_1.Numeric.lerp(i / kIter, tMin, tMax);
            const testPos = this.getPosition(testT);
            const testDistSq = vector_1.Vec.squaredLen(vector_1.Vec.sub(testPos, position));
            if (testDistSq < nearestDistSq) {
                nearestT = testT;
                nearestDistSq = testDistSq;
            }
        }
        // Refine by offsetting along the spline tangent
        const tangent = this.getTangent(nearestT);
        const tanLen = vector_1.Vec.len(tangent);
        if (tanLen > 0) {
            const nearest = this.getPosition(nearestT);
            const offset = vector_1.Vec.dotProduct(tangent, vector_1.Vec.sub(position, nearest)) / tanLen;
            const offsetT = nearestT + offset / (tanLen * len);
            if (vector_1.Vec.squaredLen(vector_1.Vec.sub(position, this.getPosition(offsetT))) < vector_1.Vec.squaredLen(vector_1.Vec.sub(position, nearest))) {
                nearestT = offsetT;
            }
        }
        return nearestT;
    }
    /**
     * @param onBank If the position can also be inside a river bank not just water
     * @param margin A margin to subtract from the river width, useful when you dont want a cirlce to spawn inside it
     */
    getRandomPosition(onBank, margin = 0) {
        const t = Math.random();
        // river width is not consistent so map t to a point indexing the width at that point
        const pointIdx = math_1.Numeric.clamp(Math.floor(t * this.points.length), 0, this.points.length);
        const waterWidth = this[onBank ? "bankWidths" : "waterWidths"][pointIdx] - margin;
        const dist = (0, random_1.randomFloat)(0, waterWidth) * ((0, random_1.randomBoolean)() ? 1 : -1);
        // add a random offset that's between river center and river border on either directions
        const normal = this.getNormal(t);
        return vector_1.Vec.add(this.getPosition(t), vector_1.Vec.scale(normal, dist));
    }
}
exports.River = River;
//# sourceMappingURL=terrain.js.map