"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loots = void 0;
const ammos_1 = require("./items/ammos");
const armors_1 = require("./items/armors");
const backpacks_1 = require("./items/backpacks");
const guns_1 = require("./items/guns");
const healingItems_1 = require("./items/healingItems");
const melees_1 = require("./items/melees");
const objectDefinitions_1 = require("../utils/objectDefinitions");
const perks_1 = require("./items/perks");
const scopes_1 = require("./items/scopes");
const skins_1 = require("./items/skins");
const throwables_1 = require("./items/throwables");
exports.Loots = new objectDefinitions_1.ObjectDefinitions([
    ...guns_1.Guns,
    ...ammos_1.Ammos,
    ...melees_1.Melees,
    ...throwables_1.Throwables,
    ...healingItems_1.HealingItems,
    ...armors_1.Armors,
    ...backpacks_1.Backpacks,
    ...scopes_1.Scopes,
    ...skins_1.Skins,
    ...perks_1.Perks
]);
//# sourceMappingURL=loots.js.map