"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuroiByteStream = exports.calculateEnumPacketBits = void 0;
const constants_1 = require("../constants");
const byteStream_1 = require("./byteStream");
const math_1 = require("./math");
const calculateEnumPacketBits = (enumeration) => Math.ceil(Math.log2(Object.keys(enumeration).length / 2));
exports.calculateEnumPacketBits = calculateEnumPacketBits;
if ((0, exports.calculateEnumPacketBits)(constants_1.ObjectCategory) > 8) {
    throw new RangeError("FATAL: ObjectCategory enum contains too many keys for a single byte. Please update code accordingly");
}
const { maxPosition, objectMinScale, objectMaxScale, player: { nameMaxLength } } = constants_1.GameConstants;
const objectScaleRange = objectMaxScale - objectMinScale;
class SuroiByteStream extends byteStream_1.ByteStream {
    /**
     * Writes a {@link Vector} object to the stream. Undefined behavior occurs if either `[minX, maxX]` or `[minY, maxY]` is degenerate.
     * Otherwise, both intervals are inclusive
     * @param vector The vector to write. Undefined behavior occurs if either component is out-of-bounds
     * @param minX The smallest x value
     * @param minY The largest x value
     * @param maxX The smallest y value
     * @param maxY The largest y value
     * @param bytes The number of bytes to use
     */
    writeVector(vector, minX, minY, maxX, maxY, bytes) {
        this.writeFloat(vector.x, minX, maxX, bytes);
        this.writeFloat(vector.y, minY, maxY, bytes);
        return this;
    }
    /**
     * Reads a {@link Vector} object from the stream. Undefined behavior occurs if either `[minX, maxX]` or `[minY, maxY]` is degenerate.
     * Otherwise, both intervals are inclusive
     * @param minX The smallest x value
     * @param minY The largest x value
     * @param maxX The smallest y value
     * @param maxY The largest y value
     * @param bytes The number of bytes to use
     */
    readVector(minX, minY, maxX, maxY, bytes) {
        return {
            x: this.readFloat(minX, maxX, bytes),
            y: this.readFloat(minY, maxY, bytes)
        };
    }
    /**
     * Writes an object category to the stream
     */
    writeObjectType(type) {
        return this.writeUint8(type);
    }
    /**
     * Writes an object category to the stream
     */
    readObjectType() {
        return this.readUint8();
    }
    /**
     * Alias for {@link ByteStream.writeUint16}
     */
    writeObjectId(id) {
        return this.writeUint16(id);
    }
    /**
     * Alias for {@link ByteStream.readUint16}
     */
    readObjectId() {
        return this.readUint16();
    }
    /**
     * Writes a position to the stream, using {@link GameConstants.maxPosition} as an upper bound.
     * @param vector The position
     *
     * Impl. note: inlined and optimized version of the expression: `vector => writeVector(vector, 0, GameConstants.maxPosition, 0, GameConstants.maxPosition, 2)`
     */
    writePosition(vector) {
        this.writeUint16((vector.x / maxPosition) * 65535 + 0.5);
        this.writeUint16((vector.y / maxPosition) * 65535 + 0.5);
        return this;
    }
    /**
     * Reads a position from the stream, using {@link GameConstants.maxPosition} as an upper bound.
     *
     * Impl. note: inlined and optimized version of the expression: `() => readVector(0, GameConstants.maxPosition, 0, GameConstants.maxPosition, 2)`
     */
    readPosition() {
        return {
            x: maxPosition * this.readUint16() / 65535,
            y: maxPosition * this.readUint16() / 65535
        };
    }
    /**
     * Writes an obstacle rotation to the stream
     *
     * **Note**: This method is provided, but users should be aware that it is not space-efficient, and should
     * therefore investigate space optimization techniques
     * @param value The rotation value. Passing an invalid value for the given mode results in undefined behavior
     * @param mode The rotation mode to use
     */
    writeObstacleRotation(value, mode) {
        switch (mode) {
            case constants_1.RotationMode.Full: {
                this.writeRotation(value);
                break;
            }
            case constants_1.RotationMode.Limited:
            case constants_1.RotationMode.Binary: {
                this.writeUint8(value);
                break;
            }
            // case RotationMode.None: {
            //     break;
            // }
        }
        return this;
    }
    /**
     * Reads an obstacle rotation from the stream
     *
     * **Note**: This method is provided, but users should be aware that it is not space-efficient, and should
     * therefore investigate space optimization techniques
     * @param mode The mode to use
     */
    readObstacleRotation(mode) {
        let orientation = 0;
        let rotation = 0;
        switch (mode) {
            case constants_1.RotationMode.Full: {
                rotation = this.readRotation();
                break;
            }
            case constants_1.RotationMode.Limited: {
                orientation = this.readUint8();
                rotation = -math_1.Angle.normalize(orientation) * math_1.halfπ;
                break;
            }
            case constants_1.RotationMode.Binary: {
                if (this.readUint8() !== 0) {
                    rotation = math_1.halfπ; // sus
                    orientation = 1;
                }
                break;
            }
            // case RotationMode.None: {
            //     break;
            // }
        }
        return {
            rotation,
            orientation
        };
    }
    /**
     * Writes a scale to the stream
     * @param scale The scale to write. Must be within `[MIN_OBJECT_SCALE, MAX_OBJECT_SCALE]`
     *
     * Impl. note: inlined and optimized version of the expression: `scale => writeFloat(scale, MIN_OBJECT_SCALE, MAX_OBJECT_SCALE, 1)`
     */
    writeScale(scale) {
        this.writeUint8(((scale - objectMinScale) / objectScaleRange) * 255 + 0.5);
        return this;
    }
    /**
     * Reads a scale from the stream
     * @returns A scale within `[MIN_OBJECT_SCALE, MAX_OBJECT_SCALE]`
     *
     * Impl. note: inlined and optimized version of the expression: `() => readFloat(MIN_OBJECT_SCALE, MAX_OBJECT_SCALE, 1)`
     */
    readScale() {
        return objectMinScale + objectScaleRange * this.readUint8() / 255;
    }
    /**
     * Alias for {@link ByteStream.writeInt8}
     */
    writeLayer(layer) {
        return this.writeInt8(layer);
    }
    /**
     * Alias for {@link ByteStream.readUint8}
     */
    readLayer() {
        return this.readInt8();
    }
    /**
     * Writes a player's name to the stream, as if by `name => writeString(16, name)`
     */
    writePlayerName(name) {
        const byteArray = byteStream_1.ByteStream.encoder.encode(name);
        for (let i = 0; i < nameMaxLength; i++) {
            const val = byteArray[i] ?? 0;
            this.writeUint8(val);
            if (val === 0) {
                break;
            }
        }
        return this;
    }
    /**
     * Reads a player's name to the stream, as if by `() => readString(16, name)`
     */
    readPlayerName() {
        const chars = [];
        let c;
        let i = 0;
        do {
            if ((c = this.readUint8()) === 0) {
                break;
            }
            chars[i++] = c;
        } while (i < nameMaxLength);
        return byteStream_1.ByteStream.decoder.decode(new Uint8Array(chars));
    }
}
exports.SuroiByteStream = SuroiByteStream;
//# sourceMappingURL=suroiByteStream.js.map