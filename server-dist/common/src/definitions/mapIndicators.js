"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapIndicators = void 0;
const objectDefinitions_1 = require("../utils/objectDefinitions");
exports.MapIndicators = new objectDefinitions_1.ObjectDefinitions([
    "helmet_indicator",
    "vest_indicator",
    "pack_indicator",
    "juggernaut_indicator",
    "player_indicator"
].map(idString => ({
    idString,
    name: idString,
    defType: objectDefinitions_1.DefinitionType.MapIndicator
})));
//# sourceMappingURL=mapIndicators.js.map