"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectatePacket = void 0;
const packet_1 = require("./packet");
exports.SpectatePacket = new packet_1.Packet(packet_1.PacketType.Spectate, {
    serialize(stream, data) {
        stream.writeUint8(data.spectateAction);
        if (data.spectateAction === 3 /* SpectateActions.SpectateSpecific */) {
            stream.writeObjectId(data.playerID);
        }
    },
    deserialize(stream, data) {
        data.spectateAction = stream.readUint8();
        if (data.spectateAction === 3 /* SpectateActions.SpectateSpecific */) {
            data.playerID = stream.readObjectId();
        }
    }
});
//# sourceMappingURL=spectatePacket.js.map