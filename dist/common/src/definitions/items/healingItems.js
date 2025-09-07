"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealingItems = exports.HealType = void 0;
const objectDefinitions_1 = require("../../utils/objectDefinitions");
var HealType;
(function (HealType) {
    HealType[HealType["Health"] = 0] = "Health";
    HealType[HealType["Adrenaline"] = 1] = "Adrenaline";
    HealType[HealType["Special"] = 2] = "Special";
})(HealType || (exports.HealType = HealType = {}));
exports.HealingItems = new objectDefinitions_1.ObjectDefinitions([
    {
        idString: "gauze",
        name: "Gauze",
        defType: objectDefinitions_1.DefinitionType.HealingItem,
        healType: HealType.Health,
        restoreAmount: 20,
        useTime: 3
    },
    {
        idString: "medikit",
        name: "Medikit",
        defType: objectDefinitions_1.DefinitionType.HealingItem,
        healType: HealType.Health,
        restoreAmount: 100,
        useTime: 6
    },
    {
        idString: "cola",
        name: "Cola",
        defType: objectDefinitions_1.DefinitionType.HealingItem,
        healType: HealType.Adrenaline,
        restoreAmount: 25,
        useTime: 3
    },
    {
        idString: "tablets",
        name: "Tablets",
        defType: objectDefinitions_1.DefinitionType.HealingItem,
        healType: HealType.Adrenaline,
        restoreAmount: 50,
        useTime: 4
    },
    {
        idString: "vaccine_syringe",
        name: "Vaccine Syringe",
        defType: objectDefinitions_1.DefinitionType.HealingItem,
        healType: HealType.Special,
        restoreAmount: 0,
        useTime: 2,
        effect: {
            removePerk: "infected" /* PerkIds.Infected */,
            restoreAmounts: [
                {
                    healType: HealType.Adrenaline,
                    restoreAmount: 50
                }
            ]
        },
        hideUnlessPresent: true
    }
]);
//# sourceMappingURL=healingItems.js.map