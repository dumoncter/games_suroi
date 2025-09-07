"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
const constants_1 = require("../../../../common/src/constants");
const buildings_1 = require("../../../../common/src/definitions/buildings");
const math_1 = require("../../../../common/src/utils/math");
const gameObject_1 = require("./gameObject");
const misc_1 = require("../utils/misc");
class Building extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.Building) {
    fullAllocBytes = 8;
    partialAllocBytes = 6;
    definition;
    scopeHitbox;
    spawnHitbox;
    hitbox;
    collidable;
    _wallsToDestroy;
    interactableObstacles = new Set();
    orientation;
    _puzzle;
    get puzzle() { return this._puzzle; }
    get hasPuzzle() { return this.puzzle !== undefined; }
    puzzlePieces = [];
    // TODO replace flyoverpref with actual height values
    get height() {
        switch (this.definition.allowFlyover) {
            case constants_1.FlyoverPref.Always:
                return 0.2;
            case constants_1.FlyoverPref.Sometimes:
                return 0.5;
        }
        return Infinity;
    }
    constructor(game, definition, position, orientation, layer) {
        super(game, position);
        this.definition = buildings_1.Buildings.reify(definition);
        this.layer = layer;
        this.rotation = math_1.Angle.orientationToRotation(this.orientation = orientation);
        this._wallsToDestroy = this.definition.wallsToDestroy ?? Infinity;
        this.spawnHitbox = this.definition.spawnHitbox.transform(this.position, 1, orientation);
        this.hitbox = this.definition.hitbox?.transform(this.position, 1, orientation);
        this.collidable = this.damageable = !!this.definition.hitbox;
        if (this.definition.ceilingHitbox !== undefined && !this.definition.noCeilingScopeEffect) {
            this.scopeHitbox = this.definition.ceilingHitbox.transform(this.position, 1, orientation);
        }
        if (this.definition.puzzle) {
            this._puzzle = {
                ...this.definition.puzzle,
                inputOrder: [],
                solved: false,
                errorSeq: false
            };
        }
    }
    damageCeiling(damage = 1) {
        if (this._wallsToDestroy === Infinity
            || this.dead
            || this.game.pluginManager.emit("building_will_damage_ceiling", {
                building: this,
                damage
            }))
            return;
        this._wallsToDestroy -= damage;
        this.game.pluginManager.emit("building_did_damage_ceiling", {
            building: this,
            damage
        });
        if (this._wallsToDestroy <= 0) {
            this.dead = true;
            this.setPartialDirty();
            this.game.pluginManager.emit("building_did_destroy_ceiling", this);
            if (this.definition.destroyOnCeilingCollapse && this.scopeHitbox) {
                for (const object of this.game.grid.intersectsHitbox(this.scopeHitbox)) {
                    if ((object.isObstacle && this.definition.destroyOnCeilingCollapse.includes(object.definition.idString)) && object.hitbox.collidesWith(this.spawnHitbox)) {
                        if (object.definition.isWindow)
                            object.collidable = false;
                        object.damage({
                            source: this,
                            amount: object.health
                        });
                    }
                }
            }
        }
    }
    damage() { }
    get data() {
        return {
            dead: this.dead,
            puzzle: this.puzzle,
            layer: this.layer,
            full: {
                definition: this.definition,
                position: this.position,
                orientation: this.orientation
            }
        };
    }
    togglePuzzlePiece(piece) {
        if (!piece.puzzlePiece) {
            console.warn(`Not a puzzle piece: ${piece.definition.idString}`);
            return;
        }
        const puzzle = this._puzzle;
        if (!puzzle) {
            console.warn("Attempting to toggle puzzle piece when no puzzle is present");
            return;
        }
        if (!("order" in puzzle)) {
            this.solvePuzzle();
            return;
        }
        if (puzzle.resetTimeout)
            puzzle.resetTimeout.kill();
        puzzle.inputOrder.push(piece.puzzlePiece);
        // we hope that puzzle and puzzle.order are sync'd correctly with the definition
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const order = this.definition.puzzle.order;
        // hack to compare two arrays :boffy:
        if (JSON.stringify(puzzle.inputOrder) === JSON.stringify(Object.values(order))) {
            this.solvePuzzle();
        }
        else if (puzzle.inputOrder.length >= order.length) {
            puzzle.errorSeq = !puzzle.errorSeq;
            this.setPartialDirty();
            puzzle.resetTimeout = this.game.addTimeout(this.resetPuzzle.bind(this), 1000);
        }
        else {
            puzzle.resetTimeout = this.game.addTimeout(() => {
                puzzle.errorSeq = !puzzle.errorSeq;
                this.setPartialDirty();
                this.game.addTimeout(this.resetPuzzle.bind(this), 1000);
            }, 10000);
        }
    }
    solvePuzzle() {
        const puzzle = this._puzzle;
        if (!puzzle) {
            this.game.warn("Attempting to solve puzzle when no puzzle is present");
            return;
        }
        // we hope the `this.puzzle` field is sync'd with the definition
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const puzzleDef = this.definition.puzzle;
        (0, misc_1.runOrWait)(this.game, () => {
            puzzle.solved = true;
            this.setPartialDirty();
        }, puzzleDef.setSolvedImmediately ? 0 : puzzleDef.delay);
        (0, misc_1.runOrWait)(this.game, () => {
            for (const obstacle of this.interactableObstacles) {
                if (obstacle.definition.idString === puzzleDef.triggerOnSolve) {
                    if (obstacle.door) {
                        obstacle.door.locked = false;
                        obstacle.door.powered = true;
                    }
                    // Saw
                    if (obstacle.definition.damage) {
                        obstacle.activated = true;
                        obstacle.setDirty();
                        for (const object of this.game.grid.intersectsHitbox(obstacle.hitbox)) {
                            if (object.hitbox !== undefined && obstacle.hitbox.collidesWith(object.hitbox) && object.isObstacle && !object.definition.indestructible) {
                                object.damage({
                                    amount: object.health,
                                    source: obstacle
                                });
                            }
                        }
                    }
                    if (!puzzleDef.unlockOnly)
                        obstacle.interact(undefined);
                    else
                        obstacle.setDirty();
                }
            }
        }, puzzleDef.delay);
    }
    resetPuzzle() {
        if (!this._puzzle) {
            this.game.warn("Attempting to reset puzzle when no puzzle is present");
            return;
        }
        this._puzzle.inputOrder = [];
        for (const piece of this.puzzlePieces) {
            piece.activated = false;
            piece.setDirty();
        }
        this.setPartialDirty();
    }
}
exports.Building = Building;
//# sourceMappingURL=building.js.map