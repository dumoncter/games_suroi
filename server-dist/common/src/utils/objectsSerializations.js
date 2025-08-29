"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSerializations = void 0;
const constants_1 = require("../constants");
const armors_1 = require("../definitions/items/armors");
const backpacks_1 = require("../definitions/items/backpacks");
const buildings_1 = require("../definitions/buildings");
const decals_1 = require("../definitions/decals");
const loots_1 = require("../definitions/loots");
const melees_1 = require("../definitions/items/melees");
const obstacles_1 = require("../definitions/obstacles");
const skins_1 = require("../definitions/items/skins");
const syncedParticles_1 = require("../definitions/syncedParticles");
const throwables_1 = require("../definitions/items/throwables");
const math_1 = require("./math");
exports.ObjectSerializations = {
    //
    // Player serialization
    //
    [constants_1.ObjectCategory.Player]: {
        serializePartial(stream, { position, rotation, animation, action }) {
            stream.writePosition(position);
            stream.writeRotation2(rotation);
            /*
                4 bits for animation, 2 for action
                each has a "dirty" bit, and that makes 8

                our setup will be
                Nnnn nccC

                N: animation dirty
                n: animation
                c: action
                C: action dirty
            */
            const animationDirty = animation !== undefined;
            const actionDirty = action !== undefined;
            let actAnim = (animationDirty ? 128 : 0) + (actionDirty ? 1 : 0);
            if (animationDirty) {
                actAnim += animation << 3;
            }
            if (actionDirty) {
                actAnim += action.type << 1;
            }
            stream.writeUint8(actAnim);
            if (actionDirty && action.item !== undefined) {
                loots_1.Loots.writeToStream(stream, action.item);
            }
        },
        serializeFull(stream, { full: { layer, dead, downed, beingRevived, teamID, invulnerable, activeItem, sizeMod, skin, helmet, vest, backpack, halloweenThrowableSkin, activeDisguise, infected, backEquippedMelee, hasBubble, activeOverdrive } }) {
            stream.writeLayer(layer);
            const hasSizeMod = sizeMod !== undefined;
            const hasHelmet = helmet !== undefined;
            const hasVest = vest !== undefined;
            const hasDisguise = activeDisguise !== undefined;
            const hasBackEquippedMelee = backEquippedMelee !== undefined;
            stream.writeBooleanGroup2(dead, downed, beingRevived, invulnerable, hasSizeMod, halloweenThrowableSkin, hasHelmet, hasVest, hasDisguise, infected, hasBackEquippedMelee, hasBubble, activeOverdrive);
            stream.writeUint8(teamID);
            loots_1.Loots.writeToStream(stream, activeItem);
            if (hasSizeMod) {
                stream.writeFloat(sizeMod, 0, 4, 1);
            }
            skins_1.Skins.writeToStream(stream, skin);
            if (hasHelmet)
                armors_1.Armors.writeToStream(stream, helmet);
            if (hasVest)
                armors_1.Armors.writeToStream(stream, vest);
            backpacks_1.Backpacks.writeToStream(stream, backpack);
            if (hasDisguise)
                obstacles_1.Obstacles.writeToStream(stream, activeDisguise);
            if (hasBackEquippedMelee)
                melees_1.Melees.writeToStream(stream, backEquippedMelee);
        },
        deserializePartial(stream) {
            const data = {
                position: stream.readPosition(),
                rotation: stream.readRotation2()
            };
            // see serialization comment
            const actAnim = stream.readUint8();
            const hasAnimation = (actAnim & 128) !== 0;
            const hasAction = (actAnim & 1) !== 0;
            data.animation = hasAnimation ? (actAnim >> 3) & 15 : undefined;
            const action = hasAction ? (actAnim >> 1) & 3 : undefined;
            if (action !== undefined) {
                const act = {
                    type: action
                };
                if (action === 2 /* PlayerActions.UseItem */) {
                    act.item = loots_1.Loots.readFromStream(stream);
                }
                data.action = act;
            }
            return data;
        },
        deserializeFull(stream) {
            const layer = stream.readLayer();
            const [dead, downed, beingRevived, invulnerable, hasSizeMod, halloweenThrowableSkin, hasHelmet, hasVest, hasDisguise, infected, hasBackEquippedMelee, hasBubble, activeOverdrive] = stream.readBooleanGroup2();
            return {
                layer,
                dead,
                downed,
                beingRevived,
                invulnerable,
                halloweenThrowableSkin,
                teamID: stream.readUint8(),
                activeItem: loots_1.Loots.readFromStream(stream),
                sizeMod: hasSizeMod ? stream.readFloat(0, 4, 1) : undefined,
                skin: skins_1.Skins.readFromStream(stream),
                helmet: hasHelmet ? armors_1.Armors.readFromStream(stream) : undefined,
                vest: hasVest ? armors_1.Armors.readFromStream(stream) : undefined,
                backpack: backpacks_1.Backpacks.readFromStream(stream),
                activeDisguise: hasDisguise ? obstacles_1.Obstacles.readFromStream(stream) : undefined,
                infected,
                backEquippedMelee: hasBackEquippedMelee ? melees_1.Melees.readFromStream(stream) : undefined,
                hasBubble,
                activeOverdrive
            };
        }
    },
    //
    // Obstacle Serialization
    //
    [constants_1.ObjectCategory.Obstacle]: {
        serializePartial(stream, data) {
            stream.writeBooleanGroup(data.dead, data.playMaterialDestroyedSound, data.waterOverlay, data.powered);
            stream.writeScale(data.scale);
        },
        serializeFull(stream, { full: { position, definition, rotation, door, activated, variation, layer } }) {
            obstacles_1.Obstacles.writeToStream(stream, definition);
            stream.writePosition(position);
            stream.writeLayer(layer);
            /*
                here we're condensing stuff to try and minimize deadspace
                this is really peak tryharding
                we have:
                - a rotation
                - a variation (maybe)
                possibly one of:
                    - door stuff
                    - activation stuff
            */
            // variations leave at least 5 vacant bits, which is enough for the rest of our data
            let obstacleData = 0;
            if (definition.variations !== undefined && variation !== undefined) {
                // variation being undefined is equivalent to it being 0
                // make the variation stuff take up the MSBs, leaving the LSBs for the other stuff
                obstacleData += variation << (8 - definition.variationBits);
                /*
                    for example, variation = 3, variationBits = 3
                    we then have 0110 0000
                    the 5 least-significant bits are free for use
                */
            }
            if (definition.isDoor && door) {
                // 3 bits
                obstacleData += door.offset * 2 + (door.locked ? 1 : 0);
                //                            ^ shift left by one
                // will result in something like 0110 0101
                // or more generally, xxx00xxx
            }
            else if (definition.isActivatable) {
                // 1 bit
                obstacleData += activated ? 1 : 0;
                // will result in something like xxx0000x
            }
            /*
                what remains is the door/activation/detector stuff
                door stuff is 3 bits, the other two are 1 bit
                thus, we conclude that obstacleData will never exceed 6 bits

                RotationMode.Full takes a clean 2 bytes, so it's not of a concern
                Limited and Binary take 2 and 1 respectively

                thus we see that if the mode is limited or binary, we can fit
                the rotation and the data in a single 8-bit number

                for example, with variation 3 over 3 bits,
                and door offset of 2 and locked

                we get
                0 1 1 0 0 1 0 1
                |___|     |_| |
                |          | locked
                variation  |
                        offset

                the two middle bits are free to use
            */
            switch (definition.rotationMode) {
                case constants_1.RotationMode.Full: {
                    // rotation doesn't leave any deadspace, so we write
                    // it and the data
                    // to make deserialization easier though, always write
                    // the obstacle data first
                    stream.writeUint8(obstacleData);
                    stream.writeRotation(rotation.rotation);
                    break;
                }
                case constants_1.RotationMode.Limited:
                case constants_1.RotationMode.Binary: {
                    stream.writeUint8(obstacleData + (rotation.rotation << 3));
                    // shift into correct position with a << 3
                    break;
                }
                case constants_1.RotationMode.None: {
                    // there may be no rotation data, but there's still variation data and
                    // all the other thingies
                    stream.writeUint8(obstacleData);
                    break;
                }
            }
        },
        deserializePartial(stream) {
            const [dead, playMaterialDestroyedSound, waterOverlay, powered] = stream.readBooleanGroup();
            return {
                scale: stream.readScale(),
                dead,
                playMaterialDestroyedSound,
                waterOverlay,
                powered
            };
        },
        deserializeFull(stream) {
            const definition = obstacles_1.Obstacles.readFromStream(stream);
            const data = {
                definition,
                position: stream.readPosition(),
                layer: stream.readLayer(),
                rotation: {
                    orientation: 0,
                    rotation: 0
                }
            };
            // see the comments in serializeFull to understand what's going on
            // "safe" version
            /*
            switch (definition.rotationMode) {
                case RotationMode.Full: {
                    data.rotation.rotation = stream.readRotation();
                    break;
                }
                case RotationMode.Limited:
                case RotationMode.Binary: {
                    data.rotation.orientation = stread.readUint8() as Orientation;
                    data.rotation.rotation = definition.rotationMode === RotationMode.Binary
                        ? orientation * halfπ // sus
                        : -Angle.normalize(orientation) * halfπ;
                    break;
                }
                // case RotationMode.None: {
                //     break;
                // }
            }

            if (definition.variations !== undefined && variation !== undefined) {
                data.variation = stream.readUint8();
            }

            if (definition.isDoor && door) {
                const door = stream.readUint8();
                data.door = {
                    offset: (door >> 1) & 3,
                    locked: (door & 1) === 1
                };
            } else if (definition.isActivatable) {
                data.activated = stream.readUint8() !== 0;
            }
            */
            const obstacleData = stream.readUint8();
            if (definition.variations !== undefined) {
                const bits = 8 - definition.variationBits;
                data.variation = (obstacleData & (0xFF - (2 ** bits - 1))) >> bits;
                //                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ mask the most significant bits
            }
            if (definition.isDoor) {
                data.door = {
                    offset: (obstacleData >> 1) & 3,
                    locked: (obstacleData & 1) === 1
                };
            }
            else if (definition.isActivatable) {
                data.activated = (obstacleData & 1) === 1;
            }
            switch (definition.rotationMode) {
                case constants_1.RotationMode.Full: {
                    data.rotation.rotation = stream.readRotation();
                    break;
                }
                case constants_1.RotationMode.Limited:
                case constants_1.RotationMode.Binary: {
                    const orientation = (obstacleData & 0b11000) / 8;
                    data.rotation.orientation = orientation;
                    data.rotation.rotation = definition.rotationMode === constants_1.RotationMode.Binary
                        ? orientation * math_1.halfπ // sus
                        : -math_1.Angle.normalize(orientation) * math_1.halfπ;
                    break;
                }
                // case RotationMode.None: {
                //     break;
                // }
            }
            return data;
        }
    },
    //
    // Loot Serialization
    //
    [constants_1.ObjectCategory.Loot]: {
        serializePartial(stream, data) {
            stream.writePosition(data.position);
            stream.writeLayer(data.layer);
        },
        serializeFull(stream, { full }) {
            loots_1.Loots.writeToStream(stream, full.definition);
            /*
                package 'isNew' and 'count' in a single 16-bit
                integer—the first bit will be for isNew, the other
                15 will be for the count
            */
            stream.writeUint16((full.isNew ? 32768 : 0) + full.count
            //            ^^^^^ 1 << 15
            );
        },
        deserializePartial(stream) {
            return {
                position: stream.readPosition(),
                layer: stream.readLayer()
            };
        },
        deserializeFull(stream) {
            const definition = loots_1.Loots.readFromStream(stream);
            const amount = stream.readUint16();
            return {
                definition,
                count: amount & 32767, // mask out the MSB
                isNew: (amount & 32768) !== 0 // extract the MSB
            };
        }
    },
    //
    // Death Marker Serialization
    //
    [constants_1.ObjectCategory.DeathMarker]: {
        serializePartial(stream, data) {
            stream.writePosition(data.position);
            stream.writeLayer(data.layer);
            stream.writeUint8(data.isNew ? -1 : 0);
            stream.writeObjectId(data.playerID);
        },
        serializeFull() { },
        deserializePartial(stream) {
            return {
                position: stream.readPosition(),
                layer: stream.readLayer(),
                isNew: stream.readUint8() !== 0,
                playerID: stream.readObjectId()
            };
        },
        deserializeFull() { }
    },
    //
    // Building Serialization
    //
    [constants_1.ObjectCategory.Building]: {
        serializePartial(stream, data) {
            stream.writeBooleanGroup(data.dead, data.puzzle !== undefined, 
            // for now, this is okay, since the space isn't being used
            // up anyways—if space is needed in the future, then
            // these two booleans can be booted off
            data.puzzle?.solved, data.puzzle?.errorSeq);
            stream.writeLayer(data.layer);
        },
        serializeFull(stream, { full }) {
            buildings_1.Buildings.writeToStream(stream, full.definition);
            stream.writePosition(full.position);
            stream.writeUint8(full.orientation);
        },
        deserializePartial(stream) {
            const [dead, hasPuzzle, solved, errorSeq] = stream.readBooleanGroup();
            return {
                dead,
                puzzle: hasPuzzle
                    ? { solved, errorSeq }
                    : undefined,
                layer: stream.readLayer()
            };
        },
        deserializeFull(stream) {
            return {
                definition: buildings_1.Buildings.readFromStream(stream),
                position: stream.readPosition(),
                orientation: stream.readUint8()
            };
        }
    },
    //
    // Decal Serialization
    //
    [constants_1.ObjectCategory.Decal]: {
        serializePartial(stream, data) {
            decals_1.Decals.writeToStream(stream, data.definition);
            stream.writePosition(data.position);
            stream.writeObstacleRotation(data.rotation, data.definition.rotationMode);
            stream.writeLayer(data.layer);
        },
        serializeFull() { },
        deserializePartial(stream) {
            const definition = decals_1.Decals.readFromStream(stream);
            return {
                definition,
                position: stream.readPosition(),
                rotation: stream.readObstacleRotation(definition.rotationMode).rotation,
                layer: stream.readLayer()
            };
        },
        deserializeFull() { }
    },
    [constants_1.ObjectCategory.Parachute]: {
        serializePartial(stream, data) {
            stream.writeFloat(data.height, 0, 1, 1);
        },
        serializeFull(stream, { full }) {
            stream.writePosition(full.position);
        },
        deserializePartial(stream) {
            return {
                height: stream.readFloat(0, 1, 1)
            };
        },
        deserializeFull(stream) {
            return {
                position: stream.readPosition()
            };
        }
    },
    [constants_1.ObjectCategory.SyncedParticle]: {
        serializePartial(stream, data) {
            const { definition, startPosition, endPosition, layer, age, lifetime, angularVelocity, scale, alpha, variant, creatorID } = data;
            syncedParticles_1.SyncedParticles.writeToStream(stream, definition);
            stream.writePosition(startPosition);
            stream.writePosition(endPosition);
            stream.writeLayer(layer);
            stream.writeFloat(age, 0, 1, 1);
            if (typeof definition.lifetime === "object") {
                const { min, max } = definition.lifetime;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                stream.writeFloat(lifetime, min, max, 1);
            }
            if (typeof definition.angularVelocity === "object") {
                const { min, max } = definition.angularVelocity;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                stream.writeFloat(angularVelocity, min, max, 1);
            }
            if (scale !== undefined) {
                stream.writeScale(scale.start);
                stream.writeScale(scale.end);
            }
            if (alpha !== undefined) {
                stream.writeFloat(alpha.start, 0, 1, 1);
                stream.writeFloat(alpha.end, 0, 1, 1);
            }
            if (definition.variations !== undefined && variant !== undefined) {
                stream.writeUint8(variant);
            }
            if (creatorID !== undefined) {
                stream.writeObjectId(creatorID);
            }
        },
        serializeFull() { },
        deserializePartial(stream) {
            const data = {
                definition: syncedParticles_1.SyncedParticles.readFromStream(stream),
                startPosition: stream.readPosition(),
                endPosition: stream.readPosition(),
                layer: stream.readLayer(),
                age: stream.readFloat(0, 1, 1)
            };
            const { lifetime, angularVelocity, scale, alpha, variations, hasCreatorID } = data.definition;
            if (typeof lifetime === "object") {
                data.lifetime = stream.readFloat(lifetime.min, lifetime.max, 1);
            }
            if (typeof angularVelocity === "object") {
                data.angularVelocity = stream.readFloat(angularVelocity.min, angularVelocity.max, 1);
            }
            if (typeof scale === "object") {
                data.scale = {
                    start: stream.readScale(),
                    end: stream.readScale()
                };
            }
            if (typeof alpha === "object") {
                data.alpha = {
                    start: stream.readFloat(0, 1, 1),
                    end: stream.readFloat(0, 1, 1)
                };
            }
            if (variations !== undefined) {
                data.variant = stream.readUint8();
            }
            if (hasCreatorID) {
                data.creatorID = stream.readObjectId();
            }
            return data;
        },
        deserializeFull() { }
    },
    [constants_1.ObjectCategory.Projectile]: {
        serializePartial(strm, data) {
            strm.writePosition(data.position)
                .writeRotation2(data.rotation)
                .writeLayer(data.layer)
                .writeFloat(data.height, 0, constants_1.GameConstants.projectiles.maxHeight, 1);
        },
        serializeFull(stream, { full }) {
            throwables_1.Throwables.writeToStream(stream, full.definition);
            stream.writeBooleanGroup(full.halloweenSkin, full.activated);
            if (full.definition.c4 && full.c4) {
                stream.writeUint8(full.c4.throwerTeamID);
                stream.writeUint8(full.c4.tintIndex);
            }
        },
        deserializePartial(stream) {
            return {
                position: stream.readPosition(),
                rotation: stream.readRotation2(),
                layer: stream.readLayer(),
                height: stream.readFloat(0, constants_1.GameConstants.projectiles.maxHeight, 1)
            };
        },
        deserializeFull(stream) {
            const definition = throwables_1.Throwables.readFromStream(stream);
            const [halloweenSkin, activated] = stream.readBooleanGroup();
            const data = {
                definition,
                halloweenSkin,
                activated
            };
            if (definition.c4) {
                data.c4 = {
                    throwerTeamID: stream.readUint8(),
                    tintIndex: stream.readUint8()
                };
            }
            return data;
        }
    }
};
//# sourceMappingURL=objectsSerializations.js.map