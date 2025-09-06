"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonHitbox = exports.GroupHitbox = exports.RectangleHitbox = exports.CircleHitbox = exports.BaseHitbox = exports.HitboxType = void 0;
const math_1 = require("./math");
const misc_1 = require("./misc");
const random_1 = require("./random");
const vector_1 = require("./vector");
var HitboxType;
(function (HitboxType) {
    HitboxType[HitboxType["Circle"] = 0] = "Circle";
    HitboxType[HitboxType["Rect"] = 1] = "Rect";
    HitboxType[HitboxType["Group"] = 2] = "Group";
    HitboxType[HitboxType["Polygon"] = 3] = "Polygon";
})(HitboxType || (exports.HitboxType = HitboxType = {}));
const intersectionFunctions = [];
function setIntersectionFn(hitboxTypeA, hitboxTypeB, fn) {
    const setFunction = (typeA, typeB, fn, reverse) => {
        intersectionFunctions[typeA] ??= [];
        intersectionFunctions[typeA][typeB] = {
            fn: fn,
            reverse
        };
    };
    setFunction(hitboxTypeA, hitboxTypeB, fn, false);
    // @ts-expect-error shut up
    if (hitboxTypeA !== hitboxTypeB) {
        setFunction(hitboxTypeB, hitboxTypeA, fn, true);
    }
}
setIntersectionFn(HitboxType.Circle, HitboxType.Circle, (a, b) => {
    return math_1.Collision.circleCircleIntersection(a.position, a.radius, b.position, b.radius);
});
setIntersectionFn(HitboxType.Circle, HitboxType.Rect, (a, b) => {
    return math_1.Collision.rectCircleIntersection(b.min, b.max, a.position, a.radius);
});
setIntersectionFn(HitboxType.Rect, HitboxType.Rect, (a, b) => {
    return math_1.Collision.rectRectIntersection(a.min, a.max, b.min, b.max);
});
function getIntersection(hitboxA, hitboxB) {
    const collisionFn = intersectionFunctions[hitboxA.type][hitboxB.type];
    if (!collisionFn) {
        throw new Error(`${hitboxA.type} doesn't support intersection with ${hitboxB.type}`);
    }
    const response = collisionFn.reverse
        ? collisionFn.fn(hitboxB, hitboxA)
        : collisionFn.fn(hitboxA, hitboxB);
    if (response && collisionFn.reverse) {
        response.dir = vector_1.Vec.invert(response.dir);
    }
    return response;
}
class BaseHitbox {
    static fromJSON(data) {
        switch (data.type) {
            case HitboxType.Circle:
                return new CircleHitbox(data.radius, data.position);
            case HitboxType.Rect:
                return new RectangleHitbox(data.min, data.max);
            case HitboxType.Group:
                return new GroupHitbox(...data.hitboxes.map(d => BaseHitbox.fromJSON(d)));
            case HitboxType.Polygon:
                return new PolygonHitbox(data.points);
        }
    }
    [misc_1.cloneSymbol]() { return this.clone(false); }
    [misc_1.cloneDeepSymbol]() { return this.clone(true); }
    throwUnknownSubclassError(that) {
        throw new Error(`Hitbox type ${HitboxType[this.type]} doesn't support this operation with hitbox type ${HitboxType[that.type]}`);
    }
}
exports.BaseHitbox = BaseHitbox;
class CircleHitbox extends BaseHitbox {
    type = HitboxType.Circle;
    position;
    radius;
    static simple(radius, center) {
        return {
            type: HitboxType.Circle,
            radius,
            position: center ?? (0, vector_1.Vec)(0, 0)
        };
    }
    constructor(radius, position) {
        super();
        this.position = position ?? (0, vector_1.Vec)(0, 0);
        this.radius = radius;
    }
    toJSON() {
        return {
            type: this.type,
            radius: this.radius,
            position: vector_1.Vec.clone(this.position)
        };
    }
    collidesWith(that) {
        switch (that.type) {
            case HitboxType.Circle:
                return math_1.Collision.circleCollision(that.position, that.radius, this.position, this.radius);
            case HitboxType.Rect:
                return math_1.Collision.rectangleCollision(that.min, that.max, this.position, this.radius);
            case HitboxType.Group:
                return that.collidesWith(this);
            case HitboxType.Polygon:
                // TODO: proper circle to polygon detection
                return that.collidesWith(this.toRectangle());
        }
    }
    resolveCollision(that) {
        switch (that.type) {
            case HitboxType.Circle: {
                const collision = math_1.Collision.circleCircleIntersection(this.position, this.radius, that.position, that.radius);
                if (collision) {
                    this.position = vector_1.Vec.sub(this.position, vector_1.Vec.scale(collision.dir, collision.pen));
                }
                break;
            }
            case HitboxType.Rect: {
                const collision = math_1.Collision.rectCircleIntersection(that.min, that.max, this.position, this.radius);
                if (collision) {
                    this.position = vector_1.Vec.sub(this.position, vector_1.Vec.scale(collision.dir, collision.pen));
                }
                break;
            }
            case HitboxType.Group: {
                for (const hitbox of that.hitboxes) {
                    if (this.collidesWith(hitbox)) {
                        this.resolveCollision(hitbox);
                    }
                }
                break;
            }
            default: {
                this.throwUnknownSubclassError(that);
            }
        }
    }
    distanceTo(that) {
        switch (that.type) {
            case HitboxType.Circle:
                return math_1.Collision.distanceBetweenCircles(that.position, that.radius, this.position, this.radius);
            case HitboxType.Rect:
                return math_1.Collision.distanceBetweenRectangleCircle(that.min, that.max, this.position, this.radius);
            default:
                this.throwUnknownSubclassError(that);
        }
    }
    clone(deep = true) {
        return new CircleHitbox(this.radius, deep ? vector_1.Vec.clone(this.position) : this.position);
    }
    transform(position, scale = 1, orientation = 0) {
        return new CircleHitbox(this.radius * scale, vector_1.Vec.addAdjust(position, this.position, orientation));
    }
    scale(scale) {
        this.radius *= scale;
    }
    getIntersection(hitbox) {
        return getIntersection(this, hitbox);
    }
    intersectsLine(a, b) {
        return math_1.Collision.lineIntersectsCircle(a, b, this.position, this.radius);
    }
    randomPoint() {
        return (0, random_1.randomPointInsideCircle)(this.position, this.radius);
    }
    toRectangle() {
        return new RectangleHitbox((0, vector_1.Vec)(this.position.x - this.radius, this.position.y - this.radius), (0, vector_1.Vec)(this.position.x + this.radius, this.position.y + this.radius));
    }
    isPointInside(point) {
        return math_1.Geometry.distance(point, this.position) < this.radius;
    }
    getCenter() {
        return this.position;
    }
}
exports.CircleHitbox = CircleHitbox;
class RectangleHitbox extends BaseHitbox {
    type = HitboxType.Rect;
    min;
    max;
    static fromLine(a, b) {
        return new RectangleHitbox((0, vector_1.Vec)(math_1.Numeric.min(a.x, b.x), math_1.Numeric.min(a.y, b.y)), (0, vector_1.Vec)(math_1.Numeric.max(a.x, b.x), math_1.Numeric.max(a.y, b.y)));
    }
    static fromRect(width, height, center = (0, vector_1.Vec)(0, 0)) {
        const size = (0, vector_1.Vec)(width / 2, height / 2);
        return new RectangleHitbox(vector_1.Vec.sub(center, size), vector_1.Vec.add(center, size));
    }
    static simple(width, height, center = (0, vector_1.Vec)(0, 0)) {
        const size = (0, vector_1.Vec)(width / 2, height / 2);
        return {
            type: HitboxType.Rect,
            min: vector_1.Vec.sub(center, size),
            max: vector_1.Vec.add(center, size)
        };
    }
    constructor(min, max) {
        super();
        this.min = min;
        this.max = max;
    }
    toJSON() {
        return {
            type: this.type,
            min: vector_1.Vec.clone(this.min),
            max: vector_1.Vec.clone(this.max)
        };
    }
    collidesWith(that) {
        switch (that.type) {
            case HitboxType.Circle:
                return math_1.Collision.rectangleCollision(this.min, this.max, that.position, that.radius);
            case HitboxType.Rect:
                return math_1.Collision.rectRectCollision(that.min, that.max, this.min, this.max);
            case HitboxType.Group:
            case HitboxType.Polygon:
                return that.collidesWith(this);
        }
    }
    resolveCollision(that) {
        switch (that.type) {
            case HitboxType.Circle: {
                const collision = math_1.Collision.rectCircleIntersection(this.min, this.max, that.position, that.radius);
                if (collision) {
                    const rect = this.transform(vector_1.Vec.scale(collision.dir, -collision.pen));
                    this.min = rect.min;
                    this.max = rect.max;
                }
                break;
            }
            case HitboxType.Rect: {
                const collision = math_1.Collision.rectRectIntersection(this.min, this.max, that.min, that.max);
                if (collision) {
                    const rect = this.transform(vector_1.Vec.scale(collision.dir, -collision.pen));
                    this.min = rect.min;
                    this.max = rect.max;
                }
                break;
            }
            case HitboxType.Group: {
                for (const hitbox of that.hitboxes) {
                    if (this.collidesWith(hitbox))
                        this.resolveCollision(hitbox);
                }
                break;
            }
            default:
                this.throwUnknownSubclassError(that);
        }
    }
    distanceTo(that) {
        switch (that.type) {
            case HitboxType.Circle:
                return math_1.Collision.distanceBetweenRectangleCircle(this.min, this.max, that.position, that.radius);
            case HitboxType.Rect:
                return math_1.Collision.distanceBetweenRectangles(that.min, that.max, this.min, this.max);
        }
        this.throwUnknownSubclassError(that);
    }
    clone(deep = true) {
        return new RectangleHitbox(deep ? vector_1.Vec.clone(this.min) : this.min, deep ? vector_1.Vec.clone(this.max) : this.max);
    }
    transform(position, scale = 1, orientation = 0) {
        const rect = math_1.Geometry.transformRectangle(position, this.min, this.max, scale, orientation);
        return new RectangleHitbox(rect.min, rect.max);
    }
    scale(scale) {
        const centerX = (this.min.x + this.max.x) / 2;
        const centerY = (this.min.y + this.max.y) / 2;
        this.min = (0, vector_1.Vec)((this.min.x - centerX) * scale + centerX, (this.min.y - centerY) * scale + centerY);
        this.max = (0, vector_1.Vec)((this.max.x - centerX) * scale + centerX, (this.max.y - centerY) * scale + centerY);
    }
    getIntersection(hitbox) {
        return getIntersection(this, hitbox);
    }
    intersectsLine(a, b) {
        return math_1.Collision.lineIntersectsRect(a, b, this.min, this.max);
    }
    randomPoint() {
        return {
            x: (0, random_1.randomFloat)(this.min.x, this.max.x),
            y: (0, random_1.randomFloat)(this.min.y, this.max.y)
        };
    }
    toRectangle() {
        return this.clone();
    }
    isPointInside(point) {
        return point.x > this.min.x && point.y > this.min.y && point.x < this.max.x && point.y < this.max.y;
    }
    getCenter() {
        return {
            x: this.min.x + ((this.max.x - this.min.x) / 2),
            y: this.min.y + ((this.max.y - this.min.y) / 2)
        };
    }
    isFullyWithin(that) {
        return (that.min.x <= this.min.x
            && that.min.y <= this.min.y
            && that.max.x >= this.max.x
            && that.max.y >= this.max.y);
    }
    getSide(position) {
        const { min, max } = this;
        if (position.x > min.x && position.x < max.x) {
            if (position.y < min.y)
                return 0;
            else if (position.y > max.y)
                return 2;
        }
        else if (position.y > min.y && position.y < max.y) {
            if (position.x > max.x)
                return 1;
            else if (position.x < min.x)
                return 3;
        }
        return -1;
    }
}
exports.RectangleHitbox = RectangleHitbox;
class GroupHitbox extends BaseHitbox {
    type = HitboxType.Group;
    position = (0, vector_1.Vec)(0, 0);
    hitboxes;
    static simple(...hitboxes) {
        return {
            type: HitboxType.Group,
            hitboxes: hitboxes.map(h => h.toJSON())
        };
    }
    constructor(...hitboxes) {
        super();
        // yes? no? maybe?
        // if (hitboxes.length === 0) throw new class StupidityError extends Error {} ("you're stupid");
        this.hitboxes = hitboxes;
    }
    toJSON() {
        return {
            type: HitboxType.Group,
            hitboxes: this.hitboxes.map(hitbox => hitbox.toJSON())
        };
    }
    collidesWith(that) {
        return this.hitboxes.some(hitbox => hitbox.collidesWith(that));
    }
    resolveCollision(that) {
        that.resolveCollision(this);
    }
    distanceTo(that) {
        let distance = Number.MAX_VALUE;
        let record;
        for (const hitbox of this.hitboxes) {
            let newRecord;
            switch (hitbox.type) {
                case HitboxType.Circle:
                    switch (that.type) {
                        case HitboxType.Circle:
                            newRecord = math_1.Collision.distanceBetweenCircles(that.position, that.radius, hitbox.position, hitbox.radius);
                            break;
                        case HitboxType.Rect:
                            newRecord = math_1.Collision.distanceBetweenRectangleCircle(that.min, that.max, hitbox.position, hitbox.radius);
                            break;
                    }
                    break;
                case HitboxType.Rect:
                    switch (that.type) {
                        case HitboxType.Circle:
                            newRecord = math_1.Collision.distanceBetweenRectangleCircle(hitbox.min, hitbox.max, that.position, that.radius);
                            break;
                        case HitboxType.Rect:
                            newRecord = math_1.Collision.distanceBetweenRectangles(that.min, that.max, hitbox.min, hitbox.max);
                    }
                    break;
            }
            if (newRecord.distance < distance) {
                record = newRecord;
                distance = newRecord.distance;
            }
        }
        // we pray that this nna is okay (if this.hitboxes is empty, it won't be okay)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return record;
    }
    clone(deep = true) {
        return new GroupHitbox(...(deep
            ? this.hitboxes.map(hitbox => hitbox.clone(true))
            : this.hitboxes));
    }
    transform(position, scale, orientation) {
        this.position = position;
        return new GroupHitbox(...this.hitboxes.map(hitbox => hitbox.transform(position, scale, orientation)));
    }
    scale(scale) {
        for (const hitbox of this.hitboxes)
            hitbox.scale(scale);
    }
    getIntersection(_hitbox) {
        throw new Error("Get intersection only supports base shapes");
    }
    intersectsLine(a, b) {
        const intersections = [];
        // get the closest intersection point from the start of the line
        for (const hitbox of this.hitboxes) {
            const intersection = hitbox.intersectsLine(a, b);
            if (intersection)
                intersections.push(intersection);
        }
        return intersections.sort((c, d) => math_1.Geometry.distanceSquared(c.point, a) - math_1.Geometry.distanceSquared(d.point, a))[0] ?? null;
    }
    randomPoint() {
        return (0, random_1.pickRandomInArray)(this.hitboxes).randomPoint();
    }
    toRectangle() {
        const min = (0, vector_1.Vec)(Number.MAX_VALUE, Number.MAX_VALUE);
        const max = (0, vector_1.Vec)(0, 0);
        for (const hitbox of this.hitboxes) {
            const toRect = hitbox.toRectangle();
            min.x = math_1.Numeric.min(min.x, toRect.min.x);
            min.y = math_1.Numeric.min(min.y, toRect.min.y);
            max.x = math_1.Numeric.max(max.x, toRect.max.x);
            max.y = math_1.Numeric.max(max.y, toRect.max.y);
        }
        return new RectangleHitbox(min, max);
    }
    isPointInside(point) {
        for (const hitbox of this.hitboxes) {
            if (hitbox.isPointInside(point))
                return true;
        }
        return false;
    }
    getCenter() {
        return this.toRectangle().getCenter();
    }
}
exports.GroupHitbox = GroupHitbox;
class PolygonHitbox extends BaseHitbox {
    type = HitboxType.Polygon;
    points;
    center;
    static simple(points, center = (0, vector_1.Vec)(0, 0)) {
        return {
            type: HitboxType.Polygon,
            points,
            center
        };
    }
    constructor(points, center = (0, vector_1.Vec)(0, 0)) {
        super();
        this.points = points;
        this.center = center;
    }
    toJSON() {
        return {
            type: this.type,
            points: this.points.map(point => vector_1.Vec.clone(point)),
            center: this.center
        };
    }
    collidesWith(that) {
        switch (that.type) {
            case HitboxType.Rect: {
                if (this.isPointInside(that.min) || this.isPointInside(that.max))
                    return true;
                const length = this.points.length;
                for (let i = 0; i < length; i++) {
                    const a = this.points[i];
                    if (that.isPointInside(a))
                        return true;
                    const b = this.points[(i + 1) % length];
                    if (math_1.Collision.lineIntersectsRectTest(b, a, that.min, that.max)) {
                        return true;
                    }
                }
                return false;
            }
            case HitboxType.Group:
            case HitboxType.Circle: {
                return that.collidesWith(this);
            }
        }
        this.throwUnknownSubclassError(that);
    }
    resolveCollision(that) {
        this.throwUnknownSubclassError(that);
    }
    distanceTo(that) {
        this.throwUnknownSubclassError(that);
    }
    clone(deep = true) {
        return new PolygonHitbox(deep
            ? this.points.map(p => vector_1.Vec.clone(p))
            : this.points);
    }
    transform(position, scale = 1, orientation = 0) {
        return new PolygonHitbox(this.points.map(point => vector_1.Vec.scale(vector_1.Vec.addAdjust(position, point, orientation), scale)));
    }
    scale(scale) {
        for (let i = 0, length = this.points.length; i < length; i++) {
            this.points[i] = vector_1.Vec.scale(this.points[i], scale);
        }
    }
    getIntersection(hitbox) {
        this.throwUnknownSubclassError(hitbox);
    }
    intersectsLine(_a, _b) {
        throw new Error("Operation not supported");
    }
    randomPoint() {
        const rect = this.toRectangle();
        let point;
        do {
            point = rect.randomPoint();
        } while (!this.isPointInside(point));
        return point;
    }
    toRectangle() {
        const min = (0, vector_1.Vec)(Number.MAX_VALUE, Number.MAX_VALUE);
        const max = (0, vector_1.Vec)(0, 0);
        for (const point of this.points) {
            min.x = math_1.Numeric.min(min.x, point.x);
            min.y = math_1.Numeric.min(min.y, point.y);
            max.x = math_1.Numeric.max(max.x, point.x);
            max.y = math_1.Numeric.max(max.y, point.y);
        }
        return new RectangleHitbox(min, max);
    }
    isPointInside(point) {
        const { x, y } = point;
        let inside = false;
        const count = this.points.length;
        // take first and last
        // then take second and second last
        // so on
        for (let i = 0, j = count - 1; i < count; j = i++) {
            const { x: xi, y: yi } = this.points[i];
            const { x: xj, y: yj } = this.points[j];
            if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
                inside = !inside;
            }
        }
        return inside;
    }
    getCenter() {
        return this.toRectangle().getCenter();
    }
}
exports.PolygonHitbox = PolygonHitbox;
//# sourceMappingURL=hitbox.js.map