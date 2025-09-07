"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const constants_1 = require("../../../../common/src/constants");
const layer_1 = require("../../../../common/src/utils/layer");
const math_1 = require("../../../../common/src/utils/math");
const objectPool_1 = require("../../../../common/src/utils/objectPool");
const vector_1 = require("../../../../common/src/utils/vector");
/**
 * A Grid to filter collision detection of game objects
 */
class Grid {
    game;
    width;
    height;
    cellSize = 32;
    //                        X     Y     Object ID
    //                      __^__ __^__     ___^__
    _grid;
    // store the cells each game object is occupying
    // so removing the object from the grid is faster
    _objectsCells = new Map();
    pool = new objectPool_1.ObjectPool();
    constructor(game, width, height) {
        this.game = game;
        this.width = Math.floor(width / this.cellSize);
        this.height = Math.floor(height / this.cellSize);
        // fill the grid X row with arrays for the Y column
        // maps are created on-demand to save memory usage
        this._grid = Array.from({ length: this.width + 1 }, () => []);
    }
    /**
     * Add an object to the grid system and pool
     */
    addObject(object) {
        if (this.pool.has(object)) {
            this.game.warn(`[Grid] Tried to add object ${constants_1.ObjectCategory[object.type]} again`);
            return;
        }
        this.pool.add(object);
        this.updateObject(object);
        this.game.updateObjects = true;
    }
    /**
     * Update an object position on the grid system
     * This removes it from the grid and re-adds it
     */
    updateObject(object) {
        this._removeFromGrid(object);
        const cells = [];
        const hasSpawnHitbox = "spawnHitbox" in object;
        const hitbox = object.hitbox;
        if (hitbox === undefined && !hasSpawnHitbox) {
            const pos = this._roundToCells(object.position);
            (this._grid[pos.x][pos.y] ??= new Map()).set(object.id, object);
            cells.push(pos);
        }
        else {
            const rect = (hasSpawnHitbox
                ? object.spawnHitbox
                // can't be undefined cuz then hasSpawnHitbox would be true, meaning we'd pick the ternary's other branch
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                : hitbox).toRectangle();
            // Get the bounds of the hitbox
            // Round it to the grid cells
            const min = this._roundToCells(rect.min);
            const max = this._roundToCells(rect.max);
            // Add it to all grid cells that it intersects
            for (let x = min.x, maxX = max.x; x <= maxX; x++) {
                const xRow = this._grid[x];
                for (let y = min.y, maxY = max.y; y <= maxY; y++) {
                    (xRow[y] ??= new Map()).set(object.id, object);
                    cells.push((0, vector_1.Vec)(x, y));
                }
            }
        }
        // Store the cells this object is occupying
        this._objectsCells.set(object.id, cells);
    }
    _removeFromGrid(object) {
        const cells = this._objectsCells.get(object.id);
        if (!cells)
            return;
        for (const cell of cells) {
            this._grid[cell.x][cell.y].delete(object.id);
        }
        this._objectsCells.delete(object.id);
    }
    /**
     * Remove an object from the grid system and object pool
     */
    removeObject(object) {
        this._removeFromGrid(object);
        this.pool.delete(object);
    }
    /**
     * Get all objects near this hitbox. This transforms the hitbox into a rectangle
     * and gets all objects intersecting it after rounding it to grid cells
     *
     * @param hitbox The hitbox
     * @param layer An optional layer to filter by; if omitted, all objects intersecting the hitbox—regardless of their layer—are returned
     * @return A set with the objects near this hitbox
     */
    intersectsHitbox(hitbox, layer) {
        const rect = hitbox.toRectangle();
        const min = this._roundToCells(rect.min);
        const max = this._roundToCells(rect.max);
        const objects = new Set();
        const includeAll = layer === undefined;
        for (let x = min.x, maxX = max.x; x <= maxX; x++) {
            const xRow = this._grid[x];
            for (let y = min.y, maxY = max.y; y <= maxY; y++) {
                const objectsMap = xRow[y];
                if (!objectsMap)
                    continue;
                for (const object of objectsMap.values()) {
                    // Only filter intersecting objects by their layer if a layer was specified.
                    if (includeAll || (object.layer !== undefined && (0, layer_1.adjacentOrEquivLayer)(object, layer))) {
                        objects.add(object);
                    }
                }
            }
        }
        return objects;
    }
    /**
     * Rounds a position to this grid cells
     */
    _roundToCells(vector) {
        return {
            x: math_1.Numeric.clamp(Math.floor(vector.x / this.cellSize), 0, this.width),
            y: math_1.Numeric.clamp(Math.floor(vector.y / this.cellSize), 0, this.height)
        };
    }
}
exports.Grid = Grid;
//# sourceMappingURL=grid.js.map