"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealingAction = exports.ReloadAction = exports.ReviveAction = exports.Action = void 0;
const constants_1 = require("../../../../common/src/constants");
const healingItems_1 = require("../../../../common/src/definitions/items/healingItems");
const loots_1 = require("../../../../common/src/definitions/loots");
const math_1 = require("../../../../common/src/utils/math");
const random_1 = require("../../../../common/src/utils/random");
class Action {
    player;
    _timeout;
    speedMultiplier = 1;
    constructor(player, time) {
        this.player = player;
        this._timeout = player.game.addTimeout(this.execute.bind(this), time * 1000);
        this.player.setPartialDirty();
    }
    cancel() {
        this._timeout.kill();
        this.player.action = undefined;
        this.player.setPartialDirty();
    }
    execute() {
        if (this.player.downed)
            return;
        this.player.action = undefined;
        this.player.setPartialDirty();
    }
}
exports.Action = Action;
class ReviveAction extends Action {
    target;
    _type = 3 /* PlayerActions.Revive */;
    get type() { return this._type; }
    speedMultiplier = 0.5;
    constructor(reviver, target) {
        super(reviver, constants_1.GameConstants.player.reviveTime / reviver.mapPerkOrDefault("field_medic" /* PerkIds.FieldMedic */, ({ usageMod }) => usageMod, 1));
        this.target = target;
    }
    execute() {
        super.execute();
        this.target.revive();
        this.player.animation = 0 /* AnimationType.None */;
        this.player.setDirty();
    }
    cancel() {
        super.cancel();
        this.target.beingRevivedBy = undefined;
        this.target.setDirty();
        this.player.animation = 0 /* AnimationType.None */;
        this.player.setDirty();
    }
}
exports.ReviveAction = ReviveAction;
class ReloadAction extends Action {
    item;
    _type = 1 /* PlayerActions.Reload */;
    get type() { return this._type; }
    fullReload;
    constructor(player, item) {
        const fullReload = item.definition.reloadFullOnEmpty && item.ammo <= 0;
        super(player, (fullReload ? item.definition.fullReloadTime : item.definition.reloadTime) / (player.mapPerkOrDefault("combat_expert" /* PerkIds.CombatExpert */, ({ reloadMod }) => reloadMod, 1)));
        this.item = item;
        this.fullReload = !!fullReload;
    }
    execute() {
        super.execute();
        const items = this.player.inventory.items;
        const definition = this.item.definition;
        const capacity = this.player.hasPerk("extended_mags" /* PerkIds.ExtendedMags */)
            ? definition.extendedCapacity ?? definition.capacity
            : definition.capacity;
        const hasInfiniteAmmo = this.player.hasPerk("infinite_ammo" /* PerkIds.InfiniteAmmo */);
        const desiredLoad = math_1.Numeric.min(definition.shotsPerReload !== undefined && !this.fullReload
            ? (definition.isDual ? 2 : 1) * definition.shotsPerReload
            : capacity, capacity - this.item.ammo);
        const toLoad = hasInfiniteAmmo
            ? desiredLoad
            : math_1.Numeric.min(items.getItem(definition.ammoType), desiredLoad);
        this.item.ammo += toLoad;
        if (!hasInfiniteAmmo) {
            items.decrementItem(definition.ammoType, toLoad);
        }
        if (this.item.ammo < capacity) { // chain reloads if not full
            this.item.reload();
        }
        this.player.attacking = false;
        this.player.dirty.weapons = true;
        this.player.dirty.items = true;
    }
}
exports.ReloadAction = ReloadAction;
class HealingAction extends Action {
    _type = 2 /* PlayerActions.UseItem */;
    get type() { return this._type; }
    item;
    speedMultiplier = 0.5;
    constructor(player, item) {
        const itemDef = loots_1.Loots.reify(item);
        super(player, itemDef.useTime / player.mapPerkOrDefault("field_medic" /* PerkIds.FieldMedic */, ({ usageMod }) => usageMod, 1));
        this.item = itemDef;
    }
    execute() {
        super.execute();
        this.player.inventory.items.decrementItem(this.item.idString);
        switch (this.item.healType) {
            case healingItems_1.HealType.Health:
                this.player.health += this.item.restoreAmount;
                break;
            case healingItems_1.HealType.Adrenaline:
                this.player.adrenaline += this.item.restoreAmount;
                break;
            case healingItems_1.HealType.Special:
                if (this.item.effect?.restoreAmounts !== undefined) {
                    this.item.effect.restoreAmounts.forEach(heals => {
                        switch (heals.healType) {
                            case healingItems_1.HealType.Health:
                                this.player.health += heals.restoreAmount;
                                break;
                            case healingItems_1.HealType.Adrenaline:
                                this.player.adrenaline += heals.restoreAmount;
                                break;
                        }
                    });
                }
                if (this.item.effect?.removePerk !== undefined) {
                    this.player.removePerk(this.item.effect.removePerk);
                }
                break;
        }
        this.player.game.addDecal(`${this.item.idString}_residue`, this.player.position, (0, random_1.randomRotation)(), this.player.layer);
        this.player.dirty.items = true;
        this.player.isConsumingItem = false;
    }
}
exports.HealingAction = HealingAction;
//# sourceMappingURL=action.js.map