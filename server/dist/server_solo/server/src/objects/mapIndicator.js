"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapIndicator = void 0;
const mapIndicators_1 = require("../../../../common/src/definitions/mapIndicators");
const vector_1 = require("../../../../common/src/utils/vector");
class MapIndicator {
    id;
    dead = false;
    positionDirty = true;
    position;
    updatePosition(position) {
        if (vector_1.Vec.equals(position, this.position))
            return;
        this.position = position;
        this.positionDirty = true;
    }
    definitionDirty = true;
    definition;
    constructor(game, definition, position) {
        this.id = game.nextMapIndicatorID;
        this.definition = mapIndicators_1.MapIndicators.reify(definition);
        this.position = position;
    }
}
exports.MapIndicator = MapIndicator;
//# sourceMappingURL=mapIndicator.js.map