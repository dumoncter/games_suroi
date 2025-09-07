"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obstacles = exports.TintedParticles = exports.MaterialSounds = exports.Materials = void 0;
const constants_1 = require("../constants");
const hitbox_1 = require("../utils/hitbox");
const objectDefinitions_1 = require("../utils/objectDefinitions");
const vector_1 = require("../utils/vector");
const buildings_1 = require("./buildings");
exports.Materials = [
    "tree",
    "stone",
    "bush",
    "crate",
    "metal_light",
    "metal_heavy",
    "wood",
    "pumpkin",
    "glass",
    "porcelain",
    "cardboard",
    "appliance",
    "sand",
    "fence",
    "iron",
    "piano",
    "trash_bag",
    "ice"
];
exports.MaterialSounds = {
    cardboard: { hit: "stone", destroyed: "crate" },
    iron: { hit: "metal_light", destroyed: "appliance" },
    ice: { hit: "glass", destroyed: "glass" },
    crate: { hit: "wood" },
    pumpkin: { hit: "stone" },
    trash_bag: { hit: "sand" }
};
// TODO Detect mode somehow
const aidrTint = 0x4059bf; // GameConstants.modeName as string === "winter" ? 0xb94646 : 0x4059bf;
exports.TintedParticles = {
    _glow_: { base: "_glow_", tint: 0xffffff },
    cabin_wall_particle: { base: "wood_particle", tint: 0x5d4622 },
    cabin_particle: { base: "wood_particle", tint: 0x49371d },
    metal_particle: { base: "metal_particle_1", tint: 0x5f5f5f },
    wine_barrel_particle: { base: "metal_particle_1", tint: 0x5d482f },
    cargo_ship_particle: { base: "metal_particle_1", tint: 0x273140 },
    metal_column_particle: { base: "metal_particle_1", tint: 0x8f8f8f },
    super_barrel_particle: { base: "metal_particle_1", tint: 0xce2b29 },
    propane_tank_particle: { base: "metal_particle_1", tint: 0xb08b3f },
    dumpster_particle: { base: "metal_particle_1", tint: 0x3c7033 },
    solid_crate_particle: { base: "wood_particle", tint: 0x595959 },
    washing_machine_particle: { base: "metal_particle_1", tint: 0xb3b3b3 },
    small_lamp_thingy_particle: { base: "window_particle", tint: 0xb3b3b3 },
    fridge_particle: { base: "metal_particle_1", tint: 0x666666 },
    tv_particle: { base: "metal_particle_1", tint: 0x333333 },
    smokestack_particle: { base: "metal_particle_1", tint: 0xb5b5b5 },
    distillation_column_particle: { base: "metal_particle_1", tint: 0x1b5e98 },
    ship_oil_tank_particle: { base: "metal_particle_1", tint: 0x00538f },
    forklift_particle: { base: "metal_particle_1", tint: 0xac5339 },
    bollard_particle: { base: "metal_particle_1", tint: 0xa66e20 },
    m1117_particle: { base: "metal_particle_1", tint: 0x2f3725 },
    file_cart_particle: { base: "metal_particle_1", tint: 0x404040 },
    filing_cabinet_particle: { base: "metal_particle_2", tint: 0x7f714d },
    briefcase_particle: { base: "metal_particle_2", tint: 0xcfcfcf },
    aegis_crate_particle: { base: "wood_particle", tint: 0x2687d9 },
    log_particle: { base: "stone_particle_1", tint: 0x5b3e24 },
    airdrop_crate_particle: { base: "wood_particle", tint: aidrTint },
    chest_particle: { base: "wood_particle", tint: 0xa87e5a },
    cooler_particle: { base: "wood_particle", tint: 0x357d99 },
    crate_particle: { base: "wood_particle", tint: 0x9e7437 },
    memorial_crate_particle: { base: "wood_particle", tint: 0x763800 },
    flint_crate_particle: { base: "wood_particle", tint: 0xda6a0b },
    nsd_crate_particle: { base: "wood_particle", tint: 0x3d6336 },
    lansirama_crate_particle: { base: "wood_particle", tint: 0x725940 },
    reinforced_crate_particle: { base: "metal_particle_1", tint: 0x2e2e2e },
    furniture_particle: { base: "wood_particle", tint: 0x785a2e },
    couch_part_particle: { base: "wood_particle", tint: 0x6a330b },
    grenade_crate_particle: { base: "wood_particle", tint: 0x4c4823 },
    gun_case_particle: { base: "wood_particle", tint: 0x3e5130 },
    hazel_crate_particle: { base: "wood_particle", tint: 0x6ba371 },
    lux_crate_particle: { base: "wood_particle", tint: 0x4e5c3d },
    melee_crate_particle: { base: "wood_particle", tint: 0x23374c },
    tango_crate_particle: { base: "wood_particle", tint: 0x3f4c39 },
    wall_particle: { base: "wood_particle", tint: 0xafa08c },
    port_office_wall_particle: { base: "wood_particle", tint: 0xb98a46 },
    flint_lockbox_particle_1: { base: "stone_particle_1", tint: 0x26272c },
    flint_lockbox_particle_2: { base: "stone_particle_2", tint: 0x26272c },
    gold_rock_particle_1: { base: "stone_particle_1", tint: 0xaa8534 },
    gold_rock_particle_2: { base: "stone_particle_2", tint: 0xd3a440 },
    rock_particle_1: { base: "stone_particle_1", tint: 0x8e8e8e },
    rock_particle_2: { base: "stone_particle_2", tint: 0x8e8e8e },
    river_rock_particle_1: { base: "stone_particle_1", tint: 0x626471 },
    river_rock_particle_2: { base: "stone_particle_2", tint: 0x626471 },
    clearing_boulder_particle_1: { base: "stone_particle_1", tint: 0x5a5a5a },
    clearing_boulder_particle_2: { base: "stone_particle_2", tint: 0x5a5a5a },
    sandbags_particle: { base: "stone_particle_2", tint: 0xd59d4e },
    fire_pit_particle_1: { base: "stone_particle_1", tint: 0x5b4f3e },
    fire_pit_particle_2: { base: "stone_particle_2", tint: 0x5b4f3e },
    door2_particle: { base: "plastic_particle", tint: 0xf5f9fd },
    porta_potty_toilet_particle: { base: "plastic_particle", tint: 0x5e5e5e },
    porta_potty_wall_particle: { base: "plastic_particle", tint: 0x1c71d8 },
    porta_potty_particle_fall: { base: "plastic_particle", tint: 0x78593b },
    porta_potty_particle: { base: "ceiling_particle", tint: 0xe7e7e7 },
    outhouse_particle: { base: "ceiling_particle", tint: 0x78593b },
    outhouse_wall_particle: { base: "wood_particle", tint: 0x6e4d2f },
    mobile_home_particle: { base: "ceiling_particle", tint: 0xa8a8a8 },
    large_warehouse_particle: { base: "ceiling_particle", tint: 0x2f3c4f },
    grey_office_chair_particle: { base: "wood_particle", tint: 0x616161 },
    office_chair_particle: { base: "wood_particle", tint: 0x7d2b2b },
    hq_stone_wall_particle_1: { base: "stone_particle_1", tint: 0x591919 },
    hq_stone_wall_particle_2: { base: "stone_particle_2", tint: 0x591919 },
    desk_particle: { base: "wood_particle", tint: 0x61341a },
    headquarters_c_desk_particle: { base: "wood_particle", tint: 0x6e5838 },
    gold_aegis_case_particle: { base: "wood_particle", tint: 0x1a1a1a },
    hq_tp_wall_particle: { base: "wood_particle", tint: 0x74858b },
    white_small_couch_particle: { base: "wood_particle", tint: 0xcfc1af },
    red_small_couch_particle: { base: "wood_particle", tint: 0x823323 },
    planted_bushes_particle: { base: "toilet_particle", tint: 0xaaaaaa },
    barn_wall_particle_1: { base: "stone_particle_1", tint: 0x690c0c },
    barn_wall_particle_2: { base: "stone_particle_2", tint: 0x690c0c },
    lodge_particle: { base: "wood_particle", tint: 0x49371d },
    lodge_wall_particle: { base: "wood_particle", tint: 0x5a4320 },
    gun_mount_dual_rsh12_particle: { base: "wood_particle", tint: 0x595959 },
    square_desk_particle: { base: "wood_particle", tint: 0x4d3e28 },
    bunker_particle: { base: "metal_particle_1", tint: 0x262626 },
    metal_auto_door_particle: { base: "metal_particle_1", tint: 0x404040 },
    red_metal_auto_door_particle: { base: "metal_particle_1", tint: 0x401a1a },
    blue_metal_auto_door_particle: { base: "metal_particle_1", tint: 0x1a1a40 },
    pink_metal_auto_door_particle: { base: "metal_particle_1", tint: 0x9540bf },
    rsh_case_particle: { base: "wood_particle", tint: 0x583928 },
    river_hut_wall_particle: { base: "wood_particle", tint: 0x736758 },
    buoy_particle: { base: "metal_particle_1", tint: 0xa43737 },
    lighthouse_crate_particle: { base: "wood_particle", tint: 0x79512a },
    loot_tree_particle: { base: "oak_tree_particle", tint: 0x999999 },
    red_gift_particle: { base: "toilet_particle", tint: 0x962626 },
    green_gift_particle: { base: "toilet_particle", tint: 0x377130 },
    blue_gift_particle: { base: "toilet_particle", tint: 0x264b96 },
    purple_gift_particle: { base: "toilet_particle", tint: 0x692d69 },
    black_gift_particle: { base: "toilet_particle", tint: 0x1b1b1b },
    pumpkin_particle: { base: "pumpkin_particle_base", tint: 0xff8c01 },
    plumpkin_particle: { base: "pumpkin_particle_base", tint: 0x8a4c70 },
    diseased_plumpkin_particle: { base: "pumpkin_particle_base", tint: 0x654646 },
    container_particle_white: { base: "metal_particle_1", tint: buildings_1.ContainerTints.white },
    container_particle_red: { base: "metal_particle_1", tint: buildings_1.ContainerTints.red },
    container_particle_green: { base: "metal_particle_1", tint: buildings_1.ContainerTints.green },
    container_particle_blue: { base: "metal_particle_1", tint: buildings_1.ContainerTints.blue },
    container_particle_yellow: { base: "metal_particle_1", tint: buildings_1.ContainerTints.yellow },
    container_particle_gas_can: { base: "metal_particle_1", tint: buildings_1.ContainerTints.gas_can },
    container_particle_military_green: { base: "metal_particle_1", tint: buildings_1.ContainerTints.military_green },
    container_particle_military_orange: { base: "metal_particle_1", tint: buildings_1.ContainerTints.military_orange },
    container_particle_military_marine: { base: "metal_particle_1", tint: buildings_1.ContainerTints.military_marine },
    container_particle_military_lime: { base: "metal_particle_1", tint: buildings_1.ContainerTints.military_lime },
    tent_particle_1: { base: "ceiling_particle", tint: buildings_1.TentTints.red },
    tent_particle_2: { base: "ceiling_particle", tint: buildings_1.TentTints.green },
    tent_particle_3: { base: "ceiling_particle", tint: buildings_1.TentTints.blue },
    tent_particle_4: { base: "ceiling_particle", tint: buildings_1.TentTints.orange },
    tent_particle_5: { base: "ceiling_particle", tint: buildings_1.TentTints.purple },
    tent_ceiling_particle_red_1: { base: "tent_ceiling_particle_1", tint: buildings_1.TentTints.red },
    tent_ceiling_particle_red_2: { base: "tent_ceiling_particle_2", tint: buildings_1.TentTints.red },
    tent_ceiling_particle_red_3: { base: "tent_ceiling_particle_3", tint: buildings_1.TentTints.red },
    tent_ceiling_particle_green_1: { base: "tent_ceiling_particle_1", tint: buildings_1.TentTints.green },
    tent_ceiling_particle_green_2: { base: "tent_ceiling_particle_2", tint: buildings_1.TentTints.green },
    tent_ceiling_particle_green_3: { base: "tent_ceiling_particle_3", tint: buildings_1.TentTints.green },
    tent_ceiling_particle_blue_1: { base: "tent_ceiling_particle_1", tint: buildings_1.TentTints.blue },
    tent_ceiling_particle_blue_2: { base: "tent_ceiling_particle_2", tint: buildings_1.TentTints.blue },
    tent_ceiling_particle_blue_3: { base: "tent_ceiling_particle_3", tint: buildings_1.TentTints.blue },
    tent_ceiling_particle_orange_1: { base: "tent_ceiling_particle_1", tint: buildings_1.TentTints.orange },
    tent_ceiling_particle_orange_2: { base: "tent_ceiling_particle_2", tint: buildings_1.TentTints.orange },
    tent_ceiling_particle_orange_3: { base: "tent_ceiling_particle_3", tint: buildings_1.TentTints.orange },
    tent_ceiling_particle_purple_1: { base: "tent_ceiling_particle_1", tint: buildings_1.TentTints.purple },
    tent_ceiling_particle_purple_2: { base: "tent_ceiling_particle_2", tint: buildings_1.TentTints.purple },
    tent_ceiling_particle_purple_3: { base: "tent_ceiling_particle_3", tint: buildings_1.TentTints.purple },
    truck_container_particle_teal: { base: "metal_particle_1", tint: buildings_1.TruckContainerTints.teal },
    truck_container_particle_orange: { base: "metal_particle_1", tint: buildings_1.TruckContainerTints.orange },
    truck_container_particle_purple: { base: "metal_particle_1", tint: buildings_1.TruckContainerTints.purple },
    truck_container_particle_green: { base: "metal_particle_1", tint: buildings_1.TruckContainerTints.green },
    truck_container_particle_red: { base: "metal_particle_1", tint: buildings_1.TruckContainerTints.red },
    abandoned_warehouse_1_particle_1: { base: "stone_particle_1", tint: 0x5a1919 },
    abandoned_warehouse_1_particle_2: { base: "stone_particle_1", tint: 0x5a1919 },
    abandoned_warehouse_col_particle: { base: "metal_particle_1", tint: 0x3c3c3c },
    sawmill_office_particle: { base: "wood_particle", tint: 0x6e4f32 },
    sawmill_warehouse_particle_1: { base: "stone_particle_1", tint: 0x5a1919 },
    sawmill_warehouse_particle_2: { base: "stone_particle_2", tint: 0x5a1919 },
    sawmill_warehouse_wall_particle: { base: "wood_particle", tint: 0x764423 },
    warehouse_hunted_particle: { base: "wood_particle", tint: 0x6e4f32 },
    hunting_stand_particle: { base: "wood_particle", tint: 0x764423 },
    tavern_bar_particle: { base: "wood_particle", tint: 0x603b26 },
    tavern_wall_particle: { base: "wood_particle", tint: 0x72572a },
    humvee_particle: { base: "metal_particle_1", tint: 0x425b3e },
    lansirama_log_particle: { base: "stone_particle_1", tint: 0x6c543d },
    toolbox_particle: { base: "metal_particle_1", tint: 0x2f4b88 },
    garage_door_particle: { base: "metal_particle_1", tint: 0xa29e99 },
    research_desk_particle: { base: "wood_particle", tint: 0x88642f },
    nsd_wall_particle: { base: "wood_particle", tint: 0x3e5130 },
    carport_particle_1: { base: "stone_particle_1", tint: 0xafafaf },
    carport_particle_2: { base: "stone_particle_2", tint: 0xafafaf },
    pickup_truck_particle: { base: "metal_particle_1", tint: 0x733226 },
    hollow_log_wall_particle_1: { base: "stone_particle_1", tint: 0x432f20 },
    hollow_log_wall_particle_2: { base: "stone_particle_2", tint: 0x432f20 }
};
const houseWall = (lengthNumber, hitbox, tintProperties) => ({
    idString: `house_wall_${lengthNumber}`,
    name: `House Wall ${lengthNumber}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 170,
    hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: (tintProperties?.particle) ?? "wall_particle"
    },
    isWall: true,
    wall: {
        borderColor: (tintProperties?.border) ?? 0x4a4134,
        color: (tintProperties?.color) ?? 0xafa08c
    }
});
const hqWall = (lengthNumber, hitbox, customHealth = false) => ({
    idString: `headquarters_wall_${lengthNumber}`,
    name: "Headquarters Wall",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: customHealth ? 100 : 170,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: customHealth ? "hq_tp_wall_particle" : "wall_particle"
    },
    hitbox,
    isWall: true,
    wall: {
        borderColor: customHealth ? 0x23282a : 0x4a4134,
        color: customHealth ? 0x74858b : 0xafa08c,
        ...(customHealth ? {} : { rounded: !customHealth })
    }
});
const lodgeWall = (id, length) => ({
    idString: `lodge_wall_${id}`,
    name: "Lodge Wall",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 170,
    hitbox: hitbox_1.RectangleHitbox.fromRect(length, 2.06),
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "lodge_wall_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x291e0f,
        color: 0x5a4320
    }
});
const cabinWall = (id, length) => ({
    idString: `cabin_wall_${id}`,
    name: "Cabin Wall",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 170,
    hitbox: hitbox_1.RectangleHitbox.fromRect(length, 2.06),
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "lodge_wall_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x291e0f,
        color: 0x5a4320
    }
});
const sawmillWarehouseWall = (lengthNumber, hitbox) => ({
    idString: `sawmill_warehouse_wall_${lengthNumber}`,
    name: `Port Main Office Wall ${lengthNumber}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 200,
    hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "sawmill_warehouse_wall_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x341b0b,
        color: 0x764423
    }
});
const warehouseHuntedWall = (lengthNumber, hitbox) => ({
    idString: `warehouse_hunted_wall_${lengthNumber}`,
    name: `Abandoned Warehouse Wall ${lengthNumber}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 200,
    hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "warehouse_hunted_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x332416,
        color: 0x6e4f32
    }
});
const portMainOfficeWall = (lengthNumber, hitbox) => ({
    idString: `port_main_office_wall_${lengthNumber}`,
    name: `Port Main Office Wall ${lengthNumber}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 200,
    hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "port_office_wall_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x302412,
        color: 0xb98a46
    }
});
const lighthouseWall = (lengthNumber, hitbox) => ({
    idString: `lighthouse_wall_${lengthNumber}`,
    name: `Lighthouse Wall ${lengthNumber}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 200,
    hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "port_office_wall_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x352719,
        color: 0x85613c
    }
});
const innerConcreteWall = (id, hitbox) => ({
    idString: `inner_concrete_wall_${id}`,
    name: "Inner Concrete Wall",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "stone",
    hitbox,
    health: 500,
    noResidue: true,
    hideOnMap: true,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    particleVariations: 2,
    frames: {
        particle: "rock_particle"
    },
    isWall: true,
    wall: {
        color: 0x808080,
        borderColor: 0x484848
    }
});
const mobileHomeWall = (lengthNumber, hitbox) => ({
    idString: `mobile_home_wall_${lengthNumber}`,
    name: `Mobile Home Wall ${lengthNumber}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "appliance",
    noResidue: true,
    hideOnMap: true,
    health: 240,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    hitbox,
    frames: {
        particle: "briefcase_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x666666,
        color: 0xbfbfbf
    }
});
const tentWall = (id, color) => ({
    idString: `tent_wall_${id}`,
    name: `Tent Wall ${id}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "stone",
    hideOnMap: true,
    noResidue: true,
    health: 100,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(26.1, 1.25, (0, vector_1.Vec)(0, -0.75)), hitbox_1.RectangleHitbox.fromRect(1.25, 2.8, (0, vector_1.Vec)(-12.9, 0)), hitbox_1.RectangleHitbox.fromRect(1.25, 2.8, (0, vector_1.Vec)(12.9, 0))),
    particleVariations: 3,
    frames: {
        base: "tent_wall",
        particle: `tent_ceiling_particle_${color}`
    },
    tint: buildings_1.TentTints[color],
    isWall: true
});
const portaPottyWall = (name, hitbox, outhouse) => ({
    idString: name.toLowerCase().replace(/'/g, "").replace(/ /g, "_"),
    name: name,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    health: 100,
    noResidue: true,
    scale: {
        spawnMin: 1,
        spawnMax: 1,
        destroy: 0.9
    },
    hideOnMap: true,
    hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    isWall: true,
    wall: outhouse
        ? { color: 0x6e4d2f, borderColor: 0x261b14 }
        : { color: 0x1c71d8, borderColor: 0x0d3565 },
    frames: {
        particle: outhouse
            ? "outhouse_wall_particle"
            : "porta_potty_wall_particle"
    }
});
const bigTentWall = (id, color) => ({
    idString: `tent_wall_big_${id}`,
    name: `Big Tent Wall ${id}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "stone",
    hideOnMap: true,
    noResidue: true,
    health: 200,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1.25, 6.5, (0, vector_1.Vec)(-3.425, -0.5)), hitbox_1.RectangleHitbox.fromRect(10.5, 1.25, (0, vector_1.Vec)(0, 3.5)), 
    // RectangleHitbox.fromRect(7, 2.1, Vec(-8.5, 3.25)),
    // RectangleHitbox.fromRect(7, 2.1, Vec(8.5, 3.25)),
    hitbox_1.RectangleHitbox.fromRect(9, 1.25, (0, vector_1.Vec)(-17.45, 3.5)), hitbox_1.RectangleHitbox.fromRect(9, 1.25, (0, vector_1.Vec)(17.45, 3.5)), hitbox_1.RectangleHitbox.fromRect(1.25, 8.7, (0, vector_1.Vec)(-21.5, -0.3)), hitbox_1.RectangleHitbox.fromRect(1.25, 8.7, (0, vector_1.Vec)(21.5, -0.3))),
    particleVariations: 2,
    frames: {
        base: "tent_wall_big",
        particle: `tent_ceiling_particle_${color}`
    },
    tint: buildings_1.TentTints[color],
    isWall: true
});
const tavernWall = (lengthNumber, hitbox) => ({
    idString: `tavern_wall_${lengthNumber}`,
    name: `Tavern Wall ${lengthNumber}`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    hideOnMap: true,
    noResidue: true,
    health: 200,
    hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "tavern_wall_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x251b0e,
        color: 0x72572a
    }
});
const gunMount = (gunID, weaponType, useSvg = false, hitbox, frames) => ({
    idString: `gun_mount_${gunID}`,
    name: "Gun Mount",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    health: 60,
    hideOnMap: true,
    scale: {
        spawnMin: 1,
        spawnMax: 1,
        destroy: 0.95
    },
    hasLoot: true,
    hitbox: hitbox ?? new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(8.2, 0.95, (0, vector_1.Vec)(0, -1.32)), // Base
    hitbox_1.RectangleHitbox.fromRect(0.75, 2.75, (0, vector_1.Vec)(0, 0.48)), // Center post
    hitbox_1.RectangleHitbox.fromRect(0.75, 2.75, (0, vector_1.Vec)(-3.11, 0.48)), // Left post
    hitbox_1.RectangleHitbox.fromRect(0.75, 2.75, (0, vector_1.Vec)(3.17, 0.48)) // Right post
    ),
    rotationMode: constants_1.RotationMode.Limited,
    frames: frames ?? {
        base: "gun_mount",
        particle: "furniture_particle",
        residue: "gun_mount_residue"
    },
    gunMount: !useSvg
        ? {
            type: weaponType,
            weapon: `${gunID}${weaponType === "gun" ? "_world" : ""}`
        }
        : undefined,
    wallAttached: true
});
const kitchenUnit = (id, hitbox, residue) => ({
    idString: `kitchen_unit_${id}`,
    name: "Kitchen Unit",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "wood",
    health: 100,
    scale: {
        spawnMin: 1,
        spawnMax: 1,
        destroy: 0.7
    },
    hitbox,
    hideOnMap: true,
    hasLoot: true,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Always,
    frames: {
        particle: "furniture_particle",
        residue: residue ?? "small_drawer_residue"
    }
});
const controlPanel = (idString, name) => ({
    idString,
    name,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "metal_light",
    health: 200,
    reflectBullets: true,
    scale: {
        spawnMin: 1,
        spawnMax: 1,
        destroy: 0.7
    },
    hitbox: hitbox_1.RectangleHitbox.fromRect(11, 8),
    rotationMode: constants_1.RotationMode.Limited,
    explosion: "control_panel_explosion",
    frames: {
        particle: "metal_particle",
        residue: "barrel_residue"
    }
});
const gift = (color, explode = false) => ({
    idString: `${color}_gift`,
    name: `${color.charAt(0).toUpperCase() + color.slice(1)} Gift`,
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "cardboard",
    hideOnMap: true,
    health: 60,
    scale: {
        spawnMin: 1,
        spawnMax: 1,
        destroy: 0.8
    },
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    hitbox: hitbox_1.RectangleHitbox.fromRect(4.4, 4.4),
    zIndex: constants_1.ZIndexes.ObstaclesLayer2,
    hasLoot: true,
    explosion: explode ? "coal_explosion" : undefined
});
const rshCase = (idString) => ({
    idString,
    name: "RSh-12 Case",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "crate",
    health: 150,
    hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(8.5, 5.5), hitbox_1.RectangleHitbox.fromRect(1.3, 6, (0, vector_1.Vec)(-2.7, 0)), hitbox_1.RectangleHitbox.fromRect(1.3, 6, (0, vector_1.Vec)(2.7, 0))),
    scale: {
        spawnMax: 1,
        spawnMin: 1,
        destroy: 0.8
    },
    rotationMode: constants_1.RotationMode.Limited,
    hasLoot: true,
    frames: {
        particle: "rsh_case_particle",
        residue: "rsh_case_residue"
    }
});
const huntingStandWall = (length, hitbox) => ({
    idString: `hunting_stand_wall_${length}`,
    name: "Hunting Stand Wall",
    defType: objectDefinitions_1.DefinitionType.Obstacle,
    material: "stone",
    hideOnMap: true,
    noResidue: true,
    health: 69420,
    indestructible: true,
    hitbox: hitbox,
    rotationMode: constants_1.RotationMode.Limited,
    allowFlyover: constants_1.FlyoverPref.Never,
    frames: {
        particle: "hunting_stand_particle"
    },
    isWall: true,
    wall: {
        borderColor: 0x341b0b,
        color: 0x764423
    }
});
exports.Obstacles = new objectDefinitions_1.ObjectDefinitions([
    {
        idString: "oak_tree",
        name: "Oak Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 180,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.2,
            destroy: 0.75
        },
        hitbox: new hitbox_1.CircleHitbox(3.5),
        spawnHitbox: new hitbox_1.CircleHitbox(8.5),
        rotationMode: constants_1.RotationMode.Full,
        isTree: true,
        variations: 4,
        trunkVariations: 2,
        leavesVariations: 2,
        frames: {
            base: "oak_tree_trunk",
            leaves: "oak_tree_leaves"
        },
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5
    },
    {
        idString: "birch_tree",
        name: "Birch Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        isTree: true,
        health: 180,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.75
        },
        hitbox: new hitbox_1.CircleHitbox(3.5),
        spawnHitbox: new hitbox_1.CircleHitbox(8.5),
        rotationMode: constants_1.RotationMode.Full,
        variations: 2,
        leavesVariations: 2,
        frames: {
            base: "birch_tree_trunk",
            leaves: "birch_tree_leaves"
        },
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5
    },
    {
        idString: "pine_tree",
        name: "Pine Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        isTree: true,
        tree: {
            leavesMinAlpha: 0.45
        },
        trunkVariations: 1,
        leavesVariations: 1,
        health: 180,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.75
        },
        hitbox: new hitbox_1.CircleHitbox(2.5),
        spawnHitbox: new hitbox_1.CircleHitbox(8.5),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        frames: {
            base: "pine_tree_trunk",
            leaves: "pine_tree"
        }
    },
    {
        idString: "spruce_tree",
        name: "Spruce Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        isTree: true,
        tree: {
            leavesMinAlpha: 0.45
        },
        trunkVariations: 1,
        leavesVariations: 1,
        health: 180,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.75
        },
        hitbox: new hitbox_1.CircleHitbox(2.5),
        spawnHitbox: new hitbox_1.CircleHitbox(8.5),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        frames: {
            base: "spruce_tree_trunk",
            leaves: "spruce_tree_leaves",
            particle: "pine_tree_particle",
            residue: "pine_tree_residue"
        }
    },
    {
        idString: "big_oak_tree",
        name: "Big Oak Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 240,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.2,
            destroy: 0.75
        },
        spawnHitbox: new hitbox_1.CircleHitbox(8.5),
        rotationMode: constants_1.RotationMode.Full,
        hitbox: new hitbox_1.CircleHitbox(3.5),
        isTree: true,
        tree: {
            minDist: 64,
            maxDist: 1764,
            trunkMinAlpha: 0.75,
            leavesMinAlpha: 0.3
        },
        variations: 6,
        trunkVariations: 6,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            base: "big_oak_tree_trunk",
            leaves: "big_oak_tree_leaves",
            particle: "oak_tree_particle",
            residue: "oak_tree_residue"
        }
    },
    {
        idString: "maple_tree",
        name: "Maple Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 290,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.2,
            destroy: 0.75
        },
        spawnHitbox: new hitbox_1.CircleHitbox(20),
        rotationMode: constants_1.RotationMode.Full,
        hitbox: new hitbox_1.CircleHitbox(5.5),
        isTree: true,
        tree: {
            minDist: 64,
            maxDist: 1764,
            trunkMinAlpha: 0.75,
            leavesMinAlpha: 0.3
        },
        variations: 3,
        leavesVariations: 3,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        frames: {
            base: "maple_tree_trunk",
            leaves: "maple_tree_leaves"
        }
    },
    {
        idString: "dormant_oak_tree",
        name: "Dormant Oak Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 120,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.75
        },
        spawnHitbox: new hitbox_1.CircleHitbox(8.5),
        rotationMode: constants_1.RotationMode.Full,
        hitbox: new hitbox_1.CircleHitbox(2.5),
        variations: 2,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5
    },
    {
        idString: "dead_pine_tree",
        name: "Dead Pine Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 120,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.75
        },
        spawnHitbox: new hitbox_1.CircleHitbox(8.5),
        rotationMode: constants_1.RotationMode.Full,
        hitbox: new hitbox_1.CircleHitbox(2.5),
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer4
    },
    {
        idString: "christmas_tree",
        name: "Christmas Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 720,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.75
        },
        hitbox: new hitbox_1.CircleHitbox(10),
        spawnHitbox: new hitbox_1.CircleHitbox(15),
        rotationMode: constants_1.RotationMode.Full,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        allowFlyover: constants_1.FlyoverPref.Never,
        hasLoot: true,
        glow: {
            tint: 0xffff00,
            scale: 1.5,
            alpha: 0.8,
            scaleAnim: {
                to: 2,
                duration: 1e3
            }
        }
    },
    {
        idString: "stump",
        name: "Stump",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 180,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(2.9),
        rotationMode: constants_1.RotationMode.Full
    },
    {
        idString: "hatchet_stump",
        name: "Hatchet Stump",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(2.9),
        rotationMode: constants_1.RotationMode.None,
        hasLoot: true,
        frames: {
            particle: "stump_particle",
            residue: "stump_residue"
        }
    },
    {
        idString: "rock",
        name: "Rock",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 200,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: new hitbox_1.CircleHitbox(4),
        spawnHitbox: new hitbox_1.CircleHitbox(4.5),
        rotationMode: constants_1.RotationMode.Full,
        variations: 7,
        particleVariations: 2
    },
    {
        idString: "river_rock",
        name: "River Rock",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 550,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.River,
        zIndex: constants_1.ZIndexes.DownedPlayers - 1,
        hitbox: new hitbox_1.CircleHitbox(8),
        spawnHitbox: new hitbox_1.CircleHitbox(10),
        rotationMode: constants_1.RotationMode.Full,
        variations: 5,
        particleVariations: 2
    },
    {
        idString: "clearing_boulder",
        name: "Clearing Boulder",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 850,
        scale: {
            spawnMin: 1,
            spawnMax: 1.2,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.Grass,
        hitbox: new hitbox_1.CircleHitbox(8.2),
        spawnHitbox: new hitbox_1.CircleHitbox(12),
        rotationMode: constants_1.RotationMode.Full,
        variations: 2,
        particleVariations: 2
    },
    {
        idString: "pebble",
        name: "Pebble",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 200,
        indestructible: true,
        noCollisions: true,
        noMeleeCollision: true,
        noBulletCollision: true,
        scale: {
            spawnMin: 0.8,
            spawnMax: 1.2,
            destroy: 0
        },
        spawnMode: constants_1.MapObjectSpawnMode.Trail,
        hitbox: new hitbox_1.CircleHitbox(0.5),
        spawnHitbox: new hitbox_1.CircleHitbox(0.5),
        rotationMode: constants_1.RotationMode.Full,
        variations: 2
    },
    {
        idString: "pumpkin",
        name: "Pumpkin",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 100,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(2.55),
        spawnHitbox: new hitbox_1.CircleHitbox(3),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "pumpkin_particle"
        }
    },
    {
        idString: "large_pumpkin",
        name: "Large Pumpkin",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 160,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(4.69),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "pumpkin_particle",
            residue: "pumpkin_residue"
        }
    },
    {
        idString: "jack_o_lantern",
        name: "Jack O' Lantern",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 300,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        glow: {
            tint: 0xfca202,
            scale: 0.6,
            alpha: 0.8,
            scaleAnim: {
                to: 0.7,
                duration: 2e3
            },
            flicker: {
                chance: 0.5,
                strength: 0.9,
                interval: 7e2
            }
        },
        hitbox: new hitbox_1.CircleHitbox(4.69),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "pumpkin_particle",
            residue: "pumpkin_residue"
        }
    },
    {
        idString: "baby_plumpkin",
        name: "Baby Plumpkin",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 100,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.6
        },
        hitbox: new hitbox_1.CircleHitbox(1.83),
        spawnHitbox: new hitbox_1.CircleHitbox(2),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "plumpkin_particle"
        },
        variations: 1,
        weaponSwap: {
            modeRestricted: true
        }
    },
    {
        idString: "baby_plumpkin_infection",
        name: "Baby Plumpkin (Infection)",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 100,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.6
        },
        hitbox: new hitbox_1.CircleHitbox(1.83),
        spawnHitbox: new hitbox_1.CircleHitbox(2),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            base: "baby_plumpkin",
            particle: "plumpkin_particle",
            residue: "baby_plumpkin_residue"
        },
        variations: 3,
        weaponSwap: {
            weighted: true
        },
        regenerateAfterDestroyed: 30000,
        applyPerkOnDestroy: {
            mode: "infection",
            perk: "infected" /* PerkIds.Infected */,
            chance: 0.05
        }
    },
    {
        idString: "plumpkin",
        name: "Plumpkin",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 300,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(4.69),
        spawnHitbox: new hitbox_1.CircleHitbox(5),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            base: "plumpkin_base",
            particle: "plumpkin_particle"
        },
        hasLoot: true
    },
    {
        idString: "diseased_plumpkin",
        name: "Diseased Plumpkin",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 200,
        hideOnMap: true,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        glow: {
            tint: 0x643554,
            scale: 0.6,
            alpha: 0.8,
            scaleAnim: {
                to: 0.7,
                duration: 3e3
            }
        },
        hitbox: new hitbox_1.CircleHitbox(4.45),
        spawnHitbox: new hitbox_1.CircleHitbox(5),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true
    },
    {
        idString: "birthday_cake",
        name: "Birthday Cake",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "pumpkin",
        health: 70,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.75
        },
        hitbox: new hitbox_1.CircleHitbox(1.9),
        spawnHitbox: new hitbox_1.CircleHitbox(2.9),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true
    },
    {
        idString: "cobweb",
        name: "Cobweb",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 69420,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(9, 9),
        noCollisions: true,
        noMeleeCollision: true,
        noBulletCollision: true,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        zIndex: constants_1.ZIndexes.ObstaclesLayer4
    },
    {
        idString: "oil_tank",
        name: "Oil Tank",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(16.8, 13.6), hitbox_1.RectangleHitbox.fromRect(26, 2), new hitbox_1.CircleHitbox(5, (0, vector_1.Vec)(-8, 1.8)), new hitbox_1.CircleHitbox(5, (0, vector_1.Vec)(-8, -1.8)), new hitbox_1.CircleHitbox(5, (0, vector_1.Vec)(8, 1.8)), new hitbox_1.CircleHitbox(5, (0, vector_1.Vec)(8, -1.8))),
        spawnHitbox: hitbox_1.RectangleHitbox.fromRect(28, 18),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        noResidue: true,
        frames: {
            particle: "metal_particle"
        },
        reflectBullets: true,
        winterVariations: 2
    },
    {
        idString: "flint_lockbox",
        name: "Flint Lockbox",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        hardness: 5,
        health: 200,
        impenetrable: true,
        hasLoot: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.9, 8.9, (0, vector_1.Vec)(0, 0.1)),
        rotationMode: constants_1.RotationMode.None,
        particleVariations: 2,
        winterVariations: 1
    },
    {
        idString: "monument",
        name: "Monument",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 200,
        indestructible: true,
        noResidue: true,
        doorSound: "monument_slide",
        zIndex: constants_1.ZIndexes.BuildingsCeiling + 1,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        customInteractMessage: true,
        interactOnlyFromSide: 2,
        isDoor: true,
        openOnce: true,
        operationStyle: "slide",
        slideFactor: 0.8,
        animationDuration: 6000,
        hitbox: hitbox_1.RectangleHitbox.fromRect(19.25, 19.25),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "clearing_boulder_particle"
        },
        particleVariations: 2
    },
    {
        idString: "bush",
        name: "Bush",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "bush",
        health: 80,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.CircleHitbox(4.2),
        noCollisions: true,
        rotationMode: constants_1.RotationMode.Full,
        particleVariations: 2,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3
    },
    {
        idString: "vibrant_bush",
        name: "Vibrant Bush",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "bush",
        health: 120,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.CircleHitbox(5.4),
        noCollisions: true,
        spawnWithLoot: true,
        lootTable: "special_bush",
        rotationMode: constants_1.RotationMode.Full,
        particleVariations: 2,
        variations: 3,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3
    },
    {
        idString: "lamp",
        name: "Lamp",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        variations: 2,
        health: 69,
        indestructible: true,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.CircleHitbox(0),
        noCollisions: true,
        noBulletCollision: true,
        noHitEffect: true,
        noMeleeCollision: true,
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsCeiling - 2
    },
    {
        idString: "vat",
        name: "Vat",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        rotationMode: constants_1.RotationMode.Limited,
        material: "appliance",
        variations: 2,
        health: 200,
        indestructible: true,
        reflectBullets: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.75
        },
        frames: {
            particle: "washing_machine_particle"
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(7.03, 3.98, (0, vector_1.Vec)(0, 1.19)), hitbox_1.RectangleHitbox.fromRect(5.61, 2.74, (0, vector_1.Vec)(-0.03, -1.27)), hitbox_1.RectangleHitbox.fromRect(1, 3.79, (0, vector_1.Vec)(-3.03, -0.21)), hitbox_1.RectangleHitbox.fromRect(1, 3.79, (0, vector_1.Vec)(3.01, -0.21)), new hitbox_1.CircleHitbox(0.56, (0, vector_1.Vec)(2.69, -2.09)), new hitbox_1.CircleHitbox(0.56, (0, vector_1.Vec)(-2.63, -2.11)))
    },
    {
        idString: "detector_walls",
        name: "Detector Walls",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        health: 1000,
        reflectBullets: true,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1, 9.1, (0, vector_1.Vec)(4, 0)), hitbox_1.RectangleHitbox.fromRect(1, 9, (0, vector_1.Vec)(-3.9, 0.1))),
        noResidue: true,
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "detector_top",
        name: "Detector Top",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        health: 1000,
        detector: true,
        indestructible: true,
        noBulletCollision: true,
        noMeleeCollision: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9, 3),
        noCollisions: true,
        noResidue: true,
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "metal_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3
    },
    {
        idString: "blueberry_bush",
        name: "Blueberry Bush",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "bush",
        health: 80,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.CircleHitbox(4.2),
        noCollisions: true,
        rotationMode: constants_1.RotationMode.Full,
        particleVariations: 2,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        spawnWithLoot: true,
        lootTable: "special_bush",
        frames: {
            particle: "bush_particle",
            residue: "bush_residue"
        }
    },
    {
        idString: "oak_leaf_pile",
        name: "Oak Leaf Pile",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "bush",
        health: 50,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.3,
            destroy: 0.8
        },
        hitbox: new hitbox_1.CircleHitbox(5),
        noCollisions: true,
        noResidue: true,
        rotationMode: constants_1.RotationMode.Full,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        // spawnWithLoot: true,
        frames: {
            particle: "leaf_particle_3"
        }
    },
    {
        idString: "regular_crate",
        name: "Regular Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.Binary,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        hasLoot: true,
        frames: {
            particle: "crate_particle",
            residue: "regular_crate_residue"
        },
        winterVariations: 6
    },
    {
        idString: "nsd_crate",
        name: "NSD Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.None,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        hasLoot: true,
        hideOnMap: true
    },
    {
        idString: "flint_crate",
        name: "Flint Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.None,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        hasLoot: true,
        hideOnMap: true,
        winterVariations: 6
    },
    {
        idString: "aegis_crate",
        name: "AEGIS Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.None,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        hasLoot: true,
        hideOnMap: true,
        winterVariations: 6
    },
    {
        idString: "lansirama_crate",
        name: "Lansirama Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.None,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        hasLoot: true,
        hideOnMap: true
    },
    {
        idString: "grenade_crate",
        name: "Grenade Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.5, 6.3),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        winterVariations: 3
    },
    {
        idString: "melee_crate",
        name: "Melee Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.5, 6.3),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        winterVariations: 1
    },
    {
        idString: "lighthouse_crate",
        name: "Lighthouse Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.5, 6.3),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        winterVariations: 1
    },
    {
        idString: "hazel_crate",
        name: "HAZEL Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 1700,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        rotationMode: constants_1.RotationMode.None,
        frames: {
            particle: "hazel_crate_particle",
            residue: "hazel_crate_residue"
        },
        hasLoot: true
    },
    {
        idString: "frozen_crate",
        name: "Frozen Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "ice",
        health: 1000,
        variations: 2,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.Binary,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        frames: {
            residue: "regular_crate_residue",
            particle: "window_particle"
        },
        hasLoot: true,
        hideOnMap: true
    },
    {
        idString: "ammo_crate",
        name: "Ammo Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "cardboard",
        health: 160,
        impenetrable: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.6
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.49, 8.36),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        frames: {
            particle: "crate_particle"
        },
        winterVariations: 2
    },
    {
        idString: "desk_left",
        name: "Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(18.25, 5.25, (0, vector_1.Vec)(0, -3)), hitbox_1.RectangleHitbox.fromRect(4.5, 11, (0, vector_1.Vec)(-6.8, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        lootTable: "desk",
        frames: {
            particle: "desk_particle"
        }
    },
    {
        idString: "desk_right",
        name: "Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(18.25, 5.25, (0, vector_1.Vec)(0, -3)), hitbox_1.RectangleHitbox.fromRect(4.5, 11, (0, vector_1.Vec)(6.8, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        lootTable: "desk",
        frames: {
            particle: "desk_particle"
        }
    },
    {
        idString: "square_desk",
        name: "Square Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(18.55, 3.76, (0, vector_1.Vec)(0, -7.39)), hitbox_1.RectangleHitbox.fromRect(18.55, 3.76, (0, vector_1.Vec)(0, 7.39)), hitbox_1.RectangleHitbox.fromRect(6.02, 14.27, (0, vector_1.Vec)(6.27, 0)), hitbox_1.RectangleHitbox.fromRect(3.77, 3.37, (0, vector_1.Vec)(-7.39, -4.57)), hitbox_1.RectangleHitbox.fromRect(3.77, 3.37, (0, vector_1.Vec)(-7.39, 4.57))),
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "piano",
        name: "Piano",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "piano",
        health: 350,
        hitSoundVariations: 4,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(12.9, 3, (0, vector_1.Vec)(0.1, -6.5)), hitbox_1.RectangleHitbox.fromRect(11, 5, (0, vector_1.Vec)(0.1, -3)), hitbox_1.RectangleHitbox.fromRect(7, 5, (0, vector_1.Vec)(3.5, 2.5)), hitbox_1.RectangleHitbox.fromRect(2, 8, (0, vector_1.Vec)(6, 0)), new hitbox_1.CircleHitbox(1.6, (0, vector_1.Vec)(-5.1, -4)), new hitbox_1.CircleHitbox(1.6, (0, vector_1.Vec)(-4.5, -2)), new hitbox_1.CircleHitbox(1.6, (0, vector_1.Vec)(-3, -1)), new hitbox_1.CircleHitbox(1.6, (0, vector_1.Vec)(0.5, 3)), new hitbox_1.CircleHitbox(1.6, (0, vector_1.Vec)(0, 2)), new hitbox_1.CircleHitbox(1.6, (0, vector_1.Vec)(-0.5, 1)), new hitbox_1.CircleHitbox(1.6, (0, vector_1.Vec)(-1, 0.5)), new hitbox_1.CircleHitbox(1, (0, vector_1.Vec)(6, -4.5)), new hitbox_1.CircleHitbox(0.8, (0, vector_1.Vec)(-6.4, -4.8)), new hitbox_1.CircleHitbox(2.8, (0, vector_1.Vec)(3.5, 5)), new hitbox_1.CircleHitbox(3, (0, vector_1.Vec)(4, 5)), new hitbox_1.CircleHitbox(3, (0, vector_1.Vec)(3, 4))),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "rocket_box",
        name: "Firework rocket box",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "cardboard",
        health: 45,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.6
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(4, 4),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        frames: {
            particle: "box_particle",
            residue: "box_residue"
        }
    },
    {
        idString: "confetti_grenade_box",
        name: "Confetti grenade box",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "cardboard",
        health: 45,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.6
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(4, 4),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        frames: {
            particle: "box_particle",
            residue: "box_residue"
        }
    },
    {
        idString: "tear_gas_crate",
        name: "Tear Gas Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.6
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.15, 6.3),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "crate_particle",
            residue: "regular_crate_residue"
        },
        particlesOnDestroy: "tear_gas_particle",
        additionalDestroySounds: ["smoke_grenade"],
        winterVariations: 1,
        waterOverlay: {
            scaleX: 1,
            scaleY: 0.65
        }
    },
    {
        idString: "barrel",
        name: "Barrel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 160,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: new hitbox_1.CircleHitbox(3.75),
        rotationMode: constants_1.RotationMode.Full,
        explosion: "barrel_explosion",
        frames: {
            particle: "metal_particle"
        },
        reflectBullets: true,
        winterVariations: 3
    },
    {
        idString: "super_barrel",
        name: "Super Barrel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 240,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: new hitbox_1.CircleHitbox(3.75),
        rotationMode: constants_1.RotationMode.Full,
        explosion: "super_barrel_explosion",
        reflectBullets: true,
        winterVariations: 3
    },
    {
        idString: "propane_tank",
        name: "Propane Tank",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 60,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        reflectBullets: true,
        hitbox: new hitbox_1.CircleHitbox(1.9),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        explosion: "propane_tank_explosion",
        frames: {
            particle: "propane_tank_particle",
            residue: "explosion_decal"
        }
    },
    {
        idString: "loot_barrel",
        name: "Loot Barrel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        hideOnMap: true,
        health: 160,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hasLoot: true,
        hitbox: new hitbox_1.CircleHitbox(3.75),
        rotationMode: constants_1.RotationMode.Full,
        explosion: "barrel_explosion",
        reflectBullets: true,
        frames: {
            particle: "metal_particle",
            residue: "barrel_residue"
        }
    },
    {
        idString: "airdrop_crate_locked",
        name: "Airdrop",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 10000,
        indestructible: true,
        reflectBullets: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.7, 8.7),
        spawnHitbox: hitbox_1.RectangleHitbox.fromRect(10, 10),
        rotationMode: constants_1.RotationMode.None,
        hideOnMap: true,
        isActivatable: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        sound: {
            name: "airdrop_unlock",
            maxRange: 64,
            falloff: 0.3
        },
        replaceWith: {
            idString: { airdrop_crate: 0.95, gold_airdrop_crate: 0.05 },
            delay: 800
        },
        noResidue: true,
        frames: {
            particle: "metal_particle"
        },
        airdropUnlock: true
    },
    {
        idString: "airdrop_crate_locked_force",
        name: "Airdrop",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 10000,
        indestructible: true,
        reflectBullets: true,
        interactObstacleIdString: "airdrop_crate_locked",
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.7, 8.7),
        spawnHitbox: hitbox_1.RectangleHitbox.fromRect(10, 10),
        rotationMode: constants_1.RotationMode.None,
        hideOnMap: true,
        isActivatable: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        sound: {
            name: "airdrop_unlock",
            maxRange: 64,
            falloff: 0.3
        },
        replaceWith: {
            idString: "gold_airdrop_crate",
            delay: 800
        },
        noResidue: true,
        frames: {
            base: "airdrop_crate_locked",
            particle: "metal_particle"
        },
        airdropUnlock: true
    },
    {
        idString: "airdrop_crate",
        name: "Airdrop Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 150,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.7, 8.7),
        spawnHitbox: hitbox_1.RectangleHitbox.fromRect(10, 10),
        hideOnMap: true,
        rotationMode: constants_1.RotationMode.None,
        hasLoot: true
    },
    {
        idString: "gold_airdrop_crate",
        name: "Gold Airdrop Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 170,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.7, 8.7),
        spawnHitbox: hitbox_1.RectangleHitbox.fromRect(10, 10),
        rotationMode: constants_1.RotationMode.None,
        hideOnMap: true,
        hasLoot: true,
        frames: {
            particle: "airdrop_crate_particle"
        }
    },
    {
        idString: "gold_rock",
        name: "Gold Rock",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        hideOnMap: true,
        health: 250,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.3
        },
        hitbox: new hitbox_1.CircleHitbox(4),
        spawnHitbox: new hitbox_1.CircleHitbox(4.5),
        particleVariations: 2,
        rotationMode: constants_1.RotationMode.Full,
        hasLoot: true
    },
    {
        idString: "loot_tree",
        name: "Loot Tree",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        hideOnMap: true,
        health: 250,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1,
            destroy: 0.75
        },
        hitbox: new hitbox_1.CircleHitbox(5.5),
        spawnHitbox: new hitbox_1.CircleHitbox(15),
        rotationMode: constants_1.RotationMode.Full,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        allowFlyover: constants_1.FlyoverPref.Never,
        hasLoot: true,
        isTree: true,
        variations: 4,
        trunkVariations: 2,
        leavesVariations: 2,
        frames: {
            base: "oak_tree_trunk",
            leaves: "oak_tree_leaves"
        },
        tint: 0x999999
    },
    {
        idString: "box",
        name: "Box",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "cardboard",
        health: 40,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(4.4, 4.4),
        rotationMode: constants_1.RotationMode.Limited,
        variations: 3,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        hasLoot: true,
        winterVariations: 3,
        waterOverlay: {
            scaleX: 0.45,
            scaleY: 0.45
        }
    },
    gift("red"),
    gift("green"),
    gift("blue"),
    gift("purple"),
    gift("black", true),
    {
        idString: "hq_large_cart",
        name: "Large Cart",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        health: 210,
        indestructible: true,
        hideOnMap: true,
        invisible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1.6, 10.8, (0, vector_1.Vec)(-16.5, 0.2)), hitbox_1.RectangleHitbox.fromRect(1.6, 10.8, (0, vector_1.Vec)(1.5, 0.2))),
        rotationMode: constants_1.RotationMode.Limited,
        reflectBullets: true,
        noResidue: true,
        frames: {
            particle: "file_cart_particle"
        }
    },
    {
        idString: "file_cart",
        name: "File Cart",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        health: 210,
        hideOnMap: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(11, 5.7)),
        rotationMode: constants_1.RotationMode.Limited,
        reflectBullets: true,
        frames: {
            particle: "file_cart_particle"
        }
    },
    houseWall(1, hitbox_1.RectangleHitbox.fromRect(9, 2)),
    houseWall(2, hitbox_1.RectangleHitbox.fromRect(20.86, 2)),
    houseWall(3, hitbox_1.RectangleHitbox.fromRect(11.4, 2)),
    houseWall(4, hitbox_1.RectangleHitbox.fromRect(21.4, 2)),
    houseWall(5, hitbox_1.RectangleHitbox.fromRect(16, 2)),
    houseWall(6, hitbox_1.RectangleHitbox.fromRect(15.1, 2)),
    houseWall(7, hitbox_1.RectangleHitbox.fromRect(20.6, 2)),
    houseWall(8, hitbox_1.RectangleHitbox.fromRect(10.7, 2)),
    houseWall(9, hitbox_1.RectangleHitbox.fromRect(17.7, 2)),
    houseWall(10, hitbox_1.RectangleHitbox.fromRect(20.6, 2)),
    houseWall(11, hitbox_1.RectangleHitbox.fromRect(11.6, 2)),
    houseWall(12, hitbox_1.RectangleHitbox.fromRect(16.2, 2)),
    houseWall(14, hitbox_1.RectangleHitbox.fromRect(17, 2)),
    houseWall(15, hitbox_1.RectangleHitbox.fromRect(12.1, 2)),
    houseWall(16, hitbox_1.RectangleHitbox.fromRect(10.5, 2)),
    houseWall(17, hitbox_1.RectangleHitbox.fromRect(22.56, 2)),
    // small bunker special wall
    houseWall(13, hitbox_1.RectangleHitbox.fromRect(9, 2), { color: 0x74858b, border: 0x23282a, particle: "hq_tp_wall_particle" }),
    // blue house basement shit
    houseWall(18, hitbox_1.RectangleHitbox.fromRect(5.25, 2), { color: 0x74858b, border: 0x23282a, particle: "hq_tp_wall_particle" }),
    houseWall(19, hitbox_1.RectangleHitbox.fromRect(19.55, 2), { color: 0x74858b, border: 0x23282a, particle: "hq_tp_wall_particle" }),
    // river hut
    houseWall(20, hitbox_1.RectangleHitbox.fromRect(32.7, 2), { color: 0x736758, border: 0x383127, particle: "river_hut_wall_particle" }),
    houseWall(21, hitbox_1.RectangleHitbox.fromRect(23.15, 2), { color: 0x736758, border: 0x383127, particle: "river_hut_wall_particle" }),
    houseWall(22, hitbox_1.RectangleHitbox.fromRect(30.8, 2), { color: 0x736758, border: 0x383127, particle: "river_hut_wall_particle" }),
    houseWall(23, hitbox_1.RectangleHitbox.fromRect(25.4, 2), { color: 0x736758, border: 0x383127, particle: "river_hut_wall_particle" }),
    // flooded bunker
    houseWall(24, hitbox_1.RectangleHitbox.fromRect(14.1, 2)),
    houseWall(25, hitbox_1.RectangleHitbox.fromRect(16.52, 2)),
    // HQ walls (headquarters)
    hqWall(1, hitbox_1.RectangleHitbox.fromRect(11.4, 2)),
    hqWall(2, hitbox_1.RectangleHitbox.fromRect(21.05, 2)),
    hqWall(3, hitbox_1.RectangleHitbox.fromRect(9.1, 2)),
    hqWall(4, hitbox_1.RectangleHitbox.fromRect(16, 2.1)),
    hqWall(5, hitbox_1.RectangleHitbox.fromRect(11.2, 2)),
    hqWall(6, hitbox_1.RectangleHitbox.fromRect(39.2, 2)),
    hqWall(7, hitbox_1.RectangleHitbox.fromRect(3.2, 1.6), true),
    hqWall(8, hitbox_1.RectangleHitbox.fromRect(3.5, 1.6), true),
    hqWall(9, hitbox_1.RectangleHitbox.fromRect(21, 2.1)),
    // cabin walls
    cabinWall("1", 8.22),
    cabinWall("2", 8.28),
    cabinWall("3", 18.79),
    cabinWall("4", 19.68),
    cabinWall("5", 26.35),
    {
        idString: "cabin_secret_wall",
        name: "Cabin Secret Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        hideOnMap: true,
        noResidue: true,
        health: 100,
        hitbox: hitbox_1.RectangleHitbox.fromRect(17.62, 1.91),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "lodge_wall_particle"
        },
        isWall: true
    },
    lodgeWall("1", 9.15),
    lodgeWall("2", 9.7),
    lodgeWall("3", 9.82),
    lodgeWall("4", 15.08),
    lodgeWall("5", 19.77),
    lodgeWall("6", 20.44),
    lodgeWall("7", 26.15),
    lodgeWall("8", 27.03),
    {
        idString: "lodge_secret_room_wall",
        name: "Lodge Secret Room Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        hideOnMap: true,
        noResidue: true,
        health: 100,
        hitbox: hitbox_1.RectangleHitbox.fromRect(17.62, 1.91),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "lodge_wall_particle"
        },
        isWall: true
    },
    tentWall(1, "red"),
    tentWall(2, "green"),
    tentWall(3, "blue"),
    tentWall(4, "orange"),
    tentWall(5, "purple"),
    bigTentWall(1, "red"),
    bigTentWall(2, "green"),
    bigTentWall(3, "blue"),
    bigTentWall(4, "orange"),
    portaPottyWall("Porta Potty Back Wall", hitbox_1.RectangleHitbox.fromRect(12.8, 1.6)),
    portaPottyWall("Porta Potty Front Wall", hitbox_1.RectangleHitbox.fromRect(3, 1.6)),
    portaPottyWall("Outhouse Back Wall", hitbox_1.RectangleHitbox.fromRect(11.71, 1.81), true),
    portaPottyWall("Outhouse Side Wall", hitbox_1.RectangleHitbox.fromRect(1.81, 19.2), true),
    portaPottyWall("Outhouse Front Wall", hitbox_1.RectangleHitbox.fromRect(2.8, 1.81), true),
    portMainOfficeWall(1, hitbox_1.RectangleHitbox.fromRect(16.7, 1.8)),
    portMainOfficeWall(2, hitbox_1.RectangleHitbox.fromRect(9.5, 1.8)),
    portMainOfficeWall(3, hitbox_1.RectangleHitbox.fromRect(22.05, 1.8)),
    portMainOfficeWall(4, hitbox_1.RectangleHitbox.fromRect(32.6, 1.8)),
    portMainOfficeWall(5, hitbox_1.RectangleHitbox.fromRect(11.4, 1.8)),
    portMainOfficeWall(6, hitbox_1.RectangleHitbox.fromRect(1.8, 16.5)),
    lighthouseWall(1, hitbox_1.RectangleHitbox.fromRect(4.69, 2)),
    lighthouseWall(2, hitbox_1.RectangleHitbox.fromRect(11.89, 2)),
    lighthouseWall(3, hitbox_1.RectangleHitbox.fromRect(2, 21.14)),
    sawmillWarehouseWall(1, hitbox_1.RectangleHitbox.fromRect(41.13, 2.02)),
    sawmillWarehouseWall(2, hitbox_1.RectangleHitbox.fromRect(30.47, 2.02)),
    sawmillWarehouseWall(3, hitbox_1.RectangleHitbox.fromRect(13.11, 2.02)),
    sawmillWarehouseWall(4, hitbox_1.RectangleHitbox.fromRect(2.02, 17.43)),
    sawmillWarehouseWall(5, hitbox_1.RectangleHitbox.fromRect(2.02, 11.82)),
    sawmillWarehouseWall(6, hitbox_1.RectangleHitbox.fromRect(2.02, 15.75)),
    sawmillWarehouseWall(7, hitbox_1.RectangleHitbox.fromRect(23.01, 2.02)),
    // SHOOTING RANGE OFFICE
    sawmillWarehouseWall(8, hitbox_1.RectangleHitbox.fromRect(20.64, 2.03)),
    sawmillWarehouseWall(9, hitbox_1.RectangleHitbox.fromRect(8.02, 2.03)),
    warehouseHuntedWall(1, hitbox_1.RectangleHitbox.fromRect(2.01, 12.31)),
    warehouseHuntedWall(2, hitbox_1.RectangleHitbox.fromRect(2.01, 16.78)),
    huntingStandWall(1, hitbox_1.RectangleHitbox.fromRect(10.77, 2)),
    tavernWall(1, hitbox_1.RectangleHitbox.fromRect(39.27, 2.02)),
    tavernWall(2, hitbox_1.RectangleHitbox.fromRect(2.02, 19.8)),
    tavernWall(3, hitbox_1.RectangleHitbox.fromRect(21.83, 2.02)),
    tavernWall(4, hitbox_1.RectangleHitbox.fromRect(2.02, 25.61)),
    tavernWall(5, hitbox_1.RectangleHitbox.fromRect(24.52, 2.02)),
    tavernWall(6, hitbox_1.RectangleHitbox.fromRect(2.02, 5.67)),
    tavernWall(7, hitbox_1.RectangleHitbox.fromRect(13.3, 2.02)),
    tavernWall(8, hitbox_1.RectangleHitbox.fromRect(23.05, 2.02)),
    {
        idString: "fridge",
        name: "Fridge",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hasLoot: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.1, 6.45, (0, vector_1.Vec)(0, -0.2)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "fridge_particle"
        },
        reflectBullets: true
    },
    {
        idString: "water_cooler",
        name: "Cool Water",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 125,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(6, 5, (0, vector_1.Vec)(0, -0.2)), hitbox_1.RectangleHitbox.fromRect(5.7, 0.25, (0, vector_1.Vec)(0, 2.5))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "briefcase_particle"
        }
    },
    {
        idString: "stove",
        name: "Stove",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.1, 6.45, (0, vector_1.Vec)(0, -0.2)),
        rotationMode: constants_1.RotationMode.Limited,
        explosion: "stove_explosion",
        frames: {
            particle: "metal_particle"
        },
        reflectBullets: true
    },
    {
        idString: "small_stove",
        name: "Small Stove",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.9, 6.64, (0, vector_1.Vec)(0, -0.3)),
        rotationMode: constants_1.RotationMode.Limited,
        explosion: "stove_explosion",
        frames: {
            particle: "metal_particle",
            residue: "stove_residue"
        },
        reflectBullets: true
    },
    {
        idString: "pan_stove",
        name: "Pan Stove",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.1, 6.45, (0, vector_1.Vec)(0, -0.2)),
        rotationMode: constants_1.RotationMode.Limited,
        explosion: "stove_explosion",
        frames: {
            particle: "metal_particle",
            residue: "stove_residue"
        },
        reflectBullets: true,
        hasLoot: true
    },
    {
        idString: "small_pan_stove",
        name: "Small Pan Stove",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.9, 6.64, (0, vector_1.Vec)(0, -0.3)),
        rotationMode: constants_1.RotationMode.Limited,
        explosion: "stove_explosion",
        frames: {
            particle: "metal_particle",
            residue: "stove_residue"
        },
        reflectBullets: true,
        hasLoot: true
    },
    {
        idString: "fireplace",
        name: "Fireplace",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 300,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(15.05, 7.71, (0, vector_1.Vec)(0, -0.3)),
        rotationMode: constants_1.RotationMode.Limited,
        explosion: "fireplace_explosion",
        frames: {
            particle: "metal_particle",
            residue: "stove_residue"
        },
        reflectBullets: true
    },
    {
        idString: "fire_pit",
        name: "Fire Pit",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 400,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: new hitbox_1.CircleHitbox(6.35),
        rotationMode: constants_1.RotationMode.Full,
        particleVariations: 2,
        frames: {
            particle: "fire_pit_particle"
        }
    },
    {
        idString: "speaker",
        name: "Speaker",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        health: 160,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        sound: {
            name: "speaker_start",
            maxRange: 30,
            falloff: 0.25
        },
        noResidue: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6, 5, (0, vector_1.Vec)(0, -0.1)),
        rotationMode: constants_1.RotationMode.Limited,
        isActivatable: true,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "metal_particle"
        },
        reflectBullets: true
    },
    {
        idString: "vending_machine",
        name: "Vending Machine",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 165,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hasLoot: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.25, 6.45, (0, vector_1.Vec)(0, -0.2)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "super_barrel_particle"
        },
        reflectBullets: true
    },
    {
        idString: "washing_machine",
        name: "Washing Machine",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hasLoot: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.1, 6.45, (0, vector_1.Vec)(0, -0.2)),
        rotationMode: constants_1.RotationMode.Limited,
        reflectBullets: true
    },
    {
        idString: "door",
        name: "Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.15, 1.6, (0, vector_1.Vec)(-0.44, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        isDoor: true,
        hingeOffset: (0, vector_1.Vec)(-5.5, 0),
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        frames: {
            particle: "furniture_particle"
        }
        // wallAttached: true
    },
    {
        idString: "barn_door",
        name: "Barn Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        doorSound: "barn_door",
        health: 150,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.7, 1.6, (0, vector_1.Vec)(0.85, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        animationDuration: 600,
        isDoor: true,
        hingeOffset: (0, vector_1.Vec)(-5.5, 0),
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "aegis_golden_case",
        name: "Golden Aegis Case",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood", // crate or wood?
        health: 150,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(11, 6, (0, vector_1.Vec)(0, -0.2)), hitbox_1.RectangleHitbox.fromRect(1, 0.4, (0, vector_1.Vec)(-3.6, 3)), hitbox_1.RectangleHitbox.fromRect(1, 0.4, (0, vector_1.Vec)(3.8, 3))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "gold_aegis_case_particle"
        }
    },
    {
        idString: "falchion_case",
        name: "Falchion Case",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 200,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(13, 6)),
        hasLoot: true,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "window_particle"
        }
    },
    {
        idString: "dumpster",
        name: "Dumpster",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        reflectBullets: true,
        hasLoot: true,
        health: 200,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(6.5, 12.5, (0, vector_1.Vec)(0.2, 0)), hitbox_1.RectangleHitbox.fromRect(5.8, 0.8, (0, vector_1.Vec)(0.25, 6.4)), hitbox_1.RectangleHitbox.fromRect(5.8, 0.8, (0, vector_1.Vec)(0.25, -6.4))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        winterVariations: 2
    },
    {
        idString: "trash_bag",
        name: "Trash Bag",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "trash_bag",
        health: 40,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hitbox: new hitbox_1.CircleHitbox(2.2),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        lootTable: "trash",
        frames: {
            particle: "flint_lockbox_particle"
        },
        particleVariations: 2,
        winterVariations: 1
    },
    {
        idString: "hay_bale",
        name: "Hay Bale",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "bush",
        hideOnMap: true,
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(11.91, 10.2),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        particleVariations: 2
    },
    {
        idString: "secret_door",
        name: "Secret Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        noInteractMessage: true,
        health: 120,
        hitbox: hitbox_1.RectangleHitbox.fromRect(11, 1.75, (0, vector_1.Vec)(-0.8, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        isDoor: true,
        hingeOffset: (0, vector_1.Vec)(-5.5, 0),
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "glass_door",
        name: "Glass Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        doorSound: "auto_door",
        health: 100,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.86, 1.13),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        isDoor: true,
        automatic: true,
        hideWhenOpen: true,
        operationStyle: "slide",
        slideFactor: 0.9,
        frames: {
            particle: "window_particle"
        }
    },
    {
        idString: "red_metal_auto_door",
        name: "Red Metal Automatic Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        doorSound: "metal_auto_door",
        locked: true,
        openOnce: true,
        indestructible: true,
        reflectBullets: true,
        health: 100,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.5, 1.62),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        isDoor: true,
        hideWhenOpen: true,
        operationStyle: "slide",
        slideFactor: 0.9,
        animationDuration: 400,
        frames: {
            base: "auto_door"
        },
        tint: 0x401a1a
    },
    {
        idString: "blue_metal_auto_door",
        name: "Blue Metal Automatic Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        doorSound: "metal_auto_door",
        locked: true,
        openOnce: true,
        indestructible: true,
        reflectBullets: true,
        health: 100,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.5, 1.62),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        isDoor: true,
        hideWhenOpen: true,
        operationStyle: "slide",
        slideFactor: 0.9,
        animationDuration: 400,
        frames: {
            base: "auto_door"
        },
        tint: 0x1a1a40
    },
    {
        idString: "pink_metal_auto_door",
        name: "Pink Metal Automatic Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        doorSound: "metal_auto_door",
        indestructible: true,
        reflectBullets: true,
        unlockableWithStage: true,
        openOnce: true,
        health: 100,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.5, 1.62),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        isDoor: true,
        hideWhenOpen: true,
        automatic: true,
        operationStyle: "slide",
        slideFactor: 0.9,
        animationDuration: 400,
        frames: {
            base: "auto_door"
        },
        tint: 0x9540bf
    },
    {
        idString: "metal_auto_door",
        name: "Metal Automatic Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        doorSound: "metal_auto_door",
        health: 100,
        indestructible: true,
        reflectBullets: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.5, 1.62),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        isDoor: true,
        automatic: true,
        hideWhenOpen: true,
        operationStyle: "slide",
        slideFactor: 0.9,
        animationDuration: 400,
        frames: {
            base: "auto_door",
            particle: "metal_auto_door_particle"
        },
        tint: 0x404040
    },
    {
        idString: "metal_door",
        name: "Metal Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        reflectBullets: true,
        doorSound: "metal_door",
        indestructible: true,
        collideWithLayers: 1 /* Layers.Adjacent */,
        //  visibleFromLayers: Layers.All,
        health: 500,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.46, 1.69, (0, vector_1.Vec)(-0.25, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        animationDuration: 80,
        isDoor: true,
        hingeOffset: (0, vector_1.Vec)(-5.5, 0),
        //   zIndex: ZIndexes.ObstaclesLayer3,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "vault_door",
        name: "Vault Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(14.2, 1.9, (0, vector_1.Vec)(1.1, -0.4)),
        rotationMode: constants_1.RotationMode.Limited,
        isDoor: true,
        locked: true,
        openOnce: true,
        doorSound: "vault_door",
        animationDuration: 2000,
        hingeOffset: (0, vector_1.Vec)(-6.1, -0.8),
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "vault_door_deactivated",
        name: "Vault Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(14.2, 1.95, (0, vector_1.Vec)(1.6, -2.9)),
        rotationMode: constants_1.RotationMode.Limited,
        isDoor: true,
        openOnce: true,
        doorSound: "vault_door_powered",
        requiresPower: true,
        animationDuration: 2000,
        interactionDelay: 2500,
        hingeOffset: (0, vector_1.Vec)(-5.6, -2.3),
        frames: {
            particle: "metal_particle",
            powered: "vault_door_activated",
            opened: "vault_door_off"
        }
    },
    {
        idString: "tent_window",
        name: "Tent Window",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        indestructible: true,
        noBulletCollision: true,
        noMeleeCollision: true,
        health: 100,
        isWindow: true,
        invisible: true,
        noHitEffect: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.6, 2.5),
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        frames: {}
    },
    {
        idString: "windowed_vault_door",
        name: "Windowed Vault Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.83, 1.9, (0, vector_1.Vec)(0, -0.4)),
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        allowFlyover: constants_1.FlyoverPref.Never, // LMAO no
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "toilet",
        name: "Toilet",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.CircleHitbox(2.5),
        allowFlyover: constants_1.FlyoverPref.Always,
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true
    },
    {
        idString: "used_toilet",
        name: "Used Toilet",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.CircleHitbox(2.5),
        allowFlyover: constants_1.FlyoverPref.Always,
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        frames: {
            particle: "toilet_particle",
            residue: "toilet_residue"
        }
    },
    {
        idString: "sink",
        name: "Sink",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hideOnMap: true,
        hasLoot: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.5, 6.63, (0, vector_1.Vec)(0, -0.47)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "sink2",
        name: "Sink",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 120,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.32, 5.79, (0, vector_1.Vec)(0, -0.52)),
        allowFlyover: constants_1.FlyoverPref.Always,
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "toilet_particle"
        },
        hideOnMap: true,
        hasLoot: true
    },
    {
        idString: "bathtub",
        name: "Bathtub",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(17.72, 9.29),
        allowFlyover: constants_1.FlyoverPref.Sometimes,
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "toilet_particle"
        },
        hideOnMap: true
    },
    {
        idString: "ducktub",
        name: "Ducktub",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(17.72, 9.29),
        allowFlyover: constants_1.FlyoverPref.Sometimes,
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "toilet_particle"
        },
        hideOnMap: true,
        hasLoot: true
    },
    {
        idString: "small_drawer",
        name: "Small Drawer",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.2, 6, (0, vector_1.Vec)(0, -0.5)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "cabin_fence",
        name: "Cabin Fence",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 80,
        hitbox: hitbox_1.RectangleHitbox.fromRect(21.92, 1.52),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "cabin_wall_particle"
        },
        isWall: true,
        hideOnMap: true,
        noResidue: true,
        zIndex: constants_1.ZIndexes.BuildingsFloor,
        wall: {
            borderColor: 0x342512,
            color: 0x6b5431
        }
    },
    {
        idString: "filing_cabinet",
        name: "Filing Cabinet",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.2, 6, (0, vector_1.Vec)(0, -0.4)),
        rotationMode: constants_1.RotationMode.Limited,
        reflectBullets: true,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true
    },
    {
        idString: "large_drawer",
        name: "Large Drawer",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.5, 6, (0, vector_1.Vec)(0, -0.5)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "couch",
        name: "Couch",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.85, 15.4, (0, vector_1.Vec)(-0.3, 0)),
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "white_small_couch",
        name: "White Small Couch",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 95,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5, 5), hitbox_1.RectangleHitbox.fromRect(2, 7, (0, vector_1.Vec)(-3.5, 0)), hitbox_1.RectangleHitbox.fromRect(2, 7, (0, vector_1.Vec)(3.5, 0)), hitbox_1.RectangleHitbox.fromRect(7, 2, (0, vector_1.Vec)(0, -2.5))),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "white_small_couch_particle"
        }
    },
    {
        idString: "red_small_couch",
        name: "Red Small Couch",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 95,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        tint: 0x823323, // tints are so cool
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5, 5), hitbox_1.RectangleHitbox.fromRect(2, 7, (0, vector_1.Vec)(-3.5, 0)), hitbox_1.RectangleHitbox.fromRect(2, 7, (0, vector_1.Vec)(3.5, 0)), hitbox_1.RectangleHitbox.fromRect(7, 2, (0, vector_1.Vec)(0, -2.5))),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            base: "white_small_couch",
            residue: "white_small_couch_residue",
            particle: "red_small_couch_particle"
        }
    },
    {
        idString: "couch_part",
        name: "Couch Part",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 95,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5, 5), hitbox_1.RectangleHitbox.fromRect(1.5, 6, (0, vector_1.Vec)(-2.5, 0)), new hitbox_1.CircleHitbox(2.5, (0, vector_1.Vec)(0.9, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "couch_part_particle",
            residue: "brown_couch_part_residue"
        }
    },
    {
        idString: "couch_corner",
        name: "Couch Corner",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 95,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5, 5, (0, vector_1.Vec)(0.6, 0.6)), hitbox_1.RectangleHitbox.fromRect(1.5, 5, (0, vector_1.Vec)(-2.5, 0.6)), hitbox_1.RectangleHitbox.fromRect(5, 1.5, (0, vector_1.Vec)(0.6, -2.5)), new hitbox_1.CircleHitbox(0.8, (0, vector_1.Vec)(-2.4, -2.4))),
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        frames: {
            particle: "couch_part_particle",
            residue: "brown_couch_part_residue"
        }
    },
    {
        idString: "couch_end_right",
        name: "Couch Part",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 95,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5, 5, (0, vector_1.Vec)(-1, 0)), hitbox_1.RectangleHitbox.fromRect(6.8, 1.5, (0, vector_1.Vec)(-0.25, -2.6)), hitbox_1.RectangleHitbox.fromRect(1.5, 4.5, (0, vector_1.Vec)(2.6, -0.5)), new hitbox_1.CircleHitbox(0.85, (0, vector_1.Vec)(2.6, -2.6)), new hitbox_1.CircleHitbox(0.85, (0, vector_1.Vec)(2.6, 2.65)), new hitbox_1.CircleHitbox(2.635, (0, vector_1.Vec)(-1, 0.25))),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "couch_part_particle",
            residue: "brown_couch_part_residue"
        }
    },
    {
        idString: "couch_end_left",
        name: "Couch Part",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 95,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5, 5, (0, vector_1.Vec)(0, -1)), hitbox_1.RectangleHitbox.fromRect(1.5, 6.8, (0, vector_1.Vec)(-2.6, -0.5)), hitbox_1.RectangleHitbox.fromRect(4.5, 1.5, (0, vector_1.Vec)(0, 2.6)), new hitbox_1.CircleHitbox(0.85, (0, vector_1.Vec)(2.6, 2.6)), new hitbox_1.CircleHitbox(0.85, (0, vector_1.Vec)(-2.6, 2.65)), new hitbox_1.CircleHitbox(2.65, (0, vector_1.Vec)(0.25, -0.5))),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "couch_part_particle",
            residue: "brown_couch_part_residue"
        }
    },
    {
        idString: "tv",
        name: "TV",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(1.1, 15.1, (0, vector_1.Vec)(-0.25, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        wallAttached: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3 + 0.5 // needs to be above table
    },
    {
        idString: "small_table",
        name: "Small Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        variations: 2,
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.3, 12.3),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "furniture_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        noCollisions: true,
        noResidue: true
    },
    {
        idString: "small_table_papers",
        name: "Small Table with Papers",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.3, 12.3),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "furniture_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        noCollisions: true,
        noResidue: true
    },
    {
        idString: "large_table",
        name: "Large Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        variations: 2,
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12, 16.6),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "furniture_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        noCollisions: true,
        noResidue: true
    },
    {
        idString: "round_table",
        name: "Round Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: new hitbox_1.CircleHitbox(6.12),
        rotationMode: constants_1.RotationMode.Full,
        frames: {
            particle: "furniture_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        noCollisions: true,
        noResidue: true
    },
    {
        idString: "chair",
        name: "Chair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.8, 6.7),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "bookshelf",
        name: "Bookshelf",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hideOnMap: true,
        variations: 2,
        allowFlyover: constants_1.FlyoverPref.Always,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.49, 4.24),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        frames: {
            particle: "furniture_particle"
        }
    },
    {
        idString: "window_damaged",
        name: "Window",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 20,
        invisible: true,
        noMeleeCollision: true,
        noBulletCollision: true,
        indestructible: true,
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(1.8, 9.4),
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        allowFlyover: constants_1.FlyoverPref.Always,
        rotationMode: constants_1.RotationMode.Limited,
        isWindow: true
    },
    {
        idString: "window",
        name: "Window",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 20,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(1.8, 10),
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        allowFlyover: constants_1.FlyoverPref.Never,
        rotationMode: constants_1.RotationMode.Limited,
        isWindow: true
    },
    {
        idString: "window2",
        name: "Window",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 20,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(1.8, 9.4),
        allowFlyover: constants_1.FlyoverPref.Never,
        rotationMode: constants_1.RotationMode.Limited,
        isWindow: true
    },
    {
        idString: "bulletproof_window",
        name: "Bulletproof Window",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 1000,
        hitbox: hitbox_1.RectangleHitbox.fromRect(18.57, 2.45),
        allowFlyover: constants_1.FlyoverPref.Never,
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "window_particle"
        }
    },
    {
        idString: "bed",
        name: "Bed",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(11.2, 16),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always
    },
    {
        idString: "small_bed",
        name: "Small Bed",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.12, 16.06),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "bed_particle"
        }
    },
    {
        idString: "bunk_bed",
        name: "Bunk Bed",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.2, 15.6, (0, vector_1.Vec)(0.4, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "porta_potty_toilet_open",
        name: "Porta Potty Toilet Open",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.13, 4.3, (0, vector_1.Vec)(0.02, -1.05)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "porta_potty_toilet_particle",
            residue: "porta_potty_toilet_residue"
        }
    },
    {
        idString: "porta_potty_toilet_closed",
        name: "Porta Potty Toilet Closed",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12, 4.3, (0, vector_1.Vec)(0, -1.05)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        frames: {
            particle: "porta_potty_toilet_particle",
            residue: "porta_potty_toilet_residue"
        }
    },
    {
        idString: "door2",
        name: "Porta Potty Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        noResidue: true,
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.5, 1.4, (0, vector_1.Vec)(-0.8, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        isDoor: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        hingeOffset: (0, vector_1.Vec)(-5.5, 0)
    },
    {
        idString: "outhouse_door",
        name: "Outhouse Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        noResidue: true,
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.91, 1.5),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        isDoor: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        hingeOffset: (0, vector_1.Vec)(-4.96, 0),
        frames: {
            particle: "outhouse_wall_particle"
        }
    },
    {
        idString: "porta_potty_sink_wall",
        name: "Porta Potty Sink Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        noResidue: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(19.2, 1.9, (0, vector_1.Vec)(0, 1.25)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        isWall: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        frames: {
            particle: "porta_potty_wall_particle"
        }
    },
    {
        idString: "porta_potty_sink_wall_fall",
        name: "Porta Potty Sink Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        noResidue: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(19.2, 1.9, (0, vector_1.Vec)(0, 1.25)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        isWall: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        frames: {
            base: "porta_potty_sink_wall",
            particle: "porta_potty_particle_fall"
        }
    },
    {
        idString: "outhouse_toilet_paper_wall",
        name: "Outhouse Toilet Paper Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        noResidue: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(1.81, 19.2, (0, vector_1.Vec)(-1.16, 0.01)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        isWall: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        frames: {
            particle: "outhouse_wall_particle"
        }
    },
    {
        idString: "porta_potty_toilet_paper_wall",
        name: "Porta Potty Toilet Paper Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        noResidue: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(19.2, 1.7, (0, vector_1.Vec)(0, -1.15)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        isWall: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        frames: {
            particle: "porta_potty_wall_particle"
        }
    },
    {
        idString: "hq_toilet_paper_wall",
        name: "Headquarters Toilet Paper Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        noResidue: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(19.2, 1.7, (0, vector_1.Vec)(0, -1.15)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        isWall: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        frames: {
            particle: "hq_tp_wall_particle"
        }
    },
    innerConcreteWall(1, hitbox_1.RectangleHitbox.fromRect(10.8, 1.9)),
    innerConcreteWall(2, hitbox_1.RectangleHitbox.fromRect(36.7, 1.9)),
    innerConcreteWall(3, hitbox_1.RectangleHitbox.fromRect(39.14, 1.9)),
    innerConcreteWall(4, hitbox_1.RectangleHitbox.fromRect(47.14, 1.9)),
    {
        idString: "bombed_armory_vault_wall",
        name: "Bombed Armory Vault Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        hitbox: hitbox_1.RectangleHitbox.fromRect(15, 2.04),
        health: 500,
        noResidue: true,
        hideOnMap: true,
        impenetrable: true,
        rotationMode: constants_1.RotationMode.Limited,
        isWall: true,
        allowFlyover: constants_1.FlyoverPref.Never,
        particleVariations: 2,
        frames: {
            particle: "rock_particle"
        }
        /* wall: {
            color: 0x606060,
            borderColor: 0x262626
        } */
    },
    {
        idString: "large_warehouse_wall", // todo: make this wall only damageable by big white barrel explosion
        name: "Large Warehouse Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(55.19, 2.02, (0, vector_1.Vec)(0.35, -12.47)), hitbox_1.RectangleHitbox.fromRect(2, 27, (0, vector_1.Vec)(-26.95, -0.02))),
        graphics: [
            {
                color: 0x1a1a1a,
                hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(55.19, 2, (0, vector_1.Vec)(0.35, -12.52)), hitbox_1.RectangleHitbox.fromRect(2, 27, (0, vector_1.Vec)(-26.95, -0.02)))
            },
            {
                color: 0x4d4d4d,
                hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(55.15, 1.155, (0, vector_1.Vec)(0.35, -12.51)), hitbox_1.RectangleHitbox.fromRect(1.155, 26.56, (0, vector_1.Vec)(-26.95, 0.2)))
            }
        ],
        graphicsZIndex: constants_1.ZIndexes.ObstaclesLayer1,
        health: 9999,
        hideOnMap: true,
        reflectBullets: true,
        rotationMode: constants_1.RotationMode.Limited,
        isWall: true,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            base: "column",
            particle: "metal_particle",
            residue: "large_warehouse_ceiling_residue"
        }
    },
    {
        idString: "small_refinery_barrel",
        name: "Small Refinery Barrel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 250,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(6.8),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Never,
        explosion: "small_refinery_barrel_explosion",
        reflectBullets: true,
        frames: {
            particle: "metal_particle",
            residue: "barrel_residue"
        }
    },
    {
        idString: "large_refinery_barrel",
        name: "Large Refinery Barrel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 2000,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(17.15),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Never,
        explosion: "large_refinery_barrel_explosion",
        reflectBullets: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        frames: {
            particle: "metal_particle"
        },
        winterVariations: 1
    },
    {
        idString: "smokestack",
        name: "Smokestack",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 500,
        indestructible: true,
        hitbox: new hitbox_1.CircleHitbox(8.9),
        rotationMode: constants_1.RotationMode.Limited,
        reflectBullets: true,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        noResidue: true
    },
    {
        idString: "distillation_column",
        name: "Distillation Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 500,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(new hitbox_1.CircleHitbox(5.22, (0, vector_1.Vec)(0, -0.65)), new hitbox_1.CircleHitbox(4.9, (0, vector_1.Vec)(0, 0.9))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        reflectBullets: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        noResidue: true
    },
    {
        idString: "distillation_equipment",
        name: "Distillation Equipment",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 500,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(new hitbox_1.CircleHitbox(3, (0, vector_1.Vec)(-11.3, -3.85)), // Main tank rounded corners
        new hitbox_1.CircleHitbox(3, (0, vector_1.Vec)(-11.3, -6.55)), hitbox_1.RectangleHitbox.fromRect(17.5, 3.5, (0, vector_1.Vec)(-5.55, -5.25)), hitbox_1.RectangleHitbox.fromRect(14.2, 8.5, (0, vector_1.Vec)(-3.9, -5.15)), // Main tank
        new hitbox_1.CircleHitbox(3.15, (0, vector_1.Vec)(0.72, 5.62)), // Bottom left circle
        new hitbox_1.CircleHitbox(4.4, (0, vector_1.Vec)(8.95, 5.62)), // Bottom right circle
        new hitbox_1.CircleHitbox(5.35, (0, vector_1.Vec)(8.95, -4.7)), // Top circle
        hitbox_1.RectangleHitbox.fromRect(1.8, 3.7, (0, vector_1.Vec)(0.65, 0.85)), // Pipe connected to bottom left circle
        hitbox_1.RectangleHitbox.fromRect(2.6, 1.2, (0, vector_1.Vec)(8.95, 1)), // Pipe between 2 rightmost circles
        hitbox_1.RectangleHitbox.fromRect(1.6, 1.75, (0, vector_1.Vec)(4.2, 5.53)), // Pipe between 2 bottommost circles
        hitbox_1.RectangleHitbox.fromRect(1.9, -2.6, (0, vector_1.Vec)(4.05, -6.65)) // Pipe connected to topmost circle
        ),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        reflectBullets: true,
        noResidue: true,
        frames: {
            particle: "metal_particle"
        }
    },
    gunMount("mcx_spear", "gun"),
    gunMount("stoner_63", "gun"),
    gunMount("mini14", "gun"),
    gunMount("hp18", "gun"),
    gunMount("model_37", "gun"),
    gunMount("sks", "gun"),
    gunMount("m590m", "gun"),
    gunMount("svu", "gun"),
    gunMount("ak47", "gun"),
    gunMount("an94", "gun"),
    gunMount("rpk74", "gun"),
    gunMount("fn_fal", "gun"),
    gunMount("maul", "melee", false, new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5.05, 1, (0, vector_1.Vec)(0, -1.3)), hitbox_1.RectangleHitbox.fromRect(0.8, 3, (0, vector_1.Vec)(-1.55, 0.35)), hitbox_1.RectangleHitbox.fromRect(0.8, 3, (0, vector_1.Vec)(1.55, 0.35))), {
        base: "gun_mount_melee",
        particle: "furniture_particle",
        residue: "gun_mount_residue"
    }),
    gunMount("hatchet", "melee", false, new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5.05, 1, (0, vector_1.Vec)(0, -1.3)), hitbox_1.RectangleHitbox.fromRect(0.8, 3, (0, vector_1.Vec)(-1.55, 0.35)), hitbox_1.RectangleHitbox.fromRect(0.8, 3, (0, vector_1.Vec)(1.55, 0.35))), {
        base: "gun_mount_melee",
        particle: "furniture_particle",
        residue: "gun_mount_residue"
    }),
    gunMount("dual_rsh12", "gun", true, new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(6.5, 0.99, (0, vector_1.Vec)(0, -1.36)), hitbox_1.RectangleHitbox.fromRect(5.7, 2.5, (0, vector_1.Vec)(0, 0.4))), {
        particle: "gun_mount_dual_rsh12_particle",
        residue: "gun_mount_dual_rsh12_residue"
    }),
    {
        idString: "truck",
        name: "Truck",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(20.25, 2.15, (0, vector_1.Vec)(0, 25.1)), // Front bumper
        hitbox_1.RectangleHitbox.fromRect(18.96, 9.2, (0, vector_1.Vec)(0, 19.4)), // Hood
        hitbox_1.RectangleHitbox.fromRect(16.7, 23.5, (0, vector_1.Vec)(0, 3)), // Cab
        hitbox_1.RectangleHitbox.fromRect(4.75, 15.9, (0, vector_1.Vec)(0, -16.65)), // Fifth wheel
        hitbox_1.RectangleHitbox.fromRect(17, 6.9, (0, vector_1.Vec)(0, -13.2)), // Front-most back wheels
        hitbox_1.RectangleHitbox.fromRect(17, 6.9, (0, vector_1.Vec)(0, -20.7)), // Rearmost back wheels
        hitbox_1.RectangleHitbox.fromRect(16.55, 1.6, (0, vector_1.Vec)(0, -25.35)) // Rear bumper
        ),
        reflectBullets: true,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "truck_front",
        name: "Truck",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(13.25, 12.3, (0, vector_1.Vec)(0, 0)), hitbox_1.RectangleHitbox.fromRect(16.8, 4.85, (0, vector_1.Vec)(0, -6.85)), new hitbox_1.CircleHitbox(0.39, (0, vector_1.Vec)(-5.25, -10.5)), new hitbox_1.CircleHitbox(1.13, (0, vector_1.Vec)(6.24, -9.63)), hitbox_1.RectangleHitbox.fromRect(10.27, 3.9, (0, vector_1.Vec)(0.03, -9.09)), new hitbox_1.CircleHitbox(1.13, (0, vector_1.Vec)(-6.27, -9.63)), new hitbox_1.CircleHitbox(0.39, (0, vector_1.Vec)(5.34, -10.46))),
        reflectBullets: true,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.BuildingsFloor - 1,
        variations: 3,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "trailer",
        name: "Trailer",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(14.9, 44.7, (0, vector_1.Vec)(-0.05, 0)), // Body
        hitbox_1.RectangleHitbox.fromRect(15.9, 6.4, (0, vector_1.Vec)(0, -11.2)), // Front-most back wheels
        hitbox_1.RectangleHitbox.fromRect(15.9, 6.4, (0, vector_1.Vec)(0, -18.2)), // Rearmost back wheels
        hitbox_1.RectangleHitbox.fromRect(15.5, 1.5, (0, vector_1.Vec)(0, -22.5)), // Rear bumper
        hitbox_1.RectangleHitbox.fromRect(9.75, 1, (0, vector_1.Vec)(-0.05, 22.75)) // Front part (idk)
        ),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        zIndex: constants_1.ZIndexes.ObstaclesLayer4,
        noResidue: true,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "tango_crate",
        name: "Tango Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(15.49, 5.85),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true
    },
    {
        ...controlPanel("control_panel", "Control Panel"),
        isActivatable: true,
        sound: {
            names: ["button_press", "puzzle_solved"]
        },
        frames: {
            activated: "control_panel_activated",
            particle: "metal_particle",
            residue: "barrel_residue"
        }
    },
    {
        ...controlPanel("control_panel2", "Control Panel"),
        waterOverlay: {
            scaleX: 1.2,
            scaleY: 0.85
        }
    },
    {
        ...controlPanel("recorder", "Recorder"),
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.7, 6.34),
        indestructible: true,
        isActivatable: true,
        noInteractMessage: true,
        requiredItem: "heap_sword", // womp womp
        sound: {
            names: ["speaker_start", "speaker_start"]
        },
        frames: {
            activated: "recorder_used",
            particle: "metal_particle",
            residue: "barrel_residue"
        }
    },
    {
        ...controlPanel("recorder_interactable", "Recorder"),
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.7, 6.34),
        indestructible: true,
        isActivatable: true,
        sound: {
            names: ["speaker_start", "speaker_start"]
        },
        frames: {
            base: "recorder",
            activated: "recorder_used",
            particle: "metal_particle",
            residue: "barrel_residue"
        }
    },
    {
        ...controlPanel("control_panel_small", "Small Control Panel"),
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.5, 8)
    },
    {
        ...controlPanel("bear_bunker_recorder", "Bear Bunker Recorder"),
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.7, 6.34),
        indestructible: true,
        isActivatable: true,
        interactObstacleIdString: "recorder_interactable",
        sound: {
            name: "bear_bunker_recording",
            maxRange: 80,
            falloff: 0.5,
            dynamic: true
        },
        frames: {
            base: "recorder",
            activated: "recorder_used",
            particle: "metal_particle",
            residue: "barrel_residue"
        }
    },
    {
        idString: "small_desk",
        name: "Small Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.79
        },
        noResidue: true, // TODO
        health: 150,
        hasLoot: true,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "desk_particle"
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.5, 5)
    },
    {
        idString: "generator",
        name: "Generator",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 200,
        indestructible: true,
        reflectBullets: true,
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "super_barrel_particle"
        },
        isActivatable: true,
        sound: {
            name: "generator_starting",
            maxRange: 412,
            falloff: 2
        },
        emitParticles: true,
        requiredItem: "gas_can",
        hitbox: hitbox_1.RectangleHitbox.fromRect(9, 7),
        winterVariations: 1
    },
    {
        idString: "ship_oil_tank",
        name: "Ship Oil Tank",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 200,
        indestructible: true,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        hitbox: hitbox_1.RectangleHitbox.fromRect(28, 14)
    },
    {
        idString: "forklift",
        name: "Forklift",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(8.15, 17.3, (0, vector_1.Vec)(0, -3.8)), hitbox_1.RectangleHitbox.fromRect(9.45, 10.6, (0, vector_1.Vec)(0, -4.9))),
        zIndex: constants_1.ZIndexes.Decals - 0.1,
        rotationMode: constants_1.RotationMode.Limited,
        winterVariations: 1
    },
    {
        idString: "pallet",
        name: "Pallet",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.1, 9),
        zIndex: constants_1.ZIndexes.Decals,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "crate_particle",
            residue: "regular_crate_residue"
        },
        noCollisions: true,
        noMeleeCollision: true,
        noBulletCollision: true
    },
    {
        idString: "pipe",
        name: "Pipe",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        health: 200,
        indestructible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(0, 0),
        zIndex: constants_1.ZIndexes.ObstaclesLayer4,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noBulletCollision: true,
        noMeleeCollision: true,
        noCollisions: true,
        variations: 4
    },
    {
        idString: "bollard",
        name: "Bollard",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(8.2, 9.2, (0, vector_1.Vec)(-0.36, 0)), new hitbox_1.CircleHitbox(3.45, (0, vector_1.Vec)(1, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        winterVariations: 2
    },
    {
        idString: "barrier",
        name: "Barrier",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1.2, 31.75, (0, vector_1.Vec)(-2.2, -2.8)), hitbox_1.RectangleHitbox.fromRect(2, 5, (0, vector_1.Vec)(-2.3, 15.4)), hitbox_1.RectangleHitbox.fromRect(4.71, 6.59, (0, vector_1.Vec)(0.95, 15.4))),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "fence",
        name: "Fence",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "fence",
        health: 40,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.45, 1.6),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        frames: {
            particle: "fence_particle"
        }
    },
    {
        idString: "port_main_office_column",
        name: "Port Main Office Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        health: 340,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0xb98a46,
        frames: {
            base: "column",
            particle: "port_office_wall_particle"
        },
        isWall: true
    },
    {
        idString: "house_column",
        name: "House Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        health: 340,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0xa3917b,
        frames: {
            base: "column",
            particle: "wall_particle"
        },
        isWall: true
    },
    {
        idString: "cabin_column",
        name: "Cabin Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        health: 340,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x5d4622,
        frames: {
            base: "column",
            particle: "cabin_wall_particle"
        },
        isWall: true
    },
    {
        idString: "metal_column",
        name: "Metal Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        reflectBullets: true,
        indestructible: true,
        health: 340,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x8f8f8f,
        zIndex: constants_1.ZIndexes.ObstaclesLayer1 + 0.1,
        frames: {
            base: "column",
            particle: "metal_column_particle"
        },
        isWall: true
    },
    {
        idString: "sawmill_warehouse_column",
        name: "sawmill Warehouse Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        health: 340,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x764423,
        frames: {
            base: "column",
            particle: "sawmill_warehouse_wall_particle"
        },
        isWall: true
    },
    {
        idString: "sawmill_center_warehouse_column",
        name: "Sawmill Center Warehouse Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        particleVariations: 2,
        health: 340,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x5a1919,
        frames: {
            base: "column",
            particle: "sawmill_warehouse_particle"
        },
        isWall: true
    },
    {
        idString: "sawmill_storage_column",
        name: "sawmill Storage Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        particleVariations: 2,
        health: 340,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x5a1919,
        frames: {
            base: "column",
            particle: "hq_stone_wall_particle"
        },
        isWall: true
    },
    {
        idString: "warehouse_hunted_column",
        name: "Abandoned Warehouse Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        health: 340,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x6e4f32,
        frames: {
            base: "column",
            particle: "warehouse_hunted_particle"
        },
        isWall: true
    },
    {
        idString: "hunting_stand_column",
        name: "Hunting Stand Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        health: 340,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x764423,
        frames: {
            base: "column",
            particle: "hunting_stand_particle"
        },
        isWall: true
    },
    {
        idString: "tavern_column",
        name: "Tavern Column",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        indestructible: true,
        health: 340,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3, 3)),
        rotationMode: constants_1.RotationMode.None,
        allowFlyover: constants_1.FlyoverPref.Never,
        tint: 0x5a4320,
        frames: {
            base: "column",
            particle: "cabin_wall_particle"
        },
        isWall: true
    },
    {
        idString: "potted_plant",
        name: "Potted Plant",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.CircleHitbox(2.45, (0, vector_1.Vec)(-0.15, 0.9)),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true
    },
    {
        idString: "poinsettia",
        name: "Poinsettia",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: new hitbox_1.CircleHitbox(1.9),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        hasLoot: true,
        lootTable: "potted_plant",
        frames: {
            particle: "potted_plant_particle"
        }
    },
    {
        idString: "trash_can",
        name: "Trash Can",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 60,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hasLoot: true,
        lootTable: "trash",
        reflectBullets: true,
        hitbox: new hitbox_1.CircleHitbox(2.5),
        rotationMode: constants_1.RotationMode.Full,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "sandbags",
        name: "Sandbags",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "sand",
        health: 1000,
        indestructible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(13.1, 7.7),
        rotationMode: constants_1.RotationMode.Limited,
        winterVariations: 1,
        waterOverlay: {
            scaleX: 1.4,
            scaleY: 0.8
        }
    },
    {
        idString: "smaller_sandbags",
        name: "Sandbags",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "sand",
        health: 1000,
        indestructible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8, 5.9),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "sandbags_particle"
        }
        // winterVariations: 1
    },
    {
        idString: "gun_locker",
        name: "Gun Locker",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        health: 220,
        impenetrable: true,
        hasLoot: true,
        reflectBullets: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(13.1, 4.2, (0, vector_1.Vec)(0, -0.25)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        hideOnMap: true,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "roadblock",
        name: "Road Block",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "fence",
        health: 80,
        indestructible: false,
        hitbox: hitbox_1.RectangleHitbox.fromRect(1, 10),
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "gun_case",
        name: "Gun Case",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.19, 4.76),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        winterVariations: 3
    },
    {
        idString: "cooler",
        name: "Cooler",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.3, 4.73),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true,
        winterVariations: 1
    },
    {
        idString: "m1117",
        name: "M1117",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(18.51, 32.28, (0, vector_1.Vec)(0, -5.17)), // Body
        hitbox_1.RectangleHitbox.fromRect(19.69, 6.67, (0, vector_1.Vec)(0, -10.87)), // Back wheels
        hitbox_1.RectangleHitbox.fromRect(19.69, 6.67, (0, vector_1.Vec)(0, 10.8)), // Front wheels
        hitbox_1.RectangleHitbox.fromRect(17, 5.38, (0, vector_1.Vec)(0, 16.14)), // Back of hood
        hitbox_1.RectangleHitbox.fromRect(15.06, 5.38, (0, vector_1.Vec)(0, 19.7)) // Front of hood
        ),
        variations: 2,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never
    },
    {
        idString: "cabinet",
        name: "Cabinet",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 100,
        reflectBullets: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(14.53, 4.3, (0, vector_1.Vec)(0, -0.22)),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "metal_particle"
        },
        hasLoot: true
    },
    {
        idString: "briefcase",
        name: "Briefcase",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 150,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.65, 7.42, (0, vector_1.Vec)(0, 0.43)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true
    },
    {
        idString: "fire_hatchet_case",
        name: "Fire Hatchet Case",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hasLoot: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(10.5, 4.5, (0, vector_1.Vec)(-0.1, -0.1)), hitbox_1.RectangleHitbox.fromRect(0.55, 5.95, (0, vector_1.Vec)(-4.15, 0)), hitbox_1.RectangleHitbox.fromRect(0.55, 5.95, (0, vector_1.Vec)(3.15, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "super_barrel_particle"
        },
        reflectBullets: true,
        winterVariations: 1
    },
    {
        idString: "ice_pick_case",
        name: "Ice Pick Case",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hasLoot: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(10.5, 4.5, (0, vector_1.Vec)(-0.1, -0.1)), hitbox_1.RectangleHitbox.fromRect(0.55, 5.95, (0, vector_1.Vec)(-3.7, 0)), hitbox_1.RectangleHitbox.fromRect(0.55, 5.95, (0, vector_1.Vec)(3.7, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "crate_particle"
        }
    },
    {
        idString: "campsite_case",
        name: "Campsite Case",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hasLoot: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(10.5, 4.5, (0, vector_1.Vec)(-0.1, -0.1)), hitbox_1.RectangleHitbox.fromRect(0.55, 5.95, (0, vector_1.Vec)(-3.7, 0)), hitbox_1.RectangleHitbox.fromRect(0.55, 5.95, (0, vector_1.Vec)(3.7, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "crate_particle"
        }
    },
    {
        idString: "button",
        name: "Button",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 1000,
        indestructible: true,
        variations: 2,
        isActivatable: true,
        sound: {
            name: "button_press"
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(2.15, 1.51),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        frames: {
            particle: "metal_particle",
            activated: "button_activated"
        }
    },
    mobileHomeWall("1", hitbox_1.RectangleHitbox.fromRect(7.5, 1.68)),
    mobileHomeWall("2", hitbox_1.RectangleHitbox.fromRect(20.6, 1.68)),
    mobileHomeWall("3", hitbox_1.RectangleHitbox.fromRect(20.5, 1.68)),
    mobileHomeWall("4", hitbox_1.RectangleHitbox.fromRect(10.65, 1.68)),
    kitchenUnit("1", hitbox_1.RectangleHitbox.fromRect(6.61, 6.61, (0, vector_1.Vec)(0, -0.45))),
    kitchenUnit("2", hitbox_1.RectangleHitbox.fromRect(6.61, 6.61)),
    kitchenUnit("3", hitbox_1.RectangleHitbox.fromRect(9.45, 6.61, (0, vector_1.Vec)(0, -0.48)), "sink_residue"),
    {
        idString: "tire",
        name: "Tire",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 200,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(3.47, 8.35),
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor - 1,
        noResidue: true,
        frames: {
            particle: "flint_lockbox_particle"
        },
        particleVariations: 2,
        winterVariations: 2
    },
    {
        idString: "truck_tire",
        name: "Truck Tire",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 200,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1, 5.31, (0, vector_1.Vec)(0, 0)), hitbox_1.RectangleHitbox.fromRect(2.18, 4.28, (0, vector_1.Vec)(-0.01, 0.01)), new hitbox_1.CircleHitbox(0.51, (0, vector_1.Vec)(0.57, 2.14)), new hitbox_1.CircleHitbox(0.51, (0, vector_1.Vec)(-0.57, -2.14)), new hitbox_1.CircleHitbox(0.51, (0, vector_1.Vec)(-0.57, 2.14)), new hitbox_1.CircleHitbox(0.51, (0, vector_1.Vec)(0.57, -2.13))),
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor - 0.25,
        noResidue: true,
        frames: {
            particle: "flint_lockbox_particle"
        },
        particleVariations: 2
    },
    {
        idString: "mobile_home_window",
        name: "Mobile Home Window",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 20,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hideOnMap: true,
        noCollisionAfterDestroyed: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(13.8, 1.5),
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        allowFlyover: constants_1.FlyoverPref.Never,
        rotationMode: constants_1.RotationMode.Limited,
        isWindow: true,
        frames: {
            particle: "window_particle"
        }
    },
    {
        idString: "lux_crate",
        name: "Lux Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(15.49, 5.85),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hasLoot: true
    },
    {
        idString: "tugboat_control_panel",
        name: "Tugboat Control Panel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 250,
        reflectBullets: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(26.3, 8.02, (0, vector_1.Vec)(0, 0.5)),
        rotationMode: constants_1.RotationMode.Limited,
        explosion: "control_panel_explosion",
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "office_chair",
        name: "Office Chair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(4.5, 5.3, (0, vector_1.Vec)(0, -0.14)),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "office_chair_particle"
        }
    },
    {
        idString: "grey_office_chair",
        name: "Office Chair (Grey Edition)",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 155,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(5, 5.1),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "grey_office_chair_particle"
        }
    },
    {
        idString: "life_preserver",
        name: "Life Preserver",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 80,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(3.2, 8.87, (0, vector_1.Vec)(-0.4, 0)),
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "grenade_box",
        name: "Grenade Box",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "cardboard",
        health: 40,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(4.4, 4.4),
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2,
        hasLoot: true,
        frames: {
            particle: "box_particle",
            residue: "box_residue"
        },
        winterVariations: 2
    },
    {
        idString: "lily_pad",
        name: "Lily Pad",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "bush",
        health: 80,
        scale: {
            spawnMin: 1.1,
            spawnMax: 1.4, // fall mode only, original 0.9, 1.1, 0.8
            destroy: 1
        },
        hitbox: new hitbox_1.CircleHitbox(4.2),
        noCollisions: true,
        rotationMode: constants_1.RotationMode.Full,
        spawnMode: constants_1.MapObjectSpawnMode.River,
        variations: 2,
        zIndex: constants_1.ZIndexes.ObstaclesLayer3
    },
    {
        idString: "planted_bushes",
        name: "Planted Bushes",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 800,
        indestructible: true,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.5, 16.5),
        rotationMode: constants_1.RotationMode.Limited,
        spawnMode: constants_1.MapObjectSpawnMode.River,
        noResidue: true
    },
    {
        idString: "viking_chest",
        name: "Viking Chest",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 150,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(12, 7, (0, vector_1.Vec)(0, -0.4)),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true,
        hideOnMap: true,
        frames: {
            particle: "chest_particle",
            residue: "chest_residue"
        },
        spawnMode: constants_1.MapObjectSpawnMode.Beach,
        allowFlyover: constants_1.FlyoverPref.Always
    },
    {
        idString: "river_chest",
        name: "River Chest",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 150,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(12, 7),
        spawnHitbox: hitbox_1.RectangleHitbox.fromRect(14, 9),
        rotationMode: constants_1.RotationMode.None,
        zIndex: constants_1.ZIndexes.DownedPlayers - 1,
        hasLoot: true,
        hideOnMap: true,
        frames: {
            particle: "chest_particle"
        },
        spawnMode: constants_1.MapObjectSpawnMode.River,
        allowFlyover: constants_1.FlyoverPref.Always
    },
    {
        idString: "cargo_ship_stair_entrance_walls",
        name: "Cargo Ship Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 69,
        indestructible: true,
        reflectBullets: true,
        collideWithLayers: 2 /* Layers.Equal */,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(15.27, 2.72, (0, vector_1.Vec)(0.01, -7.24)), hitbox_1.RectangleHitbox.fromRect(2.36, 15.71, (0, vector_1.Vec)(-6.45, 0.71)), hitbox_1.RectangleHitbox.fromRect(2.36, 16.68, (0, vector_1.Vec)(6.46, 0.19))),
        frames: {
            base: "cargo_ship_stair_entrance",
            particle: "cargo_ship_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "cargo_ship_stair",
        name: "Cargo Ship Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 69,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(23.99, 1.01, (0, vector_1.Vec)(1.34, 5.45)), hitbox_1.RectangleHitbox.fromRect(23.99, 1.01, (0, vector_1.Vec)(1.6, -5.47)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(13.01, 5.45)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(-2.7, -5.48)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(5.16, -5.46)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(13, -5.48)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(-10.57, -5.48)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(-10.57, 5.45)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(-2.7, 5.45)), new hitbox_1.CircleHitbox(0.91, (0, vector_1.Vec)(5.15, 5.45))),
        frames: {
            particle: "metal_particle"
        },
        hideOnMap: false,
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "bunker_entrance",
        name: "Bunker Entrance",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        reflectBullets: true,
        indestructible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(13, 16.9),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "hunted_bunker_entrance",
        name: "Hunted Bunker Entrance",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        reflectBullets: true,
        indestructible: true,
        collideWithLayers: 2 /* Layers.Equal */,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1.67, 12.32, (0, vector_1.Vec)(4.59, 0.16)), hitbox_1.RectangleHitbox.fromRect(1.67, 12.32, (0, vector_1.Vec)(-4.59, 0.16)), hitbox_1.RectangleHitbox.fromRect(10.85, 1.86, (0, vector_1.Vec)(0, -5.38))),
        frames: {
            particle: "bunker_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never
    },
    {
        idString: "bunker_stair",
        name: "Bunker Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        isStair: true,
        activeEdges: {
            high: 2,
            low: 0
        },
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10, 11.5),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "blue_stair_collider",
        name: "Blue Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        isStair: true,
        activeEdges: {
            high: 2,
            low: 0
        },
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.17, 9.78),
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "cargo_ship_bottom_stair",
        name: "Cargo Ship Bottom Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        isStair: true,
        activeEdges: {
            high: 3,
            low: 1
        },
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(13, 11.27),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "cargo_ship_top_stair",
        name: "Cargo Ship Top Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        isStair: true,
        activeEdges: {
            high: 3,
            low: 1
        },
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10, 10),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "blue_house_stair_walls",
        name: "Blue House Stair Walls",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(13, 4),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "blue_house_stair",
        name: "Blue House Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        isStair: true,
        activeEdges: {
            high: 1,
            low: 3
        },
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9, 10),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "ship_thing_v2",
        name: "the snack that smiles back",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 42069,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(5.24, 21.1, (0, vector_1.Vec)(0, 0.2)), new hitbox_1.CircleHitbox(2.55, (0, vector_1.Vec)(0, 10.7)), new hitbox_1.CircleHitbox(3.37, (0, vector_1.Vec)(-0.02, -9.91)), hitbox_1.RectangleHitbox.fromRect(6.87, 3.96, (0, vector_1.Vec)(-0.01, -7.98))),
        frames: {
            particle: "cargo_ship_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "ship_oil_source",
        name: "Ship Oil Source",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 69,
        indestructible: true,
        reflectBullets: true,
        allowFlyover: constants_1.FlyoverPref.Never,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(7.7, 19.43, (0, vector_1.Vec)(-6.47, 0)), hitbox_1.RectangleHitbox.fromRect(2.38, 15.56, (0, vector_1.Vec)(9.13, -0.3))),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsCeiling
    },
    {
        idString: "cargo_ship_stair_support",
        name: "cargo ship stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        indestructible: true,
        collideWithLayers: 0 /* Layers.All */,
        health: 69,
        reflectBullets: true,
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(17.22, 2.09),
        frames: {
            particle: "cargo_ship_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "memorial_bunker_stair",
        name: "Memorial Bunker Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        isStair: true,
        activeEdges: {
            high: 2,
            low: 0
        },
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(11, 12),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "hq_stair",
        name: "HQ Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        isStair: true,
        activeEdges: {
            high: 0,
            low: 1
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.8, 24),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "barn_stair",
        name: "Barn Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        isStair: true,
        activeEdges: {
            high: 0,
            low: 2
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(6.5, 4),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "hq_large_stair",
        name: "HQ Large Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        isStair: true,
        activeEdges: {
            high: 2,
            low: 0
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(11.55, 25.5),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "lodge_stair",
        name: "Lodge Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        isStair: true,
        activeEdges: {
            high: 0,
            low: 3
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(11.72, 8.8),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "plumpkin_bunker_stair",
        name: "Plumpkin Bunker Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        isStair: true,
        activeEdges: {
            high: 1,
            low: 3
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(16.07, 11.3),
        frames: {
            // base: "plumpkin_bunker_entrance_floor",
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
        // zIndex: 9999
    },
    {
        idString: "fulcrum_bunker_stair",
        name: "Flooded Bunker Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        isStair: true,
        activeEdges: {
            high: 0,
            low: 2
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.5, 10.68),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "hunted_bunker_stair",
        name: "Hunted Bunker Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        isStair: true,
        activeEdges: {
            high: 0,
            low: 2
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.5, 7),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "fulcrum_bunker_collider_hack",
        name: "Fulcrum Bunker Collider Hack",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(10.68, 0.68, (0, vector_1.Vec)(-30.19, -32.02)), hitbox_1.RectangleHitbox.fromRect(10.68, 0.68, (0, vector_1.Vec)(-9.82, 38.92))),
        reflectBullets: true,
        frames: {
            particle: "bunker_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        collideWithLayers: 2 /* Layers.Equal */
    },
    {
        idString: "hunted_bunker_collider_hack",
        name: "Hunted Mode Bunker Collider Hack",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(1.67, 12.32),
        reflectBullets: true,
        frames: {
            particle: "bunker_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        collideWithLayers: 2 /* Layers.Equal */
    },
    {
        idString: "tavern_basement_collider_hack",
        name: "Tavern Basement Collider Hack",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(2.06, 19.23, (0, vector_1.Vec)(4.33, 49.24)), hitbox_1.RectangleHitbox.fromRect(2.06, 19.23, (0, vector_1.Vec)(-10.2, 49.25))),
        reflectBullets: true,
        frames: {
            particle: "bunker_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        collideWithLayers: 2 /* Layers.Equal */
    },
    {
        idString: "fire_exit_railing",
        name: "Fire exit railing",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1.4, 41, (0, vector_1.Vec)(5.18, 1)), hitbox_1.RectangleHitbox.fromRect(11.6, 1.4, (0, vector_1.Vec)(-0.3, 21.5)), new hitbox_1.CircleHitbox(0.95, (0, vector_1.Vec)(5.18, -19.3)), new hitbox_1.CircleHitbox(0.95, (0, vector_1.Vec)(5.18, 6.6)), new hitbox_1.CircleHitbox(0.95, (0, vector_1.Vec)(5.18, 21.5)), new hitbox_1.CircleHitbox(0.95, (0, vector_1.Vec)(-6.18, 21.5))),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.ObstaclesLayer1
    },
    {
        idString: "hq_second_floor_collider_hack",
        name: "HQ Second Floor Collider Hack",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(84.9, 1.75, (0, vector_1.Vec)(-28.9, -105.9)), hitbox_1.RectangleHitbox.fromRect(1.75, 40.8, (0, vector_1.Vec)(-33.35, -85.5)), hitbox_1.RectangleHitbox.fromRect(1.75, 44.5, (0, vector_1.Vec)(-70.3, -84.4))),
        health: 1000,
        indestructible: true,
        invisible: true,
        frames: {
            particle: "hq_stone_wall_particle"
        },
        particleVariations: 2,
        visibleFromLayers: 0 /* Layers.All */,
        collideWithLayers: 0 /* Layers.All */,
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "hq_second_floor_collider_hack_2",
        name: "HQ Second Floor Collider Hack 2",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        hitbox: hitbox_1.RectangleHitbox.fromRect(13, 17.7, (0, vector_1.Vec)(-52, -85.5)),
        health: 1000,
        indestructible: true,
        invisible: true,
        noHitEffect: true,
        particleVariations: 2,
        visibleFromLayers: 0 /* Layers.All */,
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "lodge_railing",
        name: "Lodge Railing",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(12.04, 1.28, (0, vector_1.Vec)(-32.61, 20.51)), hitbox_1.RectangleHitbox.fromRect(1.24, 12.93, (0, vector_1.Vec)(-38.53, 14.66))),
        collideWithLayers: 2 /* Layers.Equal */,
        health: 1000,
        indestructible: true,
        invisible: true,
        visibleFromLayers: 0 /* Layers.All */,
        frames: {
            particle: "lodge_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    // --------------------------------------------------------------------------------------------
    // Headquarters.
    // --------------------------------------------------------------------------------------------
    {
        idString: "headquarters_bottom_entrance",
        name: "Headquarters Bottom Entrance",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 1000,
        hideOnMap: true,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(
        // left
        hitbox_1.RectangleHitbox.fromRect(0.25, 12.5, (0, vector_1.Vec)(-40.9, 43)), new hitbox_1.CircleHitbox(0.5, (0, vector_1.Vec)(-41.1, 50.15)), new hitbox_1.CircleHitbox(0.5, (0, vector_1.Vec)(-41.1, 36.75)), 
        // right
        hitbox_1.RectangleHitbox.fromRect(0.25, 12.5, (0, vector_1.Vec)(-20.86, 43.1)), new hitbox_1.CircleHitbox(0.5, (0, vector_1.Vec)(-20.95, 50.15)), new hitbox_1.CircleHitbox(0.5, (0, vector_1.Vec)(-20.95, 36.9))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        invisible: true,
        particleVariations: 2,
        frames: {
            particle: "rock_particle"
        }
    },
    {
        idString: "barn_stair_walls",
        name: "Barn Stair Walls",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        hideOnMap: true,
        indestructible: true,
        collideWithLayers: 1 /* Layers.Adjacent */,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1, 9, (0, vector_1.Vec)(-45, 0.5)), hitbox_1.RectangleHitbox.fromRect(1, 9, (0, vector_1.Vec)(-52.8, 0.5)), hitbox_1.RectangleHitbox.fromRect(9, 1, (0, vector_1.Vec)(9.1, -31.1)), hitbox_1.RectangleHitbox.fromRect(9, 1, (0, vector_1.Vec)(9.1, -39))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        invisible: true,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "barn_stair_walls_top_floor",
        name: "Barn Stair Walls",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        hideOnMap: true,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1, 8, (0, vector_1.Vec)(-45, 0)), hitbox_1.RectangleHitbox.fromRect(1, 8, (0, vector_1.Vec)(-52.8, 0)), hitbox_1.RectangleHitbox.fromRect(8, 1, (0, vector_1.Vec)(9.5, -31.1)), hitbox_1.RectangleHitbox.fromRect(8, 1, (0, vector_1.Vec)(9.5, -39))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        invisible: true,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "barn_stair_walls_2",
        name: "Barn Stair Walls",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        hideOnMap: true,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(8, 1.5, (0, vector_1.Vec)(-48.5, 4.25)), hitbox_1.RectangleHitbox.fromRect(1.5, 8, (0, vector_1.Vec)(5.25, -35))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never, // todo
        invisible: true,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "lighthouse_stairs",
        name: "Lighthouse Stairs",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 10000,
        hideOnMap: true,
        reflectBullets: true,
        noResidue: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1.18, 4.25, (0, vector_1.Vec)(-3.83, 0)), hitbox_1.RectangleHitbox.fromRect(1.18, 4.25, (0, vector_1.Vec)(3.83, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "headquarters_main_desk",
        name: "Headquarters Main Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 120,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hideOnMap: true,
        invisible: true,
        noResidue: true,
        rotationMode: constants_1.RotationMode.Limited,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(23.6, 5, (0, vector_1.Vec)(0, 3)), hitbox_1.RectangleHitbox.fromRect(4.6, 8, (0, vector_1.Vec)(9.5, -1.5)), hitbox_1.RectangleHitbox.fromRect(4.6, 8, (0, vector_1.Vec)(-9.5, -1.5))),
        frames: {
            particle: "hq_stone_wall_particle"
        },
        particleVariations: 2
    },
    {
        idString: "headquarters_boss_desk",
        name: "Headquarters Boss Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        health: 120,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hideOnMap: true,
        invisible: true,
        noResidue: true,
        rotationMode: constants_1.RotationMode.Limited,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(20, 6.3, (0, vector_1.Vec)(0, 0)), hitbox_1.RectangleHitbox.fromRect(11, 7, (0, vector_1.Vec)(0, -0.5))),
        frames: {
            particle: "hq_stone_wall_particle"
        },
        particleVariations: 2
    },
    {
        idString: "headquarters_cafeteria_table",
        name: "Headquarters Cafeteria Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        noBulletCollision: true,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hideOnMap: true,
        invisible: true,
        noResidue: true,
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        hitbox: hitbox_1.RectangleHitbox.fromRect(22.8, 5),
        frames: {
            particle: "headquarters_c_desk_particle"
        }
    },
    {
        idString: "headquarters_security_desk",
        name: "Headquarters Security Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        hideOnMap: true,
        noResidue: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(27.5, 5.2),
        rotationMode: constants_1.RotationMode.Limited,
        isActivatable: true,
        allowFlyover: constants_1.FlyoverPref.Always,
        replaceWith: {
            idString: "headquarters_security_desk_activated",
            delay: 0
        },
        sound: {
            names: ["button_press", "puzzle_solved"]
        },
        frames: {
            particle: "desk_particle"
        }
    },
    {
        idString: "headquarters_security_desk_activated",
        name: "Headquarters Security Panel (active)",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 120,
        indestructible: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(27.5, 5.2),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "desk_particle"
        }
    },
    {
        idString: "headquarters_wood_obstacles",
        name: "Headquarters Wood Obstacles",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        hideOnMap: true,
        indestructible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(27.5, 5, (0, vector_1.Vec)(-56.3, 31)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        invisible: true,
        frames: {
            particle: "desk_particle"
        }
    },
    {
        idString: "headquarters_wood_table_second_floor",
        name: "Headquarters Wood Obstacles",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        hideOnMap: true,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(3.05, 21.5), hitbox_1.RectangleHitbox.fromRect(13.4, 4.25, (0, vector_1.Vec)(-5, -8.8))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        invisible: true,
        frames: {
            particle: "desk_particle"
        }
    },
    {
        idString: "headquarters_sinks",
        name: "Headquarters Sinks",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "porcelain",
        health: 1000,
        hideOnMap: true,
        indestructible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(34, 6, (0, vector_1.Vec)(-7.4, -103.5))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        invisible: true,
        frames: {
            particle: "toilet_particle"
        }
    },
    {
        idString: "pole",
        name: "Pole",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "fence",
        health: 50,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.5
        },
        noResidue: true,
        isWall: true,
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        hitbox: new hitbox_1.CircleHitbox(1.1),
        rotationMode: constants_1.RotationMode.None,
        frames: {
            particle: "metal_particle"
        }
    },
    rshCase("rsh_case_single"),
    rshCase("rsh_case_dual"),
    {
        idString: "memorial_crate",
        name: "Aged Memorial Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        hasLoot: true,
        health: 140,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.None,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        frames: {
            particle: "memorial_crate_particle"
        }
    },
    {
        idString: "silo",
        name: "Silo",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        hitbox: new hitbox_1.GroupHitbox(new hitbox_1.CircleHitbox(17.07, (0, vector_1.Vec)(-2.03, 0)), new hitbox_1.CircleHitbox(3.26, (0, vector_1.Vec)(-13.43, -11.4)), new hitbox_1.CircleHitbox(3.26, (0, vector_1.Vec)(-13.43, 11.4)), new hitbox_1.CircleHitbox(3.26, (0, vector_1.Vec)(9.36, -11.4)), new hitbox_1.CircleHitbox(3.26, (0, vector_1.Vec)(9.36, 11.4)), hitbox_1.RectangleHitbox.fromRect(5.48, 11.65, (0, vector_1.Vec)(16.35, 0))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never,
        explosion: "silo_explosion",
        reflectBullets: true,
        zIndex: constants_1.ZIndexes.ObstaclesLayer5,
        frames: {
            particle: "metal_particle",
            residue: "large_refinery_barrel_residue"
        }
        // winterVariations: 1
    },
    {
        idString: "buoy",
        name: "Buoy",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 69,
        indestructible: true,
        reflectBullets: true,
        hitbox: new hitbox_1.CircleHitbox(7.27),
        frames: {
            particle: "buoy_particle"
        },
        rotationMode: constants_1.RotationMode.Full,
        spawnWithWaterOverlay: true,
        waterOverlay: {
            scaleX: 2.4,
            scaleY: 2.4
        },
        allowFlyover: constants_1.FlyoverPref.Always
        // spawnMode: MapObjectSpawnMode.Beach // todo: ocean spawn mode
    },
    {
        idString: "large_logs_pile",
        name: "Large Logs Pile",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 250,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(17.54, 8.22),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true,
        frames: {
            particle: "log_particle"
        }
    },
    {
        idString: "small_logs_pile",
        name: "Small Logs Pile",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 230,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.6, 8.21),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true,
        frames: {
            particle: "log_particle"
        }
    },
    {
        idString: "campsite_crate",
        name: "Campsite Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 65,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.Binary,
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.96, 7.96),
        hasLoot: true,
        frames: {
            particle: "crate_particle",
            residue: "regular_crate_residue"
        }
    },
    {
        idString: "special_table_helmet",
        name: "Small Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.3, 12.3),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "furniture_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        noCollisions: true,
        noResidue: true,
        hasLoot: true
    },
    {
        idString: "special_table_vest",
        name: "Small Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.3, 12.3),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "furniture_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        noCollisions: true,
        noResidue: true,
        hasLoot: true
    },
    {
        idString: "special_table_pack",
        name: "Small Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.9
        },
        hideOnMap: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.3, 12.3),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "furniture_particle"
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3,
        noCollisions: true,
        noResidue: true,
        hasLoot: true
    },
    {
        idString: "small_lamp_thingy",
        name: "Small Lamp",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 35,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.95
        },
        zIndex: constants_1.ZIndexes.ObstaclesLayer3 + 0.6,
        hitbox: new hitbox_1.CircleHitbox(1.9),
        noResidue: true,
        rotationMode: constants_1.RotationMode.Full,
        glow: {
            tint: 0xe7deb1,
            scale: 0.38,
            alpha: 0.8,
            zIndex: constants_1.ZIndexes.ObstaclesLayer3 + 0.1,
            scaleAnim: {
                to: 0.395,
                duration: 150
            }
        }
    },
    {
        idString: "log",
        name: "Wood Log",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        variations: 2,
        health: 200,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(23.16, 2.98),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true,
        frames: {
            particle: "log_particle"
        }
    },
    {
        idString: "large_logs_pile_2",
        name: "Large Logs Pile",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        variations: 2,
        material: "tree",
        health: 250,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(17.54, 8.22),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true,
        frames: {
            particle: "log_particle"
        }
    },
    {
        idString: "small_logs_pile_2",
        name: "Small Logs Pile",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        variations: 2,
        health: 230,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.6, 8.21),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true,
        frames: {
            particle: "log_particle"
        }
    },
    {
        idString: "small_moldy_logs",
        name: "Small Moldy Logs",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 110,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: new hitbox_1.GroupHitbox(new hitbox_1.CircleHitbox(1.5, (0, vector_1.Vec)(0.94, 1.36)), new hitbox_1.CircleHitbox(1.21, (0, vector_1.Vec)(-2.65, -1.14)), new hitbox_1.CircleHitbox(1.21, (0, vector_1.Vec)(2.62, 1.85)), new hitbox_1.CircleHitbox(1.21, (0, vector_1.Vec)(1.15, 2.72)), new hitbox_1.CircleHitbox(1.21, (0, vector_1.Vec)(-1.38, -2.66)), new hitbox_1.CircleHitbox(1.45, (0, vector_1.Vec)(-0.7, -0.41)), new hitbox_1.CircleHitbox(1.18, (0, vector_1.Vec)(0.14, 0.47)), new hitbox_1.CircleHitbox(0.88, (0, vector_1.Vec)(-1.87, -0.39)), new hitbox_1.CircleHitbox(0.88, (0, vector_1.Vec)(-0.61, -1.62))),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true,
        frames: {
            particle: "log_particle"
        }
    },
    {
        idString: "abandoned_warehouse_metal_collider",
        name: "Abandoned Warehouse Metal Collider",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(1.15, 68.3, (0, vector_1.Vec)(37.87, -5.4)), new hitbox_1.CircleHitbox(1.5, (0, vector_1.Vec)(38.05, 46.12)), new hitbox_1.CircleHitbox(1.5, (0, vector_1.Vec)(18.27, -40.56)), new hitbox_1.CircleHitbox(1.5, (0, vector_1.Vec)(37.88, -40.32)), new hitbox_1.CircleHitbox(1.5, (0, vector_1.Vec)(37.87, -20.32)), new hitbox_1.CircleHitbox(1.5, (0, vector_1.Vec)(37.88, 6.23)), new hitbox_1.CircleHitbox(1.5, (0, vector_1.Vec)(37.87, 29.21))),
        reflectBullets: true,
        frames: {
            particle: "abandoned_warehouse_col_particle"
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "sawmill_center_warehouse_table_collider",
        name: "Sawmill Center Warehouse Table Collider",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.24, 74.46, (0, vector_1.Vec)(-7.99, -10.4)),
        frames: {
            particle: "desk_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always
    },
    {
        idString: "solid_crate",
        name: "Solid Regular Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "crate",
        health: 850,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.Binary,
        hitbox: hitbox_1.RectangleHitbox.fromRect(9.2, 9.2),
        hasLoot: true,
        hardness: 5,
        impenetrable: true,
        frames: {
            particle: "solid_crate_particle"
        }
    },
    {
        idString: "saw",
        name: "Saw",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_light",
        animationFrames: ["saw_1", "saw_1", "saw_2"],
        health: 1000,
        damage: 15,
        isActivatable: true,
        indestructible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(3, 18), // RectangleHitbox.fromRect(1.99, 16.71),
        reflectBullets: true,
        frames: {
            particle: "metal_particle",
            base: "saw_1"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.ObstaclesLayer2
    },
    {
        idString: "tavern_bar_collider",
        name: "Tavern Bar Collider",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(19.2, 10.25, (0, vector_1.Vec)(8.12, -9.77)), hitbox_1.RectangleHitbox.fromRect(10.05, 31.91, (0, vector_1.Vec)(3.6, 10.61))),
        frames: {
            particle: "tavern_bar_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always
    },
    {
        idString: "tavern_table_collider",
        name: "Tavern Table Collider",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(38.21, 9.91, (0, vector_1.Vec)(-5.81, -58.96)),
        frames: {
            particle: "tavern_bar_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always
    },
    {
        idString: "tavern_bottle_table",
        name: "Tavern Bottle Table",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        indestructible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(16.02, 5.3),
        frames: {
            particle: "tavern_bar_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        damage: 0, // to remove interact message
        doorSound: "monument_slide",
        isDoor: true,
        openOnce: true,
        locked: true,
        operationStyle: "slide",
        slideFactor: 1.11,
        animationDuration: 6000
    },
    {
        idString: "wine_barrel",
        name: "Wine Barrel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 161,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(3.75),
        rotationMode: constants_1.RotationMode.Full,
        noResidue: true,
        frames: {
            particle: "wine_barrel_particle"
        }
    },
    {
        idString: "bar_seat",
        name: "Seat",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "fence",
        health: 180,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.6
        },
        hitbox: new hitbox_1.CircleHitbox(3.02),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "wine_barrel_particle",
            residue: "chair_residue"
        }
    },
    {
        idString: "tavern_basement_table_colliders",
        name: "Tavern Basement Table Colliders",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        indestructible: true,
        invisible: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(38.22, 10.83, (0, vector_1.Vec)(3.17, 10.5)), hitbox_1.RectangleHitbox.fromRect(20.53, 10.87, (0, vector_1.Vec)(34.15, -15.81))),
        frames: {
            particle: "tavern_bar_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always
    },
    {
        idString: "bulletproof_automatic_glass_door",
        name: "Bullet-proof Automatic Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        doorSound: "metal_auto_door",
        locked: true,
        openOnce: true,
        indestructible: true,
        health: 100,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10.87, 1.6),
        rotationMode: constants_1.RotationMode.Limited,
        isDoor: true,
        hideWhenOpen: true,
        operationStyle: "slide",
        slideFactor: 0.9,
        animationDuration: 400,
        frames: {
            particle: "window_particle"
        }
    },
    {
        idString: "rare_wine_case",
        name: "Rare Wine Case",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "glass",
        health: 200,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.43, 8.2),
        rotationMode: constants_1.RotationMode.Limited,
        noResidue: true,
        frames: {
            particle: "window_particle"
        }
    },
    {
        idString: "tavern_stair",
        name: "Tavern Stair",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        isStair: true,
        activeEdges: {
            high: 2,
            low: 0
        },
        invisible: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(12.47, 12),
        frames: {
            particle: "metal_particle"
        },
        rotationMode: constants_1.RotationMode.Limited,
        zIndex: constants_1.ZIndexes.BuildingsFloor
    },
    {
        idString: "special_wine_barrel",
        name: "Wine Barrel",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 161,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        hitbox: new hitbox_1.CircleHitbox(3.6),
        rotationMode: constants_1.RotationMode.Full,
        explosion: "barrel_explosion",
        frames: {
            particle: "wine_barrel_particle",
            residue: "explosion_decal"
        }
    },
    {
        idString: "nsd_rock",
        name: "NSD Rock",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "stone",
        hideOnMap: true,
        health: 250,
        scale: {
            spawnMin: 0.9,
            spawnMax: 1.1,
            destroy: 0.3
        },
        hitbox: new hitbox_1.CircleHitbox(4),
        spawnHitbox: new hitbox_1.CircleHitbox(4.5),
        particleVariations: 2,
        rotationMode: constants_1.RotationMode.Full,
        hasLoot: true,
        frames: {
            particle: "rock_particle",
            residue: "rock_residue"
        }
    },
    {
        idString: "reinforced_crate",
        name: "Reinforced NSD Crate",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        reflectBullets: true,
        health: 200,
        hardness: 5,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.5
        },
        spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand,
        rotationMode: constants_1.RotationMode.None,
        hitbox: hitbox_1.RectangleHitbox.fromRect(10, 10),
        hasLoot: true,
        noResidue: true, // todo; residue
        impenetrable: true,
        frames: {
            particle: "reinforced_crate_particle"
        }
    },
    {
        idString: "tavern_recorder",
        name: "Tavern Recorder",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 1000,
        indestructible: true,
        noCollisions: true,
        noBulletCollision: true,
        noMeleeCollision: true,
        isActivatable: true,
        interactObstacleIdString: "recorder_interactable",
        hitbox: new hitbox_1.CircleHitbox(4),
        frames: {
            activated: "tavern_recorder_activated",
            particle: "tavern_bar_particle"
        },
        sound: {
            name: "tavern_recording",
            maxRange: 80,
            falloff: 0.5,
            dynamic: true
        },
        rotationMode: constants_1.RotationMode.Limited
    },
    {
        idString: "humvee",
        name: "Humvee",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        rotationMode: constants_1.RotationMode.Limited,
        health: 100,
        indestructible: true,
        reflectBullets: true,
        material: "metal_heavy",
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(39.36, 19.32, (0, vector_1.Vec)(-0.68, 0.02)), new hitbox_1.CircleHitbox(2.02, (0, vector_1.Vec)(18.39, 7.71)), new hitbox_1.CircleHitbox(2.02, (0, vector_1.Vec)(18.39, -7.69)), hitbox_1.RectangleHitbox.fromRect(2.87, 15.29, (0, vector_1.Vec)(18.96, 0.03)), hitbox_1.RectangleHitbox.fromRect(8.31, 20.63, (0, vector_1.Vec)(15.6, 0.01)), hitbox_1.RectangleHitbox.fromRect(8.31, 20.63, (0, vector_1.Vec)(-13.96, 0)), hitbox_1.RectangleHitbox.fromRect(1.19, 23.26, (0, vector_1.Vec)(8.62, 0)))
    },
    {
        idString: "lansirama_log",
        name: "Lansirama Log",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 250,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(25.58, 7.46),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true
    },
    {
        idString: "small_lansirama_log",
        name: "Small Lansirama Log",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 150,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        frames: {
            particle: "lansirama_log_particle"
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(15.82, 6.5),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true
    },
    {
        idString: "toolbox",
        name: "Toolbox",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "iron",
        health: 150,
        reflectBullets: true,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(18.93, 6.44, (0, vector_1.Vec)(-0.01, -0.38)),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true
    },
    {
        idString: "garage_door",
        name: "Garage Door",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "appliance",
        health: 300,
        noResidue: true,
        reflectBullets: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(21.76, 1.51, (0, vector_1.Vec)(0, -0.42)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never
    },
    {
        idString: "research_desk",
        name: "Research Desk",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.8
        },
        hitbox: hitbox_1.RectangleHitbox.fromRect(24.12, 6.61),
        rotationMode: constants_1.RotationMode.Limited,
        hasLoot: true
    },
    {
        idString: "abandoned_bunker_entrance",
        name: "Abandoned Bunker Entrance",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 100,
        indestructible: true,
        noResidue: true,
        reflectBullets: true,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(14.61, 13.15, (0, vector_1.Vec)(0, -2.19)), hitbox_1.RectangleHitbox.fromRect(1.94, 4.93, (0, vector_1.Vec)(6.33, 6.34)), hitbox_1.RectangleHitbox.fromRect(1.94, 4.93, (0, vector_1.Vec)(-6.33, 6.34))),
        rotationMode: constants_1.RotationMode.Limited,
        frames: {
            particle: "metal_particle"
        }
    },
    {
        idString: "nsd_wall",
        name: "NSD Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "wood",
        health: 170,
        hideOnMap: true,
        isWall: true,
        noResidue: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(8.96, 2),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Never
    },
    {
        idString: "shooting_range_practice_log",
        name: "Shooting Range Practice Log",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "tree",
        health: 300,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.7
        },
        frames: {
            particle: "lansirama_log_particle"
        },
        zIndex: constants_1.ZIndexes.Players + 0.1,
        hitbox: hitbox_1.RectangleHitbox.fromRect(7.48, 33.36, (0, vector_1.Vec)(-0.67, 0.01)),
        rotationMode: constants_1.RotationMode.Limited,
        allowFlyover: constants_1.FlyoverPref.Always,
        noResidue: true,
        hasLoot: true
    },
    {
        idString: "dummy",
        name: "Dummy",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        hitbox: new hitbox_1.CircleHitbox(constants_1.GameConstants.player.radius),
        rotationMode: constants_1.RotationMode.Limited,
        material: "trash_bag",
        health: 100,
        scale: {
            spawnMin: 1,
            spawnMax: 1,
            destroy: 0.75
        }
    },
    {
        idString: "server_interactor",
        name: "Server",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 1000,
        indestructible: true,
        noCollisions: true,
        noBulletCollision: true,
        noMeleeCollision: true,
        isActivatable: true,
        hideOnMap: true,
        interactObstacleIdString: "server",
        hitbox: new hitbox_1.CircleHitbox(3),
        rotationMode: constants_1.RotationMode.Limited,
        invisible: true,
        sound: {
            name: "button_press"
        }
    },
    {
        idString: "shooting_range_server_colliders",
        name: "Server",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        material: "metal_heavy",
        health: 100,
        invisible: true,
        indestructible: true,
        reflectBullets: true,
        hideOnMap: true,
        rotationMode: constants_1.RotationMode.Limited,
        hitbox: new hitbox_1.GroupHitbox(hitbox_1.RectangleHitbox.fromRect(8.56, 23.45, (0, vector_1.Vec)(31.06, -18.23)), hitbox_1.RectangleHitbox.fromRect(27.15, 8.52, (0, vector_1.Vec)(21.8, 11.95))),
        frames: {
            particle: "bunker_particle"
        }
    },
    {
        idString: "pickup_truck",
        name: "Big Ol' Chuck",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        rotationMode: constants_1.RotationMode.Limited,
        health: 100,
        indestructible: true,
        reflectBullets: true,
        material: "metal_heavy",
        hitbox: hitbox_1.RectangleHitbox.fromRect(34.6, 14.23)
        // chuck will make sure to go vroom vroom on u if u dare to touch his definition
    },
    {
        idString: "hollow_log_wall",
        name: "Hollow Log Wall",
        defType: objectDefinitions_1.DefinitionType.Obstacle,
        particleVariations: 2,
        material: "tree",
        health: 200,
        hideOnMap: true,
        isWall: true,
        noResidue: true,
        hitbox: hitbox_1.RectangleHitbox.fromRect(1.7, 19.66),
        rotationMode: constants_1.RotationMode.Limited
    }
].flatMap((def) => {
    if (def.variations !== undefined)
        def.variationBits = Math.ceil(Math.log2(def.variations));
    if (def.allowFlyover === undefined)
        def.allowFlyover = constants_1.FlyoverPref.Sometimes;
    if (def.visibleFromLayers === undefined)
        def.visibleFromLayers = 1 /* Layers.Adjacent */;
    const winterVariations = def.winterVariations;
    return winterVariations
        ? [
            def,
            {
                ...def,
                idString: `${def.idString}_winter`,
                variations: winterVariations === 1 ? undefined : winterVariations,
                winterVariations: undefined
            }
        ]
        : def;
}));
//# sourceMappingURL=obstacles.js.map