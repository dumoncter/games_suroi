"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameOverPacket = void 0;
const packet_1 = require("../packets/packet");
exports.GameOverPacket = new packet_1.Packet(packet_1.PacketType.GameOver, {
    serialize(strm, data) {
        strm.writeUint8(data.rank);
        strm.writeArray(data.teammates, teammate => strm.writeObjectId(teammate.playerID)
            .writeUint8(teammate.kills)
            .writeUint16(teammate.damageDone)
            .writeUint16(teammate.damageTaken)
            .writeUint16(teammate.timeAlive)
            .writeUint8(teammate.alive ? 1 : 0));
    },
    deserialize(stream, data) {
        data.rank = stream.readUint8();
        data.teammates = stream.readArray(() => ({
            playerID: stream.readObjectId(),
            kills: stream.readUint8(),
            damageDone: stream.readUint16(),
            damageTaken: stream.readUint16(),
            timeAlive: stream.readUint16(),
            alive: stream.readUint8() === 1
        }));
    }
});
//# sourceMappingURL=gameOverPacket.js.map