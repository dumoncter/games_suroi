"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerkData = exports.Perks = void 0;
const objectDefinitions_1 = require("../../utils/objectDefinitions");
const terrain_1 = require("../../utils/terrain");
const perks = [
    //
    // Normal Perks
    //
    {
        idString: "second_wind" /* PerkIds.SecondWind */,
        name: "Second Wind",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        cutoff: 0.5,
        speedMod: 1.4
    },
    {
        idString: "flechettes" /* PerkIds.Flechettes */,
        name: "Fléchettes",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        split: 3,
        deviation: 0.7,
        damageMod: 0.4
    },
    {
        idString: "sabot_rounds" /* PerkIds.SabotRounds */,
        name: "Sabot Rounds",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        rangeMod: 1.5,
        speedMod: 1.5,
        spreadMod: 0.6,
        damageMod: 0.9,
        tracerLengthMod: 1.2
    },
    {
        idString: "extended_mags" /* PerkIds.ExtendedMags */,
        name: "Extended Mags",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */
        // define for each weapon individually
    },
    {
        idString: "demo_expert" /* PerkIds.DemoExpert */,
        name: "Demo Expert",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        updateInterval: 10e3, // milliseconds
        rangeMod: 2,
        restoreAmount: 0.25 // times max capacity
    },
    {
        idString: "advanced_athletics" /* PerkIds.AdvancedAthletics */,
        name: "Advanced Athletics",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        // all multiplicative
        waterSpeedMod: (1 / (terrain_1.FloorTypes.water.speedMultiplier ?? 1)) * 1.3,
        smokeSpeedMod: 1.3
    },
    {
        idString: "toploaded" /* PerkIds.Toploaded */,
        name: "Toploaded",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        thresholds: [
            [0.2, 1.25],
            [0.49, 1.1]
        ]
    },
    {
        idString: "infinite_ammo" /* PerkIds.InfiniteAmmo */,
        name: "Infinite Ammo",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        airdropCallerLimit: 3
    },
    {
        idString: "field_medic" /* PerkIds.FieldMedic */,
        name: "Field Medic",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        usageMod: 1.5 // divide
    },
    {
        idString: "berserker" /* PerkIds.Berserker */,
        name: "Berserker",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        speedMod: 1.2, // multiplicative
        damageMod: 1.2 // multiplicative
    },
    {
        idString: "close_quarters_combat" /* PerkIds.CloseQuartersCombat */,
        name: "Close Quarters Combat",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        cutoff: 50,
        reloadMod: 1.3, // divide
        damageMod: 1.2 // multiplicative
    },
    {
        idString: "low_profile" /* PerkIds.LowProfile */,
        name: "Low Profile",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        sizeMod: 0.8, // multiplicative
        explosionMod: 0.5 // multiplicative
    },
    {
        idString: "combat_expert" /* PerkIds.CombatExpert */,
        name: "Combat Expert",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        reloadMod: 1.25
    },
    {
        idString: "precision_recycling" /* PerkIds.PrecisionRecycling */,
        name: "Precision Recycling",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        updateInterval: 1e3, // milliseconds
        hitReq: 2,
        accThreshold: 0.5,
        refund: 2,
        margin: 3 // times fireDelay
    },
    {
        idString: "loot_baron" /* PerkIds.LootBaron */,
        name: "Loot Baron",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        lootBonus: 1
    },
    //
    // Halloween perks
    //
    {
        idString: "plumpkin_gamble" /* PerkIds.PlumpkinGamble */,
        name: "Plumpkin Gamble",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        noDrop: true,
        plumpkinGambleIgnore: true
        /*
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
            krr krr krr *buzzer* aw dang it! krr krr krr *buzzer* aw dang it!
        */
    },
    {
        idString: "lycanthropy" /* PerkIds.Lycanthropy */,
        name: "Lycanthropy",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "positive" /* PerkQualities.Positive */,
        speedMod: 1.3,
        healthMod: 1.5,
        regenRate: 1,
        damageMod: 2,
        noDrop: true
    },
    {
        idString: "bloodthirst" /* PerkIds.Bloodthirst */,
        name: "Bloodthirst",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "positive" /* PerkQualities.Positive */,
        updateInterval: 1e3,
        speedMod: 1.5,
        speedBoostDuration: 2000, // sec
        healthLoss: 1,
        healBonus: 25,
        adrenalineBonus: 25,
        noDrop: true
    },
    {
        idString: "plumpkin_bomb" /* PerkIds.PlumpkinBomb */,
        name: "Plumpkin Bomb",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "positive" /* PerkQualities.Positive */,
        damageMod: 1.2, // for grenades
        noDrop: true
    },
    {
        idString: "shrouded" /* PerkIds.Shrouded */,
        name: "Shrouded",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "positive" /* PerkQualities.Positive */,
        updateInterval: 100,
        noDrop: true
    },
    {
        idString: "experimental_treatment" /* PerkIds.ExperimentalTreatment */,
        name: "Experimental Treatment",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "neutral" /* PerkQualities.Neutral */,
        adrenDecay: 0,
        adrenSet: 1,
        healthMod: 0.8,
        noDrop: true
    },
    {
        idString: "engorged" /* PerkIds.Engorged */,
        name: "Engorged",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "neutral" /* PerkQualities.Neutral */,
        healthMod: 10, // additive
        sizeMod: 1.05, // multiplicative
        killsLimit: 10,
        noDrop: true
    },
    {
        idString: "baby_plumpkin_pie" /* PerkIds.BabyPlumpkinPie */,
        name: "Baby Plumpkin Pie",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "neutral" /* PerkQualities.Neutral */, // how is this neutral it's annoying
        updateInterval: 10e3, // milliseconds
        noDrop: true
    },
    {
        idString: "costumed" /* PerkIds.Costumed */,
        name: "Costumed",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "neutral" /* PerkQualities.Neutral */,
        choices: {
            oak_tree: 1,
            dormant_oak_tree: 1,
            maple_tree: 1,
            pine_tree: 1,
            birch_tree: 1,
            stump: 1,
            rock: 1,
            regular_crate: 1,
            barrel: 1,
            super_barrel: 1,
            vibrant_bush: 1,
            oak_leaf_pile: 1,
            hay_bale: 1,
            baby_plumpkin: 0.01,
            plumpkin: 0.01,
            diseased_plumpkin: 0.01
        },
        noDrop: true,
        alwaysAllowSwap: true
    },
    {
        idString: "torn_pockets" /* PerkIds.TornPockets */,
        name: "Torn Pockets",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "negative" /* PerkQualities.Negative */,
        updateInterval: 2e3,
        dropCount: 2,
        noDrop: true
    },
    {
        idString: "claustrophobic" /* PerkIds.Claustrophobic */,
        name: "Claustrophobic",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "negative" /* PerkQualities.Negative */,
        speedMod: 0.75,
        noDrop: true
    },
    {
        idString: "laced_stimulants" /* PerkIds.LacedStimulants */,
        name: "Laced Stimulants",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "negative" /* PerkQualities.Negative */,
        healDmgRate: 0.5,
        lowerHpLimit: 5, // absolute
        noDrop: true
    },
    {
        idString: "rotten_plumpkin" /* PerkIds.RottenPlumpkin */,
        name: "Rotten Plumpkin",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 1 /* PerkCategories.Halloween */,
        quality: "negative" /* PerkQualities.Negative */,
        updateInterval: 10e3, // milliseconds
        emote: "vomiting_face",
        adrenLoss: 5, // percentage
        healthLoss: 5, // absolute
        noDrop: true
    },
    /* {
        idString: PerkIds.PriorityTarget,
        name: "Priority Target",
        defType: DefinitionType.Perk,
                description: "All players on the map can see your location.",
        category: PerkCategories.Halloween,
        type: PerkQualities.Negative,

        noDrop: true,
        plumpkinGambleIgnore: true
    }, */
    //
    // Infection Mode
    //
    {
        idString: "infected" /* PerkIds.Infected */,
        name: "Infected",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        quality: "negative" /* PerkQualities.Negative */,
        updateInterval: 1000,
        dps: 0.78,
        minHealth: 5,
        healthMod: 0.75,
        speedMod: 1.25,
        damageMod: 1.2,
        adrenDrainMod: 10,
        infectionRadius: 20,
        infectionChance: 0.05,
        noDrop: true,
        plumpkinGambleIgnore: true
    },
    {
        idString: "immunity" /* PerkIds.Immunity */,
        name: "Immunity",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 0 /* PerkCategories.Normal */,
        quality: "positive" /* PerkQualities.Positive */,
        duration: 15000,
        noDrop: true,
        plumpkinGambleIgnore: true
    },
    //
    // Hunted Mode
    //
    {
        idString: "hollow_points" /* PerkIds.HollowPoints */,
        name: "Hollow Points",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 2 /* PerkCategories.Hunted */,
        damageMod: 1.1,
        soundMod: 75,
        highlightDuration: 5000,
        noDrop: true
    },
    {
        idString: "experimental_forcefield" /* PerkIds.ExperimentalForcefield */,
        name: "Experimental Forcefield",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 2 /* PerkCategories.Hunted */,
        noDrop: true,
        shieldRegenRate: 1,
        shieldRespawnTime: 20e3, // seconds
        shieldObtainSound: "shield_obtained",
        shieldDestroySound: "shield_destroyed",
        shieldHitSound: "glass", // "_hit_1/2" is added by the client
        shieldParticle: "window_particle"
    },
    {
        idString: "thermal_goggles" /* PerkIds.ThermalGoggles */,
        name: "Thermal Goggles",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 2 /* PerkCategories.Hunted */,
        noDrop: true,
        detectionRadius: 100
    },
    {
        idString: "overdrive" /* PerkIds.Overdrive */,
        name: "Overdrive",
        defType: objectDefinitions_1.DefinitionType.Perk,
        category: 2 /* PerkCategories.Hunted */,
        quality: "negative" /* PerkQualities.Negative */,
        plumpkinGambleIgnore: true,
        noDrop: true,
        particle: "charged_particle",
        activatedSound: "overdrive",
        requiredKills: 0, // its actually 1 i know but code works with 0 (it takes it as 1)
        speedMod: 1.25,
        speedBoostDuration: 10e3, // msec
        sizeMod: 1.05,
        healBonus: 25,
        adrenalineBonus: 25,
        // achieveTime: 30e3, // msec
        cooldown: 12e3 // msec
    }
];
exports.Perks = new objectDefinitions_1.ObjectDefinitions(perks);
exports.PerkData = exports.Perks.idStringToDef;
//# sourceMappingURL=perks.js.map