"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SCOPE = exports.Scopes = void 0;
const objectDefinitions_1 = require("../../utils/objectDefinitions");
exports.Scopes = new objectDefinitions_1.ObjectDefinitions([
    ["1x", 70, true],
    ["2x", 100, true],
    ["4x", 130],
    ["8x", 160],
    ["16x", 220]
    // Value 190 reserved for possible 12x scope
].map(([magnification, zoomLevel, defaultScope]) => ({
    idString: `${magnification}_scope`,
    name: `${magnification} Scope`,
    defType: objectDefinitions_1.DefinitionType.Scope,
    noDrop: defaultScope,
    giveByDefault: defaultScope,
    zoomLevel
})));
exports.DEFAULT_SCOPE = exports.Scopes.definitions[0];
//# sourceMappingURL=scopes.js.map