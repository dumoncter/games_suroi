"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedMap = exports.Queue = exports.Stack = exports.Timeout = exports.cloneSymbol = exports.cloneDeepSymbol = exports.isArray = void 0;
exports.isObject = isObject;
exports.handleResult = handleResult;
exports.mergeDeep = mergeDeep;
exports.cloneDeep = cloneDeep;
exports.freezeDeep = freezeDeep;
exports.splitArray = splitArray;
exports.groupArray = groupArray;
exports.removeFrom = removeFrom;
function isObject(item) {
    return (item && typeof item === "object" && !Array.isArray(item));
}
/**
 * Patched version of `Array.isArray` that correctly narrows types when used on `readonly` arrays
 */
// again, variance => use any on an array type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.isArray = Array.isArray;
function handleResult(result, fallbackSupplier) {
    return "err" in result ? fallbackSupplier() : result.res;
}
function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const [source, ...rest] = sources;
    if (source) { // fast-track for empty objects
        for (const key of Object.keys(source).concat(Object.getOwnPropertySymbols(source))) {
            const [sourceProp, targetProp] = [source[key], target[key]];
            if (isObject(sourceProp)) {
                if (isObject(targetProp)) {
                    mergeDeep(targetProp, sourceProp);
                }
                else {
                    target[key] = cloneDeep(sourceProp);
                }
                continue;
            }
            target[key] = sourceProp;
        }
    }
    return mergeDeep(target, ...rest);
}
/**
 * Symbol used to indicate an object's deep-clone method
 * @see {@linkcode DeepCloneable}
 * @see {@linkcode cloneDeep}
*/
exports.cloneDeepSymbol = Symbol("clone deep");
/**
 * Symbol used to indicate an object's cloning method
 */
exports.cloneSymbol = Symbol("clone");
/**
 * Clones a given value recursively. Primitives are returned as-is (effectively cloned), while objects are deeply cloned.
 *
 * On a best-effort basis, properties and their descriptors are kept intact; this includes custom properties on `Array`s,
 * `Map`s, and `Set`s. These three data structures also receive special handling to preserve their contents, and the subclass
 * is preserved to the best of {@linkcode Object.setPrototypeOf}'s ability.
 *
 * For class instances, callers should look into making the class implement the {@linkcode DeepCloneable} interface, and define their
 * own deep-cloning algorithm there; this method will honor any such method. Doing so ensures that the cloning process is faster,
 * more secure, and probably more efficient
 * @param object The value to clone
 * @returns A deep-copy of `object`, to the best of this method's ability
 * @see {@linkcode cloneDeepSymbol}
 * @see {@linkcode DeepCloneable}
 */
function cloneDeep(object) {
    // For cyclical data structures, ensures that cyclical-ness is preserved in the clone
    const clonedNodes = new Map();
    return (function internal(target) {
        if (!isObject(target) && !Array.isArray(target))
            return target;
        if (clonedNodes.has(target))
            return clonedNodes.get(target);
        if (exports.cloneDeepSymbol in target) {
            const clone = target[exports.cloneDeepSymbol];
            if (typeof clone === "function" && clone.length === 0) {
                // basically we hope that the caller isn't a dumbass and hasn't
                // passed in an object with a nonsensical cloning method
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return clone.call(target);
            }
            else {
                console.warn(`Inappropriate use of ${exports.cloneDeepSymbol.toString()}: it should be a no-arg function`);
            }
        }
        const copyAllPropDescs = (to, entryFilter = () => true) => {
            for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(target)).filter(entryFilter)) {
                desc.value = internal(target[key]);
                Object.defineProperty(to, key, desc);
            }
            return to;
        };
        const prototype = Object.getPrototypeOf(target);
        // special handling for certain builtins
        switch (true) {
            case target instanceof Array: {
                // we can probably treat this as an array (unless someone is trolling us)
                const root = Object.create(prototype);
                clonedNodes.set(target, root);
                for (let i = 0, l = target.length; i < l; i++) {
                    root[i] = internal(target[i]);
                }
                return copyAllPropDescs(root, ([key]) => /* filter out numeric keys */ Number.isNaN(+key));
            }
            case target instanceof Map: {
                const root = new Map();
                clonedNodes.set(target, root);
                for (const [k, v] of target.entries()) {
                    root.set(internal(k), internal(v));
                }
                // Map.prototype methods reject targets which aren't direct instances of `Map`, so our hand is kinda forced here
                Object.setPrototypeOf(root, prototype);
                return copyAllPropDescs(root);
            }
            case target instanceof Set: {
                const root = new Set();
                clonedNodes.set(target, root);
                for (const v of target)
                    root.add(internal(v));
                // Set.prototype methods reject targets which aren't direct instances of `Set`, so our hand is kinda forced here
                Object.setPrototypeOf(root, prototype);
                return copyAllPropDescs(root);
            }
            default: {
                /*
                    we pray that if a constructor is present, that it doesn't incur side-effects…
                    or at least, not necessary ones
                */
                const clone = Object.create(prototype);
                clonedNodes.set(target, clone);
                return copyAllPropDescs(clone);
            }
        }
    })(object);
}
function freezeDeep(object) {
    Object.freeze(object);
    for (const key in object) {
        const value = object[key];
        if (typeof value === "object" && value !== null) {
            freezeDeep(value);
        }
    }
    return object;
}
/**
 * Splits an array into two subarrays based on a predicate. If `Out` is not assignable to `string | number | symbol`, use {@link groupArray} instead
 * @param target The array to split
 * @param predicate A function deciding which subarray to put each element in
 * @returns The two subarrays
 */
