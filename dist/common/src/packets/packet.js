"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = exports.PacketType = void 0;
exports.getSplitTypeForCategory = getSplitTypeForCategory;
const constants_1 = require("../constants");
var PacketType;
(function (PacketType) {
    PacketType[PacketType["Disconnect"] = 0] = "Disconnect";
    PacketType[PacketType["GameOver"] = 1] = "GameOver";
    PacketType[PacketType["Input"] = 2] = "Input";
    PacketType[PacketType["Joined"] = 3] = "Joined";
    PacketType[PacketType["Join"] = 4] = "Join";
    PacketType[PacketType["Kill"] = 5] = "Kill";
    PacketType[PacketType["Map"] = 6] = "Map";
    PacketType[PacketType["Pickup"] = 7] = "Pickup";
    PacketType[PacketType["Report"] = 8] = "Report";
    PacketType[PacketType["Spectate"] = 9] = "Spectate";
    PacketType[PacketType["Update"] = 10] = "Update";
})(PacketType || (exports.PacketType = PacketType = {}));
function getSplitTypeForCategory(category) {
    /* eslint-disable @stylistic/no-multi-spaces */
    switch (category) {
        case constants_1.ObjectCategory.Player: return 1 /* DataSplitTypes.Players */;
        case constants_1.ObjectCategory.Obstacle: return 2 /* DataSplitTypes.Obstacles */;
        case constants_1.ObjectCategory.DeathMarker: return 5 /* DataSplitTypes.GameObjects */;
        case constants_1.ObjectCategory.Loot: return 3 /* DataSplitTypes.Loots */;
        case constants_1.ObjectCategory.Building: return 5 /* DataSplitTypes.GameObjects */;
        case constants_1.ObjectCategory.Decal: return 5 /* DataSplitTypes.GameObjects */;
        case constants_1.ObjectCategory.Parachute: return 5 /* DataSplitTypes.GameObjects */;
        case constants_1.ObjectCategory.Projectile: return 5 /* DataSplitTypes.GameObjects */;
        case constants_1.ObjectCategory.SyncedParticle: return 4 /* DataSplitTypes.SyncedParticles */;
    }
    /* eslint-enable @stylistic/no-multi-spaces */
}
;
class Packet {
    type;
    serialize;
    deserialize;
    constructor(type, { serialize, deserialize }) {
        this.type = type;
        this.serialize = serialize;
        this.deserialize = (stream, splits) => {
            let savedIndex;
            const data = { type: this.type };
            deserialize(stream, data, () => savedIndex = stream.index, target => splits && (splits[target] += stream.index - savedIndex));
            return data;
        };
    }
    create(data = {}) {
        return { ...data, type: this.type };
    }
}
exports.Packet = Packet;
//# sourceMappingURL=packet.js.map