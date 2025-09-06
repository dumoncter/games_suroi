"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryItemDefinitions = void 0;
const constants_1 = require("../../constants");
const objectDefinitions_1 = require("../../utils/objectDefinitions");
/**
 * Subclass of {@link ObjectDefinitions} specialized for {@link InventoryItemDefinition}s. Notable
 * changes include:
 * - Resolving speed multipliers (`base` * `defaultForType` * `specific`)
 */
class InventoryItemDefinitions extends objectDefinitions_1.ObjectDefinitions {
    constructor(definitions) {
        super(definitions.map(i => {
            i.speedMultiplier *= constants_1.GameConstants.defaultSpeedModifiers[i.defType];
            return i;
        }));
    }
}
exports.InventoryItemDefinitions = InventoryItemDefinitions;
//# sourceMappingURL=items.js.map