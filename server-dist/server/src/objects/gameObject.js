"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGameObject = void 0;
const constants_1 = require("../../../common/src/constants");
const gameObject_1 = require("../../../common/src/utils/gameObject");
const objectsSerializations_1 = require("../../../common/src/utils/objectsSerializations");
const suroiByteStream_1 = require("../../../common/src/utils/suroiByteStream");
class BaseGameObject extends (0, gameObject_1.makeGameObjectTemplate)() {
    id;
    game;
    _position;
    get position() { return this._position; }
    set position(position) { this._position = position; }
    _rotation = 0;
    get rotation() { return this._rotation; }
    set rotation(rotation) { this._rotation = rotation; }
    damageable = false;
    dead = false;
    _layer = constants_1.Layer.Ground;
    get layer() { return this._layer; }
    set layer(value) { this._layer = value; }
    _fullStream;
    get fullStream() { return this._fullStream ??= new suroiByteStream_1.SuroiByteStream(new ArrayBuffer(this.fullAllocBytes)); }
    _partialStream;
    get partialStream() { return this._partialStream ??= new suroiByteStream_1.SuroiByteStream(new ArrayBuffer(this.partialAllocBytes)); }
    constructor(game, position) {
        super();
        this.id = game.nextObjectID;
        this.game = game;
        this._position = position;
        this.setDirty();
    }
    serializeFull() {
        this.serializePartial();
        const stream = this.fullStream;
        stream.index = 0;
        objectsSerializations_1.ObjectSerializations[this.type].serializeFull(stream, this.data);
    }
    serializePartial() {
        const stream = this.partialStream;
        stream.index = 0;
        stream.writeObjectId(this.id);
        stream.writeObjectType(this.type);
        objectsSerializations_1.ObjectSerializations[this.type].serializePartial(stream, this.data);
    }
    /**
     * Sets this object as fully dirty
     *
     * This means all the serialization data will be sent
     * to clients on the next update
     */
    setDirty() {
        this.game.fullDirtyObjects.add(this);
    }
    /**
     * Sets this object as partially dirty
     *
     * This means the partial data will be sent to clients
     * on the next update
     */
    setPartialDirty() {
        this.game.partialDirtyObjects.add(this);
    }
}
exports.BaseGameObject = BaseGameObject;
//# sourceMappingURL=gameObject.js.map