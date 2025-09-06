"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armors = exports.ArmorType = void 0;
const objectDefinitions_1 = require("../../utils/objectDefinitions");
var ArmorType;
(function (ArmorType) {
    ArmorType[ArmorType["Helmet"] = 0] = "Helmet";
    ArmorType[ArmorType["Vest"] = 1] = "Vest";
})(ArmorType || (exports.ArmorType = ArmorType = {}));
exports.Armors = new objectDefinitions_1.ObjectDefinitions([
    //
    // Helmets
    //
    {
        idString: "basic_helmet",
        name: "Basic Helmet",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Helmet,
        level: 1,
        damageReduction: 0.1
    },
    {
        idString: "regular_helmet",
        name: "Regular Helmet",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Helmet,
        level: 2,
        damageReduction: 0.15
    },
    {
        idString: "tactical_helmet",
        name: "Tactical Helmet",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Helmet,
        level: 3,
        damageReduction: 0.2
    },
    {
        idString: "power_helmet",
        name: "NTK-11 Halycon",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Helmet,
        level: 4,
        damageReduction: 0.25,
        positionOverride: 0,
        positionOverrideDowned: 0,
        perk: "thermal_goggles" /* PerkIds.ThermalGoggles */,
        mapIndicator: "helmet_indicator"
    },
    //
    // Vests
    //
    {
        idString: "basic_vest",
        name: "Basic Vest",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Vest,
        level: 1,
        damageReduction: 0.2,
        color: 0xc8c8c6
    },
    {
        idString: "regular_vest",
        name: "Regular Vest",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Vest,
        level: 2,
        damageReduction: 0.35,
        color: 0x404d2e
    },
    {
        idString: "tactical_vest",
        name: "Tactical Vest",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Vest,
        level: 3,
        damageReduction: 0.45,
        color: 0x0d0d0d
    },
    {
        idString: "power_vest",
        name: "ERV-3 Core",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Vest,
        level: 4,
        damageReduction: 0.35,
        color: 0xffffff,
        worldImage: "power_vest_world",
        perk: "experimental_forcefield" /* PerkIds.ExperimentalForcefield */,
        mapIndicator: "vest_indicator"
    },
    {
        idString: "developr_vest",
        name: "Developr Vest",
        defType: objectDefinitions_1.DefinitionType.Armor,
        armorType: ArmorType.Vest,
        level: 99,
        devItem: true,
        damageReduction: 0.72,
        color: 0x2f0000,
        noDrop: true
    }
]);
//# sourceMappingURL=armors.js.map