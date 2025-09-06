"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinedPacket = void 0;
const constants_1 = require("../constants");
const emotes_1 = require("../definitions/emotes");
const packet_1 = require("./packet");
exports.JoinedPacket = new packet_1.Packet(packet_1.PacketType.Joined, {
    serialize(stream, data) {
        stream.writeUint8(data.teamMode);
        if (data.teamMode !== constants_1.TeamMode.Solo) {
            stream.writeUint8(data.teamID);
        }
        const emotes = data.emotes;
        stream.writeBooleanGroup(emotes[0] !== undefined, emotes[1] !== undefined, emotes[2] !== undefined, emotes[3] !== undefined, emotes[4] !== undefined, emotes[5] !== undefined, emotes[6] !== undefined, emotes[7] !== undefined);
        for (let i = 0; i < 8; i++) {
            const emote = emotes[i];
            if (emote === undefined)
                continue;
            emotes_1.Emotes.writeToStream(stream, emote);
        }
    },
    deserialize(stream, data, saveIndex, recordTo) {
        saveIndex();
        data.teamMode = stream.readUint8();
        if (data.teamMode !== constants_1.TeamMode.Solo) {
            data.teamID = stream.readUint8();
        }
        const emotes = stream.readBooleanGroup();
        data.emotes = new Array(8);
        for (let i = 0; i < 8; i++) {
            if (!emotes[i])
                continue;
            data.emotes[i] = emotes_1.Emotes.readFromStream(stream);
        }
        recordTo(0 /* DataSplitTypes.PlayerData */);
    }
});
//# sourceMappingURL=joinedPacket.js.map