"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPacket = void 0;
const packet_1 = require("./packet");
exports.ReportPacket = new packet_1.Packet(packet_1.PacketType.Report, {
    serialize(strm, data) {
        strm.writeObjectId(data.playerID)
            .writeString(8, data.reportID);
    },
    deserialize(stream, data) {
        data.playerID = stream.readObjectId();
        data.reportID = stream.readString(8);
    }
});
//# sourceMappingURL=reportPacket.js.map