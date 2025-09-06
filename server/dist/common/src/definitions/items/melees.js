"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Melees = exports.DEFAULT_HAND_RIGGING = void 0;
const objectDefinitions_1 = require("../../utils/objectDefinitions");
const vector_1 = require("../../utils/vector");
const guns_1 = require("./guns");
const items_1 = require("./items");
exports.DEFAULT_HAND_RIGGING = Object.freeze({
    left: (0, vector_1.Vec)(38, -35),
    right: (0, vector_1.Vec)(38, 35)
});
exports.Melees = new items_1.InventoryItemDefinitions([
    {
        idString: "fists",
        name: "Fists",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.D,
        damage: 20,
        speedMultiplier: 1,
        obstacleMultiplier: 1,
        iceMultiplier: 0.01,
        radius: 1.5,
        offset: (0, vector_1.Vec)(2.5, 0),
        cooldown: 250,
        noDrop: true,
        fists: {
            animationDuration: 125,
            randomFist: true,
            ...exports.DEFAULT_HAND_RIGGING
        },
        animation: [
            {
                duration: 125,
                fists: {
                    left: (0, vector_1.Vec)(75, -10),
                    right: (0, vector_1.Vec)(75, 10)
                }
            },
            {
                duration: 125,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(38, 35)
                }
            }
        ],
        image: undefined
    },
    {
        idString: "baseball_bat",
        name: "Baseball Bat",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.C,
        swingSound: "heavy_swing",
        damage: 34,
        speedMultiplier: 1,
        obstacleMultiplier: 1.5,
        radius: 4,
        offset: (0, vector_1.Vec)(3.8, 2.2),
        cooldown: 450,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(55, -15),
            right: (0, vector_1.Vec)(45, 0)
        },
        animation: [
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(28, -15),
                    right: (0, vector_1.Vec)(50, -15)
                },
                image: {
                    position: (0, vector_1.Vec)(115, -14),
                    angle: 45
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(55, -15),
                    right: (0, vector_1.Vec)(45, 0)
                },
                image: {
                    position: (0, vector_1.Vec)(35, 45),
                    angle: 155
                }
            }
        ],
        image: {
            position: (0, vector_1.Vec)(35, 45),
            angle: 155,
            lootScale: 0.55
        }
    },
    /**
    {
                idString: "baseball_bat",
                name: "Baseball Bat",
                swingSound: "heavy_swing",
                damage: 34,
                obstacleMultiplier: 1.5,
                radius: 3.8,
                offset: Vec(3.8, 2.2),
                cooldown: 340,
                fists: {
                    animationDuration: 150,
                    left: Vec(55, -15),
                    right: Vec(45, 0)
                },
                animation: [
                    {
                        duration: 150,
                        fists: {
                            left: Vec(28, -15),
                            right: Vec(50, -15)
                        },
                        image: {
                            position: Vec(115, -14),
                            angle: 45
                        }
                    },
                    {
                        duration: 150,
                        fists: {
                            left: Vec(55, -15),
                            right: Vec(45, 0)
                        },
                        image: {
                            position: Vec(35, 45),
                            angle: 155
                        }
                    }
                ],
                image: {
                    position: Vec(35, 45),
                    angle: 155,
                    lootScale: 0.55
                }
            },
    */
    {
        idString: "hatchet",
        name: "Hatchet",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.B,
        damage: 38,
        speedMultiplier: 1,
        obstacleMultiplier: 2,
        piercingMultiplier: 1.5,
        radius: 2,
        swingSound: "heavy_swing",
        offset: (0, vector_1.Vec)(5.2, -0.5),
        cooldown: 420,
        hitDelay: 180,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(40, -25),
            right: (0, vector_1.Vec)(40, 15)
        },
        image: {
            position: (0, vector_1.Vec)(42, 20),
            angle: 135,
            lootScale: 0.6
        },
        animation: [
            {
                duration: 100,
                fists: {
                    left: (0, vector_1.Vec)(40, 25),
                    right: (0, vector_1.Vec)(0, 50)
                },
                image: {
                    angle: 210,
                    position: (0, vector_1.Vec)(-10, 45)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(0, -50),
                    right: (0, vector_1.Vec)(40, -25)
                },
                image: {
                    position: (0, vector_1.Vec)(42, -25),
                    angle: 65
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(40, -25),
                    right: (0, vector_1.Vec)(40, 15)
                },
                image: {
                    position: (0, vector_1.Vec)(42, 20),
                    angle: 135
                }
            }
        ]
    },
    {
        idString: "fire_hatchet",
        name: "Fire Hatchet",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.A,
        damage: 50,
        speedMultiplier: 1,
        obstacleMultiplier: 2,
        piercingMultiplier: 2,
        iceMultiplier: 5,
        radius: 2.05,
        swingSound: "heavy_swing",
        offset: (0, vector_1.Vec)(5.2, -0.5),
        cooldown: 420,
        hitDelay: 180,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(40, -25),
            right: (0, vector_1.Vec)(40, 15)
        },
        image: {
            position: (0, vector_1.Vec)(42, 20),
            angle: 135,
            lootScale: 0.7
        },
        animation: [
            {
                duration: 100,
                fists: {
                    left: (0, vector_1.Vec)(40, 25),
                    right: (0, vector_1.Vec)(0, 50)
                },
                image: {
                    angle: 210,
                    position: (0, vector_1.Vec)(-10, 45)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(0, -50),
                    right: (0, vector_1.Vec)(40, -25)
                },
                image: {
                    position: (0, vector_1.Vec)(42, -25),
                    angle: 65
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(40, -25),
                    right: (0, vector_1.Vec)(40, 15)
                },
                image: {
                    position: (0, vector_1.Vec)(42, 20),
                    angle: 135
                }
            }
        ]
    },
    {
        idString: "crowbar",
        name: "Crowbar",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.A,
        swingSound: "heavy_swing",
        damage: 40,
        speedMultiplier: 1,
        obstacleMultiplier: 2.2,
        piercingMultiplier: 2,
        radius: 2.58,
        offset: (0, vector_1.Vec)(5.9, 1.7),
        cooldown: 560,
        reskins: ["winter"],
        fists: {
            animationDuration: 200,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(38, 35)
        },
        image: {
            position: (0, vector_1.Vec)(31, 41),
            angle: 190,
            lootScale: 0.65
        },
        animation: [
            {
                duration: 200,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(100, 35)
                },
                image: {
                    position: (0, vector_1.Vec)(110, 33),
                    angle: 40
                }
            },
            {
                duration: 200,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(38, 35)
                },
                image: {
                    position: (0, vector_1.Vec)(31, 41),
                    angle: 190
                }
            }
        ]
    },
    {
        idString: "kbar",
        name: "K-bar",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.C,
        swingSound: "soft_swing",
        damage: 25,
        speedMultiplier: 1,
        obstacleMultiplier: 1.25,
        radius: 2.7,
        iceMultiplier: 0.1,
        offset: (0, vector_1.Vec)(3.1, 0.9),
        cooldown: 225,
        fists: {
            animationDuration: 100,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(38, 35)
        },
        image: {
            position: (0, vector_1.Vec)(62, 42),
            angle: 60,
            lootScale: 0.8
        },
        animation: [
            {
                duration: 100,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(70, 20)
                },
                image: {
                    position: (0, vector_1.Vec)(90, 8),
                    angle: 5
                }
            },
            {
                duration: 100,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(38, 35)
                },
                image: {
                    position: (0, vector_1.Vec)(62, 42),
                    angle: 60
                }
            }
        ]
    },
    {
        idString: "sickle",
        name: "Sickle",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.B,
        damage: 20,
        swingSound: "soft_swing",
        speedMultiplier: 1,
        obstacleMultiplier: 1.3,
        radius: 2.7,
        offset: (0, vector_1.Vec)(4, 0),
        cooldown: 160,
        attackCooldown: 140,
        reskins: ["winter"],
        fireMode: 2 /* FireMode.Auto */,
        fists: {
            animationDuration: 70,
            left: (0, vector_1.Vec)(29, -39),
            right: (0, vector_1.Vec)(44, 35)
        },
        image: {
            position: (0, vector_1.Vec)(42, 66),
            angle: 135,
            lootScale: 0.85
        },
        animation: [
            {
                duration: 65,
                fists: {
                    left: (0, vector_1.Vec)(29, -39),
                    right: (0, vector_1.Vec)(44, -25)
                },
                image: {
                    position: (0, vector_1.Vec)(82, -34),
                    angle: 30
                }
            },
            {
                duration: 85,
                fists: {
                    left: (0, vector_1.Vec)(29, -39),
                    right: (0, vector_1.Vec)(44, 35)
                },
                image: {
                    position: (0, vector_1.Vec)(42, 66),
                    angle: 135
                }
            }
        ]
    },
    {
        idString: "maul",
        name: "Maul",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.S,
        maxHardness: 5,
        damage: 54,
        speedMultiplier: 1,
        iceMultiplier: 5,
        swingSound: "heavy_swing",
        obstacleMultiplier: 2,
        stonePiercing: true,
        piercingMultiplier: 1,
        radius: 2.7,
        offset: (0, vector_1.Vec)(5.4, -0.5),
        cooldown: 450,
        hitDelay: 180,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(40, -25),
            right: (0, vector_1.Vec)(40, 15)
        },
        image: {
            angle: 135,
            position: (0, vector_1.Vec)(40, 20),
            lootScale: 0.6
        },
        animation: [
            {
                duration: 100,
                fists: {
                    left: (0, vector_1.Vec)(40, 25),
                    right: (0, vector_1.Vec)(0, 50)
                },
                image: {
                    angle: 210,
                    position: (0, vector_1.Vec)(-10, 45)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(0, -50),
                    right: (0, vector_1.Vec)(40, -25)
                },
                image: {
                    angle: 65,
                    position: (0, vector_1.Vec)(40, -25)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(40, -25),
                    right: (0, vector_1.Vec)(40, 15)
                },
                image: {
                    angle: 135,
                    position: (0, vector_1.Vec)(40, 20)
                }
            }
        ]
    },
    {
        idString: "steelfang",
        name: "Steelfang",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.S,
        devItem: true,
        noSwap: true,
        damage: 40,
        noDrop: true,
        stonePiercing: true,
        speedMultiplier: 1,
        obstacleMultiplier: 1,
        piercingMultiplier: 1,
        radius: 2.7,
        offset: (0, vector_1.Vec)(3.1, 0.9),
        cooldown: 200,
        wearerAttributes: {
            passive: {
                speedBoost: 1.1
            }
        },
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(30, 40)
        },
        image: {
            position: (0, vector_1.Vec)(55, 55),
            angle: -120,
            lootScale: 0.9
        },
        animation: [
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(35, -40),
                    right: (0, vector_1.Vec)(75, -20)
                },
                image: {
                    angle: -800,
                    position: (0, vector_1.Vec)(80, -25)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(30, 40)
                },
                image: {
                    angle: -120,
                    position: (0, vector_1.Vec)(55, 55)
                }
            }
        ]
    },
    {
        idString: "gas_can",
        name: "Gas Can",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.S,
        damage: 22,
        speedMultiplier: 1,
        obstacleMultiplier: 1,
        radius: 1.75,
        offset: (0, vector_1.Vec)(3.1, 0.5),
        cooldown: 250,
        image: {
            position: (0, vector_1.Vec)(54, 35),
            lootScale: 0.8,
            separateWorldImage: true
        },
        fists: {
            animationDuration: 125,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(38, 35)
        },
        animation: [
            {
                duration: 125,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(75, 10)
                },
                image: {
                    angle: 0,
                    position: (0, vector_1.Vec)(91, 10)
                }
            },
            {
                duration: 125,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(38, 35)
                },
                image: {
                    angle: 0,
                    position: (0, vector_1.Vec)(54, 35)
                }
            }
        ]
    },
    {
        idString: "heap_sword",
        name: "HE-AP sword",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.S,
        devItem: true,
        noSwap: true,
        damage: 75,
        speedMultiplier: 1,
        obstacleMultiplier: 2.5,
        piercingMultiplier: 1,
        killstreak: true,
        stonePiercing: true,
        radius: 4,
        offset: (0, vector_1.Vec)(5, 0),
        cooldown: 300,
        maxTargets: Infinity,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(38, 35)
        },
        image: {
            position: (0, vector_1.Vec)(102, 35),
            angle: 50,
            lootScale: 0.6
        },
        animation: [
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(120, 20)
                },
                image: {
                    angle: -20,
                    position: (0, vector_1.Vec)(140, -30)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(38, 35)
                },
                image: {
                    angle: 50,
                    position: (0, vector_1.Vec)(102, 35)
                }
            }
        ]
    },
    {
        idString: "ice_pick",
        name: "Ice Pick",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.S,
        swingSound: "heavy_swing",
        damage: 40,
        speedMultiplier: 1,
        obstacleMultiplier: 1.9,
        piercingMultiplier: 1,
        iceMultiplier: 5,
        radius: 2.8,
        offset: (0, vector_1.Vec)(5.4, -0.5),
        cooldown: 350,
        hitDelay: 180,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(40, -30),
            right: (0, vector_1.Vec)(40, 10)
        },
        image: {
            position: (0, vector_1.Vec)(47, 25),
            angle: 130,
            lootScale: 0.6
        },
        animation: [
            {
                duration: 100,
                fists: {
                    left: (0, vector_1.Vec)(40, 25),
                    right: (0, vector_1.Vec)(0, 50)
                },
                image: {
                    angle: 210,
                    position: (0, vector_1.Vec)(-10, 45)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(0, -50),
                    right: (0, vector_1.Vec)(40, -25)
                },
                image: {
                    position: (0, vector_1.Vec)(47, -25),
                    angle: 65
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(40, -30),
                    right: (0, vector_1.Vec)(40, 10)
                },
                image: {
                    position: (0, vector_1.Vec)(47, 25),
                    angle: 135
                }
            }
        ]
    },
    {
        idString: "seax",
        name: "Seax",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.A,
        damage: 45,
        swingSound: "heavy_swing",
        speedMultiplier: 1,
        obstacleMultiplier: 1.5,
        radius: 2.7,
        offset: (0, vector_1.Vec)(5.4, -0.5),
        cooldown: 410,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(38, 35)
        },
        image: {
            position: (0, vector_1.Vec)(80, 32),
            angle: 35,
            lootScale: 0.7
        },
        animation: [
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(95, 20)
                },
                image: {
                    angle: 0,
                    position: (0, vector_1.Vec)(130, -9)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(38, 35)
                },
                image: {
                    angle: 35,
                    position: (0, vector_1.Vec)(80, 32)
                }
            }
        ]
    },
    {
        idString: "falchion",
        name: "Falchion",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.B,
        damage: 41,
        swingSound: "soft_swing",
        speedMultiplier: 1,
        obstacleMultiplier: 1.1,
        radius: 4.1,
        // maxTargets: Infinity, - TODO: It must hit multiple targets at once, however enabling this causes melee through wall bug to appear
        offset: (0, vector_1.Vec)(7.2, 0.5),
        piercingMultiplier: 0.95,
        cooldown: 450,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(43.5, 41.5)
        },
        image: {
            position: (0, vector_1.Vec)(5, 90),
            angle: 170,
            lootScale: 0.6
        },
        animation: [
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(0, -50),
                    right: (0, vector_1.Vec)(43.5, -25)
                },
                image: {
                    angle: 25,
                    position: (0, vector_1.Vec)(108, -25)
                }
            },
            {
                duration: 150,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(43.5, 41.5)
                },
                image: {
                    angle: 170,
                    position: (0, vector_1.Vec)(5, 90)
                }
            }
        ]
    },
    {
        idString: "chainsaw",
        name: "Chain Saw",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.S,
        fireMode: 2 /* FireMode.Auto */,
        devItem: true,
        noSwap: true,
        damage: 25,
        speedMultiplier: 1,
        obstacleMultiplier: 2,
        piercingMultiplier: 2,
        radius: 2.7,
        swingSound: "chainsaw",
        stopSound: "chainsaw_stop",
        offset: (0, vector_1.Vec)(6.8, 0.5),
        cooldown: 0,
        fists: {
            animationDuration: 0,
            left: (0, vector_1.Vec)(61, 10),
            right: (0, vector_1.Vec)(35, 70)
        },
        image: {
            position: (0, vector_1.Vec)(106, 27),
            angle: 10,
            lootScale: 0.5,
            animated: true
        },
        animation: [
            {
                duration: 10,
                fists: {
                    left: (0, vector_1.Vec)(57, 10),
                    right: (0, vector_1.Vec)(31, 70)
                },
                image: {
                    angle: 10,
                    position: (0, vector_1.Vec)(106, 27)
                }
            },
            {
                duration: 10,
                fists: {
                    left: (0, vector_1.Vec)(61, 10),
                    right: (0, vector_1.Vec)(35, 70)
                },
                image: {
                    angle: 10,
                    position: (0, vector_1.Vec)(106, 27)
                }
            }
        ]
    },
    {
        idString: "pan",
        name: "Pan",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.S,
        damage: 65,
        swingSound: "heavy_swing",
        hitSound: "pan_hit",
        speedMultiplier: 1,
        obstacleMultiplier: 1.5,
        radius: 2.7,
        offset: (0, vector_1.Vec)(5.5, 2),
        cooldown: 800,
        reflectiveSurface: {
            pointA: (0, vector_1.Vec)(3.55, -2),
            pointB: (0, vector_1.Vec)(2.6, 0.66)
        },
        onBack: {
            angle: 35,
            position: (0, vector_1.Vec)(-45, 30),
            reflectiveSurface: {
                pointA: (0, vector_1.Vec)(-2.83, 0.96),
                pointB: (0, vector_1.Vec)(-0.35, 2.62)
            }
        },
        fists: {
            animationDuration: 200,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(45, 35)
        },
        image: {
            separateWorldImage: true,
            angle: -70,
            position: (0, vector_1.Vec)(60, 4),
            lootScale: 0.9
        },
        animation: [
            {
                duration: 200,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(65, 55)
                },
                image: {
                    angle: 15,
                    position: (0, vector_1.Vec)(105, 65)
                }
            },
            {
                duration: 200,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(45, 35)
                },
                image: {
                    angle: -70,
                    position: (0, vector_1.Vec)(60, 4)
                }
            }
        ]
    },
    {
        idString: "kukri",
        name: "Kukri",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.A,
        swingSound: "soft_swing",
        hitSound: "kukri_stab",
        damage: 40,
        speedMultiplier: 1,
        obstacleMultiplier: 1,
        radius: 2.5,
        iceMultiplier: 0.1,
        offset: (0, vector_1.Vec)(4.25, -0.8),
        cooldown: 350,
        fists: {
            animationDuration: 150,
            left: (0, vector_1.Vec)(38, -35),
            right: (0, vector_1.Vec)(0, 45)
        },
        image: {
            position: (0, vector_1.Vec)(45, 45),
            angle: 50,
            lootScale: 0.75
        },
        hitDelay: 100,
        animation: [
            {
                duration: 100,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(-5, 48)
                },
                image: {
                    position: (0, vector_1.Vec)(24, 76),
                    angle: 95
                }
            },
            {
                duration: 95,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(60, 10)
                },
                image: {
                    position: (0, vector_1.Vec)(85, -25),
                    angle: -5
                }
            },
            {
                duration: 95,
                fists: {
                    left: (0, vector_1.Vec)(38, -35),
                    right: (0, vector_1.Vec)(0, 45)
                },
                image: {
                    position: (0, vector_1.Vec)(45, 45),
                    angle: 50
                }
            }
        ]
    },
    {
        idString: "pipe_wrench",
        name: "Pipe Wrench",
        defType: objectDefinitions_1.DefinitionType.Melee,
        tier: guns_1.Tier.A,
        damage: 42,
        obstacleMultiplier: 2.5,
        radius: 2.6,
        offset: (0, vector_1.Vec)(4.25, -0.05),
        cooldown: 450,
        speedMultiplier: 1,
        swingSound: "heavy_swing",
        fists: {
            animationDuration: 200,
            left: (0, vector_1.Vec)(38, -40),
            right: (0, vector_1.Vec)(47, 0)
        },
        image: {
            position: (0, vector_1.Vec)(40, -40),
            angle: -60,
            lootScale: 0.7
        },
        animation: [
            {
                duration: 200,
                fists: {
                    left: (0, vector_1.Vec)(48, -33),
                    right: (0, vector_1.Vec)(65, 20)
                },
                image: {
                    position: (0, vector_1.Vec)(85, 10),
                    angle: 10
                }
            },
            {
                duration: 200,
                fists: {
                    left: (0, vector_1.Vec)(38, -40),
                    right: (0, vector_1.Vec)(47, 0)
                },
                image: {
                    position: (0, vector_1.Vec)(40, -40),
                    angle: -60
                }
            }
        ]
    }
]);
//# sourceMappingURL=melees.js.map