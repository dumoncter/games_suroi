"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMessages = exports.RotationMode = exports.MapObjectSpawnMode = exports.FlyoverPref = exports.ObjectCategory = exports.TeamMode = exports.Layer = exports.Z_INDEX_COUNT = exports.ZIndexes = exports.GameConstants = void 0;
const objectDefinitions_1 = require("./utils/objectDefinitions");
const inventorySlotTypings = Object.freeze([objectDefinitions_1.DefinitionType.Gun, objectDefinitions_1.DefinitionType.Gun, objectDefinitions_1.DefinitionType.Melee, objectDefinitions_1.DefinitionType.Throwable]);
exports.GameConstants = {
    // !!!!! NOTE: Increase this every time a byte stream change is made between latest release and master
    // or a new item is added to a definition list
    protocolVersion: 66,
    tps: 40,
    gridSize: 32,
    maxPosition: 1924,
    objectMinScale: 0.15,
    objectMaxScale: 3,
    defaultMode: "normal",
    player: {
        radius: 2.25,
        baseSpeed: 0.03,
        defaultHealth: 100,
        maxAdrenaline: 100,
        maxShield: 100,
        inventorySlotTypings,
        maxWeapons: inventorySlotTypings.length,
        nameMaxLength: 16,
        defaultName: "Player",
        defaultSkin: "hazel_jumpsuit",
        killLeaderMinKills: 3,
        maxMouseDist: 256,
        reviveTime: 8,
        maxReviveDist: 5,
        bleedOutDPMs: 0.002, // === 2 dps
        maxPerkCount: 1,
        maxPerks: 4,
        buildingVisionSize: 20,
        rateLimitPunishmentTrigger: 10,
        emotePunishmentTime: 5000, // ms
        rateLimitInterval: 1000,
        defaultModifiers: () => ({
            maxHealth: 1,
            maxAdrenaline: 1,
            maxShield: 1,
            baseSpeed: 1,
            size: 1,
            adrenDrain: 1,
            minAdrenaline: 0,
            hpRegen: 0,
            shieldRegen: 0
        })
    },
    gas: {
        damageScaleFactor: 0.005, // Extra damage, linear per distance unit into the gas
        unscaledDamageDist: 12 // Don't scale damage for a certain distance into the gas
    },
    lootSpawnMaxJitter: 0.7,
    lootRadius: {
        [objectDefinitions_1.DefinitionType.Gun]: 3.4,
        [objectDefinitions_1.DefinitionType.Ammo]: 2,
        [objectDefinitions_1.DefinitionType.Melee]: 3,
        [objectDefinitions_1.DefinitionType.Throwable]: 3,
        [objectDefinitions_1.DefinitionType.HealingItem]: 2.5,
        [objectDefinitions_1.DefinitionType.Armor]: 3,
        [objectDefinitions_1.DefinitionType.Backpack]: 3,
        [objectDefinitions_1.DefinitionType.Scope]: 3,
        [objectDefinitions_1.DefinitionType.Skin]: 3,
        [objectDefinitions_1.DefinitionType.Perk]: 3
    },
    defaultSpeedModifiers: {
        [objectDefinitions_1.DefinitionType.Gun]: 0.88,
        [objectDefinitions_1.DefinitionType.Melee]: 1,
        [objectDefinitions_1.DefinitionType.Throwable]: 0.92
    },
    airdrop: {
        fallTime: 8000,
        flyTime: 30000,
        damage: 300
    },
    projectiles: {
        maxHeight: 5,
        gravity: 10,
        distanceToMouseMultiplier: 1.5,
        drag: {
            air: 0.7,
            ground: 3,
            water: 5
        }
    },
    explosionMaxDistSquared: 128 ** 2,
    trailPadding: 384,
    explosionRayDistance: 2
};
var ZIndexes;
(function (ZIndexes) {
    ZIndexes[ZIndexes["Ground"] = 0] = "Ground";
    ZIndexes[ZIndexes["BuildingsFloor"] = 1] = "BuildingsFloor";
    ZIndexes[ZIndexes["Decals"] = 2] = "Decals";
    ZIndexes[ZIndexes["DeadObstacles"] = 3] = "DeadObstacles";
    ZIndexes[ZIndexes["DeathMarkers"] = 4] = "DeathMarkers";
    ZIndexes[ZIndexes["Explosions"] = 5] = "Explosions";
    /**
     * This is the default layer for obstacles
     */
    ZIndexes[ZIndexes["ObstaclesLayer1"] = 6] = "ObstaclesLayer1";
    ZIndexes[ZIndexes["Loot"] = 7] = "Loot";
    ZIndexes[ZIndexes["GroundedThrowables"] = 8] = "GroundedThrowables";
    ZIndexes[ZIndexes["ObstaclesLayer2"] = 9] = "ObstaclesLayer2";
    ZIndexes[ZIndexes["TeammateName"] = 10] = "TeammateName";
    ZIndexes[ZIndexes["Bullets"] = 11] = "Bullets";
    ZIndexes[ZIndexes["DownedPlayers"] = 12] = "DownedPlayers";
    ZIndexes[ZIndexes["Players"] = 13] = "Players";
    /**
     * bushes, tables etc
     */
    ZIndexes[ZIndexes["ObstaclesLayer3"] = 14] = "ObstaclesLayer3";
    ZIndexes[ZIndexes["AirborneThrowables"] = 15] = "AirborneThrowables";
    /**
     * trees
     */
    ZIndexes[ZIndexes["ObstaclesLayer4"] = 16] = "ObstaclesLayer4";
    ZIndexes[ZIndexes["BuildingsCeiling"] = 17] = "BuildingsCeiling";
    /**
     * obstacles that should show on top of ceilings
     */
    ZIndexes[ZIndexes["ObstaclesLayer5"] = 18] = "ObstaclesLayer5";
    ZIndexes[ZIndexes["Emotes"] = 19] = "Emotes";
    ZIndexes[ZIndexes["Gas"] = 20] = "Gas";
})(ZIndexes || (exports.ZIndexes = ZIndexes = {}));
exports.Z_INDEX_COUNT = Object.keys(ZIndexes).length / 2; // account for double indexing
var Layer;
(function (Layer) {
    Layer[Layer["Basement"] = -2] = "Basement";
    Layer[Layer["ToBasement"] = -1] = "ToBasement";
    Layer[Layer["Ground"] = 0] = "Ground";
    Layer[Layer["ToUpstairs"] = 1] = "ToUpstairs";
    Layer[Layer["Upstairs"] = 2] = "Upstairs";
})(Layer || (exports.Layer = Layer = {}));
var TeamMode;
(function (TeamMode) {
    TeamMode[TeamMode["Solo"] = 1] = "Solo";
    TeamMode[TeamMode["Duo"] = 2] = "Duo";
    TeamMode[TeamMode["Squad"] = 4] = "Squad";
})(TeamMode || (exports.TeamMode = TeamMode = {}));
var ObjectCategory;
(function (ObjectCategory) {
    ObjectCategory[ObjectCategory["Player"] = 0] = "Player";
    ObjectCategory[ObjectCategory["Obstacle"] = 1] = "Obstacle";
    ObjectCategory[ObjectCategory["DeathMarker"] = 2] = "DeathMarker";
    ObjectCategory[ObjectCategory["Loot"] = 3] = "Loot";
    ObjectCategory[ObjectCategory["Building"] = 4] = "Building";
    ObjectCategory[ObjectCategory["Decal"] = 5] = "Decal";
    ObjectCategory[ObjectCategory["Parachute"] = 6] = "Parachute";
    ObjectCategory[ObjectCategory["Projectile"] = 7] = "Projectile";
    ObjectCategory[ObjectCategory["SyncedParticle"] = 8] = "SyncedParticle";
})(ObjectCategory || (exports.ObjectCategory = ObjectCategory = {}));
/**
 * An enum indicating the degree to which an obstacle should allow
 * throwables to sail over it.
 *
 * Note that any throwable whose velocity is below 0.03 u/ms won't be able to sail
 * over any obstacle, even those marked as `Always`. Additionally, if the obstacle
 * in question has a role that is `ObstacleSpecialRoles.Door`, its preference will only
 * be honored when the door is opened; if it is closed, it will act as {@link Never}.
 */
