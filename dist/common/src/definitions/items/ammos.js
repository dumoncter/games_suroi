"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ammos = void 0;
const objectDefinitions_1 = require("../../utils/objectDefinitions");
exports.Ammos = new objectDefinitions_1.ObjectDefinitions([
    {
        idString: "12g",
        name: "12 gauge",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 20,
        minDropAmount: 3,
        characteristicColor: {
            hue: 0,
            saturation: 100,
            lightness: 89
        },
        defaultCasingFrame: "casing_12ga_275in"
    },
    {
        idString: "556mm",
        name: "5.56mm",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 60,
        minDropAmount: 5,
        characteristicColor: {
            hue: 120,
            saturation: 100,
            lightness: 75
        },
        defaultCasingFrame: "casing_556x45mm"
    },
    {
        idString: "762mm",
        name: "7.62mm",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 60,
        minDropAmount: 5,
        characteristicColor: {
            hue: 210,
            saturation: 100,
            lightness: 65
        },
        defaultCasingFrame: "casing_762x51mm"
    },
    {
        idString: "9mm",
        name: "9mm",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 90,
        minDropAmount: 5,
        characteristicColor: {
            hue: 48,
            saturation: 100,
            lightness: 75
        },
        defaultCasingFrame: "casing_9x19mm"
    },
    {
        idString: "50cal",
        name: ".50 Cal",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 9,
        minDropAmount: 3,
        characteristicColor: {
            hue: 0,
            saturation: 0,
            lightness: 0
        },
        defaultCasingFrame: "casing_50bmg",
        hideUnlessPresent: true
    },
    {
        idString: "338lap",
        name: ".338 Lapua Magnum",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 9,
        minDropAmount: 3,
        characteristicColor: {
            hue: 75,
            saturation: 100,
            lightness: 75
        },
        defaultCasingFrame: "casing_338lap",
        hideUnlessPresent: true
    },
    {
        idString: "545mm",
        name: "5.45mm",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 60,
        minDropAmount: 5,
        characteristicColor: {
            hue: 23,
            saturation: 100,
            lightness: 65
        },
        defaultCasingFrame: "casing_545mm",
        hideUnlessPresent: true
    },
    {
        idString: "firework_rocket",
        name: "Firework Rocket",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 5,
        minDropAmount: 1,
        characteristicColor: {
            hue: 0,
            saturation: 55,
            lightness: 85
        },
        defaultCasingFrame: "casing_firework_rocket",
        hideUnlessPresent: true
    },
    // Ephemeral ammo types below
    {
        idString: "seed",
        name: "Plumpkin Seed",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 0,
        minDropAmount: 0,
        characteristicColor: {
            hue: 37,
            saturation: 85,
            lightness: 67
        },
        ephemeral: true
    },
    {
        idString: "needle",
        name: "Needle",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 0,
        minDropAmount: 0,
        characteristicColor: {
            hue: 305,
            saturation: 70,
            lightness: 50
        },
        ephemeral: true
    },
    {
        idString: "plumpkin_ammo",
        name: "Plumpkin Ammo",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 0,
        minDropAmount: 0,
        characteristicColor: {
            hue: 305,
            saturation: 70,
            lightness: 50
        },
        ephemeral: true
    },
    {
        idString: "power_cell",
        name: "P.O.W.E.R. cell",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 10,
        minDropAmount: 1,
        characteristicColor: {
            hue: 190,
            saturation: 100,
            lightness: 85
        },
        defaultCasingFrame: "casing_power_cell",
        ephemeral: true
    },
    {
        idString: "bb",
        name: "6mm BB",
        defType: objectDefinitions_1.DefinitionType.Ammo,
        maxStackSize: 240,
        minDropAmount: 1,
        characteristicColor: {
            hue: 0,
            saturation: 0,
            lightness: 75
        },
        ephemeral: true
    }
]);
//# sourceMappingURL=ammos.js.map