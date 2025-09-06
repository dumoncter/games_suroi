"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCollection = exports.Inventory = exports.InventoryItemCtorMapping = void 0;
const constants_1 = require("../../../common/src/constants");
const ammos_1 = require("../../../common/src/definitions/items/ammos");
const armors_1 = require("../../../common/src/definitions/items/armors");
const backpacks_1 = require("../../../common/src/definitions/items/backpacks");
const healingItems_1 = require("../../../common/src/definitions/items/healingItems");
const loots_1 = require("../../../common/src/definitions/loots");
const scopes_1 = require("../../../common/src/definitions/items/scopes");
const throwables_1 = require("../../../common/src/definitions/items/throwables");
const math_1 = require("../../../common/src/utils/math");
const misc_1 = require("../../../common/src/utils/misc");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const action_1 = require("./action");
const gunItem_1 = require("./gunItem");
const inventoryItem_1 = require("./inventoryItem");
const meleeItem_1 = require("./meleeItem");
const throwableItem_1 = require("./throwableItem");
const defaultInventory_1 = require("../../../common/src/defaultInventory");
exports.InventoryItemCtorMapping = {
    [objectDefinitions_1.DefinitionType.Gun]: gunItem_1.GunItem,
    [objectDefinitions_1.DefinitionType.Melee]: meleeItem_1.MeleeItem,
    [objectDefinitions_1.DefinitionType.Throwable]: throwableItem_1.ThrowableItem
};
/**
 * A class representing a player's inventory
 */
