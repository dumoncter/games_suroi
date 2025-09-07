"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncedParticle = void 0;
const constants_1 = require("../../../../common/src/constants");
const syncedParticles_1 = require("../../../../common/src/definitions/syncedParticles");
const hitbox_1 = require("../../../../common/src/utils/hitbox");
const math_1 = require("../../../../common/src/utils/math");
const random_1 = require("../../../../common/src/utils/random");
const vector_1 = require("../../../../common/src/utils/vector");
const gameObject_1 = require("./gameObject");
class SyncedParticle extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.SyncedParticle) {
    fullAllocBytes = 0;
    partialAllocBytes = 23;
    hitbox;
    _positionAnim;
    _alphaAnim;
    scale = 0;
    _scaleAnim;
    angularVelocity = 0;
    definition;
    _creationDate;
    _lifetime;
    age = 0;
    variant;
    creatorID;
    constructor(game, definition, position, endPosition, layer, creatorID) {
        super(game, position);
        this._creationDate = game.now;
        this.definition = definition;
        this.layer = layer ?? 0;
        const clampToMapBounds = (position) => (0, vector_1.Vec)(math_1.Numeric.clamp(position.x, 0, constants_1.GameConstants.maxPosition), math_1.Numeric.clamp(position.y, 0, constants_1.GameConstants.maxPosition));
        position = clampToMapBounds(position);
        if (endPosition)
            endPosition = clampToMapBounds(endPosition);
        this.creatorID = creatorID;
        if (definition.hasCreatorID && creatorID === undefined) {
            throw new Error("creatorID not specified for SyncedParticle which requires it");
        }
        else if (!definition.hasCreatorID && creatorID !== undefined) {
            throw new Error("creatorID specified for SyncedParticle which doesn't have it");
        }
        this._lifetime = (0, syncedParticles_1.resolveNumericSpecifier)(definition.lifetime);
        const { alpha, scale, velocity } = definition;
        const easing = math_1.EaseFunctions[velocity?.easing ?? "linear"];
        this._positionAnim = {
            start: position,
            end: endPosition ?? clampToMapBounds(vector_1.Vec.add(position, vector_1.Vec.scale((0, syncedParticles_1.resolveVectorSpecifier)(velocity), this._lifetime))),
            easing,
            duration: endPosition ? definition.velocity?.duration : undefined
        };
        this._position = position;
        if (typeof alpha === "object" && "start" in alpha) {
            this._alphaAnim = {
                start: (0, syncedParticles_1.resolveNumericSpecifier)(alpha.start),
                end: (0, syncedParticles_1.resolveNumericSpecifier)(alpha.end)
            };
        }
        if (typeof scale === "object" && "start" in scale) {
            const easing = math_1.EaseFunctions[scale.easing ?? "linear"];
            this._scaleAnim = {
                start: (0, syncedParticles_1.resolveNumericSpecifier)(scale.start),
                end: (0, syncedParticles_1.resolveNumericSpecifier)(scale.end),
                easing
            };
            this.scale = this._scaleAnim.start;
        }
        else {
            this.scale = (0, syncedParticles_1.resolveNumericSpecifier)(scale);
        }
        this.angularVelocity = (0, syncedParticles_1.resolveNumericSpecifier)(definition.angularVelocity);
        if (definition.variations !== undefined) {
            this.variant = (0, random_1.random)(0, definition.variations);
        }
        this.hitbox = definition.hitbox?.transform(this.position, this.scale);
        this.setPartialDirty();
    }
    damage() { }
    update() {
        const age = this.game.now - this._creationDate;
        if (age > this._lifetime) {
            this.game.removeSyncedParticle(this);
            return;
        }
        const interpFactor = this.age = age / this._lifetime;
        const { start, end, easing, duration } = this._positionAnim;
        const positionInterpFactor = duration ? duration / this._lifetime : interpFactor;
        this._position = vector_1.Vec.lerp(start, end, easing(math_1.Numeric.clamp(positionInterpFactor, 0, 1)));
        if (this._scaleAnim) {
            const { start, end, easing } = this._scaleAnim;
            this.scale = math_1.Numeric.lerp(start, end, easing(interpFactor));
        }
        if (this.hitbox instanceof hitbox_1.CircleHitbox && this.definition.hitbox !== undefined) {
            this.hitbox.position = this.position;
            this.hitbox.radius = this.definition.hitbox.radius * this.scale;
            this.game.grid.updateObject(this);
        }
        this.serializePartial();
    }
    get data() {
        return {
            definition: this.definition,
            startPosition: this._positionAnim.start,
            endPosition: this._positionAnim.end,
            layer: this.layer,
            age: this.age,
            lifetime: this._lifetime,
            angularVelocity: this.angularVelocity,
            scale: this._scaleAnim
                ? {
                    start: this._scaleAnim.start,
                    end: this._scaleAnim.end
                }
                : undefined,
            alpha: this._alphaAnim
                ? {
                    start: this._alphaAnim.start,
                    end: this._alphaAnim.end
                }
                : undefined,
            variant: this.variant,
            creatorID: this.creatorID
        };
    }
}
exports.SyncedParticle = SyncedParticle;
//# sourceMappingURL=syncedParticle.js.map