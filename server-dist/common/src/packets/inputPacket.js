"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputPacket = void 0;
exports.areDifferent = areDifferent;
const constants_1 = require("../constants");
const emotes_1 = require("../definitions/emotes");
const loots_1 = require("../definitions/loots");
const mapPings_1 = require("../definitions/mapPings");
const packet_1 = require("./packet");
exports.InputPacket = new packet_1.Packet(packet_1.PacketType.Input, {
    serialize(stream, data) {
        const { movement, isMobile, turning } = data;
        stream.writeUint8(data.pingSeq);
        if ((data.pingSeq & 128) !== 0)
            return;
        stream.writeBooleanGroup(movement.up, movement.down, movement.left, movement.right, isMobile, data.mobile?.moving, turning, data.attacking);
        if (isMobile) {
            stream.writeRotation2(data.mobile.angle);
        }
        if (turning) {
            stream.writeRotation2(data.rotation);
            stream.writeFloat(data.distanceToMouse, 0, constants_1.GameConstants.player.maxMouseDist, 2);
        }
        stream.writeArray(data.actions, action => {
            if ("slot" in action) {
                // slot is 2 bits, InputActions is 4
                // move the slot info to the MSB and leave
                // the enum member as the LSB for compatibility
                // with the other branch
                stream.writeUint8(action.type + (action.slot << 6));
            }
            else {
                stream.writeUint8(action.type);
            }
            switch (action.type) {
                case 0 /* InputActions.EquipItem */:
                case 2 /* InputActions.DropWeapon */:
                case 5 /* InputActions.LockSlot */:
                case 6 /* InputActions.UnlockSlot */:
                case 7 /* InputActions.ToggleSlotLock */:
                    // already handled above
                    break;
                case 3 /* InputActions.DropItem */:
                    loots_1.Loots.writeToStream(stream, action.item);
                    break;
                case 11 /* InputActions.UseItem */:
                    loots_1.Loots.writeToStream(stream, action.item);
                    break;
                case 12 /* InputActions.Emote */:
                    emotes_1.Emotes.writeToStream(stream, action.emote);
                    break;
                case 13 /* InputActions.MapPing */:
                    mapPings_1.MapPings.writeToStream(stream, action.ping);
                    stream.writePosition(action.position);
                    break;
            }
        }, 1);
    },
    deserialize(stream, data) {
        const pingSeq = stream.readUint8();
        if ((pingSeq & 128) !== 0)
            return;
        data.pingSeq = pingSeq & 127;
        const [up, down, left, right, isMobile, moving, turning, attacking] = stream.readBooleanGroup();
        data.movement = { up, down, left, right };
        data.isMobile = isMobile;
        data.turning = turning;
        data.attacking = attacking;
        if (isMobile) {
            data.mobile = {
                moving,
                angle: stream.readRotation2()
            };
        }
        if (turning) {
            data.rotation = stream.readRotation2();
            data.distanceToMouse = stream.readFloat(0, constants_1.GameConstants.player.maxMouseDist, 2);
        }
        // Actions
        data.actions = stream.readArray(() => {
            const data = stream.readUint8();
            // hiMask = 2 msb, type = 4 lsb
            const [hiMask, type] = [data & 0b1100_0000, (data & 0b0000_1111)];
            let slot;
            let item;
            let emote;
            let position;
            let ping;
            switch (type) {
                case 0 /* InputActions.EquipItem */:
                case 2 /* InputActions.DropWeapon */:
                case 5 /* InputActions.LockSlot */:
                case 6 /* InputActions.UnlockSlot */:
                case 7 /* InputActions.ToggleSlotLock */:
                    slot = hiMask >> 6;
                    break;
                case 3 /* InputActions.DropItem */:
                    item = loots_1.Loots.readFromStream(stream);
                    break;
                case 11 /* InputActions.UseItem */:
                    item = loots_1.Loots.readFromStream(stream);
                    break;
                case 12 /* InputActions.Emote */:
                    emote = emotes_1.Emotes.readFromStream(stream);
                    break;
                case 13 /* InputActions.MapPing */:
                    ping = mapPings_1.MapPings.readFromStream(stream);
                    position = stream.readPosition();
                    break;
            }
            return { type, item, slot, emote, ping, position };
        });
    }
});
/**
* Compare two input packets to test if the information needs to be resent
* @param newPacket The new packet to potentially sent
* @param oldPacket The old packet (usually the last sent one) to compare against
*/
function areDifferent(newPacket, oldPacket) {
    if (newPacket.actions.length > 0)
        return true;
    for (const k in newPacket.movement) {
        const key = k;
        if (oldPacket.movement[key] !== newPacket.movement[key])
            return true;
    }
    if (newPacket.isMobile !== oldPacket.isMobile)
        return true;
    if (newPacket.isMobile) {
        for (const k in newPacket.mobile) {
            const key = k;
            if (oldPacket.mobile[key] !== newPacket.mobile[key])
                return true;
        }
    }
    for (const key of ["attacking", "turning", "rotation", "distanceToMouse"]) {
        if (oldPacket[key] !== newPacket[key])
            return true;
    }
    return false;
}
//# sourceMappingURL=inputPacket.js.map