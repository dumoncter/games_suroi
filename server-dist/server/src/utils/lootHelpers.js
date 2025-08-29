"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootItem = void 0;
exports.getLootFromTable = getLootFromTable;
exports.resolveTable = resolveTable;
exports.getSpawnableLoots = getSpawnableLoots;
exports.getAllLoots = getAllLoots;
const ammos_1 = require("../../../common/src/definitions/items/ammos");
const armors_1 = require("../../../common/src/definitions/items/armors");
const backpacks_1 = require("../../../common/src/definitions/items/backpacks");
const guns_1 = require("../../../common/src/definitions/items/guns");
const healingItems_1 = require("../../../common/src/definitions/items/healingItems");
const melees_1 = require("../../../common/src/definitions/items/melees");
const perks_1 = require("../../../common/src/definitions/items/perks");
const scopes_1 = require("../../../common/src/definitions/items/scopes");
const skins_1 = require("../../../common/src/definitions/items/skins");
const throwables_1 = require("../../../common/src/definitions/items/throwables");
const loots_1 = require("../../../common/src/definitions/loots");
const misc_1 = require("../../../common/src/utils/misc");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../common/src/utils/random");
const lootTables_1 = require("../data/lootTables");
const buildings_1 = require("../../../common/src/definitions/buildings");
const obstacles_1 = require("../../../common/src/definitions/obstacles");
class LootItem {
    idString;
    count;
    constructor(idString, count) {
        this.idString = idString;
        this.count = count;
    }
}
exports.LootItem = LootItem;
function getLootFromTable(modeName, tableID) {
    const lootTable = resolveTable(modeName, tableID);
    if (lootTable === undefined) {
        throw new ReferenceError(`Unknown loot table: ${tableID}`);
    }
    const isSimple = (0, misc_1.isArray)(lootTable);
    const { min, max, noDuplicates, loot } = isSimple
        ? {
            min: 1,
            max: 1,
            noDuplicates: false,
            loot: lootTable
        }
        : lootTable.noDuplicates
            ? { ...lootTable, loot: Array.from(lootTable.loot) } // cloning the array is necessary because noDuplicates mutates it
            : lootTable;
    return (isSimple && (0, misc_1.isArray)(loot[0])
        ? loot.map(innerTable => getLoot(modeName, innerTable))
        : min === 1 && max === 1
            ? getLoot(modeName, loot, noDuplicates)
            : Array.from({ length: (0, random_1.random)(min, max) }, () => getLoot(modeName, loot, noDuplicates))).flat();
}
function resolveTable(modeName, tableID) {
    return lootTables_1.LootTables[modeName]?.[tableID] ?? lootTables_1.LootTables.normal[tableID];
}
function getLoot(modeName, items, noDuplicates) {
    const selection = items.length === 1
        ? items[0]
        : (0, random_1.weightedRandom)(items, items.map(({ weight }) => weight));
    if ("table" in selection) {
        return getLootFromTable(modeName, selection.table);
    }
    const item = selection.item;
    if (item === objectDefinitions_1.NullString)
        return [];
    const loot = selection.spawnSeparately
        ? Array.from({ length: selection.count }, () => new LootItem(item, 1))
        : [new LootItem(item, selection.count ?? 1)];
    const definition = loots_1.Loots.fromStringSafe(item);
    if (definition === undefined) {
        throw new ReferenceError(`Unknown loot item: ${item}`);
    }
    if (definition.defType === objectDefinitions_1.DefinitionType.Gun) {
        // eslint-disable-next-line prefer-const
        let { ammoType, ammoSpawnAmount } = definition;
        if (selection.spawnSeparately) {
            ammoSpawnAmount *= selection.count;
        }
        if (ammoSpawnAmount > 1) {
            const halfAmount = ammoSpawnAmount / 2;
            loot.push(new LootItem(ammoType, Math.floor(halfAmount)), new LootItem(ammoType, Math.ceil(halfAmount)));
        }
        else {
            loot.push(new LootItem(ammoType, ammoSpawnAmount));
        }
    }
    if (definition.defType === objectDefinitions_1.DefinitionType.Gun && definition.spawnScope) {
        loot.push(new LootItem(definition.spawnScope, 1));
    }
    if (noDuplicates) {
        const index = items.findIndex(entry => "item" in entry && entry.item === selection.item);
        if (index !== -1)
            items.splice(index, 1);
    }
    return loot;
}
// either return a reference as-is, or take all the non-null string references
const referenceOrRandomOptions = (obj) => {
    return typeof obj === "string"
        ? [obj]
        // well, Object.keys already filters out symbols so…
        : Object.keys(obj) /* .filter(k => k !== NullString) */;
};
const defTypeToCollection = {
    [objectDefinitions_1.DefinitionType.Gun]: guns_1.Guns,
    [objectDefinitions_1.DefinitionType.Ammo]: ammos_1.Ammos,
    [objectDefinitions_1.DefinitionType.Melee]: melees_1.Melees,
    [objectDefinitions_1.DefinitionType.Throwable]: throwables_1.Throwables,
    [objectDefinitions_1.DefinitionType.HealingItem]: healingItems_1.HealingItems,
    [objectDefinitions_1.DefinitionType.Armor]: armors_1.Armors,
    [objectDefinitions_1.DefinitionType.Backpack]: backpacks_1.Backpacks,
    [objectDefinitions_1.DefinitionType.Scope]: scopes_1.Scopes,
    [objectDefinitions_1.DefinitionType.Skin]: skins_1.Skins,
    [objectDefinitions_1.DefinitionType.Perk]: perks_1.Perks
};
function getSpawnableLoots(modeName, mapDef, cache) {
    /*
        we have a collection of loot tables, but not all of them are necessarily reachable
        for example, if loot table A belongs to obstacle A, but said obstacle is never spawned,
        then we mustn't take loot table A into account
    */
    // first, get all the reachable buildings
    // to do this, we get all the buildings in the map def, then for each one, include itself and any subbuildings
    // flatten that array, and that's the reachable buildings
    // and for good measure, we exclude duplicates by using a set
    const reachableBuildings = [
        ...new Set(Object.keys(mapDef.buildings ?? {}).map(building => {
            const b = buildings_1.Buildings.fromString(building);
            // for each subbuilding, we either take it as-is, or take all possible spawn options
            return (b.subBuildings ?? []).map(({ idString }) => referenceOrRandomOptions(idString).map(s => buildings_1.Buildings.fromString(s))).concat([b]);
        }).flat(2))
    ];
    // now obstacles
    // for this, we take the list of obstacles from the map def, and append to that alllllll the obstacles from the
    // reachable buildings, which again involves flattening some arrays
    const reachableObstacles = [
        ...new Set(Object.keys(mapDef.obstacles ?? {}).map(o => obstacles_1.Obstacles.fromString(o)).concat(reachableBuildings.map(({ obstacles = [] }) => obstacles.map(({ idString }) => referenceOrRandomOptions(idString).map(o => obstacles_1.Obstacles.fromString(o)))).flat(2)))
    ];
    // and now, we generate the list of reachable tables, by taking those from map def, and adding those from
    // both the obstacles and the buildings
    const reachableLootTables = [
        ...new Set(Object.keys(mapDef.loots ?? {}).map(t => resolveTable(modeName, t)).concat(reachableObstacles.filter(({ hasLoot }) => hasLoot).map(({ lootTable, idString }) => resolveTable(modeName, lootTable ?? idString))).concat(reachableBuildings.map(({ lootSpawners }) => lootSpawners ? lootSpawners.map(({ table }) => resolveTable(modeName, table)) : []).flat()))
    ];
    const getAllItemsFromTable = (table) => (Array.isArray(table)
        ? table
        : table.loot)
        .flat()
        .map(entry => "item" in entry ? entry.item : getAllItemsFromTable(resolveTable(modeName, entry.table)))
        .filter(item => item !== objectDefinitions_1.NullString && !loots_1.Loots.fromStringSafe(item)?.noSwap)
        .flat();
    // and now we go get the spawnable loots
    const spawnableLoots = new Set(reachableLootTables.map(getAllItemsFromTable).flat());
    spawnableLoots.forType = (type) => {
        return (
        // without this seemingly useless assertion, assignability errors occur
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        cache[type] ??= defTypeToCollection[type].definitions.filter(({ idString }) => spawnableLoots.has(idString)));
    };
    return spawnableLoots;
}
function getAllLoots(cache, dev) {
    // returns a set of all loot items in the game
    // property "dev" allows including dev items if true
    const filter = (def) => dev || !def.devItem;
    const allLoots = new Set([
        ...loots_1.Loots.definitions.filter(filter)
    ].map(({ idString }) => idString));
    allLoots.forType = (type) => {
        return (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        cache[type] ??= defTypeToCollection[type].definitions.filter(({ idString }) => allLoots.has(idString)));
    };
    return allLoots;
}
//# sourceMappingURL=lootHelpers.js.map