var FlyoverPref;
(function (FlyoverPref) {
    /**
     * Always allow throwables to fly over the object.
     */
    FlyoverPref[FlyoverPref["Always"] = 0] = "Always";
    /**
     * Only allow throwables to fly over the object if the throwable's velocity exceeds 0.04 u/ms.
     * For reference, the maximum throwing speed is around 0.09 u/ms for a 1x scope.
     */
    FlyoverPref[FlyoverPref["Sometimes"] = 1] = "Sometimes";
    /**
     * Never allow throwables to fly over the object.
     */
    FlyoverPref[FlyoverPref["Never"] = 2] = "Never";
})(FlyoverPref || (exports.FlyoverPref = FlyoverPref = {}));
var MapObjectSpawnMode;
(function (MapObjectSpawnMode) {
    MapObjectSpawnMode[MapObjectSpawnMode["Grass"] = 0] = "Grass";
    /**
     * Grass, beach and river banks.
     */
    MapObjectSpawnMode[MapObjectSpawnMode["GrassAndSand"] = 1] = "GrassAndSand";
    MapObjectSpawnMode[MapObjectSpawnMode["River"] = 2] = "River";
    MapObjectSpawnMode[MapObjectSpawnMode["Beach"] = 3] = "Beach";
    MapObjectSpawnMode[MapObjectSpawnMode["Trail"] = 4] = "Trail";
    MapObjectSpawnMode[MapObjectSpawnMode["Ring"] = 5] = "Ring";
})(MapObjectSpawnMode || (exports.MapObjectSpawnMode = MapObjectSpawnMode = {}));
var RotationMode;
(function (RotationMode) {
    /**
     * Allows rotation in any direction (within the limits of the bit stream's encoding capabilities)
     */
    RotationMode[RotationMode["Full"] = 0] = "Full";
    /**
     * Allows rotation in the four cardinal directions: up, right, down and left
     */
    RotationMode[RotationMode["Limited"] = 1] = "Limited";
    /**
     * Allows rotation in two directions: a "normal" direction and a "flipped" direction; for example,
     * up and down, or left and right
     */
    RotationMode[RotationMode["Binary"] = 2] = "Binary";
    /**
     * Disabled rotation
     */
    RotationMode[RotationMode["None"] = 3] = "None";
})(RotationMode || (exports.RotationMode = RotationMode = {}));
var InventoryMessages;
(function (InventoryMessages) {
    InventoryMessages[InventoryMessages["NotEnoughSpace"] = 0] = "NotEnoughSpace";
    InventoryMessages[InventoryMessages["ItemAlreadyEquipped"] = 1] = "ItemAlreadyEquipped";
    InventoryMessages[InventoryMessages["BetterItemEquipped"] = 2] = "BetterItemEquipped";
    InventoryMessages[InventoryMessages["CannotUseFlare"] = 3] = "CannotUseFlare";
})(InventoryMessages || (exports.InventoryMessages = InventoryMessages = {}));
//# sourceMappingURL=constants.js.map