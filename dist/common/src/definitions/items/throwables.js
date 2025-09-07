"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throwables = void 0;
const objectDefinitions_1 = require("../../utils/objectDefinitions");
const vector_1 = require("../../utils/vector");
const guns_1 = require("./guns");
const items_1 = require("./items");
exports.Throwables = new items_1.InventoryItemDefinitions([
    {
        idString: "frag_grenade",
        name: "Frag Grenade",
        defType: objectDefinitions_1.DefinitionType.Throwable,
        tier: guns_1.Tier.C,
        cookable: true,
        fuseTime: 4000,
        cookTime: 150,
        throwTime: 150,
        speedMultiplier: 1,
        cookSpeedMultiplier: 0.7,
        impactDamage: 1,
        obstacleMultiplier: 20,
        hitboxRadius: 1,
        fireDelay: 250,
        physics: {
            maxThrowDistance: 128,
            initialZVelocity: 4,
            initialAngularVelocity: 10,
            initialHeight: 0.5
        },
        image: {
            position: (0, vector_1.Vec)(60, 43),
            angle: 60,
            zIndex: 5,
            anchor: (0, vector_1.Vec)(0.5, 0.68)
        },
        detonation: {
            explosion: "frag_grenade_explosion"
        },
        animation: {
            pinImage: "proj_frag_pin",
            liveImage: "proj_frag",
            leverImage: "proj_frag_lever",
            cook: {
                cookingImage: "proj_frag_nopin",
                leftFist: (0, vector_1.Vec)(2.5, 0),
                rightFist: (0, vector_1.Vec)(-0.5, 2.15)
            },
            throw: {
                leftFist: (0, vector_1.Vec)(1.9, -1.75),
                rightFist: (0, vector_1.Vec)(4, 2.15)
            }
        }
    },
    {
        idString: "smoke_grenade",
        name: "Smoke Grenade",
        defType: objectDefinitions_1.DefinitionType.Throwable,
        tier: guns_1.Tier.D,
        cookable: false,
        fuseTime: 2000,
        cookTime: 150,
        throwTime: 150,
        speedMultiplier: 1,
        cookSpeedMultiplier: 0.7,
        impactDamage: 1,
        obstacleMultiplier: 20,
        hitboxRadius: 1,
        fireDelay: 250,
        physics: {
            maxThrowDistance: 128,
            initialZVelocity: 4,
            initialAngularVelocity: 10,
            initialHeight: 0.5
        },
        image: {
            position: (0, vector_1.Vec)(60, 43),
            angle: 60,
            zIndex: 5
        },
        detonation: {
            explosion: "smoke_grenade_explosion",
            spookyParticles: "plumpkin_smoke_grenade_particle",
            particles: "smoke_grenade_particle"
        },
        animation: {
            pinImage: "proj_smoke_pin",
            liveImage: "proj_smoke",
            leverImage: "proj_smoke_lever",
            cook: {
                cookingImage: "proj_smoke_nopin",
                leftFist: (0, vector_1.Vec)(2.5, 0),
                rightFist: (0, vector_1.Vec)(-0.5, 2.15)
            },
            throw: {
                leftFist: (0, vector_1.Vec)(1.9, -1.75),
                rightFist: (0, vector_1.Vec)(4, 2.15)
            }
        }
    },
    {
        idString: "confetti_grenade",
        name: "Confetti Grenade",
        defType: objectDefinitions_1.DefinitionType.Throwable,
        tier: guns_1.Tier.S,
        fuseTime: 4000,
        cookTime: 150,
        noSkin: true,
        throwTime: 150,
        speedMultiplier: 1,
        cookSpeedMultiplier: 0.7,
        impactDamage: 1,
        obstacleMultiplier: 20,
        hitboxRadius: 1,
        cookable: true,
        fireDelay: 250,
        physics: {
            maxThrowDistance: 128,
            initialZVelocity: 4,
            initialAngularVelocity: 10,
            initialHeight: 0.5
        },
        image: {
            position: (0, vector_1.Vec)(60, 43),
            angle: 60,
            zIndex: 5
        },
        detonation: {
            explosion: "confetti_grenade_explosion"
        },
        animation: {
            pinImage: "proj_frag_pin",
            liveImage: "proj_confetti",
            leverImage: "proj_frag_lever",
            cook: {
                cookingImage: "proj_confetti_nopin",
                leftFist: (0, vector_1.Vec)(2.5, 0),
                rightFist: (0, vector_1.Vec)(-0.5, 2.15)
            },
            throw: {
                leftFist: (0, vector_1.Vec)(1.9, -1.75),
                rightFist: (0, vector_1.Vec)(4, 2.15)
            }
        }
    },
    {
        idString: "c4",
        name: "C4",
        defType: objectDefinitions_1.DefinitionType.Throwable,
        tier: guns_1.Tier.S,
        c4: true,
        cookable: false,
        fuseTime: 750,
        cookTime: 250,
        throwTime: 150,
        cookSpeedMultiplier: 0.7,
        health: 40,
        speedMultiplier: 1,
        hitboxRadius: 1,
        fireDelay: 250,
        physics: {
            maxThrowDistance: 128,
            initialZVelocity: 4,
            initialAngularVelocity: 10,
            initialHeight: 0.5,
            drag: {
                air: 0.7,
                ground: 6,
                water: 8
            }
        },
        image: {
            position: (0, vector_1.Vec)(60, 43),
            angle: 60,
            zIndex: 5
        },
        detonation: {
            explosion: "c4_explosion"
        },
        animation: {
            liveImage: "proj_c4",
            activatedImage: "proj_c4_activated",
            cook: {
                leftFist: (0, vector_1.Vec)(2, -1),
                rightFist: (0, vector_1.Vec)(3, 0)
            },
            throw: {
                leftFist: (0, vector_1.Vec)(1.9, -1.75),
                rightFist: (0, vector_1.Vec)(4, 2.15)
            }
        }
    },
    {
        idString: "flare",
        name: "Flare",
        defType: objectDefinitions_1.DefinitionType.Throwable,
        tier: guns_1.Tier.S,
        cookable: false,
        summonAirdrop: true,
        fuseTime: 30000,
        cookTime: 250,
        throwTime: 150,
        cookSpeedMultiplier: 0.7,
        speedMultiplier: 1,
        hitboxRadius: 1,
        fireDelay: 1000,
        physics: {
            maxThrowDistance: 128,
            initialZVelocity: 4,
            initialAngularVelocity: 10,
            initialHeight: 0.5,
            drag: {
                air: 0.7,
                ground: 6,
                water: 8
            }
        },
        detonation: {
            decal: "used_flare_decal"
        },
        image: {
            position: (0, vector_1.Vec)(60, 43),
            angle: 60,
            zIndex: 5
        },
        animation: {
            liveImage: "proj_flare",
            pinImage: "proj_flare_pin",
            cook: {
                leftFist: (0, vector_1.Vec)(2.5, 0),
                rightFist: (0, vector_1.Vec)(-0.5, 2.15)
            },
            throw: {
                leftFist: (0, vector_1.Vec)(1.9, -1.75),
                rightFist: (0, vector_1.Vec)(4, 2.15)
            }
        },
        flicker: {
            image: "proj_flare_flicker",
            offset: (0, vector_1.Vec)(0, -1.5)
        },
        activeSound: "flare"
    },
    {
        idString: "proj_seed",
        name: "Seed",
        defType: objectDefinitions_1.DefinitionType.Throwable,
        tier: guns_1.Tier.S,
        cookable: true,
        fuseTime: 1500,
        cookTime: 0,
        throwTime: 0,
        devItem: true,
        noSwap: true,
        speedMultiplier: 1,
        cookSpeedMultiplier: 0.7,
        impactDamage: 1,
        killfeedFrame: "seedshot",
        obstacleMultiplier: 20,
        hitboxRadius: 1,
        fireDelay: 250,
        physics: {
            maxThrowDistance: 128,
            initialZVelocity: 4,
            initialAngularVelocity: 0,
            initialHeight: 0.5,
            noSpin: true,
            drag: {
                air: Infinity,
                ground: Infinity,
                water: Infinity
            }
        },
        image: {
            position: (0, vector_1.Vec)(60, 43),
            angle: 60,
            zIndex: 5,
            anchor: (0, vector_1.Vec)(0.5, 0.68)
        },
        detonation: {
            explosion: "seed_explosion"
        },
        animation: {
            liveImage: "proj_seed",
            cook: {
                leftFist: (0, vector_1.Vec)(2.5, 0),
                rightFist: (0, vector_1.Vec)(-0.5, 2.15)
            },
            throw: {
                leftFist: (0, vector_1.Vec)(1.9, -1.75),
                rightFist: (0, vector_1.Vec)(4, 2.15)
            }
        }
    }
]);
//# sourceMappingURL=throwables.js.map