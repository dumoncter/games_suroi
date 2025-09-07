"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guns = exports.Tier = void 0;
const misc_1 = require("../../utils/misc");
const objectDefinitions_1 = require("../../utils/objectDefinitions");
const vector_1 = require("../../utils/vector");
const items_1 = require("./items");
var Tier;
(function (Tier) {
    Tier[Tier["S"] = 0] = "S";
    Tier[Tier["A"] = 1] = "A";
    Tier[Tier["B"] = 2] = "B";
    Tier[Tier["C"] = 3] = "C";
    Tier[Tier["D"] = 4] = "D";
})(Tier || (exports.Tier = Tier = {}));
const gasParticlePresets = {
    automatic: {
        amount: 2,
        spread: 30,
        minSize: 0.2,
        maxSize: 0.3,
        minLife: 1000,
        maxLife: 2000,
        minSpeed: 5,
        maxSpeed: 15
    },
    shotgun: {
        amount: 12,
        spread: 60,
        minSize: 0.3,
        maxSize: 0.5,
        minLife: 2000,
        maxLife: 5000,
        minSpeed: 5,
        maxSpeed: 10
    },
    pistol: {
        amount: 2,
        spread: 60,
        minSize: 0.2,
        maxSize: 0.3,
        minLife: 1000,
        maxLife: 2000,
        minSpeed: 5,
        maxSpeed: 15
    },
    rifle: {
        amount: 3,
        spread: 30,
        minSize: 0.3,
        maxSize: 0.5,
        minLife: 1000,
        maxLife: 3000,
        minSpeed: 7,
        maxSpeed: 14
    }
};
exports.Guns = new items_1.InventoryItemDefinitions([
    //
    // Pistols
    //
    {
        idString: "g19",
        name: "G19",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.D,
        ammoType: "9mm",
        ammoSpawnAmount: 60,
        fireDelay: 110,
        switchDelay: 250,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.8,
        recoilDuration: 90,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 4,
        moveSpread: 8,
        length: 4.8,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(65, 0) },
        inventoryScale: 0.8,
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.5),
                velocity: {
                    y: {
                        min: -6,
                        max: 15
                    }
                }
            }],
        gasParticles: gasParticlePresets.pistol,
        capacity: 15,
        extendedCapacity: 24,
        reloadTime: 1.5,
        ballistics: {
            damage: 13,
            obstacleMultiplier: 1,
            speed: 0.22,
            range: 120
        },
        dual: {
            tier: Tier.C,
            leftRightOffset: 1.3,
            fireDelay: 75,
            shotSpread: 5,
            moveSpread: 10,
            capacity: 30,
            extendedCapacity: 48,
            reloadTime: 2.9
        }
    },
    {
        idString: "cz75a",
        name: "CZ-75A",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.D,
        ammoType: "9mm",
        ammoSpawnAmount: 64,
        fireDelay: 60,
        switchDelay: 250,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.8,
        recoilDuration: 90,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 8,
        moveSpread: 14,
        length: 5.3,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(70, -1) },
        inventoryScale: 0.8,
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.45),
                velocity: {
                    y: {
                        min: 2,
                        max: 18
                    }
                }
            }],
        gasParticles: gasParticlePresets.pistol,
        capacity: 16,
        extendedCapacity: 26,
        reloadTime: 1.9,
        ballistics: {
            damage: 9,
            obstacleMultiplier: 1,
            speed: 0.18,
            range: 70
        },
        dual: {
            tier: Tier.C,
            leftRightOffset: 1.3,
            fireDelay: 30,
            shotSpread: 8,
            moveSpread: 14,
            capacity: 32,
            extendedCapacity: 52,
            reloadTime: 3.7
        }
    },
    {
        idString: "m1895",
        name: "M1895",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.D,
        ammoType: "762mm",
        ammoSpawnAmount: 28,
        fireDelay: 375,
        switchDelay: 250,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.75,
        recoilDuration: 135,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 2,
        moveSpread: 5,
        length: 5.35,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(70, 0) },
        inventoryScale: 0.85,
        casingParticles: [{
                frame: "casing_762x38mmR",
                position: (0, vector_1.Vec)(3.5, 0.5),
                count: 7,
                velocity: {
                    x: {
                        min: -8,
                        max: -2
                    },
                    y: {
                        min: 2,
                        max: 9,
                        randomSign: true
                    }
                },
                on: "reload"
            }],
        gasParticles: gasParticlePresets.pistol,
        capacity: 7,
        reloadTime: 2.1,
        ballistics: {
            damage: 24.5,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        },
        dual: {
            tier: Tier.C,
            ammoSpawnAmount: 42,
            leftRightOffset: 1.3,
            fireDelay: 187.5,
            shotSpread: 2,
            moveSpread: 5,
            capacity: 14,
            reloadTime: 4
        }
    },
    {
        idString: "deagle",
        name: "DEagle",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "50cal",
        ammoSpawnAmount: 42,
        fireDelay: 200,
        switchDelay: 250,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.65,
        recoilDuration: 150,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 3,
        moveSpread: 7,
        length: 5.4,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(75, 0) },
        inventoryScale: 0.85,
        casingParticles: [{
                frame: "casing_50ae",
                position: (0, vector_1.Vec)(3.5, 0.3),
                velocity: {
                    y: {
                        min: -6,
                        max: 15
                    }
                }
            }],
        gasParticles: gasParticlePresets.pistol,
        capacity: 7,
        extendedCapacity: 9,
        reloadTime: 2.3,
        ballistics: {
            damage: 37,
            obstacleMultiplier: 1.25,
            speed: 0.22,
            range: 130,
            tracer: {
                color: 0xE2C910,
                saturatedColor: 0xFFBF00
            }
        },
        dual: {
            tier: Tier.A,
            ammoSpawnAmount: 84,
            leftRightOffset: 1.4,
            fireDelay: 115,
            shotSpread: 3,
            moveSpread: 7,
            capacity: 14,
            extendedCapacity: 18,
            reloadTime: 3.8
        }
    },
    {
        idString: "rsh12",
        name: "RSh-12",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "50cal",
        ammoSpawnAmount: 30,
        fireDelay: 400,
        switchDelay: 250,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.8,
        recoilDuration: 600,
        fsaReset: 600,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 4,
        moveSpread: 8,
        length: 6.6,
        noMuzzleFlash: true,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.3),
                frame: "casing_127x55mm",
                on: "reload",
                count: 5,
                velocity: {
                    x: {
                        min: -8,
                        max: -2
                    },
                    y: {
                        min: 2,
                        max: 9,
                        randomSign: true
                    }
                }
            }],
        image: { position: (0, vector_1.Vec)(87, 0) },
        inventoryScale: 0.85,
        gasParticles: gasParticlePresets.pistol,
        capacity: 5,
        reloadTime: 2.4,
        ballistics: {
            damage: 60,
            obstacleMultiplier: 1,
            speed: 0.3,
            range: 120,
            tracer: {
                opacity: 0.3,
                width: 1.5
            }
        },
        dual: {
            tier: Tier.S,
            leftRightOffset: 1.3,
            ammoSpawnAmount: 60,
            fireDelay: 200,
            shotSpread: 4,
            moveSpread: 8,
            capacity: 10,
            reloadTime: 4.2
        }
    },
    {
        idString: "mp5k",
        name: "MP5k",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.D,
        ammoType: "9mm",
        ammoSpawnAmount: 80,
        speedMultiplier: 1.136,
        capacity: 20,
        extendedCapacity: 30,
        reloadTime: 1.8,
        fireDelay: 62,
        burstProperties: {
            shotsPerBurst: 3,
            burstCooldown: 250
        },
        switchDelay: 250,
        recoilMultiplier: 0.8,
        recoilDuration: 300,
        fireMode: 1 /* FireMode.Burst */,
        shotSpread: 4,
        moveSpread: 8,
        length: 5.6,
        fists: {
            left: (0, vector_1.Vec)(85, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(71, 0) },
        inventoryScale: 0.85,
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.35)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 12.75,
            obstacleMultiplier: 1.025,
            speed: 0.25,
            range: 100
        },
        dual: {
            tier: Tier.C,
            leftRightOffset: 1.3,
            ammoSpawnAmount: 80,
            fists: {
                left: (0, vector_1.Vec)(40, -1.3),
                right: (0, vector_1.Vec)(40, 1.3),
                rightZIndex: 4,
                leftZIndex: 4,
                animationDuration: 100
            },
            burstProperties: {
                shotsPerBurst: 3,
                burstCooldown: 125
            },
            fireDelay: 60,
            shotSpread: 4,
            moveSpread: 6.75,
            capacity: 40,
            reloadTime: 3.2
        }
    },
    {
        idString: "psm",
        name: "PSM",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.D,
        ammoType: "545mm",
        ammoSpawnAmount: 24,
        fireDelay: 200,
        switchDelay: 250,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.75,
        recoilDuration: 135,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 2,
        moveSpread: 5,
        length: 4.8,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(70, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.5)
            }],
        gasParticles: gasParticlePresets.pistol,
        capacity: 8,
        extendedCapacity: 12,
        reloadTime: 2.1,
        ballistics: {
            damage: 17,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        },
        dual: {
            tier: Tier.C,
            ammoSpawnAmount: 48,
            leftRightOffset: 1.3,
            fireDelay: 168,
            shotSpread: 2,
            moveSpread: 5,
            capacity: 16,
            extendedCapacity: 24,
            reloadTime: 4
        }
    },
    {
        idString: "ots23",
        name: "OTs-23",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "545mm",
        ammoSpawnAmount: 45,
        fireDelay: 133,
        switchDelay: 250,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.75,
        recoilDuration: 135,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 5,
        length: 5.1,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(70, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.5)
            }],
        gasParticles: gasParticlePresets.pistol,
        capacity: 15,
        extendedCapacity: 20,
        reloadTime: 2.1,
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        },
        dual: {
            tier: Tier.A,
            ammoSpawnAmount: 90,
            leftRightOffset: 1.4,
            fireDelay: 112,
            shotSpread: 2,
            moveSpread: 5,
            capacity: 30,
            extendedCapacity: 40,
            reloadTime: 4
        }
    },
    //
    // Submachine guns (SMGs)
    //
    {
        idString: "saf200",
        name: "SAF-200",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "9mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        extendedCapacity: 42,
        reloadTime: 1.8,
        fireDelay: 75,
        burstProperties: {
            shotsPerBurst: 3,
            burstCooldown: 300
        },
        switchDelay: 300,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 300,
        fireMode: 1 /* FireMode.Burst */,
        shotSpread: 3,
        moveSpread: 4,
        length: 6.25,
        fists: {
            left: (0, vector_1.Vec)(95, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(71, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.35)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 16,
            obstacleMultiplier: 1,
            speed: 0.28,
            range: 140
        }
    },
    {
        idString: "micro_uzi",
        name: "Micro Uzi",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "9mm",
        ammoSpawnAmount: 96,
        capacity: 32,
        extendedCapacity: 50,
        reloadTime: 1.75,
        fireDelay: 40,
        switchDelay: 300,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.75,
        recoilDuration: 60,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 9,
        moveSpread: 19,
        length: 5.07,
        fists: {
            left: (0, vector_1.Vec)(70, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.2, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        image: { position: (0, vector_1.Vec)(68, 0) },
        inventoryScale: 0.85,
        ballistics: {
            damage: 7.75,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 85
        }
    },
    {
        idString: "mpx",
        name: "MPX",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "9mm",
        ammoSpawnAmount: 96,
        capacity: 32,
        extendedCapacity: 40,
        reloadTime: 2.1,
        fireDelay: 90,
        switchDelay: 300,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 4,
        length: 6.65,
        fists: {
            left: (0, vector_1.Vec)(103, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(75, 1) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.4),
                velocity: {
                    y: {
                        min: 5,
                        max: 10
                    }
                }
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 11,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 130
        }
    },
    {
        idString: "vector",
        name: "Vector",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "9mm",
        ammoSpawnAmount: 99,
        capacity: 33,
        extendedCapacity: 50,
        reloadTime: 1.7,
        fireDelay: 40,
        switchDelay: 300,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 60,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3,
        moveSpread: 7,
        length: 6.1,
        fists: {
            left: (0, vector_1.Vec)(100, -4),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
                position: (0, vector_1.Vec)(4.7, 0.3)
            }],
        gasParticles: gasParticlePresets.automatic,
        image: { position: (0, vector_1.Vec)(70, -1) },
        ballistics: {
            damage: 9,
            obstacleMultiplier: 1,
            speed: 0.27,
            range: 80
        }
    },
    {
        idString: "pp19",
        name: "PP-19 Vityaz",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "9mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        extendedCapacity: 45,
        reloadTime: 2.3,
        fireDelay: 50,
        switchDelay: 300,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3,
        moveSpread: 6.75,
        length: 7.3,
        noMuzzleFlash: true,
        fists: {
            left: (0, vector_1.Vec)(88, -5),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.4)
            }],
        image: { position: (0, vector_1.Vec)(80, 1.3) },
        ballistics: {
            damage: 10.5,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 160,
            tracer: {
                opacity: 0.15
            }
        }
    },
    //
    // Assault rifles
    //
    {
        idString: "ak47",
        name: "AK-47",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "762mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        extendedCapacity: 40,
        reloadTime: 2.5,
        fireDelay: 100,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 6,
        length: 7.75,
        fists: {
            left: (0, vector_1.Vec)(115, -2),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(85, 1) },
        casingParticles: [{
                frame: "casing_762x39mm",
                position: (0, vector_1.Vec)(4.2, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 14,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        }
    },
    {
        idString: "mcx_spear",
        name: "MCX Spear",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "762mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        extendedCapacity: 30,
        reloadTime: 2.75,
        fireDelay: 87.5,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 130,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 4,
        length: 7.9,
        fists: {
            left: (0, vector_1.Vec)(115, -6),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(87, 1.5) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 16,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 180,
            tracer: {
                length: 1.4
            }
        }
    },
    {
        idString: "svu",
        name: "SVU-A",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "762mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        extendedCapacity: 40,
        reloadTime: 3.2,
        fireDelay: 120,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.725,
        recoilDuration: 150,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3,
        moveSpread: 8,
        length: 8.4,
        fists: {
            left: (0, vector_1.Vec)(100, -8),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(90, 1.5) },
        casingParticles: [{
                frame: "casing_762x54mmR",
                position: (0, vector_1.Vec)(4, 0.4)
            }],
        noMuzzleFlash: true,
        ballistics: {
            damage: 19,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 180,
            tracer: {
                length: 1.4,
                opacity: 0.15
            }
        }
    },
    {
        idString: "m16a2",
        name: "M16A2",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "556mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        extendedCapacity: 30,
        reloadTime: 2.2,
        fireDelay: 75,
        burstProperties: {
            shotsPerBurst: 3,
            burstCooldown: 325
        },
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 350,
        fireMode: 1 /* FireMode.Burst */,
        shotSpread: 2,
        moveSpread: 4,
        length: 8.68,
        fists: {
            left: (0, vector_1.Vec)(110, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(92, 1.5) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 19,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 180
        }
    },
    {
        idString: "aug",
        name: "AUG",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "556mm",
        ammoSpawnAmount: 90,
        fireDelay: 70,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 120,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 4,
        moveSpread: 11,
        length: 6.8,
        fists: {
            left: (0, vector_1.Vec)(100, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(75, -1) },
        casingParticles: [{
                position: (0, vector_1.Vec)(2.5, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        capacity: 30,
        extendedCapacity: 42,
        reloadTime: 2.25,
        ballistics: {
            damage: 10.5,
            obstacleMultiplier: 1.5,
            speed: 0.28,
            range: 160
        }
    },
    {
        idString: "arx160",
        name: "ARX-160",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "762mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        extendedCapacity: 40,
        reloadTime: 2.5,
        fireDelay: 75,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 145,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 5,
        moveSpread: 10,
        length: 7.3,
        fists: {
            left: (0, vector_1.Vec)(103, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(80, 0) },
        casingParticles: [{
                frame: "casing_762x39mm",
                position: (0, vector_1.Vec)(3.7, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 12.25,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        }
    },
    {
        idString: "acr",
        name: "ACR",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "556mm",
        ammoSpawnAmount: 90,
        fireDelay: 72.5,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 130,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 7,
        noMuzzleFlash: true,
        length: 7.5,
        fists: {
            left: (0, vector_1.Vec)(100, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(78, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.4)
            }],
        capacity: 30,
        extendedCapacity: 45,
        reloadTime: 3,
        ballistics: {
            damage: 14.5,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 160,
            tracer: {
                opacity: 0.15
            }
        }
    },
    {
        idString: "shak12",
        name: "ShAK-12",
        defType: objectDefinitions_1.DefinitionType.Gun,
        ammoType: "50cal",
        ammoSpawnAmount: 50,
        speedMultiplier: 1,
        tier: Tier.A,
        capacity: 10,
        extendedCapacity: 15,
        reloadTime: 3,
        fireDelay: 125,
        switchDelay: 400,
        recoilMultiplier: 0.75,
        recoilDuration: 400,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 6,
        moveSpread: 6,
        bulletCount: 2,
        length: 7.2,
        fists: {
            left: (0, vector_1.Vec)(85, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(70, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.53, 0.4)
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 17.5,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 60,
            tracer: {
                width: 1.3
            }
        }
    },
    {
        idString: "aks74u",
        name: "AKs-74u",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "545mm",
        ammoSpawnAmount: 90,
        capacity: 30,
        extendedCapacity: 40,
        reloadTime: 2.5,
        fireDelay: 85,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 6,
        length: 7.3,
        fists: {
            left: (0, vector_1.Vec)(105, -3),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(85, 1) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4.2, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 10.45,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 160
        }
    },
    {
        idString: "an94",
        name: "AN-94",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "545mm",
        ammoSpawnAmount: 90,
        capacity: 45,
        extendedCapacity: 60,
        reloadTime: 2.5,
        fireDelay: 50,
        burstProperties: {
            shotsPerBurst: 2,
            burstCooldown: 250
        },
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 150,
        fireMode: 1 /* FireMode.Burst */,
        shotSpread: 2,
        moveSpread: 6,
        length: 7.8,
        fists: {
            left: (0, vector_1.Vec)(105, -3),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(83, 1) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4.2, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 24,
            obstacleMultiplier: 1.5,
            speed: 0.32,
            range: 160
        }
    },
    //
    // Light machine guns (LMGs)
    //
    {
        idString: "fn_fal",
        name: "FN FAL",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "762mm",
        ammoSpawnAmount: 100,
        capacity: 50,
        extendedCapacity: 100,
        reloadTime: 3.4,
        fireDelay: 115,
        switchDelay: 400,
        speedMultiplier: 0.897,
        recoilMultiplier: 0.7, // also test out 0.75
        recoilDuration: 200,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3.5,
        moveSpread: 7.5, // also test out 6.5, 7, 8
        length: 9.47,
        fists: {
            left: (0, vector_1.Vec)(120, -8),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(100, 3) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.6)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 16.5,
            obstacleMultiplier: 2,
            speed: 0.3,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "stoner_63",
        name: "Stoner 63",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "556mm",
        ammoSpawnAmount: 150,
        capacity: 75,
        extendedCapacity: 125,
        reloadTime: 3.8,
        fireDelay: 90,
        switchDelay: 400,
        speedMultiplier: 0.978,
        recoilMultiplier: 0.7,
        recoilDuration: 175,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3,
        moveSpread: 4.5,
        length: 8,
        fists: {
            left: (0, vector_1.Vec)(100, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(82, 0) },
        casingParticles: [
            {
                position: (0, vector_1.Vec)(3.7, -0.6),
                velocity: {
                    y: {
                        min: -15,
                        max: -10
                    }
                }
            },
            {
                position: (0, vector_1.Vec)(3.9, -0.6),
                frame: "m13_link",
                velocity: {
                    x: {
                        min: -6,
                        max: 8
                    },
                    y: {
                        min: -25,
                        max: -10
                    }
                }
            }
        ],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 14.25,
            obstacleMultiplier: 2,
            speed: 0.28,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "mg5",
        name: "MG5",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "762mm",
        ammoSpawnAmount: 240,
        capacity: 120,
        extendedCapacity: 160,
        reloadTime: 5.2,
        fireDelay: 95,
        switchDelay: 400,
        speedMultiplier: 0.87,
        recoilMultiplier: 0.65,
        recoilDuration: 200,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 4.5,
        length: 8.6,
        fists: {
            left: (0, vector_1.Vec)(110, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(90, 1) },
        casingParticles: [
            {
                position: (0, vector_1.Vec)(4, 0.6)
            },
            {
                position: (0, vector_1.Vec)(4.2, 0.6),
                frame: "m13_link",
                velocity: {
                    x: {
                        min: -6,
                        max: 8
                    },
                    y: {
                        min: 10,
                        max: 25
                    }
                }
            }
        ],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 16.5,
            obstacleMultiplier: 1.5,
            speed: 0.26,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "negev",
        name: "Negev SF",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "556mm",
        ammoSpawnAmount: 200,
        capacity: 200,
        extendedCapacity: 250,
        reloadTime: 5.9,
        fireDelay: 70,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.675,
        recoilDuration: 200,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 5,
        moveSpread: 8,
        length: 7.15,
        fists: {
            left: (0, vector_1.Vec)(109, -18),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(80, -3.6) },
        casingParticles: [
            {
                position: (0, vector_1.Vec)(4, 0.6)
            },
            {
                position: (0, vector_1.Vec)(4.2, 0.6),
                frame: "m13_link",
                velocity: {
                    x: {
                        min: -6,
                        max: 8
                    },
                    y: {
                        min: 10,
                        max: 25
                    }
                }
            }
        ],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 13.25,
            obstacleMultiplier: 1.5,
            speed: 0.28,
            range: 160,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "mg36",
        name: "MG36",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "556mm",
        ammoSpawnAmount: 100,
        capacity: 50,
        extendedCapacity: 100,
        reloadTime: 2.75,
        fireDelay: 75,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 140,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3.5,
        moveSpread: 8,
        length: 7.8,
        fists: {
            left: (0, vector_1.Vec)(100, -4),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(83, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.75, 0.45)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 11,
            obstacleMultiplier: 2,
            speed: 0.28,
            range: 160
        }
    },
    {
        idString: "pk61",
        name: "PK-61",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "762mm",
        ammoSpawnAmount: 200,
        capacity: 100,
        extendedCapacity: 150,
        reloadTime: 4.8,
        fireDelay: 110,
        switchDelay: 400,
        speedMultiplier: 0.92,
        recoilMultiplier: 0.7,
        recoilDuration: 200,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 4,
        length: 9.45,
        fists: {
            left: (0, vector_1.Vec)(120, -4),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(100, 0) },
        casingParticles: [{
                frame: "casing_762x54mmR",
                position: (0, vector_1.Vec)(4.6, -0.8),
                velocity: {
                    y: {
                        min: -15,
                        max: -10
                    }
                }
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 17,
            obstacleMultiplier: 2,
            speed: 0.32,
            range: 250,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "rpk74",
        name: "RPK-74",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "545mm",
        ammoSpawnAmount: 90,
        capacity: 45,
        extendedCapacity: 60,
        reloadTime: 3.8,
        fireDelay: 100,
        switchDelay: 400,
        speedMultiplier: 0.978,
        recoilMultiplier: 0.7,
        recoilDuration: 175,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3,
        moveSpread: 4.5,
        length: 8.3,
        fists: {
            left: (0, vector_1.Vec)(90, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(85, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.7, 0.6)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 14,
            obstacleMultiplier: 2,
            speed: 0.28,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    {
        idString: "rpk16",
        name: "RPK-16",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "545mm",
        ammoSpawnAmount: 190,
        capacity: 95,
        extendedCapacity: 145,
        reloadTime: 3.8,
        fireDelay: 90,
        switchDelay: 400,
        speedMultiplier: 0.978,
        recoilMultiplier: 0.7,
        recoilDuration: 175,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3,
        moveSpread: 4.5,
        length: 8.3,
        fists: {
            left: (0, vector_1.Vec)(110, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(88, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.7, 0.6)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 11,
            obstacleMultiplier: 2.25,
            speed: 0.28,
            range: 180,
            tracer: {
                width: 1.1,
                length: 1.4
            }
        }
    },
    //
    // Shotguns
    //
    {
        idString: "m3k",
        name: "M3K",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "12g",
        ammoSpawnAmount: 18,
        capacity: 9,
        extendedCapacity: 12,
        reloadTime: 0.55,
        fireDelay: 700,
        switchDelay: 700,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 500,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 5,
        moveSpread: 7,
        jitterRadius: 0.5,
        bulletCount: 9,
        length: 8.5,
        fists: {
            left: (0, vector_1.Vec)(95, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(85, 2) },
        casingParticles: [{
                frame: "casing_12ga_flechette",
                position: (0, vector_1.Vec)(4, 0.6)
            }],
        gasParticles: gasParticlePresets.shotgun,
        shotsPerReload: 1,
        ballistics: {
            damage: 9,
            obstacleMultiplier: 1,
            speed: 0.2,
            range: 80
        }
    },
    {
        idString: "model_37",
        name: "Model 37",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "12g",
        ammoSpawnAmount: 15,
        capacity: 5,
        extendedCapacity: 8,
        reloadTime: 0.75,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 550,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 11,
        moveSpread: 14,
        jitterRadius: 1.25,
        bulletCount: 10,
        length: 8.15,
        fists: {
            left: (0, vector_1.Vec)(116, -3),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(89, 0.5) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.6),
                ejectionDelay: 450,
                velocity: {
                    y: {
                        min: 2,
                        max: 5,
                        randomSign: true
                    }
                }
            }],
        gasParticles: gasParticlePresets.shotgun,
        shotsPerReload: 1,
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.7
            }
        }
    },
    {
        idString: "hp18",
        name: "HP-18",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "12g",
        ammoSpawnAmount: 15,
        capacity: 5,
        extendedCapacity: 8,
        reloadTime: 0.725,
        shotsPerReload: 1,
        fireDelay: 300,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.6,
        recoilDuration: 600,
        fireMode: 0 /* FireMode.Single */,
        bulletCount: 18,
        shotSpread: 18,
        moveSpread: 22,
        jitterRadius: 1.75,
        length: 7.4,
        fists: {
            left: (0, vector_1.Vec)(95, -1),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(75, 2) },
        casingParticles: [{
                frame: "casing_12ga_bird",
                position: (0, vector_1.Vec)(4, 0.6)
            }],
        gasParticles: gasParticlePresets.shotgun,
        ballistics: {
            damage: 4,
            obstacleMultiplier: 1,
            speed: 0.12,
            range: 40,
            tracer: {
                length: 0.5
            }
        }
    },
    {
        idString: "badlander",
        name: "Badlander",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "12g",
        ammoSpawnAmount: 10,
        capacity: 2,
        reloadTime: 2.6,
        fireDelay: 250,
        switchDelay: 250,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 550,
        fireMode: 0 /* FireMode.Single */,
        bulletCount: 10,
        shotSpread: 11,
        moveSpread: 14,
        jitterRadius: 1.5,
        length: 6,
        fists: {
            left: (0, vector_1.Vec)(95, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(75, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.6),
                count: 2,
                velocity: {
                    y: {
                        min: 8,
                        max: 15,
                        randomSign: true
                    }
                },
                on: "reload"
            }],
        gasParticles: gasParticlePresets.shotgun,
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.5
            }
        }
    },
    {
        idString: "usas12",
        name: "USAS-12",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "12g",
        ammoSpawnAmount: 30,
        capacity: 10,
        extendedCapacity: 20,
        reloadTime: 3,
        fireDelay: 525,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 525,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 5,
        length: 7.35,
        fists: {
            left: (0, vector_1.Vec)(105, -1),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(80, -1.5) },
        casingParticles: [{
                frame: "casing_12ga_he",
                position: (0, vector_1.Vec)(4.5, 0.6)
            }],
        ballistics: {
            damage: 5,
            obstacleMultiplier: 1,
            speed: 0.22,
            range: 50,
            onHitExplosion: "usas_explosion",
            explodeOnImpact: true,
            allowRangeOverride: true,
            tracer: {
                length: 0.5,
                color: 0xFF0000,
                saturatedColor: 0xF55C3D
            }
        }
    },
    {
        idString: "vepr12",
        name: "Vepr-12",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "12g",
        ammoSpawnAmount: 20,
        capacity: 5,
        extendedCapacity: 8,
        reloadTime: 2.4,
        fireDelay: 400,
        switchDelay: 650,
        speedMultiplier: 1,
        recoilMultiplier: 0.7,
        recoilDuration: 550,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 11,
        moveSpread: 14,
        jitterRadius: 1.25,
        length: 7.3,
        bulletCount: 10,
        fists: {
            left: (0, vector_1.Vec)(99, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(79, 2) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.9, 0.6)
            }],
        gasParticles: gasParticlePresets.shotgun,
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.5
            }
        }
    },
    {
        idString: "stevens_555",
        name: "Stevens 555",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "12g",
        ammoSpawnAmount: 10,
        capacity: 2,
        reloadTime: 2.3,
        fireDelay: 300,
        switchDelay: 500,
        speedMultiplier: 1,
        recoilMultiplier: 0.6,
        recoilDuration: 400,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 5,
        moveSpread: 7,
        length: 7.95,
        jitterRadius: 0.5,
        bulletCount: 9,
        fists: {
            left: (0, vector_1.Vec)(84, -3),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(83, 0) },
        casingParticles: [{
                frame: "casing_12ga_flechette",
                position: (0, vector_1.Vec)(4, 0.6),
                count: 2,
                velocity: {
                    y: {
                        min: 8,
                        max: 12,
                        randomSign: true
                    }
                },
                on: "reload"
            }],
        gasParticles: gasParticlePresets.shotgun,
        ballistics: {
            damage: 9,
            obstacleMultiplier: 1,
            speed: 0.2,
            range: 80
        }
    },
    {
        idString: "m590m",
        name: "M590M",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "12g",
        ammoSpawnAmount: 15,
        capacity: 5,
        extendedCapacity: 10,
        reloadTime: 2.8,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 500,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 2,
        moveSpread: 5,
        length: 8,
        fists: {
            left: (0, vector_1.Vec)(100, -3),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(82, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4.2, 0.6),
                ejectionDelay: 400,
                frame: "casing_12ga_he"
            }],
        gasParticles: gasParticlePresets.shotgun,
        ballistics: {
            damage: 5,
            obstacleMultiplier: 1,
            speed: 0.22,
            range: 50,
            onHitExplosion: "m590m_explosion",
            explodeOnImpact: true,
            allowRangeOverride: true,
            tracer: {
                length: 0.5,
                color: 0xFF0000,
                saturatedColor: 0xF55C3D
            }
        }
    },
    {
        idString: "mp153",
        name: "MP-153",
        tier: Tier.A,
        ammoType: "12g",
        speedMultiplier: 1,
        defType: objectDefinitions_1.DefinitionType.Gun,
        ammoSpawnAmount: 16,
        capacity: 8,
        extendedCapacity: 12,
        reloadTime: 0.45,
        shotsPerReload: 1,
        fireDelay: 400,
        switchDelay: 600,
        recoilMultiplier: 0.6,
        recoilDuration: 400,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 2,
        moveSpread: 5,
        fsaReset: 600,
        length: 8.45,
        fists: {
            left: (0, vector_1.Vec)(108, -3),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(98, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4.5, 0.6),
                frame: "casing_12ga_slug"
            }],
        gasParticles: gasParticlePresets.shotgun,
        ballistics: {
            damage: 78,
            obstacleMultiplier: 1,
            speed: 0.25,
            range: 120,
            tracer: {
                width: 2,
                length: 1.3
            }
        }
    },
    //
    // Sniper rifles
    //
    {
        idString: "mosin_nagant",
        name: "Mosin-Nagant",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "762mm",
        ammoSpawnAmount: 20,
        spawnScope: "4x_scope",
        capacity: 5,
        reloadTime: 0.85,
        shotsPerReload: 1,
        reloadFullOnEmpty: true,
        fullReloadTime: 2.9,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.45,
        recoilDuration: 750,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 1,
        moveSpread: 2,
        length: 8.5,
        shootOnRelease: true,
        fists: {
            left: (0, vector_1.Vec)(100, 0),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(86.5, 2.7) },
        casingParticles: [{
                frame: "casing_762x54mmR",
                position: (0, vector_1.Vec)(4, 0.6),
                ejectionDelay: 700
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 70,
            obstacleMultiplier: 1,
            speed: 0.33,
            range: 250,
            tracer: {
                width: 1.4,
                length: 2.5
            }
        }
    },
    {
        idString: "tango_51",
        name: "Tango 51",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "762mm",
        ammoSpawnAmount: 20,
        spawnScope: "8x_scope",
        capacity: 5,
        extendedCapacity: 10,
        reloadTime: 2.6,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.4,
        recoilDuration: 1000,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 0.3,
        moveSpread: 0.6,
        length: 8.85,
        shootOnRelease: true,
        fists: {
            left: (0, vector_1.Vec)(106, -1),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(87, 3) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.6),
                ejectionDelay: 450
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 79,
            obstacleMultiplier: 1,
            speed: 0.4,
            range: 280,
            tracer: {
                width: 1.6,
                length: 3.5
            }
        }
    },
    {
        idString: "cz600",
        name: "CZ-600",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "556mm",
        ammoSpawnAmount: 20,
        capacity: 5,
        extendedCapacity: 10,
        reloadTime: 2.2,
        fireDelay: 600,
        switchDelay: 600,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 750,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 0.75,
        moveSpread: 1.25,
        length: 8.25,
        shootOnRelease: true,
        fists: {
            left: (0, vector_1.Vec)(105, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(85, 3.5) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.7, 0.4),
                ejectionDelay: 250
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 55,
            obstacleMultiplier: 1,
            speed: 0.3,
            range: 250,
            tracer: {
                width: 1.3,
                length: 2.4
            }
        }
    },
    {
        idString: "l115a1",
        name: "L115A1",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "338lap",
        ammoSpawnAmount: 12,
        spawnScope: "16x_scope",
        fireDelay: 1500,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.4,
        recoilDuration: 1600,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 0.2,
        moveSpread: 0.4,
        shootOnRelease: true,
        length: 10.6,
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.2),
                ejectionDelay: 500
            }],
        fists: {
            left: (0, vector_1.Vec)(110, 0),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(110, 3) },
        gasParticles: gasParticlePresets.rifle,
        capacity: 3,
        extendedCapacity: 5,
        reloadTime: 3.8,
        ballistics: {
            damage: 150,
            obstacleMultiplier: 1,
            speed: 0.5,
            tracer: {
                width: 2.5,
                length: 4
            },
            range: 300
        }
    },
    {
        idString: "rgs",
        name: "RG Scout",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "556mm",
        ammoSpawnAmount: 30,
        spawnScope: "4x_scope",
        capacity: 10,
        extendedCapacity: 15,
        reloadTime: 2.6,
        fireDelay: 600,
        switchDelay: 600,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 600,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 0.5,
        moveSpread: 2,
        length: 8.75,
        shootOnRelease: true,
        fists: {
            left: (0, vector_1.Vec)(105, -1),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(85, 3) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.4),
                ejectionDelay: 250
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 65,
            obstacleMultiplier: 1,
            speed: 0.33,
            range: 270,
            tracer: {
                width: 1.3,
                length: 2.4
            },
            lastShotFX: true
        }
    },
    {
        idString: "vks",
        name: "VKS Vykhlop",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "50cal",
        ammoSpawnAmount: 25,
        spawnScope: "8x_scope",
        fireDelay: 800,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.6,
        recoilDuration: 1000,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 1,
        moveSpread: 3,
        length: 8.95,
        fists: {
            left: (0, vector_1.Vec)(90, 3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(90, 2) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.5, 0.6),
                ejectionDelay: 400
            }],
        gasParticles: gasParticlePresets.rifle,
        noMuzzleFlash: true,
        capacity: 5,
        extendedCapacity: 10,
        reloadTime: 3.2,
        ballistics: {
            damage: 95,
            obstacleMultiplier: 1,
            speed: 0.27,
            range: 180,
            tracer: {
                width: 2,
                length: 2,
                opacity: 0.3
            }
        }
    },
    //
    // Designated marksman rifles (DMRs)
    //
    {
        idString: "vss",
        name: "VSS Vintorez",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "9mm",
        ammoSpawnAmount: 60,
        capacity: 20,
        extendedCapacity: 30,
        reloadTime: 2.15,
        fireDelay: 140,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.7,
        recoilDuration: 140,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 2,
        moveSpread: 3.5,
        length: 7.2,
        fists: {
            left: (0, vector_1.Vec)(92, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(82, 0) },
        casingParticles: [{
                frame: "casing_9x39mm",
                position: (0, vector_1.Vec)(3.7, 0.5)
            }],
        noMuzzleFlash: true,
        ballistics: {
            damage: 22,
            obstacleMultiplier: 1.5,
            speed: 0.22,
            range: 160,
            tracer: {
                opacity: 0.15,
                length: 1.5
            }
        }
    },
    {
        idString: "sr25",
        name: "SR-25",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "762mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        extendedCapacity: 30,
        reloadTime: 2.5,
        fireDelay: 200,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.7,
        recoilDuration: 200,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 1,
        moveSpread: 3.5,
        length: 7.85,
        fists: {
            left: (0, vector_1.Vec)(110, 0),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(78, 3) },
        casingParticles: [{
                position: (0, vector_1.Vec)(3.6, 0.4)
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 33,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 230,
            tracer: {
                length: 1.5
            }
        }
    },
    {
        idString: "mini14",
        name: "Mini-14",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.B,
        ammoType: "556mm",
        ammoSpawnAmount: 80,
        capacity: 20,
        extendedCapacity: 30,
        reloadTime: 2.4,
        fireDelay: 155,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.8,
        recoilDuration: 155,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 2,
        moveSpread: 5,
        length: 7.6,
        fists: {
            left: (0, vector_1.Vec)(88, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(80, 2) },
        casingParticles: [{
                position: (0, vector_1.Vec)(5, 0.5),
                velocity: {
                    y: {
                        min: 4,
                        max: 15
                    }
                }
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 25.5,
            obstacleMultiplier: 1.5,
            speed: 0.3,
            range: 230,
            tracer: {
                length: 1.5
            }
        }
    },
    {
        idString: "m1_garand",
        name: "M1 Garand",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "762mm",
        ammoSpawnAmount: 40,
        capacity: 8,
        reloadTime: 2.1,
        fireDelay: 250,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.75,
        recoilDuration: 200,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 1,
        moveSpread: 3.5,
        length: 8.65,
        fists: {
            left: (0, vector_1.Vec)(105, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(90, 2.5) },
        casingParticles: [
            {
                frame: "casing_30-06",
                position: (0, vector_1.Vec)(4, 0.5),
                velocity: {
                    y: {
                        min: 4,
                        max: 10
                    }
                }
            },
            {
                frame: "enbloc",
                position: (0, vector_1.Vec)(4, 0.5),
                velocity: {
                    x: {
                        min: 1,
                        max: 3,
                        randomSign: true
                    },
                    y: {
                        min: 2,
                        max: 5,
                        randomSign: true
                    }
                },
                on: "reload"
            }
        ],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 48,
            obstacleMultiplier: 1,
            speed: 0.35,
            range: 230,
            tracer: {
                length: 2,
                width: 1.5
            },
            lastShotFX: true
        }
    },
    {
        idString: "model_89",
        name: "Model 89",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "50cal",
        ammoSpawnAmount: 28,
        capacity: 7,
        extendedCapacity: 10,
        reloadTime: 0.4,
        shotsPerReload: 1,
        fireDelay: 350,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.7,
        recoilDuration: 300,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 1,
        moveSpread: 4,
        length: 7.3,
        fists: {
            left: (0, vector_1.Vec)(93, -2),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(77, 0) },
        casingParticles: [{
                frame: "casing_500sw",
                position: (0, vector_1.Vec)(3, 0.5),
                ejectionDelay: 175
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 55,
            obstacleMultiplier: 1.5,
            speed: 0.31,
            range: 250,
            tracer: {
                width: 1.8,
                length: 1.5
            }
        }
    },
    {
        idString: "sks",
        name: "SKS",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "762mm",
        ammoSpawnAmount: 60,
        capacity: 10,
        extendedCapacity: 20,
        reloadTime: 0.4,
        shotsPerReload: 2,
        reloadFullOnEmpty: true,
        fullReloadTime: 2.4,
        fireDelay: 180,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.8,
        recoilDuration: 150,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 3,
        moveSpread: 5,
        length: 7.9,
        fists: {
            left: (0, vector_1.Vec)(95, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(83, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4.2, 0.4),
                frame: "casing_762x39mm",
                velocity: {
                    y: {
                        min: 4,
                        max: 10
                    }
                }
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 23,
            obstacleMultiplier: 1.5,
            speed: 0.27,
            range: 180,
            tracer: {
                length: 1.2
            }
        }
    },
    {
        idString: "blr",
        name: "BLR 556",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        ammoType: "556mm",
        ammoSpawnAmount: 20,
        capacity: 5,
        extendedCapacity: 10,
        reloadTime: 2.1,
        fireDelay: 350,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.8,
        recoilDuration: 300,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 2,
        moveSpread: 5,
        length: 7.55,
        fists: {
            left: (0, vector_1.Vec)(95, -3),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(75, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4.2, 0.4)
            }],
        gasParticles: gasParticlePresets.rifle,
        ballistics: {
            damage: 45,
            obstacleMultiplier: 1,
            speed: 0.32,
            range: 200,
            tracer: {
                width: 1.5,
                length: 1.3
            }
        }
    },
    {
        idString: "mk18",
        name: "Mk-18 Mjölnir",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "338lap",
        ammoSpawnAmount: 20,
        spawnScope: "4x_scope",
        fireDelay: 450,
        switchDelay: 700,
        speedMultiplier: 1,
        recoilMultiplier: 0.65,
        recoilDuration: 500,
        fsaReset: 700,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 1,
        moveSpread: 4,
        length: 9.65,
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.3)
            }],
        fists: {
            left: (0, vector_1.Vec)(120, 0),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(100, 2) },
        gasParticles: gasParticlePresets.rifle,
        capacity: 5,
        extendedCapacity: 10,
        reloadTime: 3.8,
        ballistics: {
            damage: 90,
            obstacleMultiplier: 1.5,
            speed: 0.4,
            tracer: {
                width: 1.8,
                length: 3
            },
            range: 250
        }
    },
    //
    // Fictional weapons
    //
    {
        idString: "seedshot",
        name: "Seedshot",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "seed",
        ammoSpawnAmount: 0,
        capacity: 20,
        extendedCapacity: 30,
        reloadTime: 2.6,
        fireDelay: 80,
        switchDelay: 400,
        speedMultiplier: 1,
        recoilMultiplier: 0.8,
        recoilDuration: 200,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 3,
        moveSpread: 6.75,
        length: 7.9,
        fists: {
            left: (0, vector_1.Vec)(115, -6),
            right: (0, vector_1.Vec)(40, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(90, 1) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.4)
            }],
        gasParticles: gasParticlePresets.automatic,
        ballistics: {
            damage: 2,
            obstacleMultiplier: 1.5,
            speed: 0.22,
            range: 180,
            tracer: {
                image: "seed_trail",
                length: 1.4
            },
            noReflect: true,
            onHitProjectile: "proj_seed"
        },
        noSwap: true
    },
    {
        idString: "vaccinator",
        name: "Vaccinator",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        ammoType: "needle",
        ammoSpawnAmount: 0,
        fireDelay: 70,
        switchDelay: 300,
        speedMultiplier: 1.136,
        recoilMultiplier: 0.88,
        recoilDuration: 90,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 2,
        moveSpread: 5,
        length: 5.9,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(80, 0) },
        inventoryScale: 0.8,
        noMuzzleFlash: true,
        capacity: 30,
        extendedCapacity: 40,
        reloadTime: 2,
        ballistics: {
            damage: 11,
            teammateHeal: 2,
            obstacleMultiplier: 1,
            speed: 0.18,
            range: 70,
            tracer: {
                image: "needle_trail",
                length: 1.4
            },
            enemySpeedMultiplier: {
                duration: 2000,
                multiplier: 0.7
            },
            removePerk: "infected" /* PerkIds.Infected */
        },
        noSwap: true
    },
    {
        idString: "firework_launcher",
        name: "Firework Launcher",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "firework_rocket",
        ammoSpawnAmount: 9,
        capacity: 3,
        extendedCapacity: 5,
        reloadTime: 1.25,
        shotsPerReload: 1,
        shootOnRelease: true,
        fireDelay: 1250,
        switchDelay: 900,
        noMuzzleFlash: true,
        speedMultiplier: 0.707,
        recoilMultiplier: 0.5,
        recoilDuration: 925,
        fireMode: 0 /* FireMode.Single */,
        bulletOffset: 2.7,
        shotSpread: 5,
        moveSpread: 14,
        length: 5.65,
        fists: {
            left: (0, vector_1.Vec)(70, 40),
            right: (0, vector_1.Vec)(20, 55),
            animationDuration: 100
        },
        image: {
            position: (0, vector_1.Vec)(29.7, 53.5),
            zIndex: 4
        },
        casingParticles: [{
                position: (0, vector_1.Vec)(0.5, 3),
                ejectionDelay: 800
            }],
        gasParticles: {
            spread: 360,
            amount: 50,
            minLife: 5000,
            maxLife: 10000,
            minSpeed: 2,
            maxSpeed: 5,
            minSize: 0.3,
            maxSize: 0.5
        },
        ballistics: {
            damage: 20,
            obstacleMultiplier: 1,
            speed: 0.15,
            range: 120,
            onHitExplosion: "firework_launcher_explosion",
            explodeOnImpact: true,
            tracer: {
                image: "firework_rocket_trail"
            },
            trail: {
                frame: "small_gas",
                interval: 17,
                amount: 5,
                tint: -1,
                alpha: { min: 0.4, max: 0.8 },
                scale: { min: 0.1, max: 0.2 },
                spreadSpeed: { min: 1, max: 3 },
                lifetime: { min: 2500, max: 5000 }
            }
        },
        noSwap: true
    },
    //
    // Dev weapons
    //
    {
        idString: "g17_scoped",
        name: "G17 (scoped)",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.C,
        noSwap: true,
        devItem: true,
        ammoType: "bb",
        ammoSpawnAmount: 0,
        fireDelay: 35,
        switchDelay: 250,
        speedMultiplier: 1.63,
        recoilMultiplier: 0.99,
        recoilDuration: 10,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 0.5,
        moveSpread: 5,
        length: 6.7,
        fists: {
            left: (0, vector_1.Vec)(40, 0),
            right: (0, vector_1.Vec)(40, 0),
            leftZIndex: 4,
            rightZIndex: 4,
            animationDuration: 80
        },
        noMuzzleFlash: true,
        image: { position: (0, vector_1.Vec)(80, 1) },
        capacity: 100,
        extendedCapacity: 250,
        reloadTime: 1.5,
        ballistics: {
            damage: 2,
            obstacleMultiplier: 0.5,
            speed: 0.1,
            range: 70,
            tracer: {
                width: 0.7,
                opacity: 0.85,
                color: 0xFF8000,
                saturatedColor: 0xF5B83D
            }
        } /* ,
        dual: {
            leftRightOffset: 1.3,
            capacity: 200,
            extendedCapacity: 500,
            fireDelay: 20,
            shotSpread: 1,
            moveSpread: 8,
            reloadTime: 2.8
        } */
        // justice for dual s_g17 when™
    },
    {
        idString: "death_ray",
        name: "Death Ray",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.S,
        ammoType: "power_cell",
        ammoSpawnAmount: 0,
        noSwap: true,
        devItem: true,
        capacity: 1,
        reloadTime: 1.4,
        fireDelay: 40,
        switchDelay: 500,
        speedMultiplier: 1,
        recoilMultiplier: 0.8,
        recoilDuration: 100,
        fireMode: 2 /* FireMode.Auto */,
        shotSpread: 0.15,
        moveSpread: 0.1,
        killstreak: true,
        length: 8.4,
        fists: {
            left: (0, vector_1.Vec)(130, -3),
            right: (0, vector_1.Vec)(60, 0),
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(87, 1) },
        noMuzzleFlash: true,
        casingParticles: [{
                position: (0, vector_1.Vec)(4.5, 0.6),
                on: "reload"
            }],
        ballistics: {
            damage: 800,
            obstacleMultiplier: 2,
            speed: 4,
            range: 800,
            tracer: {
                image: "power_cell_trail",
                length: 10
            }
        }
    },
    {
        idString: "revitalizer",
        name: "Revitalizer",
        defType: objectDefinitions_1.DefinitionType.Gun,
        tier: Tier.A,
        noSwap: true,
        devItem: true,
        killstreak: true,
        consistentPatterning: true,
        ammoType: "12g",
        ammoSpawnAmount: 15,
        capacity: 5,
        extendedCapacity: 8,
        reloadTime: 0.75,
        fireDelay: 900,
        switchDelay: 900,
        speedMultiplier: 1,
        recoilMultiplier: 0.5,
        recoilDuration: 550,
        fireMode: 0 /* FireMode.Single */,
        shotSpread: 11,
        moveSpread: 14,
        bulletCount: 10,
        length: 6.88,
        fists: {
            left: (0, vector_1.Vec)(112, -3),
            right: (0, vector_1.Vec)(45, 0),
            rightZIndex: 4,
            animationDuration: 100
        },
        image: { position: (0, vector_1.Vec)(78, 0) },
        casingParticles: [{
                position: (0, vector_1.Vec)(4, 0.6),
                ejectionDelay: 450,
                velocity: {
                    y: {
                        min: 2,
                        max: 5,
                        randomSign: true
                    }
                }
            }],
        gasParticles: gasParticlePresets.shotgun,
        shotsPerReload: 1,
        ballistics: {
            damage: 10,
            obstacleMultiplier: 1,
            speed: 0.16,
            range: 48,
            tracer: {
                length: 0.7
            }
        },
        wearerAttributes: {
            passive: {
                maxHealth: 0.51,
                maxAdrenaline: 0.8
            },
            on: {
                kill: [
                    {
                        limit: 5,
                        maxHealth: 1.488,
                        maxAdrenaline: 1.201,
                        minAdrenaline: 20,
                        speedBoost: 1.02
                    },
                    {
                        healthRestored: 230,
                        adrenalineRestored: 30
                    }
                ],
                damageDealt: [
                    {
                        healthRestored: 2,
                        adrenalineRestored: 1.5
                    }
                ]
            }
        }
    }
].flatMap((def) => {
    if (def.dual === undefined) {
        return def;
    }
    const dualDef = (0, misc_1.mergeDeep)({}, def, def.dual, {
        idString: `dual_${def.idString}`,
        name: `Dual ${def.name}`,
        isDual: true,
        singleVariant: def.idString
    });
    // @ts-expect-error init code
    delete dualDef.dual;
    // @ts-expect-error init code
    delete dualDef.image;
    // @ts-expect-error init code
    delete dualDef.casingParticles;
    // @ts-expect-error init code
    delete def.dual;
    // @ts-expect-error init code
    def.dualVariant = dualDef.idString;
    return [def, dualDef];
}));
//# sourceMappingURL=guns.js.map