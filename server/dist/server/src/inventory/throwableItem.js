"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrowableItem = void 0;
const constants_1 = require("../../../common/src/constants");
const math_1 = require("../../../common/src/utils/math");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const vector_1 = require("../../../common/src/utils/vector");
const inventoryItem_1 = require("./inventoryItem");
const pickupPacket_1 = require("../../../common/src/packets/pickupPacket");
class ThrowableItem extends inventoryItem_1.CountableInventoryItem.derive(objectDefinitions_1.DefinitionType.Throwable) {
    count;
    _cookStart;
    _throwTimer;
    _cooking = false;
    constructor(definition, owner, data, count = 1) {
        super(definition, owner);
        this.count = count;
        if (this.category !== objectDefinitions_1.DefinitionType.Throwable) {
            throw new TypeError(`Attempted to create a Throwable object based on a definition for a non-gun object (Received a ${this.category} definition)`);
        }
        if (data) {
            this.stats.kills = data.kills;
            this.stats.damage = data.damage;
        }
    }
    _useItemNoDelayCheck(skipAttackCheck) {
        const owner = this.owner;
        if ((!skipAttackCheck && !owner.attacking)
            || owner.dead
            || owner.downed
            || owner.disconnected
            || this !== owner.activeItem
            || this.count <= 0) {
            return;
        }
        if (owner.game.pluginManager.emit("inv_item_use", this) !== undefined) {
            return;
        }
        if (this.definition.summonAirdrop && owner.isInsideBuilding) {
            owner.sendPacket(pickupPacket_1.PickupPacket.create({ message: constants_1.InventoryMessages.CannotUseFlare }));
            return;
        }
        this.lastUse = owner.game.now;
        owner.animation = 3 /* AnimationType.ThrowableCook */;
        owner.setPartialDirty();
        owner.action?.cancel();
        this._cook();
    }
    stopUse() {
        this._throw();
    }
    itemData() {
        return {
            kills: this.stats.kills,
            damage: this.stats.damage
        };
    }
    useItem() {
        super._bufferAttack(this.definition.fireDelay, this._useItemNoDelayCheck.bind(this, true));
    }
    get cooking() {
        return this._cooking;
    }
    _cook() {
        if (this._cooking)
            return;
        this._cooking = true;
        const owner = this.owner;
        const game = owner.game;
        const recoil = owner.recoil;
        recoil.active = true;
        recoil.multiplier = this.definition.cookSpeedMultiplier;
        recoil.time = Infinity;
        if (this.definition.cookable) {
            this._throwTimer = game.addTimeout(() => {
                recoil.active = false;
                this._throw(true);
            }, this.definition.fuseTime);
        }
        this._cookStart = game.now;
    }
    _throw(soft = false) {
        if (!this._cooking)
            return;
        this._cooking = false;
        this._throwTimer?.kill();
        this._throwTimer = undefined;
        const definition = this.definition;
        const owner = this.owner;
        const game = owner.game;
        owner.dirty.weapons = true;
        if (!owner.dead) {
            owner.inventory.removeThrowable(this.definition, false, 1);
        }
        owner.animation = 4 /* AnimationType.ThrowableThrow */;
        owner.setPartialDirty();
        owner.recoil.active = false;
        const speed = soft
            ? 0
            : math_1.Numeric.min(definition.physics.maxThrowDistance * owner.mapPerkOrDefault("demo_expert" /* PerkIds.DemoExpert */, ({ rangeMod }) => rangeMod, 1), owner.distanceToMouse) * constants_1.GameConstants.projectiles.distanceToMouseMultiplier;
        const time = this.definition.cookable ? (game.now - (this._cookStart ?? 0)) : 0;
        const projectile = game.addProjectile({
            definition,
            position: vector_1.Vec.add(owner.position, vector_1.Vec.rotate(definition.animation.cook.rightFist, owner.rotation)),
            layer: owner.layer,
            owner: owner,
            source: this,
            velocity: vector_1.Vec.add(vector_1.Vec.fromPolar(owner.rotation, speed), owner.movementVector),
            height: this.definition.physics.initialHeight,
            fuseTime: this.definition.fuseTime - time,
            halloweenSkin: this.owner.hasPerk("plumpkin_bomb" /* PerkIds.PlumpkinBomb */)
        });
        if (definition.c4) {
            owner.c4s.add(projectile);
            owner.dirty.activeC4s = true;
        }
    }
}
exports.ThrowableItem = ThrowableItem;
//# sourceMappingURL=throwableItem.js.map