"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemKeysLength = exports.itemKeys = exports.DEFAULT_INVENTORY = void 0;
const ammos_1 = require("./definitions/items/ammos");
const healingItems_1 = require("./definitions/items/healingItems");
const scopes_1 = require("./definitions/items/scopes");
const throwables_1 = require("./definitions/items/throwables");
const objectDefinitions_1 = require("./utils/objectDefinitions");
exports.DEFAULT_INVENTORY = Object.create(null);
for (const item of [...healingItems_1.HealingItems, ...ammos_1.Ammos, ...scopes_1.Scopes, ...throwables_1.Throwables]) {
    let amount = 0;
    switch (true) {
        case item.defType === objectDefinitions_1.DefinitionType.Ammo && item.ephemeral:
            amount = Infinity;
            break;
        case item.defType === objectDefinitions_1.DefinitionType.Scope && item.giveByDefault:
            amount = 1;
            break;
    }
    exports.DEFAULT_INVENTORY[item.idString] = amount;
}
Object.freeze(exports.DEFAULT_INVENTORY);
exports.itemKeys = Object.keys(exports.DEFAULT_INVENTORY);
exports.itemKeysLength = exports.itemKeys.length;
//# sourceMappingURL=defaultInventory.js.map