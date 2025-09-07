"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupPacket = void 0;
const loots_1 = require("../definitions/loots");
const packet_1 = require("./packet");
;
exports.PickupPacket = new packet_1.Packet(packet_1.PacketType.Pickup, {
    serialize(stream, data) {
        const { message, item } = data;
        const hasItem = item !== undefined;
        const hasMessage = message !== undefined;
        // inventory message is 3 bits, so let's use an 8 bit number
        // we'll set its 1st MSB to hasItem, 2nd MSB to hasMessage,
        // and 3 LSB's as the inventory message
        let pickupData = (hasItem ? 128 : 0) + (hasMessage ? 64 : 0);
        if (!hasItem && hasMessage) {
            pickupData += message;
        }
        stream.writeUint8(pickupData);
        if (hasItem) {
            loots_1.Loots.writeToStream(stream, item);
        }
    },
    deserialize(stream, data, saveIndex, recordTo) {
        saveIndex();
        const pickupData = stream.readUint8();
        const hasItem = (pickupData & 128) !== 0;
        const hasMessage = (pickupData & 64) !== 0;
        if (hasItem) {
            data.item = loots_1.Loots.readFromStream(stream);
        }
        else if (hasMessage) {
            data.message = (pickupData & 0b111);
        }
        recordTo(5 /* DataSplitTypes.GameObjects */);
    }
});
//# sourceMappingURL=pickupPacket.js.map