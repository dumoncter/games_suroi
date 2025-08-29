"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncedParticles = void 0;
exports.resolveNumericSpecifier = resolveNumericSpecifier;
exports.resolveVectorSpecifier = resolveVectorSpecifier;
const constants_1 = require("../constants");
const hitbox_1 = require("../utils/hitbox");
const misc_1 = require("../utils/misc");
const objectDefinitions_1 = require("../utils/objectDefinitions");
const random_1 = require("../utils/random");
const vector_1 = require("../utils/vector");
function resolveNumericSpecifier(numericSpecifier) {
    return typeof numericSpecifier === "number"
        ? numericSpecifier
        : (0, random_1.randomFloat)(numericSpecifier.min, numericSpecifier.max);
}
function resolveVectorSpecifier(vectorSpecifier) {
    if ("x" in vectorSpecifier)
        return vectorSpecifier;
    const { min, max } = vectorSpecifier;
    return (0, vector_1.Vec)((0, random_1.randomFloat)(min.x, max.x), (0, random_1.randomFloat)(min.y, max.y));
}
const smokeLike = (def) => (0, misc_1.mergeDeep)({
    defType: objectDefinitions_1.DefinitionType.SyncedParticle,
    frame: "smoke_grenade_particle",
    scale: {
        start: {
            min: 1.5,
            max: 2
        },
        end: {
            min: 1.75,
            max: 2.25
        }
    },
    alpha: {
        start: 1,
        end: 0,
        easing: "expoIn"
    },
    angularVelocity: {
        min: -0.0005,
        max: 0.0005
    },
    velocity: {
        min: {
            x: -0.0002,
            y: -0.0002
        },
        max: {
            x: 0.0002,
            y: 0.0002
        }
    },
    lifetime: {
        min: 19000,
        max: 21000
    },
    zIndex: constants_1.ZIndexes.BuildingsCeiling - 1,
    scopeOutPreMs: 3200
}, def); // the cast to SyncedParticleDefinition is technically incorrect, but it makes ts shut up so
exports.SyncedParticles = new objectDefinitions_1.ObjectDefinitions([
    smokeLike({
        idString: "smoke_grenade_particle",
        name: "Smoke Grenade Particle",
        hitbox: new hitbox_1.CircleHitbox(5),
        snapScopeTo: "1x_scope",
        velocity: {
            duration: 4000,
            easing: "expoOut"
        },
        spawner: {
            count: 10,
            radius: 15,
            staggering: {
                delay: 300,
                initialAmount: 2
            }
        }
    }),
    smokeLike({
        idString: "plumpkin_smoke_grenade_particle",
        name: "Plumpkin Smoke Grenade Particle",
        tint: 0x854770,
        hitbox: new hitbox_1.CircleHitbox(5),
        snapScopeTo: "1x_scope",
        velocity: {
            duration: 4000,
            easing: "expoOut"
        },
        spawner: {
            count: 10,
            radius: 15,
            staggering: {
                delay: 300,
                initialAmount: 2
            }
        }
    }),
    smokeLike({
        idString: "shrouded_particle",
        name: "Shrouded Particle",
        tint: 0xaaaaaa,
        hitbox: new hitbox_1.CircleHitbox(5),
        snapScopeTo: "1x_scope",
        alpha: {
            start: 0.5,
            end: 0,
            creatorMult: 0.15
        },
        velocity: {
            duration: 1000,
            easing: "circOut"
        },
        lifetime: {
            min: 1800,
            max: 2200
        },
        hasCreatorID: true
    }),
    smokeLike({
        idString: "tear_gas_particle",
        name: "Tear Gas Particle",
        tint: 0xa0e6ff,
        hitbox: new hitbox_1.CircleHitbox(5),
        snapScopeTo: "1x_scope",
        depletePerMs: {
            adrenaline: 0.0055
        },
        velocity: {
            easing: "expoOut",
            duration: 4000
        },
        spawner: {
            count: 10,
            radius: 15,
            staggering: {
                delay: 300,
                initialAmount: 2
            }
        }
    }),
    smokeLike({
        idString: "airdrop_smoke_particle",
        name: "Airdrop Smoke Particle",
        velocity: {
            duration: 2000,
            easing: "circOut"
        },
        lifetime: {
            min: 1500,
            max: 2500
        },
        spawner: {
            count: 5,
            radius: 10,
            staggering: {
                delay: 100,
                initialAmount: 2
            }
        }
    })
]);
//# sourceMappingURL=syncedParticles.js.map