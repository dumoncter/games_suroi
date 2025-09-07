"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guns_1 = require("../../../common/src/definitions/items/guns");
const melees_1 = require("../../../common/src/definitions/items/melees");
const throwables_1 = require("../../../common/src/definitions/items/throwables");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../common/src/utils/random");
const math_1 = require("../../../common/src/utils/math");
const player_1 = require("../objects/player");
const pluginManager_1 = require("../pluginManager");
const selectableGuns = guns_1.Guns.definitions.filter(g => !g.killstreak && !g.wearerAttributes);
const selectableMelees = melees_1.Melees.definitions.filter(g => !g.killstreak && !g.wearerAttributes);
const selectableThrowables = throwables_1.Throwables.definitions.filter(g => !g.killstreak && !g.wearerAttributes);
/**
 * Plugin that swaps the player weapon when the player gets a kill
 */
class WeaponSwapPlugin extends pluginManager_1.GamePlugin {
    initListeners() {
        this.on("player_will_die", ({ source }) => {
            if (!(source instanceof player_1.Player))
                return;
            const inventory = source.inventory;
            const index = source.activeItemIndex;
            let item;
            const defType = source.activeItemDefinition.defType;
            switch (defType) {
                case objectDefinitions_1.DefinitionType.Gun: {
                    const gun = (0, random_1.pickRandomInArray)(selectableGuns);
                    item = gun;
                    const { ammoType } = gun;
                    if (gun.ammoSpawnAmount) {
                        const amount = math_1.Numeric.min(inventory.backpack.maxCapacity[ammoType], inventory.items.getItem(ammoType) + gun.ammoSpawnAmount);
                        inventory.items.setItem(ammoType, amount);
                        source.dirty.items = true;
                    }
                    break;
                }
                case objectDefinitions_1.DefinitionType.Melee: {
                    item = (0, random_1.pickRandomInArray)(selectableMelees);
                    break;
                }
                case objectDefinitions_1.DefinitionType.Throwable: {
                    item = (0, random_1.pickRandomInArray)(selectableThrowables);
                    inventory.items.setItem(item.idString, source.inventory.backpack.maxCapacity[item.idString]);
                }
            }
            inventory.replaceWeapon(index, item);
            if (source.activeItem.isGun) {
                source.activeItem.ammo = source.activeItem.definition.capacity;
            }
        });
    }
}
exports.default = WeaponSwapPlugin;
//# sourceMappingURL=weaponSwapPlugin.js.map