"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeededRandom = void 0;
exports.randomFloat = randomFloat;
exports.random = random;
exports.randomBoolean = randomBoolean;
exports.randomSign = randomSign;
exports.randomVector = randomVector;
exports.randomRotation = randomRotation;
exports.randomPointInsideCircle = randomPointInsideCircle;
exports.weightedRandom = weightedRandom;
exports.pickRandomInArray = pickRandomInArray;
const math_1 = require("./math");
/**
 * Generate a random floating-point value.
 * @param min The minimum value that can be generated. (inclusive)
 * @param max The maximum value that can be generated. (exclusive)
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * Generate a random integer.
 * @param min The minimum value that can be generated. (inclusive)
 * @param max The maximum value that can be generated. (inclusive)
 * @returns A random integer between `min` and `max`
 */
function random(min, max) {
    return Math.floor(randomFloat(min, max + 1));
}
/**
 * @returns A random boolean.
 */
function randomBoolean() {
    return Math.random() < 0.5;
}
/**
 * @returns Either `-1` or `1`
 */
function randomSign() {
    return randomBoolean() ? -1 : 1;
}
/**
 * Generate a vector of random direction and magnitude.
 * @param minX The minimum length in the x-direction.
 * @param maxX The maximum length in the x-direction.
 * @param minY The minimum length in the y-direction.
 * @param maxY The maximum length in the y-direction.
 */
function randomVector(minX, maxX, minY, maxY) {
    return {
        x: randomFloat(minX, maxX),
        y: randomFloat(minY, maxY)
    };
}
/**
 * @return A random angle in radians.
 */
function randomRotation() {
    return randomFloat(-Math.PI, Math.PI);
}
/**
 * Generate a random point inside of a circle.
 * @param position The center of the circle.
 * @param maxRadius The maximum radius of the circle.
 * @param minRadius The minimum radius of the circle. Defaults to 0.
 * @returns A vector representation of the randomized point.
 */
function randomPointInsideCircle(position, maxRadius, minRadius) {
    const angle = randomFloat(0, Math.PI * 2);
    const length = randomFloat(minRadius ?? 0, maxRadius);
    return {
        x: position.x + (Math.cos(angle) * length),
        y: position.y + (Math.sin(angle) * length)
    };
}
/**
 * Pick a random element from a weighted series of elements.
 * @param items The elements to choose from.
 * @param weights A legend of the elements' relative weights.
 */
function weightedRandom(items, weights) {
    let pick = Math.random() * weights.reduce((acc, cur) => acc + cur, 0);
    let i = 0;
    while ((pick -= weights[i++]) > 0)
        ;
    return items[--i];
}
function pickRandomInArray(items) {
    return items[Math.floor(Math.random() * items.length)];
}
class SeededRandom {
    _rng = 0;
    constructor(seed) {
        this._rng = seed;
    }
    /**
     * @param [min = 0] min value (included)
     * @param [max = 1] max value (excluded)
     */
    get(min = 0, max = 1) {
        this._rng = this._rng * 16807 % 2147483647;
        return math_1.Numeric.lerp(min, max, this._rng / 2147483647);
    }
    /**
     * @param [min = 0] min value (included)
     * @param [max = 1] max value (excluded)
     */
    getInt(min = 0, max = 1) {
        return Math.round(this.get(min, max));
    }
}
exports.SeededRandom = SeededRandom;
//# sourceMappingURL=random.js.map