"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KillPacket = exports.DamageSources = void 0;
const explosions_1 = require("../definitions/explosions");
const guns_1 = require("../definitions/items/guns");
const melees_1 = require("../definitions/items/melees");
const throwables_1 = require("../definitions/items/throwables");
const obstacles_1 = require("../definitions/obstacles");
const objectDefinitions_1 = require("../utils/objectDefinitions");
const packet_1 = require("./packet");
var DamageSources;
(function (DamageSources) {
    DamageSources[DamageSources["Gun"] = 0] = "Gun";
    DamageSources[DamageSources["Melee"] = 1] = "Melee";
    DamageSources[DamageSources["Throwable"] = 2] = "Throwable";
    DamageSources[DamageSources["Explosion"] = 3] = "Explosion";
    DamageSources[DamageSources["Gas"] = 4] = "Gas";
    DamageSources[DamageSources["Obstacle"] = 5] = "Obstacle";
    DamageSources[DamageSources["BleedOut"] = 6] = "BleedOut";
    DamageSources[DamageSources["FinallyKilled"] = 7] = "FinallyKilled";
})(DamageSources || (exports.DamageSources = DamageSources = {}));
exports.KillPacket = new packet_1.Packet(packet_1.PacketType.Kill, {
    serialize(stream, data) {
        const hasAttackerId = data.attackerId !== undefined;
        const victimIsCreditedId = data.victimId === data.creditedId;
        const hasCreditedId = data.creditedId !== undefined;
        /*
            for this message type, kfData has the following format:

            a v c d k s s s

            a = attackerId present (hasAttackerId)
            v = victimId === creditedId (victimIsCreditedId)
            c = creditedId present (hasCreditedId)
            d = downed
            k = killed
            s = damageSource
        */
        let kfData = data.damageSource;
        if (hasAttackerId)
            kfData += 128;
        if (victimIsCreditedId) {
            kfData += 64;
        }
        else if (hasCreditedId) {
            kfData += 32;
        }
        if (data.downed)
            kfData += 16;
        if (data.killed)
            kfData += 8;
        stream.writeUint8(kfData);
        stream.writeObjectId(data.victimId);
        if (hasAttackerId) {
            stream.writeObjectId(data.attackerId);
        }
        if (hasCreditedId && !victimIsCreditedId) {
            stream.writeObjectId(data.creditedId);
        }
        if (hasAttackerId || hasCreditedId) {
            stream.writeUint8(data.kills ?? 0);
        }
        switch (data.damageSource) {
            case DamageSources.Gun:
                guns_1.Guns.writeToStream(stream, data.weaponUsed);
                break;
            case DamageSources.Melee:
                melees_1.Melees.writeToStream(stream, data.weaponUsed);
                break;
            case DamageSources.Throwable:
                throwables_1.Throwables.writeToStream(stream, data.weaponUsed);
                break;
            case DamageSources.Explosion:
                explosions_1.Explosions.writeToStream(stream, data.weaponUsed);
                break;
            case DamageSources.Obstacle:
                obstacles_1.Obstacles.writeToStream(stream, data.weaponUsed);
                break;
        }
        if (data.weaponUsed !== undefined
            && data.weaponUsed.defType !== objectDefinitions_1.DefinitionType.Explosion
            && "killstreak" in data.weaponUsed
            && data.weaponUsed.killstreak) {
            stream.writeUint8(data.killstreak ?? 0);
        }
    },
    deserialize(stream, data, saveIndex, recordTo) {
        saveIndex();
        // see the comments in the serialization method to
        // understand the format and what's going on
        const kfData = stream.readUint8();
        const hasAttackerId = (kfData & 128) !== 0;
        const victimIsCreditedId = (kfData & 64) !== 0;
        const hasCreditedId = (kfData & 32) !== 0;
        data.damageSource = kfData & 0b111;
        data.downed = (kfData & 16) !== 0;
        data.killed = (kfData & 8) !== 0;
        data.victimId = stream.readObjectId();
        if (hasAttackerId) {
            data.attackerId = stream.readObjectId();
        }
        if (victimIsCreditedId) {
            data.creditedId = data.victimId;
        }
        else if (hasCreditedId) {
            data.creditedId = stream.readObjectId();
        }
        if (hasAttackerId || hasCreditedId) {
            data.kills = stream.readUint8();
        }
        switch (data.damageSource) {
            case DamageSources.Gun:
                data.weaponUsed = guns_1.Guns.readFromStream(stream);
                break;
            case DamageSources.Melee:
                data.weaponUsed = melees_1.Melees.readFromStream(stream);
                break;
            case DamageSources.Throwable:
                data.weaponUsed = throwables_1.Throwables.readFromStream(stream);
                break;
            case DamageSources.Explosion:
                data.weaponUsed = explosions_1.Explosions.readFromStream(stream);
                break;
            case DamageSources.Obstacle:
                data.weaponUsed = obstacles_1.Obstacles.readFromStream(stream);
                break;
        }
        if (data.weaponUsed
            && "killstreak" in data.weaponUsed
            && data.weaponUsed.killstreak) {
            data.killstreak = stream.readUint8();
        }
        recordTo(6 /* DataSplitTypes.Killfeed */);
    }
});
//# sourceMappingURL=killPacket.js.map