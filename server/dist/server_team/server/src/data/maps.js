"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maps = void 0;
const constants_1 = require("../../../../common/src/constants");
const buildings_1 = require("../../../../common/src/definitions/buildings");
const armors_1 = require("../../../../common/src/definitions/items/armors");
const backpacks_1 = require("../../../../common/src/definitions/items/backpacks");
const guns_1 = require("../../../../common/src/definitions/items/guns");
const loots_1 = require("../../../../common/src/definitions/loots");
const obstacles_1 = require("../../../../common/src/definitions/obstacles");
const packet_1 = require("../../../../common/src/packets/packet");
const hitbox_1 = require("../../../../common/src/utils/hitbox");
const math_1 = require("../../../../common/src/utils/math");
const objectDefinitions_1 = require("../../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../../common/src/utils/random");
const vector_1 = require("../../../../common/src/utils/vector");
const map_1 = require("../map");
const pluginManager_1 = require("../pluginManager");
const lootHelpers_1 = require("../utils/lootHelpers");
const maps = {
    normal: {
        width: 1632,
        height: 1632,
        oceanSize: 128,
        beachSize: 32,
        rivers: {
            minAmount: 1,
            maxAmount: 2,
            maxWideAmount: 1,
            wideChance: 0.35,
            minWidth: 12,
            maxWidth: 18,
            minWideWidth: 25,
            maxWideWidth: 30,
            obstacles: {
                river_rock: 16,
                lily_pad: 6
            }
        },
        majorBuildings: [
            "port",
            "headquarters",
            "armory",
            "refinery"
        ],
        buildings: {
            large_bridge: 2,
            small_bridge: Infinity,
            river_hut_1: 2,
            river_hut_2: 2,
            river_hut_3: 2,
            lighthouse: 1,
            tugboat_red: 1,
            tugboat_white: 5,
            fulcrum_bunker: 1,
            small_bunker: 1,
            warehouse: 5,
            green_house: 3,
            blue_house: 2,
            blue_house_special: 1,
            red_house: 3,
            red_house_v2: 3,
            construction_site: 1,
            mobile_home: 10,
            porta_potty: 12,
            container_3: 2,
            container_4: 2,
            container_5: 2,
            container_6: 2,
            container_7: 1,
            container_8: 2,
            container_9: 1,
            container_10: 2,
            memorial: 1,
            buoy: 12
        },
        quadBuildingLimit: {
            port: 1,
            river_hut_1: 1,
            river_hut_2: 1,
            river_hut_3: 1,
            red_house: 1,
            red_house_v2: 1,
            warehouse: 2,
            green_house: 1,
            blue_house: 1,
            mobile_home: 3,
            porta_potty: 3,
            construction_site: 1,
            blue_house_special: 1
        },
        obstacles: {
            oil_tank: 12,
            oak_tree: 110,
            birch_tree: 20,
            pine_tree: 10,
            loot_tree: 1,
            regular_crate: 100,
            flint_crate: 5,
            aegis_crate: 5,
            grenade_crate: 35,
            rock: 150,
            river_chest: 1,
            bush: 110,
            // birthday_cake: 100, // birthday mode
            blueberry_bush: 30,
            barrel: 80,
            viking_chest: 1,
            super_barrel: 30,
            melee_crate: 1,
            gold_rock: 1,
            loot_barrel: 1,
            flint_lockbox: 1
        },
        obstacleClumps: [
            {
                clumpAmount: 100,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["oak_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 25,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["birch_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 4,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["pine_tree"],
                    radius: 12
                }
            }
        ],
        loots: {
            ground_loot: 60
        },
        places: [
            { name: "Banana", position: (0, vector_1.Vec)(0.23, 0.2) },
            { name: "Takedown", position: (0, vector_1.Vec)(0.23, 0.8) },
            { name: "Lavlandet", position: (0, vector_1.Vec)(0.75, 0.2) },
            { name: "Noskin Narrows", position: (0, vector_1.Vec)(0.72, 0.8) },
            { name: "Mt. Sanger", position: (0, vector_1.Vec)(0.5, 0.35) },
            { name: "Deepwood", position: (0, vector_1.Vec)(0.5, 0.65) }
        ]
    },
    fall: {
        width: 1924,
        height: 1924,
        oceanSize: 128,
        beachSize: 32,
        rivers: {
            minAmount: 2,
            maxAmount: 2,
            wideChance: 0.35,
            minWidth: 12,
            maxWidth: 18,
            minWideWidth: 25,
            maxWideWidth: 28,
            maxWideAmount: 1,
            obstacles: {
                river_rock: 16,
                lily_pad: 6
            }
        },
        trails: {
            minAmount: 2,
            maxAmount: 3,
            wideChance: 0.2,
            minWidth: 2,
            maxWidth: 4,
            minWideWidth: 3,
            maxWideWidth: 5,
            maxWideAmount: 1,
            obstacles: {
                pebble: 300
            }
        },
        clearings: {
            minWidth: 200,
            minHeight: 150,
            maxWidth: 250,
            maxHeight: 200,
            count: 2,
            allowedObstacles: ["clearing_boulder", "flint_crate", "rock", "vibrant_bush", "river_chest", "lily_pad", "grenade_crate", "oak_leaf_pile", "river_rock", "melee_crate", "flint_lockbox"],
            obstacles: [
                { idString: "clearing_boulder", min: 3, max: 6 },
                { idString: "flint_crate", min: 0, max: 2 },
                { idString: "grenade_crate", min: 0, max: 2 },
                { idString: "melee_crate", min: 0, max: 1 },
                { idString: "flint_lockbox", min: 0, max: 1 }
            ]
        },
        majorBuildings: [
            "lodge",
            "campsite",
            "bombed_armory"
        ],
        buildings: {
            plumpkin_bunker: 1,
            breached_dam: 3,
            river_hut_4: 3,
            river_hut_5: 3,
            river_hut_6: 3,
            small_bridge: Infinity,
            barn: 3,
            lighthouse: 1,
            tugboat_red: 1,
            tugboat_white: 7,
            warehouse: 4,
            green_house: 2,
            red_house: 2,
            red_house_v2: 2,
            tent_big_1: 2,
            tent_big_2: 2,
            tent_big_3: 2,
            tent_big_4: 2,
            hay_shed_1: 1,
            hay_shed_2: 3,
            hay_shed_3: 3,
            tent_1: 3,
            tent_2: 3,
            tent_3: 3,
            tent_4: 3,
            tent_5: 1,
            outhouse: 10,
            buoy: 16
        },
        quadBuildingLimit: {
            river_hut_4: 2,
            river_hut_5: 2,
            river_hut_6: 2,
            barn: 1,
            outhouse: 3,
            red_house: 1,
            green_house: 1,
            red_house_v2: 1,
            warehouse: 2,
            lodge: 1,
            tent_1: 1,
            tent_2: 1,
            tent_3: 1,
            tent_4: 1
        },
        obstacles: {
            big_oak_tree: 230,
            maple_tree: 70,
            oak_tree: 50,
            birch_tree: 25,
            pine_tree: 95,
            dormant_oak_tree: 25,
            stump: 40,
            hatchet_stump: 3,
            regular_crate: 170,
            flint_crate: 10,
            grenade_crate: 50,
            rock: 220,
            clearing_boulder: 15,
            river_chest: 1,
            vibrant_bush: 200,
            oak_leaf_pile: 200,
            barrel: 90,
            viking_chest: 1,
            super_barrel: 35,
            melee_crate: 1,
            gold_rock: 1,
            loot_tree: 4,
            loot_barrel: 1,
            flint_lockbox: 1,
            pumpkin: 200,
            large_pumpkin: 5
        },
        obstacleClumps: [
            {
                clumpAmount: 110,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["big_oak_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 15,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["oak_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 15,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["birch_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 15,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["pine_tree"],
                    radius: 12
                }
            }
        ],
        loots: {
            ground_loot: 60
        },
        places: [
            { name: "Antler", position: (0, vector_1.Vec)(0.23, 0.2) },
            { name: "Deadfall", position: (0, vector_1.Vec)(0.23, 0.8) },
            { name: "Beaverdam", position: (0, vector_1.Vec)(0.75, 0.2) },
            { name: "Crimson Hills", position: (0, vector_1.Vec)(0.72, 0.8) },
            { name: "Emerald Farms", position: (0, vector_1.Vec)(0.5, 0.35) },
            { name: "Darkwood", position: (0, vector_1.Vec)(0.5, 0.65) }
        ]
    },
    halloween: {
        width: 1924,
        height: 1924,
        oceanSize: 128,
        beachSize: 32,
        rivers: {
            minAmount: 2,
            maxAmount: 2,
            wideChance: 0.35,
            minWidth: 12,
            maxWidth: 18,
            minWideWidth: 25,
            maxWideWidth: 28,
            maxWideAmount: 1,
            obstacles: {
                river_rock: 16,
                lily_pad: 6
            }
        },
        trails: {
            minAmount: 4,
            maxAmount: 5,
            wideChance: 0.2,
            minWidth: 2,
            maxWidth: 4,
            minWideWidth: 3,
            maxWideWidth: 5,
            maxWideAmount: 1,
            obstacles: {
                pebble: 300
            }
        },
        clearings: {
            minWidth: 200,
            minHeight: 150,
            maxWidth: 250,
            maxHeight: 200,
            count: 3,
            allowedObstacles: ["clearing_boulder", "flint_crate", "rock", "plumpkin", "diseased_plumpkin", "vibrant_bush", "river_chest", "lily_pad", "grenade_crate", "oak_leaf_pile", "river_rock", "melee_crate", "flint_lockbox"],
            obstacles: [
                { idString: "clearing_boulder", min: 3, max: 6 },
                { idString: "flint_crate", min: 0, max: 2 },
                { idString: "grenade_crate", min: 0, max: 2 },
                { idString: "melee_crate", min: 0, max: 1 },
                { idString: "flint_lockbox", min: 0, max: 1 }
            ]
        },
        buildings: {
            small_bridge: Infinity,
            plumpkin_bunker: 1,
            lighthouse: 1,
            tugboat_red: 1,
            tugboat_white: 7,
            lodge: 1,
            bombed_armory: 1,
            barn: 2,
            green_house: 4,
            warehouse: 4,
            red_house: 2,
            red_house_v2: 2,
            tent_big_1: 2,
            tent_big_2: 2,
            tent_big_3: 2,
            tent_big_4: 2,
            hay_shed_1: 1,
            hay_shed_2: 3,
            hay_shed_3: 3,
            tent_1: 3,
            tent_2: 3,
            tent_3: 3,
            tent_4: 3,
            tent_5: 1,
            outhouse: 10
        },
        majorBuildings: ["bombed_armory", "lodge", "plumpkin_bunker"],
        quadBuildingLimit: {
            barn: 1,
            outhouse: 3,
            red_house: 1,
            red_house_v2: 1,
            green_house: 2,
            warehouse: 2,
            bombed_armory: 1,
            lodge: 1,
            tent_1: 1,
            tent_2: 1,
            tent_3: 1,
            tent_4: 1
        },
        obstacles: {
            big_oak_tree: 40,
            oak_tree: 100,
            birch_tree: 60,
            maple_tree: 50,
            pine_tree: 80,
            dormant_oak_tree: 100,
            stump: 40,
            hay_bale: 40,
            diseased_plumpkin: 120,
            hatchet_stump: 3,
            regular_crate: 170,
            flint_crate: 10,
            grenade_crate: 50,
            rock: 220,
            clearing_boulder: 15,
            river_chest: 1,
            vibrant_bush: 200,
            oak_leaf_pile: 200,
            barrel: 90,
            jack_o_lantern: 75,
            viking_chest: 1,
            super_barrel: 35,
            melee_crate: 1,
            gold_rock: 1,
            loot_tree: 1,
            loot_barrel: 1,
            flint_lockbox: 3,
            pumpkin: 300,
            large_pumpkin: 40,
            plumpkin: 5
        },
        obstacleClumps: [
            {
                clumpAmount: 90,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["big_oak_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 50,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["dormant_oak_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 15,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["pine_tree"],
                    radius: 12
                }
            }
        ],
        loots: {
            ground_loot: 60
        },
        places: [
            { name: "Pumpkin Patch", position: (0, vector_1.Vec)(0.23, 0.2) },
            { name: "Reaper", position: (0, vector_1.Vec)(0.23, 0.8) },
            { name: "Spøkelsesfelt", position: (0, vector_1.Vec)(0.75, 0.2) },
            { name: "Haunted Hollow", position: (0, vector_1.Vec)(0.72, 0.8) },
            { name: "Mt. Fang", position: (0, vector_1.Vec)(0.5, 0.35) },
            { name: "Darkwood", position: (0, vector_1.Vec)(0.5, 0.65) }
        ]
    },
    infection: {
        width: 1632,
        height: 1632,
        oceanSize: 128,
        beachSize: 32,
        rivers: {
            minAmount: 2,
            maxAmount: 3,
            maxWideAmount: 1,
            wideChance: 0.35,
            minWidth: 12,
            maxWidth: 18,
            minWideWidth: 25,
            maxWideWidth: 30,
            obstacles: {
                river_rock: 16,
                lily_pad: 6
            }
        },
        buildings: {
            large_bridge: 2,
            small_bridge: Infinity,
            port: 1,
            river_hut_1: 2,
            river_hut_2: 2,
            river_hut_3: 2,
            lighthouse: 1,
            tugboat_red: 1,
            tugboat_white: 5,
            armory: 1,
            headquarters: 1,
            fulcrum_bunker: 1,
            small_bunker: 1,
            refinery: 1,
            warehouse: 5,
            // mini_warehouse: 1,
            green_house: 3,
            blue_house: 2,
            blue_house_special: 1,
            red_house: 3,
            red_house_v2: 3,
            construction_site: 1,
            mobile_home: 10,
            porta_potty: 12,
            container_3: 2,
            container_4: 2,
            container_5: 2,
            container_6: 2,
            container_7: 1,
            container_8: 2,
            container_9: 1,
            container_10: 2,
            memorial: 1,
            buoy: 12
        },
        majorBuildings: ["armory", "refinery", "port", "headquarters"],
        quadBuildingLimit: {
            river_hut_1: 1,
            river_hut_2: 1,
            river_hut_3: 1,
            red_house: 1,
            red_house_v2: 1,
            warehouse: 2,
            green_house: 1,
            blue_house: 1,
            mobile_home: 3,
            porta_potty: 3,
            construction_site: 1,
            blue_house_special: 1
        },
        obstacles: {
            oil_tank: 12,
            oak_tree: 110,
            birch_tree: 20,
            pine_tree: 10,
            loot_tree: 1,
            baby_plumpkin_infection: 200,
            regular_crate: 140,
            flint_crate: 5,
            aegis_crate: 5,
            grenade_crate: 35,
            rock: 150,
            river_chest: 1,
            bush: 110,
            // birthday_cake: 100, // birthday mode
            blueberry_bush: 30,
            barrel: 80,
            viking_chest: 1,
            super_barrel: 30,
            melee_crate: 1,
            gold_rock: 1,
            loot_barrel: 1,
            flint_lockbox: 1
        },
        obstacleClumps: [
            {
                clumpAmount: 100,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["oak_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 25,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["birch_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 4,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["pine_tree"],
                    radius: 12
                }
            }
        ],
        loots: {
            ground_loot: 60
        },
        places: [
            { name: "Blightnana", position: (0, vector_1.Vec)(0.23, 0.2) },
            { name: "Quarantine", position: (0, vector_1.Vec)(0.23, 0.8) },
            { name: "Rotlandet", position: (0, vector_1.Vec)(0.75, 0.2) },
            { name: "Pathogen Narrows", position: (0, vector_1.Vec)(0.72, 0.8) },
            { name: "Mt. Putrid", position: (0, vector_1.Vec)(0.5, 0.35) },
            { name: "Decayedwood", position: (0, vector_1.Vec)(0.5, 0.65) }
        ]
    },
    hunted: {
        width: 1924,
        height: 1924,
        oceanSize: 66,
        beachSize: 32,
        rivers: {
            minAmount: 1,
            maxAmount: 1,
            maxWideAmount: 0,
            wideChance: 0,
            minWidth: 18,
            maxWidth: 22,
            minWideWidth: 0,
            maxWideWidth: 0,
            obstacles: {
                river_rock: 16,
                lily_pad: 6
            },
            centered: true
        },
        majorBuildings: [
            "sawmill",
            "shooting_range",
            "tavern"
        ],
        buildings: {
            small_bridge: Infinity,
            docks: 8,
            outhouse: 8,
            cabin: 6,
            carport: 4,
            hunting_stand: 12,
            warehouse_hunted: 5,
            fox_bunker: 1,
            moose_bunker: 1,
            bear_bunker: 1,
            hollow_log_1: 5,
            hollow_log_2: 5,
            hollow_log_3: 5
        },
        quadBuildingLimit: {
            carport: 1,
            hunting_stand: 3,
            warehouse_hunted: 2,
            docks: 2,
            outhouse: 3,
            cabin: 3,
            hollow_log_1: 3,
            hollow_log_2: 3,
            hollow_log_3: 3
        },
        obstacles: {
            stump: 80,
            small_logs_pile: 30,
            large_logs_pile_2: 20,
            clearing_boulder: 18,
            pine_tree: 100,
            spruce_tree: 92,
            dead_pine_tree: 55,
            oak_tree: 20,
            regular_crate: 120,
            nsd_crate: 6,
            lansirama_crate: 6,
            grenade_crate: 35,
            rock: 200,
            river_chest: 1,
            bush: 175,
            blueberry_bush: 42,
            barrel: 155,
            viking_chest: 1,
            super_barrel: 30,
            melee_crate: 1,
            gold_rock: 1,
            nsd_rock: 1,
            reinforced_crate: 1,
            hatchet_stump: 3
        },
        obstacleClumps: [
            {
                clumpAmount: 45,
                clump: {
                    minAmount: 10,
                    maxAmount: 15,
                    jitter: 30,
                    obstacles: ["pine_tree", "spruce_tree"],
                    radius: 30
                }
            },
            {
                clumpAmount: 25,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["dead_pine_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 20,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["stump"],
                    radius: 12
                }
            }
        ],
        loots: {
            ground_loot: 105
        },
        places: [
            { name: "Pine Cone", position: (0, vector_1.Vec)(0.23, 0.2) },
            { name: "Gunpoint", position: (0, vector_1.Vec)(0.23, 0.8) },
            { name: "Kuolema", position: (0, vector_1.Vec)(0.75, 0.2) },
            { name: "Switchback", position: (0, vector_1.Vec)(0.72, 0.8) },
            { name: "Black Hill", position: (0, vector_1.Vec)(0.5, 0.35) },
            { name: "The Grove", position: (0, vector_1.Vec)(0.5, 0.65) }
        ]
    },
    winter: {
        width: 1632,
        height: 1632,
        oceanSize: 128,
        beachSize: 32,
        rivers: {
            minAmount: 2,
            maxAmount: 3,
            maxWideAmount: 1,
            wideChance: 0.35,
            minWidth: 12,
            maxWidth: 18,
            minWideWidth: 25,
            maxWideWidth: 30,
            obstacles: {
                river_rock: 16
            }
        },
        buildings: {
            large_bridge: 2,
            small_bridge: Infinity,
            port: 1,
            lighthouse: 1,
            tugboat_red: 1,
            tugboat_white: 5,
            armory: 1,
            headquarters: 1,
            fulcrum_bunker: 1,
            small_bunker: 1,
            refinery: 1,
            warehouse: 4,
            christmas_camp: 1,
            green_house: 3,
            blue_house: 2,
            blue_house_special: 1,
            red_house: 3,
            red_house_v2: 3,
            construction_site: 1,
            mobile_home: 8,
            porta_potty: 12,
            container_3: 2,
            container_4: 2,
            container_5: 2,
            container_6: 2,
            container_7: 1,
            container_8: 2,
            container_9: 1,
            container_10: 3
        },
        majorBuildings: ["armory", "refinery", "port", "headquarters", "christmas_camp"],
        quadBuildingLimit: {
            red_house: 1,
            red_house_v2: 1,
            warehouse: 2,
            green_house: 1,
            blue_house: 1,
            mobile_home: 3,
            porta_potty: 3,
            construction_site: 1,
            blue_house_special: 1
        },
        obstacles: {
            oil_tank_winter: 12,
            oak_tree: 40,
            birch_tree: 20,
            pine_tree: 90,
            loot_tree: 1,
            regular_crate_winter: 140,
            frozen_crate: 10,
            flint_crate_winter: 5,
            aegis_crate_winter: 5,
            grenade_crate_winter: 35,
            rock: 150,
            river_chest: 1,
            bush: 110,
            // birthday_cake: 100, // birthday mode
            blueberry_bush: 30,
            barrel_winter: 80,
            viking_chest: 1,
            super_barrel_winter: 30,
            melee_crate_winter: 1,
            gold_rock: 1,
            loot_barrel: 1,
            flint_lockbox_winter: 1
        },
        obstacleClumps: [
            {
                clumpAmount: 25,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["oak_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 25,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["birch_tree"],
                    radius: 12
                }
            },
            {
                clumpAmount: 65,
                clump: {
                    minAmount: 2,
                    maxAmount: 3,
                    jitter: 5,
                    obstacles: ["pine_tree"],
                    radius: 12
                }
            }
        ],
        loots: {
            ground_loot: 60
        },
        places: [
            { name: "Banana", position: (0, vector_1.Vec)(0.23, 0.2) },
            { name: "Takedown", position: (0, vector_1.Vec)(0.23, 0.8) },
            { name: "Lavlandet", position: (0, vector_1.Vec)(0.75, 0.2) },
            { name: "Noskin Narrows", position: (0, vector_1.Vec)(0.72, 0.8) },
            { name: "Mt. Sanger", position: (0, vector_1.Vec)(0.5, 0.35) },
            { name: "Deepwood", position: (0, vector_1.Vec)(0.5, 0.65) }
        ]
    },
    debug: {
        width: 1620,
        height: 1620,
        // spawn: { mode: "fixed" },
        oceanSize: 128,
        beachSize: 32,
        onGenerate(map) {
            // Generate all buildings
            const buildingPos = (0, vector_1.Vec)(200, map.height - 600);
            for (const building of buildings_1.Buildings.definitions) {
                map.generateBuilding(building.idString, buildingPos);
                const rect = building.spawnHitbox.toRectangle();
                buildingPos.x += rect.max.x - rect.min.x;
                buildingPos.x += 20;
                if (buildingPos.x > map.width - 300) {
                    buildingPos.x = 200 - 140;
                    buildingPos.y += 200;
                }
            }
            // Generate all obstacles
            const obstaclePos = (0, vector_1.Vec)(200, 200);
            for (const obstacle of obstacles_1.Obstacles.definitions) {
                if (obstacle.invisible)
                    continue;
                for (let i = 0; i < (obstacle.variations ?? 1); i++) {
                    map.generateObstacle(obstacle.idString, obstaclePos, { variation: i });
                    obstaclePos.x += 20;
                    if (obstaclePos.x > map.width / 2 - 20) {
                        obstaclePos.x = map.width / 2 - 140;
                        obstaclePos.y += 20;
                    }
                }
            }
            // Generate all Loots
            const itemPos = (0, vector_1.Vec)(map.width / 2, map.height / 2);
            for (const item of loots_1.Loots.definitions) {
                map.game.addLoot(item, itemPos, 0, { count: Infinity, pushVel: 0, jitterSpawn: false });
                itemPos.x += 10;
                if (itemPos.x > map.width / 2 + 100) {
                    itemPos.x = map.width / 2;
                    itemPos.y += 10;
                }
            }
        },
        places: [
            { name: "[object Object]", position: (0, vector_1.Vec)(0.8, 0.7) },
            { name: "Kernel Panic", position: (0, vector_1.Vec)(0.6, 0.8) },
            { name: "NullPointerException", position: (0, vector_1.Vec)(0.7, 0.3) },
            { name: "undefined Forest", position: (0, vector_1.Vec)(0.3, 0.2) },
            { name: "seg. fault\n(core dumped)", position: (0, vector_1.Vec)(0.3, 0.7) },
            { name: "Can't read props of null", position: (0, vector_1.Vec)(0.4, 0.5) }
        ]
    },
    // Arena map to test guns with really bad custom generation code lol
    arena: {
        width: 512,
        height: 512,
        spawn: { mode: "fixed" },
        beachSize: 16,
        oceanSize: 40,
        onGenerate(map) {
            // Function to generate all game loot items
            const genLoots = (pos, ySpacing, xSpacing) => {
                const width = 80;
                const startPos = vector_1.Vec.clone(pos);
                startPos.x -= width / 2;
                const itemPos = vector_1.Vec.clone(startPos);
                const countMap = {
                    [objectDefinitions_1.DefinitionType.Gun]: 1,
                    [objectDefinitions_1.DefinitionType.Ammo]: Infinity,
                    [objectDefinitions_1.DefinitionType.Melee]: 1,
                    [objectDefinitions_1.DefinitionType.Throwable]: Infinity,
                    [objectDefinitions_1.DefinitionType.HealingItem]: Infinity,
                    [objectDefinitions_1.DefinitionType.Armor]: 1,
                    [objectDefinitions_1.DefinitionType.Backpack]: 1,
                    [objectDefinitions_1.DefinitionType.Scope]: 1,
                    [objectDefinitions_1.DefinitionType.Skin]: 1,
                    [objectDefinitions_1.DefinitionType.Perk]: Infinity
                };
                const game = map.game;
                for (const item of loots_1.Loots.definitions) {
                    if (((item.defType === objectDefinitions_1.DefinitionType.Melee || item.defType === objectDefinitions_1.DefinitionType.Scope) && item.noDrop)
                        || (item.defType === objectDefinitions_1.DefinitionType.Ammo && item.ephemeral)
                        || (item.defType === objectDefinitions_1.DefinitionType.Backpack && item.level === 0)
                        || (item.defType === objectDefinitions_1.DefinitionType.Perk && item.category === 1 /* PerkCategories.Halloween */)
                        || item.defType === objectDefinitions_1.DefinitionType.Skin
                        || item.devItem)
                        continue;
                    game.addLoot(item, itemPos, 0, { count: countMap[item.defType] ?? 1, pushVel: 0, jitterSpawn: false });
                    itemPos.x += xSpacing;
                    if ((xSpacing > 0 && itemPos.x > startPos.x + width)
                        || (xSpacing < 0 && itemPos.x < startPos.x - width)) {
                        itemPos.x = startPos.x;
                        itemPos.y -= ySpacing;
                    }
                }
            };
            // Fixed obstacles
            const obstacles = [
                { id: "rock", pos: (0, vector_1.Vec)(10, 10) },
                { id: "rock", pos: (0, vector_1.Vec)(20, 40) },
                { id: "rock", pos: (0, vector_1.Vec)(20, 80) },
                { id: "regular_crate", pos: (0, vector_1.Vec)(20, 15) },
                { id: "barrel", pos: (0, vector_1.Vec)(25, 25) },
                { id: "rock", pos: (0, vector_1.Vec)(80, 10) },
                { id: "rock", pos: (0, vector_1.Vec)(60, 15) },
                { id: "oak_tree", pos: (0, vector_1.Vec)(20, 70) },
                { id: "oil_tank", pos: (0, vector_1.Vec)(140, 25) },
                { id: "birch_tree", pos: (0, vector_1.Vec)(120, 50) }
            ];
            const center = (0, vector_1.Vec)(map.width / 2, map.height / 2);
            for (const obstacle of obstacles) {
                const { id, pos } = obstacle;
                const { x: posX, y: posY } = pos;
                map.generateObstacle(id, vector_1.Vec.add(center, pos), { rotation: 0 });
                map.generateObstacle(id, vector_1.Vec.add(center, (0, vector_1.Vec)(-posX, posY)), { rotation: 0 });
                map.generateObstacle(id, vector_1.Vec.add(center, (0, vector_1.Vec)(posX, -posY)), { rotation: 0 });
                map.generateObstacle(id, vector_1.Vec.add(center, (0, vector_1.Vec)(-posX, -posY)), { rotation: 0 });
            }
            genLoots(vector_1.Vec.add(center, (0, vector_1.Vec)(-70, 100)), 8, 8);
            genLoots(vector_1.Vec.add(center, (0, vector_1.Vec)(70, 100)), 8, 8);
            genLoots(vector_1.Vec.add(center, (0, vector_1.Vec)(-70, -100)), -8, 8);
            genLoots(vector_1.Vec.add(center, (0, vector_1.Vec)(70, -100)), -8, 8);
            // Generate random obstacles around the center
            const randomObstacles = {
                oak_tree: 50,
                rock: 50,
                bush: 20,
                birch_tree: 5,
                barrel: 15,
                super_barrel: 2
            };
            for (const obstacle in randomObstacles) {
                const limit = randomObstacles[obstacle];
                const definition = obstacles_1.Obstacles.fromString(obstacle);
                for (let i = 0; i < limit; i++) {
                    const pos = map.getRandomPosition(definition.spawnHitbox ?? definition.hitbox, {
                        collides: pos => math_1.Collision.circleCollision(center, 150, pos, 1)
                    });
                    if (!pos)
                        continue;
                    map.generateObstacle(definition, pos);
                }
            }
        },
        places: [
            { name: "stark is pro", position: (0, vector_1.Vec)(0.5, 0.5) }
        ]
    },
    singleBuilding: {
        width: 1024,
        height: 1024,
        spawn: { mode: "fixed" },
        beachSize: 32,
        oceanSize: 64,
        onGenerate(map, [building]) {
            // map.game.grid.addObject(new Decal(map.game, "lodge_decal", Vec(this.width / 2, this.height / 2), 0));
            /* for (let i = 0; i < 10; i++) {
                map.generateBuilding(`container_${i + 1}`, Vec((this.width / 2) + 15 * i, this.height / 2 - 15), 0);
            } */
            map.generateBuilding(building, (0, vector_1.Vec)(this.width / 2, this.height / 2), 0);
        }
    },
    singleObstacle: {
        width: 256,
        height: 256,
        spawn: { mode: "fixed" },
        beachSize: 8,
        oceanSize: 8,
        onGenerate(map, [obstacle]) {
            map.generateObstacle(obstacle, (0, vector_1.Vec)(this.width / 2, this.height / 2), { layer: 0, rotation: 0 });
            // const def = Obstacles.fromString(obstacle);
            // for (let i = 0; i < (def.variations ?? 1); i++) {
            //     map.generateObstacle(obstacle, Vec(i * 32 + 48, this.height / 2), { layer: 0, rotation: 0, variation: i as Variation });
            // }
        }
    },
    singleGun: {
        width: 256,
        height: 256,
        spawn: { mode: "fixed" },
        beachSize: 8,
        oceanSize: 8,
        onGenerate(map, [gun]) {
            map.game.addLoot(gun, (0, vector_1.Vec)(this.width / 2, this.height / 2 - 10), 0);
            map.game.addLoot(guns_1.Guns.fromString(gun).ammoType, (0, vector_1.Vec)(this.width / 2, this.height / 2 - 10), 0, { count: Infinity });
        }
    },
    gunsTest: (() => {
        return {
            width: 64 * 8,
            height: 48 + (6 * guns_1.Guns.definitions.length),
            beachSize: 0,
            oceanSize: 0,
            onGenerate(map) {
                const game = map.game;
                game.pluginManager.loadPlugin(class extends pluginManager_1.GamePlugin {
                    initListeners() {
                        this.on("game_created", _game => {
                            if (_game !== game)
                                return;
                            const createBot = (name) => {
                                const bot = game.addPlayer();
                                if (!bot)
                                    return;
                                game.activatePlayer(bot, {
                                    type: packet_1.PacketType.Join,
                                    name,
                                    isMobile: false,
                                    skin: loots_1.Loots.fromString("hazel_jumpsuit"),
                                    emotes: Array.from({ length: 6 }, () => undefined),
                                    protocolVersion: constants_1.GameConstants.protocolVersion
                                });
                                return bot;
                            };
                            const teleportPlayer = (player, position) => {
                                player.position = position;
                                player.updateObjects = true;
                                player.game.grid.updateObject(player);
                                player.setDirty();
                            };
                            for (let i = 0, l = guns_1.Guns.definitions.length; i < l; i++) {
                                const player = createBot(`bot ${i}`);
                                if (player === undefined)
                                    return;
                                teleportPlayer(player, (0, vector_1.Vec)(256, 24 + 6 * i));
                                const gun = guns_1.Guns.definitions[i];
                                player.inventory.addOrReplaceWeapon(0, gun.idString);
                                player.inventory.getWeapon(0).ammo = gun.capacity;
                                player.inventory.items.setItem(gun.ammoType, Infinity);
                                player.disableInvulnerability();
                                // map.game.addLoot(gun.idString, Vec(16, 32 + 16 * i), 0);
                                // map.game.addLoot(gun.ammoType, Vec(16, 32 + 16 * i), 0, { count: Infinity });
                            }
                        });
                    }
                });
            }
        };
    })(),
    obstaclesTest: {
        width: 128,
        height: 128,
        beachSize: 0,
        oceanSize: 0,
        onGenerate(map, [obstacle]) {
            for (let x = 0; x <= 128; x += 16) {
                for (let y = 0; y <= 128; y += 16) {
                    map.generateObstacle(obstacle, (0, vector_1.Vec)(x, y));
                }
            }
        }
    },
    playersTest: {
        width: 256,
        height: 256,
        beachSize: 16,
        oceanSize: 16,
        onGenerate(map) {
            for (let x = 0; x < 256; x += 16) {
                for (let y = 0; y < 256; y += 16) {
                    /* const player = new Player(map.game, { getUserData: () => { return {}; } } as unknown as WebSocket<PlayerContainer>, Vec(x, y));
                    player.disableInvulnerability();
                    player.loadout.skin = pickRandomInArray(Skins.definitions);
                    map.game.grid.addObject(player); */
                    if ((0, random_1.random)(0, 1) === 1)
                        map.generateObstacle("barrel", (0, vector_1.Vec)(x, y));
                }
            }
        }
    },
    lootTest: {
        width: 256,
        height: 256,
        //  spawn: { mode: "fixed" },
        beachSize: 16,
        oceanSize: 16,
        onGenerate(map) {
            const { game } = map;
            let x = 88;
            [
                ...armors_1.Armors.definitions,
                ...backpacks_1.Backpacks.definitions
            ].map(({ idString }) => idString).filter(idString => idString !== "bag" && idString !== "developr_vest").forEach(loot => {
                game.addLoot(loots_1.Loots.fromString(loot), (0, vector_1.Vec)(x = x + 8, 120), 0, { pushVel: 0, jitterSpawn: false });
            });
        }
    },
    bunkerSpawnTest: {
        width: 1024,
        height: 1024,
        spawn: { mode: "fixed" },
        beachSize: 32,
        oceanSize: 32,
        buildings: {
            small_bunker: 150
        }
    },
    river: {
        width: 1344,
        height: 1344,
        oceanSize: 144,
        beachSize: 32
    },
    armory: {
        width: 850,
        height: 850,
        oceanSize: 144,
        beachSize: 32,
        buildings: {
            armory: 1
        },
        obstacles: {
            regular_crate: 30,
            grenade_crate: 15,
            toilet: 20,
            aegis_crate: 10,
            flint_crate: 10,
            melee_crate: 5,
            birch_tree: 30,
            pine_tree: 30,
            rock: 30,
            barrel: 15
        }
    },
    new_port: {
        width: 875,
        height: 875,
        oceanSize: 144,
        beachSize: 32,
        buildings: {
            port: 1
        },
        obstacles: {
            regular_crate: 30,
            grenade_crate: 15,
            toilet: 20,
            aegis_crate: 10,
            flint_crate: 10,
            melee_crate: 5,
            birch_tree: 30,
            pine_tree: 30,
            rock: 30,
            barrel: 15
        }
    },
    gallery: {
        width: 1024,
        height: 1024,
        beachSize: 64,
        oceanSize: 64,
        onGenerate(map) {
            const targetBuildingIdString = "headquarters";
            map.generateBuilding(targetBuildingIdString, (0, vector_1.Vec)(this.width / 2, this.height / 2), 0);
            const buildings = {
                // seriously stfu
                /* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
                red_house: ~~Math.random(),
                blue_house: ~~Math.random(),
                green_house: ~~Math.random(),
                red_house_v2: ~~Math.random(),
                mobile_home: ~~(Math.random() * 5) + 3,
                porta_potty: ~~(Math.random() * 5) + 3,
                /* eslint-enable @typescript-eslint/no-unnecessary-type-conversion */
                warehouse: 1,
                container_3: 1,
                container_4: 1,
                container_5: 1,
                container_6: 1,
                container_7: 1,
                container_8: 1,
                container_9: 1,
                container_10: 1,
                small_bunker: 1
            };
            const obstacles = {
                oil_tank: 5,
                oak_tree: 40,
                birch_tree: 40,
                box: 50,
                pine_tree: 30,
                regular_crate: 75,
                fridge: 40,
                flint_crate: 12,
                aegis_crate: 12,
                grenade_crate: 30,
                rock: 45,
                bush: 25,
                blueberry_bush: 25,
                barrel: 40,
                gun_case: 15,
                super_barrel: 15,
                briefcase: 4,
                melee_crate: 4,
                gold_rock: 1,
                loot_tree: 1,
                loot_barrel: 1,
                viking_chest: Math.random() > 0.9 ? 1 : 0,
                river_chest: Math.random() > 0.9 ? 1 : 0,
                tango_crate: Math.random() > 0.8 ? 1 : 0,
                lux_crate: Math.random() > 0.8 ? 1 : 0
            };
            const loots = {
                ground_loot: 40,
                regular_crate: 40
            };
            Object.entries(buildings).forEach(([building, count]) => {
                const definition = buildings_1.Buildings.reify(building);
                const { rotationMode } = definition;
                let attempts = 0;
                for (let i = 0; i < count; i++) {
                    let validPositionFound = false;
                    while (!validPositionFound && attempts < 100) {
                        let orientation = map_1.GameMap.getRandomBuildingOrientation(rotationMode);
                        const position = map.getRandomPosition(definition.spawnHitbox, {
                            orientation,
                            spawnMode: definition.spawnMode ?? constants_1.MapObjectSpawnMode.Grass,
                            orientationConsumer: (newOrientation) => {
                                orientation = newOrientation;
                            },
                            maxAttempts: 400
                        });
                        if (!position) {
                            attempts++;
                            continue;
                        }
                        map.generateBuilding(definition, position, orientation);
                        validPositionFound = true;
                    }
                    attempts = 0; // Reset attempts counter for the next building
                }
            });
            Object.entries(obstacles).forEach(([obstacle, count]) => {
                const def = obstacles_1.Obstacles.reify(obstacle);
                const { scale = { spawnMin: 1, spawnMax: 1 }, variations, rotationMode } = def;
                const { spawnMin, spawnMax } = scale;
                const effSpawnHitbox = def.spawnHitbox ?? def.hitbox;
                for (let i = 0; i < count; i++) {
                    const scale = (0, random_1.randomFloat)(spawnMin ?? 1, spawnMax ?? 1);
                    const variation = (variations !== undefined ? (0, random_1.random)(0, variations - 1) : 0);
                    const rotation = map_1.GameMap.getRandomRotation(rotationMode);
                    let orientation = 0;
                    if (rotationMode === constants_1.RotationMode.Limited) {
                        orientation = rotation;
                    }
                    const position = map.getRandomPosition(effSpawnHitbox, {
                        scale,
                        orientation,
                        spawnMode: def.spawnMode
                    });
                    if (!position) {
                        continue;
                    }
                    map.generateObstacle(def, position, { layer: constants_1.Layer.Ground, scale, variation });
                }
            });
            Object.entries(loots ?? {}).forEach(([lootTable, count]) => {
                for (let i = 0; i < count; i++) {
                    const loot = (0, lootHelpers_1.getLootFromTable)("normal", lootTable);
                    const position = map.getRandomPosition(new hitbox_1.CircleHitbox(5), { spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand });
                    if (!position) {
                        continue;
                    }
                    for (const item of loot) {
                        map.game.addLoot(item.idString, position, constants_1.Layer.Ground, { count: item.count, jitterSpawn: false });
                    }
                }
            });
        },
        places: [
            { name: "pap's lonely place", position: (0, vector_1.Vec)(0.5, 0.5) }
        ]
    }
};
exports.Maps = maps;
//# sourceMappingURL=maps.js.map