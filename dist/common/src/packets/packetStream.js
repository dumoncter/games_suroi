"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketStream = exports.Packets = void 0;
const suroiByteStream_1 = require("../utils/suroiByteStream");
const gameOverPacket_1 = require("./gameOverPacket");
const inputPacket_1 = require("./inputPacket");
const joinPacket_1 = require("./joinPacket");
const joinedPacket_1 = require("./joinedPacket");
const killPacket_1 = require("./killPacket");
const mapPacket_1 = require("./mapPacket");
const pickupPacket_1 = require("./pickupPacket");
const reportPacket_1 = require("./reportPacket");
const spectatePacket_1 = require("./spectatePacket");
const updatePacket_1 = require("./updatePacket");
exports.Packets = [
    gameOverPacket_1.GameOverPacket,
    inputPacket_1.InputPacket,
    joinedPacket_1.JoinedPacket,
    joinPacket_1.JoinPacket,
    killPacket_1.KillPacket,
    mapPacket_1.MapPacket,
    pickupPacket_1.PickupPacket,
    reportPacket_1.ReportPacket,
    spectatePacket_1.SpectatePacket,
    updatePacket_1.UpdatePacket
];
class PacketStream {
    stream;
    constructor(source) {
        if (source instanceof ArrayBuffer) {
            this.stream = new suroiByteStream_1.SuroiByteStream(source);
        }
        else {
            this.stream = source;
        }
    }
    serialize(data) {
        const type = data.type - 1;
        this.stream.writeUint8(type);
        exports.Packets[type].serialize(this.stream, data);
    }
    deserialize(splits) {
        if (this.stream.buffer.byteLength <= this.stream.index)
            return;
        const type = this.stream.readUint8();
        return exports.Packets[type].deserialize(this.stream, splits);
    }
    getBuffer() {
        return this.stream.buffer.slice(0, this.stream.index);
    }
}
exports.PacketStream = PacketStream;
//# sourceMappingURL=packetStream.js.map