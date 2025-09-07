"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPacket = void 0;
const constants_1 = require("../constants");
const buildings_1 = require("../definitions/buildings");
const obstacles_1 = require("../definitions/obstacles");
const math_1 = require("../utils/math");
const packet_1 = require("./packet");
exports.MapPacket = new packet_1.Packet(packet_1.PacketType.Map, {
    serialize(strm, data) {
        strm.writeUint32(data.seed)
            .writeUint16(data.width)
            .writeUint16(data.height)
            .writeUint16(data.oceanSize)
            .writeUint16(data.beachSize)
            .writeArray(data.rivers, river => {
            strm.writeUint8(river.width)
                .writeArray(river.points, point => strm.writePosition(point))
                .writeUint8(river.isTrail ? -1 : 0);
        })
            .writeArray(data.objects, object => {
            strm.writeObjectType(object.type)
                .writePosition(object.position);
            switch (object.type) {
                case constants_1.ObjectCategory.Obstacle: {
                    obstacles_1.Obstacles.writeToStream(strm, object.definition);
                    // once again, we hit a deadspace optimization issue, but thankfully, it's easier this time
                    // once again, variation takes up to 3 bits, meaning that using an 8-bit integer leaves
                    // space for the limited and binary rotation modes, which take 2 and 1 bit respectively.
                    // for a rotation mode of full, well we just write that as-is and write the variation as-is too
                    let obstacleData = 0;
                    if (object.definition.variations !== undefined && object.variation !== undefined) {
                        // again, we'll make variation take up the MSB
                        obstacleData = object.variation << (8 - object.definition.variationBits);
                    }
                    switch (object.definition.rotationMode) {
                        case constants_1.RotationMode.Full: {
                            // nothing to pack here
                            // as an aside, write obstacle data first to make deserialization easier
                            strm.writeUint8(obstacleData);
                            strm.writeRotation(object.rotation);
                            break;
                        }
                        case constants_1.RotationMode.Limited:
                        case constants_1.RotationMode.Binary: {
                            // pack the rotation data into the LSB's of obstacleData, then write that
                            strm.writeUint8(obstacleData + object.rotation);
                            break;
                        }
                        case constants_1.RotationMode.None: {
                            // write the variation data (and even without it, deser expects a uint8 here)
                            strm.writeUint8(obstacleData);
                            break;
                        }
                    }
                    break;
                }
                case constants_1.ObjectCategory.Building:
                    buildings_1.Buildings.writeToStream(strm, object.definition);
                    strm.writeObstacleRotation(object.orientation, constants_1.RotationMode.Limited)
                        .writeLayer(object.layer);
                    break;
            }
        }, 2)
            .writeArray(data.places ?? [], place => {
            strm.writeString(24, place.name)
                .writePosition(place.position);
        });
    },
    deserialize(stream, data, saveIndex, recordTo) {
        saveIndex();
        data.seed = stream.readUint32();
        data.width = stream.readUint16();
        data.height = stream.readUint16();
        data.oceanSize = stream.readUint16();
        data.beachSize = stream.readUint16();
        data.rivers = stream.readArray(() => ({
            width: stream.readUint8(),
            points: stream.readArray(() => stream.readPosition()),
            isTrail: stream.readUint8() !== 0
        }));
        data.objects = stream.readArray(() => {
            const type = stream.readObjectType();
            const position = stream.readPosition();
            switch (type) {
                case constants_1.ObjectCategory.Obstacle: {
                    const definition = obstacles_1.Obstacles.readFromStream(stream);
                    const scale = definition.scale?.spawnMax ?? 1;
                    // see comments in serialization method to better
                    // understand what's going on
                    const obstacleData = stream.readUint8();
                    let variation;
                    if (definition.variations !== undefined) {
                        const bits = 8 - definition.variationBits;
                        variation = ((obstacleData & (0xFF - (2 ** bits - 1)))) >> bits;
                        //                           ^^^^^^^^^^^^^^^^^^^^^^^^ mask the most significant bits
                    }
                    let rotation = 0;
                    switch (definition.rotationMode) {
                        case constants_1.RotationMode.Full: {
                            rotation = stream.readRotation();
                            break;
                        }
                        case constants_1.RotationMode.Limited:
                        case constants_1.RotationMode.Binary: {
                            const orientation = (obstacleData & 0b11);
                            rotation = definition.rotationMode === constants_1.RotationMode.Binary
                                ? orientation * math_1.halfπ // sus
                                : -math_1.Angle.normalize(orientation) * math_1.halfπ;
                            break;
                        }
                        // case RotationMode.None: {
                        //     break;
                        // }
                    }
                    return {
                        position,
                        type,
                        dead: false,
                        definition,
                        scale,
                        rotation,
                        variation,
                        isObstacle: true
                    };
                }
                case constants_1.ObjectCategory.Building: {
                    const definition = buildings_1.Buildings.readFromStream(stream);
                    const { orientation } = stream.readObstacleRotation(constants_1.RotationMode.Limited);
                    const layer = stream.readLayer();
                    return {
                        position,
                        type,
                        dead: false,
                        definition,
                        rotation: math_1.Angle.orientationToRotation(orientation),
                        orientation,
                        scale: 1,
                        layer,
                        isBuilding: true
                    };
                }
            }
        }, 2);
        data.places = stream.readArray(() => ({
            name: stream.readString(24),
            position: stream.readPosition()
        }));
        recordTo(5 /* DataSplitTypes.GameObjects */);
    }
});
//# sourceMappingURL=mapPacket.js.map