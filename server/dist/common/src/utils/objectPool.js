"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPool = void 0;
const constants_1 = require("../constants");
class ObjectPool {
    _objects = new Map();
    _byCategory;
    getCategory(key) {
        return this._byCategory[key];
    }
    constructor() {
        this._byCategory = Object.keys(constants_1.ObjectCategory)
            .filter(e => !Number.isNaN(+e)) // ignore double indexing (extract enum members)
            .reduce((acc, cur) => {
            acc[cur] = new Set();
            return acc;
        }, {});
    }
    clear() {
        this._objects.clear();
        Object.values(this._byCategory).forEach(e => e.clear());
    }
    add(object) {
        this._objects.set(object.id, object);
        this.getCategory(object.type).add(object);
    }
    delete(object) {
        this.getCategory(object.type).delete(object);
        this._objects.delete(object.id);
    }
    has(object) {
        return this._objects.has(object.id);
    }
    categoryHas(object) {
        return this.getCategory(object.type).has(object);
    }
    get(id) {
        return this._objects.get(id);
    }
    hasId(id) {
        return this._objects.has(id);
    }
    get size() {
        return this._objects.size;
    }
    [Symbol.iterator]() {
        return this._objects.values();
    }
}
exports.ObjectPool = ObjectPool;
//# sourceMappingURL=objectPool.js.map