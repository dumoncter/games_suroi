"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decal = void 0;
const constants_1 = require("../../../common/src/constants");
const decals_1 = require("../../../common/src/definitions/decals");
const random_1 = require("../../../common/src/utils/random");
const gameObject_1 = require("./gameObject");
class Decal extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.Decal) {
    fullAllocBytes = 1;
    partialAllocBytes = 12;
    definition;
    constructor(game, definition, position, rotation, layer) {
        super(game, position);
        this.definition = decals_1.Decals.reify(definition);
        this.rotation = rotation ?? (0, random_1.randomRotation)();
        this.layer = layer ?? 0;
    }
    get data() {
        return this;
    }
    damage() { }
}
exports.Decal = Decal;
//# sourceMappingURL=decal.js.map