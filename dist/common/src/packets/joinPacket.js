"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinPacket = void 0;
const constants_1 = require("../constants");
const badges_1 = require("../definitions/badges");
const emotes_1 = require("../definitions/emotes");
const loots_1 = require("../definitions/loots");
const packet_1 = require("./packet");
exports.JoinPacket = new packet_1.Packet(packet_1.PacketType.Join, {
    serialize(stream, data) {
        const emotes = data.emotes;
        const hasBadge = data.badge !== undefined;
        stream.writeBooleanGroup2(data.isMobile, hasBadge, emotes[0] !== undefined, emotes[1] !== undefined, emotes[2] !== undefined, emotes[3] !== undefined, emotes[4] !== undefined, emotes[5] !== undefined, emotes[6] !== undefined, emotes[7] !== undefined);
        stream.writeUint16(constants_1.GameConstants.protocolVersion);
        stream.writePlayerName(data.name);
        loots_1.Loots.writeToStream(stream, data.skin);
        if (hasBadge) {
            badges_1.Badges.writeToStream(stream, data.badge);
        }
        for (let i = 0; i < 8; i++) {
            const emote = emotes[i];
            if (emote === undefined)
                continue;
            emotes_1.Emotes.writeToStream(stream, emote);
        }
    },
    deserialize(stream, data) {
        const [isMobile, hasBadge, ...emotes] = stream.readBooleanGroup2();
        data.isMobile = isMobile;
        data.protocolVersion = stream.readUint16();
        data.name = stream.readPlayerName().split(/<[^>]+>/g).join("").trim(); // Regex strips out HTML
        data.skin = loots_1.Loots.readFromStream(stream);
        if (hasBadge) {
            data.badge = badges_1.Badges.readFromStream(stream);
        }
        data.emotes = new Array(8);
        for (let i = 0; i < 8; i++) {
            if (!emotes[i])
                continue;
            data.emotes[i] = emotes_1.Emotes.readFromStream(stream);
        }
    }
});
//# sourceMappingURL=joinPacket.js.map