function splitArray(target, predicate) {
    const length = target.length;
    const obj = Object.create(null);
    for (let i = 0; i < length; i++) {
        const ele = target[i];
        (obj[predicate(ele, i, target)] ??= []).push(ele);
    }
    return obj;
}
/**
 * Groups an array's elements based on the result of a picker function. If `Out` is assignable to `string | number | symbol`, favor the use
 * of {@link splitArray} instead
 * @param target The array to split
 * @param picker A function deciding which subarray to put each element in
 * @returns The two subarrays
 */
function groupArray(target, picker) {
    const length = target.length;
    const map = new Map();
    for (let i = 0; i < length; i++) {
        const ele = target[i];
        const key = picker(ele, i, target);
        if (map.has(key)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            map.get(key).push(ele);
            continue;
        }
        map.set(key, [ele]);
    }
    return map;
}
/**
 * Find and remove an element from an array.
 * @param array The array to iterate over.
 * @param value The value to check for.
 */
function removeFrom(array, value) {
    const index = array.indexOf(value);
    if (index !== -1)
        array.splice(index, 1);
}
class Timeout {
    callback;
    end;
    killed = false;
    constructor(callback, end) {
        this.end = end;
        this.callback = callback;
    }
    kill() {
        this.killed = true;
    }
}
exports.Timeout = Timeout;
/**
 * Implementation of a [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))
 * @template T The type of the values stored in this collection
 */
class Stack {
    /**
     * Internal backing linked list
     */
    _head;
    /**
     * Pushes an element onto the stack
     * @param {T} value The value to add to the stack
     */
    push(value) {
        this._head = { value, next: this._head };
    }
    /**
     * Takes the top element of the stack, removes it, and returns it
     *
     * @throws {Error} If the stack is empty
     */
    pop() {
        const head = this._head;
        if (head === undefined)
            throw new Error("Empty stack");
        const value = head.value;
        this._head = head.next;
        return value;
    }
    /**
     * Returns the top element of the stack without removing it
     *
     * @throws {Error} If the stack is empty
     */
    peek() {
        if (this._head === undefined)
            throw new Error("Empty stack");
        return this._head.value;
    }
    /**
     * Returns whether or not the stack currently has elements. If this method return `true`,
     * `pop` and `peek` are guaranteed not to throw; inversely, if it returns `false`, then
     * `pop` and `peek` are guaranteed to throw an error
     */
    has() {
        return this._head !== undefined;
    }
    /**
     * Cloning implementation
     * @param deep Whether to also deep-clone this stack's elements
     */
    _clone(deep = false) {
        const clone = new Stack();
        let current = this._head;
        let currentClone;
        while (current !== undefined) {
            const node = { value: deep ? cloneDeep(current.value) : current.value };
            currentClone = currentClone
                ? currentClone.next = node
                : clone._head = node;
            current = current.next;
        }
        return clone;
    }
    /**
     * Creates a clone of this {@link Stack}, without cloning the elements within
     */
    [exports.cloneSymbol]() {
        return this._clone(false);
    }
    /**
     * Creates a deep clone of this {@link Stack}, cloning the elements inside it
     */
    [exports.cloneDeepSymbol]() {
        return this._clone(true);
    }
}
exports.Stack = Stack;
/**
 * Implementation of a [queue](https://en.wikipedia.org/wiki/Queue_(abstract_data_type))
 * @template T The type of the elements stored in this collection
 */
