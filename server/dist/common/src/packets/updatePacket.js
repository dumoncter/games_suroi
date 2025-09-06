"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePacket = void 0;
const constants_1 = require("../constants");
const defaultInventory_1 = require("../defaultInventory");
const badges_1 = require("../definitions/badges");
const emotes_1 = require("../definitions/emotes");
const explosions_1 = require("../definitions/explosions");
const perks_1 = require("../definitions/items/perks");
const scopes_1 = require("../definitions/items/scopes");
const loots_1 = require("../definitions/loots");
const mapIndicators_1 = require("../definitions/mapIndicators");
const mapPings_1 = require("../definitions/mapPings");
const baseBullet_1 = require("../utils/baseBullet");
const objectsSerializations_1 = require("../utils/objectsSerializations");
const vector_1 = require("../utils/vector");
const packet_1 = require("./packet");
function serializePlayerData(strm, { pingSeq, minMax, health, adrenaline, shield, zoom, layer, id, teammates, highlightedPlayers, inventory, lockedSlots, items, activeC4s, perks, teamID, blockEmoting }) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const hasMinMax = minMax !== undefined;
    const hasHealth = health !== undefined;
    const hasAdrenaline = adrenaline !== undefined;
    const hasShield = shield !== undefined;
    const hasZoom = zoom !== undefined;
    const hasLayer = layer !== undefined;
    const hasId = id !== undefined;
    const hasTeammates = teammates !== undefined;
    const hasHighlightedPlayers = highlightedPlayers !== undefined;
    const hasInventory = inventory !== undefined;
    const hasLockedSlots = lockedSlots !== undefined;
    const hasItems = items !== undefined;
    const hasActiveC4s = activeC4s !== undefined;
    const hasPerks = perks !== undefined;
    const hasTeamID = teamID !== undefined;
    /* eslint-enable @stylistic/no-multi-spaces */
    strm.writeBooleanGroup2(hasMinMax, hasHealth, hasAdrenaline, hasShield, hasZoom, hasLayer, hasId, hasTeammates, hasHighlightedPlayers, hasInventory, hasLockedSlots, hasItems, hasActiveC4s, hasPerks, hasTeamID, blockEmoting);
    strm.writeUint8(pingSeq);
    if (hasMinMax) {
        const { maxHealth, minAdrenaline, maxAdrenaline } = minMax;
        strm.writeFloat32(maxHealth)
            .writeFloat32(minAdrenaline)
            .writeFloat32(maxAdrenaline);
    }
    if (hasHealth) {
        strm.writeFloat(health, 0, 1, 2);
    }
    if (hasAdrenaline) {
        strm.writeFloat(adrenaline, 0, 1, 2);
    }
    if (hasShield) {
        strm.writeFloat(shield, 0, 1, 2);
    }
    if (hasZoom) {
        strm.writeUint8(zoom);
    }
    if (hasLayer) {
        strm.writeLayer(layer);
    }
    if (hasId) {
        const { id: targetId, spectating } = id;
        strm.writeUint8(spectating ? -1 : 0)
            .writeObjectId(targetId);
    }
    if (hasTeammates) {
        strm.writeArray(teammates, ({ id, position, normalizedHealth, downed, disconnected, colorIndex }) => {
            strm.writeUint8((downed ? 2 : 0) + (disconnected ? 1 : 0))
                .writeObjectId(id)
                .writePosition(position ?? (0, vector_1.Vec)(0, 0))
                .writeFloat(normalizedHealth, 0, 1, 1)
                .writeUint8(colorIndex);
        });
    }
    if (hasHighlightedPlayers) {
        strm.writeArray(highlightedPlayers, ({ id, normalizedHealth }) => {
            strm.writeObjectId(id);
            strm.writeFloat(normalizedHealth, 0, 1, 1);
        });
    }
    if (hasInventory) {
        const { activeWeaponIndex, weapons = [] } = inventory;
        /*
            activeWeaponIndex is 2 bits
            4 weapon slots, each takes up to 2 bits (2 booleans), for a total of 8 bits
            alright well, we'll just write the activeWeaponIndex as-is (can't pack
            it with anything else) and write the 8 booleans in a group
        */
        strm.writeUint8(activeWeaponIndex)
            .writeBooleanGroup(weapons[0] !== undefined, weapons[1] !== undefined, weapons[2] !== undefined, weapons[3] !== undefined, weapons[0]?.count !== undefined, weapons[1]?.count !== undefined, weapons[2]?.count !== undefined, weapons[3]?.count !== undefined);
        for (let i = 0; i < 4; i++) {
            const weapon = weapons[i];
            if (weapon === undefined)
                continue;
            const { definition, count, stats } = weapon;
            loots_1.Loots.writeToStream(strm, definition);
            if (count !== undefined) {
                strm.writeUint8(count);
            }
            if (definition.killstreak) {
                strm.writeUint8(stats?.kills ?? 0);
            }
        }
    }
    if (hasLockedSlots) {
        strm.writeUint8(lockedSlots);
    }
    if (hasItems) {
        const { items: invItems, scope } = items;
        /*
            we have here an unknown amount of booleans
            so we'll write them in chunks of 8

            in essence, we'll first write a bitfield
            indicating which keys have non-zero counts,
            and then we'll write said non-zero counts

            for example, consider this inventory:
            { a: 3, b: 0, c: 4, d: 6, e: 0 }

            there are only five items, so 3 of the bits are
            unused. the first portion would write 0000 1101,
            with the first three bits never being used. the reason
            it's reversed is because we start with 2**0, then move
            to 2**1, and so on. this makes deserialization easier.

            to be explicit, the association is (with 'x' = don't care):
            0 0 0 0 1 1 0 1
            |___| | | | | |
              x   e d c b a

            after writing this, we write all the non-zero counts, giving
            0000 0000 0000 0011 (a)
            0000 0000 0000 0100 (c)
            0000 0000 0000 0110 (d)
            (16 bits are used because the old api used 9)

            thus resulting in a payload of
            00001101000000000000001100000000000001000000000000000110
        */
        const nonNullCounts = [];
        let itemPresent = 0;
        let itemIdx = 0;
        while (itemIdx < defaultInventory_1.itemKeysLength) {
            for (let i = 0; i < 8 && itemIdx < defaultInventory_1.itemKeysLength; i++, itemIdx++) {
                const count = invItems[defaultInventory_1.itemKeys[itemIdx]];
                if (count <= 0)
                    continue;
                itemPresent += 2 ** i;
                nonNullCounts.push(count);
            }
            // write this byte
            strm.writeUint8(itemPresent);
            // reset
            itemPresent = 0;
        }
        // now write all the non-zero counts
        for (const count of nonNullCounts) {
            // old api used 9 bits
            strm.writeUint16(count);
        }
        scopes_1.Scopes.writeToStream(strm, scope);
    }
    if (hasActiveC4s) {
        // lol ok
        strm.writeUint8(activeC4s ? -1 : 0);
    }
    if (hasPerks) {
        strm.writeArray(perks, perk => perks_1.Perks.writeToStream(strm, perk));
    }
    if (hasTeamID) {
        strm.writeUint8(teamID);
    }
}
function deserializePlayerData(strm) {
    const [hasMinMax, hasHealth, hasAdrenaline, hasShield, hasZoom, hasLayer, hasId, hasTeammates, hasHighlightedPlayers, hasInventory, hasLockedSlots, hasItems, hasActiveC4s, hasPerks, hasTeamID, blockEmoting] = strm.readBooleanGroup2();
    const data = {
        pingSeq: strm.readUint8(),
        blockEmoting
    };
    if (hasMinMax) {
        data.minMax = {
            maxHealth: strm.readFloat32(),
            minAdrenaline: strm.readFloat32(),
            maxAdrenaline: strm.readFloat32()
        };
    }
    if (hasHealth) {
        data.health = strm.readFloat(0, 1, 2);
    }
    if (hasAdrenaline) {
        data.adrenaline = strm.readFloat(0, 1, 2);
    }
    if (hasShield) {
        data.shield = strm.readFloat(0, 1, 2);
    }
    if (hasZoom) {
        data.zoom = strm.readUint8();
    }
    if (hasLayer) {
        data.layer = strm.readLayer();
    }
    if (hasId) {
        data.id = {
            spectating: strm.readUint8() !== 0,
            id: strm.readObjectId()
        };
    }
    if (hasTeammates) {
        data.teammates = strm.readArray(() => {
            const status = strm.readUint8();
            return {
                id: strm.readObjectId(),
                position: strm.readPosition(),
                normalizedHealth: strm.readFloat(0, 1, 1),
                downed: (status & 2) !== 0,
                disconnected: (status & 1) !== 0,
                colorIndex: strm.readUint8()
            };
        });
    }
    if (hasHighlightedPlayers) {
        data.highlightedPlayers = strm.readArray(() => ({
            id: strm.readObjectId(),
            normalizedHealth: strm.readFloat(0, 1, 1)
        }));
    }
    if (hasInventory) {
        const activeWeaponIndex = strm.readUint8();
        const slotData = strm.readBooleanGroup();
        data.inventory = {
            activeWeaponIndex,
            weapons: Array.from({ length: 4 }, (_, i) => {
                if (!slotData[i])
                    return;
                const definition = loots_1.Loots.readFromStream(strm);
                return {
                    definition,
                    count: slotData[i + 4] ? strm.readUint8() : undefined,
                    stats: {
                        kills: definition.killstreak ? strm.readUint8() : undefined
                    }
                };
            })
        };
    }
    if (hasLockedSlots) {
        data.lockedSlots = strm.readUint8();
    }
    if (hasItems) {
        /*
            let's work backwards with the inventory given as
            example in the serialization portion's comment.
            as a reminder, the payload in the stream is
            0000 1101 0000 0000 0000 0011 0000 0000 0000 0100 0000 0000 0000 0110,
            and the 5 items that exist are a, b, c, d, and e.

            we call readBooleanGroup to succinctly read a byte and convert it to
            a bitfield. thus we obtain 0000 1101, and from that, checkIndices contains
            0, 2, and 3 after the while loop is done

            we then consult the keys at those indices and associate the 16-bit
            integer count from the stream to that item's count, giving

            0 -> item 'a' -> 0000 0000 0000 0011 -> 3
            2 -> item 'c' -> 0000 0000 0000 0100 -> 4
            3 -> item 'd' -> 0000 0000 0000 0110 -> 6

            and for the other keys, we put 0
            thus our inventory is { a: 3, b: 0, c: 4, d: 6, e: 0 }
            which matches the inventory we started with on the server. ta-da!
        */
        const checkIndices = new Set();
        let itemIdx = 0;
        while (itemIdx < defaultInventory_1.itemKeysLength) {
            // read 8 booleans at once
            const group = strm.readBooleanGroup();
            for (let i = 0; i < 8 && itemIdx < defaultInventory_1.itemKeysLength; i++, itemIdx++) {
                if (group[i]) {
                    checkIndices.add(itemIdx);
                }
            }
        }
        const items = {};
        for (let i = 0; i < defaultInventory_1.itemKeysLength; i++) {
            items[defaultInventory_1.itemKeys[i]] = checkIndices.has(i) ? strm.readUint16() : 0;
        }
        data.items = {
            items,
            scope: scopes_1.Scopes.readFromStream(strm)
        };
    }
    if (hasActiveC4s) {
        data.activeC4s = strm.readUint8() !== 0;
    }
    if (hasPerks) {
        data.perks = strm.readArray(() => perks_1.Perks.readFromStream(strm));
    }
    if (hasTeamID) {
        data.teamID = strm.readUint8();
    }
    return data;
}
const planeMinPos = -constants_1.GameConstants.maxPosition;
const planeMaxPos = constants_1.GameConstants.maxPosition * 2;
exports.UpdatePacket = new packet_1.Packet(packet_1.PacketType.Update, {
    serialize(strm, data) {
        let flags = 0;
        // save the current index to write flags later
        const flagsIdx = strm.index;
        strm.writeUint16(0);
        if (data.playerData) {
            if (Object.keys(data.playerData).length > 0) {
                serializePlayerData(strm, data.playerData);
                flags |= 1 /* UpdateFlags.PlayerData */;
            }
        }
        if (data.deletedObjects?.length) {
            strm.writeArray(data.deletedObjects, id => {
                strm.writeObjectId(id);
            }, 2);
            flags |= 2 /* UpdateFlags.DeletedObjects */;
        }
        if (data.fullObjectsCache?.size) {
            strm.writeSet(data.fullObjectsCache, object => {
                strm.writeStream(object.partialStream)
                    .writeStream(object.fullStream);
            }, 2);
            flags |= 4 /* UpdateFlags.FullObjects */;
        }
        if (data.partialObjectsCache?.length) {
            strm.writeArray(data.partialObjectsCache, object => {
                strm.writeStream(object.partialStream);
            }, 2);
            flags |= 8 /* UpdateFlags.PartialObjects */;
        }
        if (data.bullets?.length) {
            strm.writeArray(data.bullets, bullet => { bullet.serialize(strm); }, 1);
            flags |= 16 /* UpdateFlags.Bullets */;
        }
        if (data.explosions?.length) {
            strm.writeArray(data.explosions, explosion => {
                explosions_1.Explosions.writeToStream(strm, explosion.definition);
                strm.writePosition(explosion.position)
                    .writeLayer(explosion.layer);
            }, 1);
            flags |= 32 /* UpdateFlags.Explosions */;
        }
        if (data.emotes?.length) {
            strm.writeArray(data.emotes, emote => {
                emotes_1.Emotes.writeToStream(strm, emote.definition);
                strm.writeObjectId(emote.playerID);
            }, 1);
            flags |= 64 /* UpdateFlags.Emotes */;
        }
        if (data.gas) {
            const gas = data.gas;
            strm.writeUint8(gas.state)
                .writeUint8(gas.currentDuration)
                .writePosition(gas.oldPosition)
                .writePosition(gas.newPosition)
                .writeFloat(gas.oldRadius, 0, 2048, 2)
                .writeFloat(gas.newRadius, 0, 2048, 2)
                .writeBooleanGroup(gas.finalStage ?? false);
            flags |= 128 /* UpdateFlags.Gas */;
        }
        if (data.gasProgress !== undefined) {
            strm.writeFloat(data.gasProgress, 0, 1, 2);
            flags |= 256 /* UpdateFlags.GasPercentage */;
        }
        if (data.newPlayers?.length) {
            strm.writeArray(data.newPlayers, player => {
                const hasColor = player.hasColor;
                const hasBadge = player.badge !== undefined;
                strm.writeObjectId(player.id)
                    .writePlayerName(player.name)
                    .writeUint8((hasColor ? 2 : 0) + (hasBadge ? 1 : 0));
                if (hasColor) {
                    strm.writeUint24(player.nameColor);
                }
                if (hasBadge) {
                    badges_1.Badges.writeToStream(strm, player.badge);
                }
            }, 1);
            flags |= 512 /* UpdateFlags.NewPlayers */;
        }
        if (data.deletedPlayers?.length) {
            strm.writeArray(data.deletedPlayers, id => { strm.writeObjectId(id); }, 1);
            flags |= 1024 /* UpdateFlags.DeletedPlayers */;
        }
        if (data.aliveCount !== undefined) {
            strm.writeUint8(data.aliveCount);
            flags |= 2048 /* UpdateFlags.AliveCount */;
        }
        if (data.planes?.length) {
            strm.writeArray(data.planes, plane => {
                strm.writeVector(plane.position, planeMinPos, planeMinPos, planeMaxPos, planeMaxPos, 3);
                strm.writeRotation2(plane.direction);
            }, 1);
            flags |= 4096 /* UpdateFlags.Planes */;
        }
        if (data.mapPings?.length) {
            strm.writeArray(data.mapPings, ping => {
                mapPings_1.MapPings.writeToStream(strm, ping.definition);
                strm.writePosition(ping.position);
                if (ping.definition.isPlayerPing) {
                    strm.writeObjectId(ping.playerId);
                }
            });
            flags |= 8192 /* UpdateFlags.MapPings */;
        }
        if (data.mapIndicators?.length) {
            strm.writeArray(data.mapIndicators, indicator => {
                const { id, positionDirty, definitionDirty, dead, position, definition } = indicator;
                strm.writeUint8(id);
                strm.writeBooleanGroup(positionDirty, definitionDirty, dead);
                if (positionDirty) {
                    // can't be undefined on server
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    strm.writePosition(position);
                }
                if (definitionDirty) {
                    // also can't be undefined on server
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    mapIndicators_1.MapIndicators.writeToStream(strm, definition);
                }
            });
            flags |= 16384 /* UpdateFlags.MapIndicators */;
        }
        if (data.killLeader) {
            strm.writeObjectId(data.killLeader.id)
                .writeUint8(data.killLeader.kills);
            flags |= 32768 /* UpdateFlags.KillLeader */;
        }
        const idx = strm.index;
        strm.index = flagsIdx;
        strm.writeUint16(flags);
        // restore stream index
        strm.index = idx;
    },
    deserialize(stream, data, saveIndex, recordTo) {
        const flags = stream.readUint16();
        if ((flags & 1 /* UpdateFlags.PlayerData */) !== 0) {
            saveIndex();
            data.playerData = deserializePlayerData(stream);
            recordTo(0 /* DataSplitTypes.PlayerData */);
        }
        if ((flags & 2 /* UpdateFlags.DeletedObjects */) !== 0) {
            saveIndex();
            data.deletedObjects = stream.readArray(() => stream.readObjectId(), 2);
            recordTo(5 /* DataSplitTypes.GameObjects */);
        }
        if ((flags & 4 /* UpdateFlags.FullObjects */) !== 0) {
            data.fullDirtyObjects = stream.readArray(() => {
                saveIndex();
                const id = stream.readObjectId();
                const type = stream.readObjectType();
                const serializers = objectsSerializations_1.ObjectSerializations[type];
                const obj = {
                    id,
                    type,
                    data: {
                        ...serializers.deserializePartial(stream),
                        full: serializers.deserializeFull(stream)
                    }
                };
                recordTo((0, packet_1.getSplitTypeForCategory)(type));
                return obj;
            }, 2);
        }
        if ((flags & 8 /* UpdateFlags.PartialObjects */) !== 0) {
            data.partialDirtyObjects = stream.readArray(() => {
                saveIndex();
                const id = stream.readObjectId();
                const type = stream.readObjectType();
                const obj = {
                    id,
                    type,
                    data: objectsSerializations_1.ObjectSerializations[type].deserializePartial(stream)
                };
                recordTo((0, packet_1.getSplitTypeForCategory)(type));
                return obj;
            }, 2);
        }
        saveIndex();
        if ((flags & 16 /* UpdateFlags.Bullets */) !== 0) {
            data.deserializedBullets = stream.readArray(() => baseBullet_1.BaseBullet.deserialize(stream), 1);
        }
        if ((flags & 32 /* UpdateFlags.Explosions */) !== 0) {
            data.explosions = stream.readArray(() => ({
                definition: explosions_1.Explosions.readFromStream(stream),
                position: stream.readPosition(),
                layer: stream.readLayer()
            }), 1);
        }
        if ((flags & 64 /* UpdateFlags.Emotes */) !== 0) {
            data.emotes = stream.readArray(() => ({
                definition: emotes_1.Emotes.readFromStream(stream),
                playerID: stream.readObjectId()
            }), 1);
        }
        recordTo(5 /* DataSplitTypes.GameObjects */);
        if ((flags & 128 /* UpdateFlags.Gas */) !== 0) {
            data.gas = {
                state: stream.readUint8(),
                currentDuration: stream.readUint8(),
                oldPosition: stream.readPosition(),
                newPosition: stream.readPosition(),
                oldRadius: stream.readFloat(0, 2048, 2),
                newRadius: stream.readFloat(0, 2048, 2),
                finalStage: stream.readBooleanGroup()[0]
            };
        }
        if ((flags & 256 /* UpdateFlags.GasPercentage */) !== 0) {
            data.gasProgress = stream.readFloat(0, 1, 2);
        }
        saveIndex();
        if ((flags & 512 /* UpdateFlags.NewPlayers */) !== 0) {
            data.newPlayers = stream.readArray(() => {
                const id = stream.readObjectId();
                const name = stream.readPlayerName();
                const decorations = stream.readUint8();
                const hasColor = (decorations & 2) !== 0;
                return {
                    id,
                    name,
                    hasColor,
                    nameColor: hasColor ? stream.readUint24() : undefined,
                    badge: (decorations & 1) !== 0 ? badges_1.Badges.readFromStream(stream) : undefined
                };
            }, 1);
        }
        if ((flags & 1024 /* UpdateFlags.DeletedPlayers */) !== 0) {
            data.deletedPlayers = stream.readArray(() => stream.readObjectId(), 1);
        }
        recordTo(5 /* DataSplitTypes.GameObjects */);
        if ((flags & 2048 /* UpdateFlags.AliveCount */) !== 0) {
            data.aliveCount = stream.readUint8();
        }
        if ((flags & 4096 /* UpdateFlags.Planes */) !== 0) {
            data.planes = stream.readArray(() => ({
                position: stream.readVector(planeMinPos, planeMinPos, planeMaxPos, planeMaxPos, 3),
                direction: stream.readRotation2()
            }), 1);
        }
        if ((flags & 8192 /* UpdateFlags.MapPings */) !== 0) {
            data.mapPings = stream.readArray(() => {
                const definition = mapPings_1.MapPings.readFromStream(stream);
                return {
                    definition,
                    position: stream.readPosition(),
                    ...(definition.isPlayerPing ? { playerId: stream.readObjectId() } : {})
                };
            }, 1);
        }
        if ((flags & 16384 /* UpdateFlags.MapIndicators */) !== 0) {
            data.mapIndicators = stream.readArray(() => {
                const id = stream.readUint8();
                const [positionDirty, definitionDirty, dead] = stream.readBooleanGroup();
                let position;
                if (positionDirty) {
                    position = stream.readPosition();
                }
                let definition;
                if (definitionDirty) {
                    definition = mapIndicators_1.MapIndicators.readFromStream(stream);
                }
                return { id, positionDirty, definitionDirty, dead, position, definition };
            });
        }
        if ((flags & 32768 /* UpdateFlags.KillLeader */) !== 0) {
            data.killLeader = {
                id: stream.readObjectId(),
                kills: stream.readUint8()
            };
        }
    }
});
//# sourceMappingURL=updatePacket.js.map