class Inventory {
    /**
     * The player that this inventory belongs to
     */
    owner;
    items = new ItemCollection(Object.entries(defaultInventory_1.DEFAULT_INVENTORY));
    helmet;
    vest;
    backpack = loots_1.Loots.fromString("bag");
    _scope;
    get scope() { return this._scope; }
    set scope(scope) {
        this._scope = loots_1.Loots.reify(scope);
        this.owner.dirty.items = true;
    }
    /**
     * Each {@link ThrowableItem} instance represents a *type* of throwable, and they need to be
     * cycled through. It'd be wasteful to re-instantiate them every time the user swaps
     * throwables, so we cache them here
     */
    throwableItemMap = new misc_1.ExtendedMap();
    /**
     * An internal array storing weapons
     */
    weapons = Array.from({ length: constants_1.GameConstants.player.maxWeapons }, () => undefined);
    slotsByDefType = Object.freeze(constants_1.GameConstants.player.inventorySlotTypings.reduce((acc, cur, i) => {
        (acc[cur] ??= []).push(i);
        return acc;
    }, {}));
    _lockedSlots = 0;
    get lockedSlots() { return this._lockedSlots; }
    _maskCache = Array.from({ length: constants_1.GameConstants.player.maxWeapons }, (_, i) => 1 << i);
    isLocked(slot) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to query lock state of invalid slot '${slot}'`);
        return !!(this._lockedSlots & this._maskCache[slot]);
    }
    /**
     * @returns Whether the lock state was changed
     */
    lock(slot) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to lock invalid slot '${slot}'`);
        const mask = this._maskCache[slot];
        const oldState = !!(this._lockedSlots & mask);
        this._lockedSlots |= mask;
        this.owner.dirty.slotLocks ||= !oldState;
        return oldState;
    }
    /**
     * @returns Whether the lock state was changed
     */
    unlock(slot) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to unlock invalid slot '${slot}'`);
        const mask = this._maskCache[slot];
        const oldState = !!(this._lockedSlots & mask);
        this._lockedSlots &= ~mask;
        this.owner.dirty.slotLocks ||= oldState;
        return oldState;
    }
    lockAllSlots() {
        this._lockedSlots = ~0;
        this.owner.dirty.slotLocks = true;
    }
    unlockAllSlots() {
        this._lockedSlots = 0;
        this.owner.dirty.slotLocks = true;
    }
    /**
     * Private variable storing the index pointing to the last active weapon
     */
    _lastWeaponIndex = 0;
    /**
     * Returns the index pointing to the last active weapon
     */
    get lastWeaponIndex() { return this._lastWeaponIndex; }
    /**
     * Private variable storing the index pointing to the active weapon
     */
    _activeWeaponIndex = 2;
    /**
     * Returns the index pointing to the active weapon
     */
    get activeWeaponIndex() { return this._activeWeaponIndex; }
    /**
     * A reference to the timeout object responsible for scheduling the action
     * of reloading, kept here in case said action needs to be cancelled
     */
    _reloadTimeout;
    /**
     * Sets the index pointing to the active item, if it is valid. Passing an invalid index throws a `RangeError`
     * If the assignment is successful, `Player#dirty.activeWeaponIndex` is automatically set to `true` if the active item index changes
     * @param slot The new slot
     * @returns Whether the swap was done successfully
     */
    setActiveWeaponIndex(slot) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to set active index to invalid slot '${slot}'`);
        if (!this.hasWeapon(slot) || slot === this._activeWeaponIndex)
            return false;
        const old = this._activeWeaponIndex;
        this._activeWeaponIndex = slot;
        this._lastWeaponIndex = old;
        const oldItem = this.weapons[old];
        if (oldItem) {
            oldItem.isActive = false;
            oldItem.stopUse();
        }
        // nna is fine cuz of the hasWeapon call above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = this.weapons[slot];
        const owner = this.owner;
        this._reloadTimeout?.kill();
        if (this.activeWeapon.isGun) {
            this.activeWeapon.cancelAllTimers();
        }
        owner.bufferedAttack?.kill();
        item.isActive = true;
        const now = owner.game.now;
        let effectiveSwitchDelay;
        if (item.definition.defType !== objectDefinitions_1.DefinitionType.Gun || (now - owner.lastFreeSwitch >= 1000
            && !item.definition.noQuickswitch)) {
            effectiveSwitchDelay = 250;
            owner.lastFreeSwitch = now;
        }
        else {
            effectiveSwitchDelay = item.definition.switchDelay;
        }
        owner.effectiveSwitchDelay = effectiveSwitchDelay;
        item.switchDate = now;
        if (item.isGun && item.ammo <= 0) {
            this._reloadTimeout = this.owner.game.addTimeout(item.reload.bind(item), owner.effectiveSwitchDelay);
        }
        owner.attacking = false;
        owner.recoil.active = false;
        owner.dirty.weapons = true;
        this.owner.setDirty();
        owner.updateAndApplyModifiers();
        owner.updateBackEquippedMelee();
        return true;
    }
    /**
     * Returns this inventory's active weapon
     * It will never be undefined since the only place that sets the active weapon has an undefined check
     */
    get activeWeapon() {
        // we hope that it's never undefined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.weapons[this._activeWeaponIndex];
    }
    /**
     * @return The number of weapons in this inventory
     */
    get weaponCount() { return this.weapons.reduce((acc, item) => acc + +(item !== undefined), 0); }
    /**
     * Creates a new inventory.
     * @param owner The player this inventory belongs to
     */
    constructor(owner) {
        this.owner = owner;
        for (const item of [...healingItems_1.HealingItems, ...ammos_1.Ammos, ...scopes_1.Scopes]) {
            let amount = 0;
            if (item.defType === objectDefinitions_1.DefinitionType.Ammo && item.ephemeral) {
                amount = Infinity;
            }
            if (item.defType === objectDefinitions_1.DefinitionType.Scope && item.giveByDefault) {
                amount = 1;
                this.scope ??= item.idString;
            }
            this.items.setItem(item.idString, amount);
        }
        this.scope ??= scopes_1.Scopes.definitions[0].idString;
    }
    /**
     * Determines whether a given index is valid. For an index to be valid, it must be an
     * integer between 0 and `GameConstants.player.maxWeapons - 1` (inclusive)
     * @param slot The number to test
     * @returns Whether the number is a valid slot
     */
    static isValidWeaponSlot(slot) {
        return slot % 1 === 0 && 0 <= slot && slot <= constants_1.GameConstants.player.maxWeapons - 1;
    }
    /**
     * Internal method used to convert a string to the `InventoryItem` whose `idString` matches it
     * @param item The item to convert
     * @returns The corresponding `InventoryItem` subclass
     */
    _reifyItem(item, data) {
        if (item instanceof inventoryItem_1.InventoryItemBase)
            return item;
        const definition = loots_1.Loots.reify(item);
        return new exports.InventoryItemCtorMapping[definition.defType](definition, this.owner, data);
    }
    /**
     * Tests whether a weapon exists in a certain slot
     * @param slot The slot to test
     * @returns Whether or not there exists an item in the given slot
     * @throws {RangeError} If `slot` isn't a valid slot number
     */
    hasWeapon(slot) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to test for item in invalid slot '${slot}'`);
        return this.weapons[slot] !== undefined;
    }
    /**
     * Swaps the items in the gun slots
     */
    swapGunSlots() {
        [this.weapons[0], this.weapons[1]] = [this.weapons[1], this.weapons[0]];
        if (this.isLocked(0) !== this.isLocked(1)) {
            const current = this._lockedSlots;
            this._lockedSlots = (current & ~0b11) | ((current & 0b10) >> 1) | ((current & 0b01) << 1);
            this.owner.dirty.slotLocks = true;
        }
        if (this._activeWeaponIndex < 2)
            this.setActiveWeaponIndex(1 - this._activeWeaponIndex);
        this.owner.dirty.weapons = true;
    }
    /**
     * Replaces an item in an inventory slot with a new one. The old item and its ammo are
     * completely discarded. Honors slot locks
     * @param slot The slot to put the new item in
     * @param item The item to place there
     * @param force Whether to ignore slot locks
     * @returns `null` if the replacement was not done at all; otherwise, the potentially-`undefined` item that used to be in that slot
     */
    replaceWeapon(slot, item, force = false) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to set item in invalid slot '${slot}'`);
        if (this.isLocked(slot) && !force)
            return null;
        if (slot === this.activeWeaponIndex)
            this.owner.setDirty();
        return this._setWeapon(slot, this._reifyItem(item));
    }
    /**
     * Puts a weapon in a certain slot, replacing the old weapon if one was there. If an item is replaced, it is dropped into the game world
     * @param slot The slot in which to insert the item
     * @param item The item to add
     * @returns `null` if the operation was not done at all; otherwise, the potentially-`undefined` item that used to be in that slot
     * @throws {RangeError} If `slot` isn't a valid slot number
     */
    addOrReplaceWeapon(slot, item, data) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to set item in invalid slot '${slot}'`);
        if (slot === this.activeWeaponIndex)
            this.owner.setDirty();
        if (this.isLocked(slot))
            return null;
        /**
         * `dropWeapon` changes the active item index to something potentially undesirable,
         * so this variable keeps track of what to switch it back to
         */
        let index;
        const slotObj = this.weapons[slot];
        if (
        // If the active weapon is being replaced, then we want to swap to the new item when done
        (slot === this._activeWeaponIndex && slotObj?.definition.noDrop !== true)
            // Only melee in inventory, swap to new item's slot
            || this.weaponCount === 1) {
            index = slot;
        }
        // Drop old item into the game world and set the new item
        const old = this.dropWeapon(slot);
        this._setWeapon(slot, this._reifyItem(item, data));
        if (index !== undefined) {
            this.setActiveWeaponIndex(index);
        }
        return old;
    }
    /**
     * Attempts to add a weapon into the first free slot in this inventory which matches this item type.
     * This method does not throw if it cannot add the item.
     * @param item The item to add
     * @returns The slot in which the item was added, or `-1` if it could not be added
     */
    appendWeapon(item, data) {
        item = this._reifyItem(item, data);
        const maxWeapons = constants_1.GameConstants.player.maxWeapons;
        const defType = item.definition.defType;
        for (let slot = 0; slot < maxWeapons; slot++) {
            if (this.weapons[slot] === undefined
                && constants_1.GameConstants.player.inventorySlotTypings[slot] === defType) {
                this._setWeapon(slot, item); // no "destroy" call because this slot is guaranteed to be empty
                return slot;
            }
        }
        return -1;
    }
    _dropItem(toDrop, { count, data } = {}) {
        this.owner.game
            .addLoot(toDrop, this.owner.position, this.owner.layer, { jitterSpawn: false, pushVel: 0, count, data })
            ?.push(this.owner.rotation + Math.PI, 0.025);
    }
    removeThrowable(type, drop = true, removalCount) {
        const definition = loots_1.Loots.reify(type);
        if (!this.items.hasItem(definition.idString))
            return;
        const itemAmount = this.items.getItem(definition.idString);
        const removalAmount = math_1.Numeric.min(itemAmount, removalCount ?? Math.ceil(itemAmount / 2));
        if (drop) {
            this._dropItem(definition, { count: removalAmount });
        }
        this.items.decrementItem(definition.idString, removalAmount);
        if (itemAmount === removalAmount) {
            // Everything's been dropped, we need to a) discard the ThrowableItem instance b) equip a new one, if any
            this.throwableItemMap.delete(definition.idString);
            // now we gotta find a new throwable to equip
            let found = false;
            for (const def of throwables_1.Throwables) {
                if (this.items.getItem(def.idString) > 0) {
                    found = true;
                    this.useItem(def);
                    break;
                }
            }
            if (!found) {
                // welp, time to swap to another slot
                // if we get here, there's hopefully a throwable slot
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const slot = this.slotsByDefType[objectDefinitions_1.DefinitionType.Throwable][0];
                this.unlock(slot);
                this.weapons[slot] = undefined;
                this.setActiveWeaponIndex(this._findNextPopulatedSlot());
            }
        }
        else {
            // only fails if `throwableItemMap` falls out-of-sync… which hopefully shouldn't happen lol
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.throwableItemMap.get(definition.idString).count -= removalAmount;
        }
    }
    /**
     * Drops a weapon from this inventory
     * @param slot The slot to drop
     * @param [force=false] Whether to ignore slot locks
     * @returns The item that was dropped, if any
     */
    dropWeapon(slot, force = false) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to drop item from invalid slot '${slot}'`);
        if (!force && this.isLocked(slot))
            return;
        const item = this.weapons[slot];
        if (item && !force && item.category === objectDefinitions_1.DefinitionType.Throwable && item.cooking)
            return;
        if (item === undefined || item.definition.noDrop)
            return;
        const definition = item.definition;
        if (constants_1.GameConstants.player.inventorySlotTypings[slot] === objectDefinitions_1.DefinitionType.Throwable) {
            this.removeThrowable(definition, true);
        }
        else {
            if (item.isGun && definition.isDual) {
                this._dropItem(definition.singleVariant);
                this._dropItem(definition.singleVariant);
            }
            else {
                this._dropItem(definition, { data: item.itemData() });
            }
            this._setWeapon(slot, undefined);
            if (item.isGun && item.ammo > 0) {
                // Put the ammo in the gun back in the inventory
                this.giveItem(definition.ammoType, item.ammo);
                item.ammo = 0;
            }
        }
        this.owner.setDirty();
        this.owner.dirty.items = true;
        this.owner.dirty.weapons = true;
        return item;
    }
    /**
     * Removes and destroys the weapon in a given slot, ignoring slot locks
     * @param slot The slot
     */
    destroyWeapon(slot) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to destroy item in invalid slot '${slot}'`);
        this._setWeapon(slot, undefined)?.destroy();
        this.owner.setDirty();
        this.owner.dirty.items = true;
        this.owner.dirty.weapons = true;
    }
    giveItem(item, amount = 1) {
        const itemString = typeof item === "string" ? item : item.idString;
        this.items.incrementItem(itemString, amount);
        /*
            If the new amount is more than the inventory can hold, drop the extra
            unless the owner is dead; in that case, we ignore the limit

            When players die, they drop equipable items (firearms and melees) before
            dropping stackable items (ammos, consumable). Therefore, if a player has a gun
            and their ammo reserve for that gun's ammo is full, the gun and its stored ammo will
            be dropped, and the the reserve will be dropped, which potentially creates more
            blocks of ammo than required.

            For example, consider a 5-round shotgun with a 15-round reserve. Combined, this is 20
            rounds, well below the limit of 60 per block. However, because the gun is dropped with its
            5 ammo, and then the 15 ammo in reserve is dropped afterwards, we get two blocks instead of
            one.

            To solve this, we just ignore capacity limits when the player is dead.
        */
        const overAmount = loots_1.Loots.reify(itemString).ephemeral || this.owner.dead
            ? 0
            : this.items.getItem(itemString) - (this.backpack.maxCapacity[itemString] ?? 0);
        if (overAmount > 0) {
            this.items.decrementItem(itemString, overAmount);
            this._dropItem(item, { count: overAmount });
        }
    }
    /**
     * Attempts to drop a item with given `idString`
     * @param itemString The `idString` of the item
     */
    dropItem(itemString) {
        const definition = loots_1.Loots.reify(itemString);
        const { idString, defType } = definition;
        if ((!this.items.hasItem(idString)
            && defType !== objectDefinitions_1.DefinitionType.Armor
            && defType !== objectDefinitions_1.DefinitionType.Backpack
            && defType !== objectDefinitions_1.DefinitionType.Perk)
            || definition.noDrop)
            return;
        switch (defType) {
            case objectDefinitions_1.DefinitionType.HealingItem:
            case objectDefinitions_1.DefinitionType.Ammo: {
                const itemAmount = this.items.getItem(idString);
                const dropAmount = defType === objectDefinitions_1.DefinitionType.Ammo
                    ? math_1.Numeric.max(Math.ceil(itemAmount / 2), definition.minDropAmount)
                    : Math.ceil(itemAmount / 2);
                const removalAmount = math_1.Numeric.min(itemAmount, dropAmount);
                this._dropItem(definition, { count: removalAmount });
                this.items.decrementItem(idString, removalAmount);
                break;
            }
            case objectDefinitions_1.DefinitionType.Scope: {
                this._dropItem(definition);
                this.items.setItem(idString, 0);
                if (this.scope.idString !== idString)
                    break;
                // Switch to next highest scope
                for (let i = scopes_1.Scopes.definitions.length - 1; i >= 0; i--) {
                    const scope = scopes_1.Scopes.definitions[i];
                    if (this.items.hasItem(scope.idString)) {
                        this.scope = scope;
                        this.owner.effectiveScope = this.owner.isInsideBuilding
                            ? scopes_1.DEFAULT_SCOPE
                            : this.scope;
                        break;
                    }
                }
                break;
            }
            case objectDefinitions_1.DefinitionType.Throwable: {
                this.removeThrowable(definition, true);
                break;
            }
            case objectDefinitions_1.DefinitionType.Armor: {
                switch (definition.armorType) {
                    case armors_1.ArmorType.Helmet: {
                        if (!this.helmet)
                            return;
                        if (this.helmet.level !== definition.level)
                            return;
                        this.helmet = undefined;
                        break;
                    }
                    case armors_1.ArmorType.Vest: {
                        if (!this.vest)
                            return;
                        if (this.vest.level !== definition.level)
                            return;
                        this.vest = undefined;
                        break;
                    }
                }
                if (definition.perk !== undefined) {
                    this.owner.removePerk(definition.perk);
                }
                this._dropItem(definition);
                break;
            }
            case objectDefinitions_1.DefinitionType.Backpack: {
                if (this.backpack.level !== definition.level)
                    return;
                const bag = backpacks_1.Backpacks.fromString("bag");
                const maxCapacity = bag.maxCapacity;
                const validDefTypes = [
                    objectDefinitions_1.DefinitionType.HealingItem,
                    objectDefinitions_1.DefinitionType.Ammo,
                    objectDefinitions_1.DefinitionType.Throwable
                ];
                if (definition.perk !== undefined) {
                    this.owner.removePerk(definition.perk);
                }
                this._dropItem(definition);
                this.backpack = bag;
                for (const item in this.items.asRecord()) {
                    const def = loots_1.Loots.fromString(item);
                    if (def.noDrop
                        || ("ephemeral" in def && def.ephemeral)
                        || !validDefTypes.includes(def.defType))
                        continue;
                    const count = this.items.getItem(item);
                    if (count <= 0)
                        continue;
                    const targetAmount = math_1.Numeric.min(count, maxCapacity[item]);
                    const amountToDrop = count - targetAmount;
                    if (amountToDrop <= 0)
                        continue;
                    this.items.setItem(item, targetAmount);
                    this.owner.game.addLoot(def, this.owner.position, this.owner.layer, { count: amountToDrop });
                }
                break;
            }
            case objectDefinitions_1.DefinitionType.Perk: {
                if (!this.owner.hasPerk(definition))
                    return;
                this.owner.removePerk(definition);
                this._dropItem(definition);
                this.owner.dirty.perks = true;
                break;
            }
        }
        if (definition.mapIndicator) {
            this.owner.updateMapIndicator();
        }
        this.owner.setDirty();
        this.owner.dirty.items = true;
    }
    /**
     * Drops all weapons from this inventory
     * @param [force=false] Whether to ignore slot locks
     * @returns The weapons that used to be in the inventory
     */
    dropWeapons(force = false) {
        return this.weapons.map((_, i) => this.dropWeapon(i, force));
    }
    /**
     * Checks if the inventory has the given weapon
     * @param item The item's `idString`
     * @returns Whether the item exists on the inventory
     */
    checkIfWeaponExists(item) {
        return this.weapons.some(weapon => weapon?.definition.idString === item);
    }
    /**
     * Gets the weapon at a given index
     * @param index The weapon index
     * @returns The weapon at the given index, undefined if empty
     */
    getWeapon(index) {
        return this.weapons[index];
    }
    /**
     * Attempts to promote a weapon held in a slot to its dual variant
     * @param slot The slot whose gun is to be promoted
     * @returns `true` if the operation succeeded (in other words, if the weapon was upgraded to a dual variant successfully) and `false` otherwise.
     * @throws {RangeError} If the slot is out-of-bounds
     */
    upgradeToDual(slot) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to upgrade to dual weapon in invalid slot '${slot}'`);
        if (!this.hasWeapon(slot)
            || !this.weapons[slot]?.isGun
            || this.isLocked(slot))
            return false;
        const gun = this.weapons[slot];
        if (gun.definition.isDual || gun.definition.dualVariant === undefined)
            return false;
        const dualGun = this._reifyItem(gun.definition.dualVariant);
        this._setWeapon(slot, dualGun)?.destroy();
        dualGun.ammo = gun.ammo;
        return true;
    }
    _findNextPopulatedSlot() {
        let target = this._activeWeaponIndex;
        while (!this.hasWeapon(target)) {
            target = math_1.Numeric.absMod(target + 1, this.weapons.length);
        }
        return target;
    }
    /**
     * Forcefully sets a weapon in a given slot, ignoring slot locks. Note that this operation will never leave
     * the inventory empty: in the case of the attempted removal of this inventory's only item, the operation
     * will be cancelled, and fists will be put in the melee slot
     *
     * If the only item was fists and an item is added in slots 0 or 1, it will be swapped to
     * @param slot The slot to place the item in
     * @param item The item to place there. Omitting this parameter removes the item at the given slot
     * @returns The item that was previously located in the slot, if any
     * @throws {RangeError} If `slot` isn't a valid slot number
     */
    _setWeapon(slot, item) {
        if (!Inventory.isValidWeaponSlot(slot))
            throw new RangeError(`Attempted to set weapon in invalid slot '${slot}'`);
        const old = this.weapons[slot];
        const defType = item?.definition.defType;
        const permittedType = constants_1.GameConstants.player.inventorySlotTypings[slot];
        if (defType !== undefined && permittedType !== defType) {
            throw new Error(`Tried to put an item of type '${objectDefinitions_1.DefinitionType[defType]}' in slot ${slot} (configured to only accept items of type '${objectDefinitions_1.DefinitionType[permittedType]}')`);
        }
        this.weapons[slot] = item;
        this.owner.dirty.weapons = true;
        const removal = item === undefined;
        if (removal) {
            if (slot === 2) {
                this.weapons[slot] = new meleeItem_1.MeleeItem("fists", this.owner);
            }
            else if (slot === this._activeWeaponIndex) {
                this.setActiveWeaponIndex(this._findNextPopulatedSlot());
            }
            this.unlock(slot);
        }
        /*
            This is a bit of a weird one, but the short explanation is that
            we wanna avoid having last = current unless we have no other option
        */
        let target = this._lastWeaponIndex === this._activeWeaponIndex && !removal
            ? 0
            : this._lastWeaponIndex;
        while (!this.hasWeapon(target)) {
            target = math_1.Numeric.absMod(target - 1, this.weapons.length);
        }
        this._lastWeaponIndex = target;
        item?.refreshModifiers();
        this.owner.updateAndApplyModifiers();
        this.owner.updateBackEquippedMelee();
        return old;
    }
    /**
     * Attempts to use a consumable item or a scope with the given `idString`
     * @param itemString The `idString` of the consumable or scope to use
     */
    useItem(itemString) {
        const definition = loots_1.Loots.reify(itemString);
        const idString = definition.idString;
        if (!this.items.hasItem(idString))
            return;
        switch (definition.defType) {
            case objectDefinitions_1.DefinitionType.HealingItem: {
                if (
                // Already consuming something else
                this.owner.action instanceof action_1.HealingAction
                    || (definition.healType === healingItems_1.HealType.Health
                        && this.owner.health >= this.owner.maxHealth) || (definition.healType === healingItems_1.HealType.Adrenaline
                    && this.owner.adrenaline >= this.owner.maxAdrenaline) || (definition.healType === healingItems_1.HealType.Special
                    && definition.effect?.removePerk !== undefined
                    && !this.owner.hasPerk(definition.effect?.removePerk)))
                    return;
                // Can't have downed players using consumables
                if (this.owner.downed)
                    return;
                this.owner.isConsumingItem = true;
                this.owner.executeAction(new action_1.HealingAction(this.owner, idString));
                break;
            }
            case objectDefinitions_1.DefinitionType.Scope: {
                this.scope = idString;
                break;
            }
            case objectDefinitions_1.DefinitionType.Throwable: {
                if (this.activeWeapon.category === objectDefinitions_1.DefinitionType.Throwable) {
                    this.activeWeapon.stopUse();
                }
                this.owner.setDirty();
                this.owner.dirty.weapons = true;
                const slot = this.slotsByDefType[objectDefinitions_1.DefinitionType.Throwable]?.[0];
                // Let's hope there's only one throwable slot…
                if (slot !== undefined) {
                    const old = this.weapons[slot];
                    if (old) {
                        old.isActive = false;
                        old.stopUse();
                    }
                    const item = this.throwableItemMap.getAndGetDefaultIfAbsent(idString, () => new throwableItem_1.ThrowableItem(definition, this.owner, undefined, this.items.getItem(idString)));
                    item.isActive = true;
                    this.weapons[slot] = item;
                }
            }
        }
    }
}
exports.Inventory = Inventory;
class ItemCollection {
    _internal;
    // private readonly _listenerSet = new Set<(key: ReferenceTo<ItemDef>, oldValue: number, newValue: number) => void>();
    constructor(entries) {
        this._internal = new Map(entries);
    }
    _recordCache;
    asRecord() {
        return this._recordCache ??= Array.from(this._internal.entries())
            .reduce((acc, [item, count]) => {
            acc[item] = count;
            return acc;
        }, {});
    }
    /**
     * Note: It's up to the caller to verify that the item exists via {@link hasItem()}
     * before calling this method
     */
    getItem(key) {
        // please be responsible enough to call `hasItem` beforehand…
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._internal.get(key);
    }
    hasItem(key) {
        return (this._internal.get(key) ?? -1) > 0;
    }
    /**
     * It is up to the caller to perform any bounds checks with regards to maximum/minimum capacity,
     * and to perform any sanitization for abnormal values (decimals, `NaN`s, etc).
     * This method is but a setter.
     * @param key The item to modify
     * @param amount The specific count to set this item to
     */
    setItem(key, amount) {
        const old = this.getItem(key);
        this._internal.set(key, amount);
        // warn for decimal amounts?
        if (amount !== old) {
            this._recordCache = undefined;
            // this._listenerSet.forEach(fn => fn(key, old, amount));
        }
    }
    /**
     * It is up to the caller to perform any bounds checks with regards to maximum/minimum capacity,
     * and to perform any sanitization for abnormal values (decimals, `NaN`s, etc).
     * This method is but a setter.
     * @param key The item to modify
     * @param amount By how much to increment the count. Defaults to 1
     */
    incrementItem(key, amount = 1) {
        this.setItem(key, this.getItem(key) + amount);
    }
    /**
     * It is up to the caller to perform any bounds checks with regards to maximum/minimum capacity,
     * and to perform any sanitization for abnormal values (decimals, `NaN`s, etc).
     * This method is but a setter.
     * @param key The item to modify
     * @param amount By how much to decrement the count. Defaults to 1
     */
    decrementItem(key, amount = 1) {
        this.setItem(key, math_1.Numeric.max(this.getItem(key) - amount, 0));
    }
}
exports.ItemCollection = ItemCollection;
//# sourceMappingURL=inventory.js.map