class Queue {
    /**
     * A reference to the beginning of the internal linked list for this collection
     */
    _head;
    /**
     * A reference to the end of internal linked list for this collection
     */
    _tail;
    /**
     * Adds a value to the end of the queue
     *
     * @param value The value to add
     */
    enqueue(value) {
        const node = { value };
        if (this._tail === undefined) {
            this._tail = this._head = node;
            return;
        }
        this._tail = this._tail.next = node;
    }
    /**
     * Returns the first value in the queue, if it exists
     * @returns The value at the front of the queue
     * @throws {Error} If the queue is empty
     */
    dequeue() {
        if (this._head === undefined)
            throw new Error("Empty queue");
        const value = this._head.value;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (this._head = this._head.next) ?? delete this._tail;
        return value;
    }
    /**
     * Returns the first element of the queue without removing it
     *
     * @throws {Error} If the queue is empty
     */
    peek() {
        if (this._head === undefined)
            throw new Error("Empty queue");
        return this._head.value;
    }
    /**
     * Returns whether or not the queue currently has elements. If this method return `true`,
     * `dequeue` and `peek` are guaranteed not to throw; inversely, if it returns `false`, then
     * `dequeue` and `peek` are guaranteed to throw an error
     */
    has() {
        return this._head !== undefined;
    }
    /**
     * Cloning implementation
     * @param deep Whether to clone this queue's elements
     */
    _clone(deep = false) {
        const clone = new Queue();
        let current = this._head;
        let currentClone;
        while (current !== undefined) {
            const node = { value: deep ? cloneDeep(current.value) : current.value };
            currentClone = currentClone
                ? currentClone.next = node
                : clone._head = node;
            current = current.next ?? void (clone._tail = current);
        }
        return clone;
    }
    /**
     * Creates a clone of this {@link Queue}, without cloning the elements within
     */
    [exports.cloneSymbol]() {
        return this._clone(false);
    }
    /**
     * Creates a deep clone of this {@link Queue}, cloning the elements inside it
     */
    [exports.cloneDeepSymbol]() {
        return this._clone(true);
    }
}
exports.Queue = Queue;
// top 10 naming
class ExtendedMap extends Map {
    _get(key) {
        // it's up to callers to verify that the key is valid
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return super.get(key);
    }
    /**
     * Retrieves the value at a given key, placing (and returning) a user-defined
     * default value if no mapping for the key exists
     * @param key      The key to retrieve from
     * @param fallback A value to place at the given key if it currently not associated with a value
     * @returns The value emplaced at key `key`; either the one that was already there or `fallback` if
     *          none was present
     */
    getAndSetIfAbsent(key, fallback) {
        // pretty obvious why this is okay
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.has(key))
            return this.get(key);
        this.set(key, fallback);
        return fallback;
    }
    /**
     * Retrieves the value at a given key, placing (and returning) a user-defined
     * default value if no mapping for the key exists
     * @param key      The key to retrieve from
     * @param fallback A function providing a value to place at the given key if it currently not
     *                 associated with a value
     * @returns The value emplaced at key `key`; either the one that was already there
     *          or the result of `fallback` if none was present
     */
    getAndGetDefaultIfAbsent(key, fallback) {
        // pretty obvious why this is okay
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.has(key))
            return this.get(key);
        const value = fallback();
        this.set(key, value);
        return value;
    }
    ifPresent(key, callback) {
        this.ifPresentOrElse(key, callback, () => { });
    }
    ifPresentOrElse(key, callback, ifAbsent) {
        const mappingPresent = super.has(key);
        if (!mappingPresent) {
            return ifAbsent();
        }
        callback(this._get(key));
    }
    mapIfPresent(key, mapper) {
        if (!super.has(key))
            return undefined;
        return mapper(this._get(key));
    }
}
exports.ExtendedMap = ExtendedMap;
//# sourceMappingURL=misc.js.map