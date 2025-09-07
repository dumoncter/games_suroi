"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decals = void 0;
const constants_1 = require("../constants");
const objectDefinitions_1 = require("../utils/objectDefinitions");
const healingItems_1 = require("./items/healingItems");
exports.Decals = new objectDefinitions_1.ObjectDefinitions([
    {
        idString: "explosion_decal",
        name: "Explosion Decal",
        defType: objectDefinitions_1.DefinitionType.Decal,
        rotationMode: constants_1.RotationMode.Full
    },
    {
        idString: "frag_explosion_decal",
        name: "Frag Explosion Decal",
        defType: objectDefinitions_1.DefinitionType.Decal,
        rotationMode: constants_1.RotationMode.Full
    },
    {
        idString: "smoke_explosion_decal",
        name: "Smoke Explosion Decal",
        defType: objectDefinitions_1.DefinitionType.Decal,
        rotationMode: constants_1.RotationMode.Full
    },
    {
        idString: "seed_decal",
        name: "Seed Decal",
        defType: objectDefinitions_1.DefinitionType.Decal,
        rotationMode: constants_1.RotationMode.Full
    },
    {
        idString: "seed_explosion_decal",
        name: "Seed Explosion Decal",
        defType: objectDefinitions_1.DefinitionType.Decal,
        rotationMode: constants_1.RotationMode.Full
    },
    {
        idString: "used_flare_decal",
        name: "Used Flare Decal",
        defType: objectDefinitions_1.DefinitionType.Decal,
        rotationMode: constants_1.RotationMode.Full
    },
    ...healingItems_1.HealingItems.definitions.map(healingItem => {
        return {
            idString: `${healingItem.idString}_residue`,
            name: `${healingItem.name} Residue`,
            defType: objectDefinitions_1.DefinitionType.Decal,
            rotationMode: constants_1.RotationMode.Full
        };
    })
]);
//# sourceMappingURL=decals.js.map