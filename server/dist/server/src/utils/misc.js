"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOrWait = exports.CARDINAL_DIRECTIONS = void 0;
exports.modeFromMap = modeFromMap;
exports.cleanUsername = cleanUsername;
exports.getRandomIDString = getRandomIDString;
exports.getPatterningShape = getPatterningShape;
const constants_1 = require("../../../common/src/constants");
const modes_1 = require("../../../common/src/definitions/modes");
const math_1 = require("../../../common/src/utils/math");
const random_1 = require("../../../common/src/utils/random");
const vector_1 = require("../../../common/src/utils/vector");
const config_1 = require("../utils/config");
const maps_1 = require("../data/maps");
function modeFromMap(map) {
    const args = map.split(":");
    const lastArg = args[args.length - 1];
    if (lastArg in modes_1.Modes) {
        return lastArg;
    }
    const mapName = args[0];
    const mapMode = maps_1.Maps[mapName]?.mode;
    if (mapMode) {
        return mapMode;
    }
    else if (mapName in modes_1.Modes) {
        return mapName;
    }
    else {
        return constants_1.GameConstants.defaultMode;
    }
}
const usernameFilters = config_1.Config.usernameFilters?.map(filter => new RegExp(filter, "i"));
function cleanUsername(name) {
    if (!name?.trim().length
        || name.length > constants_1.GameConstants.player.nameMaxLength
        || usernameFilters?.some(regex => regex.test(name))
        || /[^\x20-\x7E]/g.test(name) // extended ASCII chars
    ) {
        return constants_1.GameConstants.player.defaultName;
    }
    else {
        return name;
    }
}
function getRandomIDString(ref) {
    if (typeof ref === "string")
        return ref;
    const items = [];
    const weights = [];
    for (const [item, weight] of Object.entries(ref)) {
        items.push(item);
        weights.push(weight);
    }
    return (0, random_1.weightedRandom)(items, weights);
}
exports.CARDINAL_DIRECTIONS = Array.from({ length: 4 }, (_, i) => i / math_1.τ);
function getPatterningShape(spawnCount, radius) {
    const makeSimpleShape = (points) => {
        const tauFrac = math_1.τ / points;
        return (radius, offset = 0) => Array.from({ length: points }, (_, i) => vector_1.Vec.fromPolar(i * tauFrac + offset, radius));
    };
    const [makeTriangle, makeSquare, makePentagon, makeHexagon] = [3, 4, 5, 6].map(makeSimpleShape);
    switch (spawnCount) {
        case 1: return [(0, vector_1.Vec)(0, 0)];
        case 2: return [
            (0, vector_1.Vec)(0, radius),
            (0, vector_1.Vec)(0, -radius)
        ];
        case 3: return makeTriangle(radius);
        case 4: return [(0, vector_1.Vec)(0, 0), ...makeTriangle(radius)];
        case 5: return [(0, vector_1.Vec)(0, 0), ...makeSquare(radius)];
        case 6: return [(0, vector_1.Vec)(0, 0), ...makePentagon(radius)];
        case 7: return [(0, vector_1.Vec)(0, 0), ...makeHexagon(radius, math_1.halfπ)];
        case 8: return [
            (0, vector_1.Vec)(0, 0),
            ...makeTriangle(radius / 2),
            ...makeSquare(radius, math_1.halfπ)
        ];
        case 9: return [
            (0, vector_1.Vec)(0, 0),
            ...makeTriangle(radius / 2),
            ...makePentagon(radius)
        ];
    }
    return [
        ...getPatterningShape(spawnCount - 6, radius * 3 / 4),
        ...makeHexagon(radius, math_1.halfπ)
    ];
}
const runOrWait = (game, cb, delay) => {
    if (delay === 0)
        cb();
    else
        game.addTimeout(cb, delay);
};
exports.runOrWait = runOrWait;
//# sourceMappingURL=misc.js.map