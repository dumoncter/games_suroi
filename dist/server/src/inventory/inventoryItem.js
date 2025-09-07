"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountableInventoryItem = exports.InventoryItemBase = void 0;
const constants_1 = require("../../../common/src/constants");
const loots_1 = require("../../../common/src/definitions/loots");
const math_1 = require("../../../common/src/utils/math");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
/**
 * Represents some item in the player's inventory *that can be equipped*
 * @abstract
 */
class InventoryItemBase extends (() => {
    class InventoryItemBase {
        /**
         * The player this item belongs to
         */
        owner;
        _modifiers = constants_1.GameConstants.player.defaultModifiers();
        /**
         * Returns a clone
         */
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        get modifiers() { return { ...this._modifiers }; }
        _isActive = false;
        get isActive() { return this._isActive; }
        set isActive(isActive) {
            if (this._isActive !== isActive) {
                this.owner.game.pluginManager.emit(isActive
                    ? "inv_item_equip"
                    : "inv_item_unequip", this);
            }
            this._isActive = isActive;
            this.refreshModifiers();
        }
        _stats = (() => {
            let kills = 0;
            let damage = 0;
            const T = this;
            return {
                get kills() { return kills; },
                set kills(_kills) {
                    kills = _kills;
                    T.owner.dirty.weapons = true;
                    T.refreshModifiers();
                },
                get damage() { return damage; },
                set damage(_damage) {
                    damage = _damage;
                    T.owner.dirty.weapons = true;
                    T.refreshModifiers();
                }
            };
        })();
        /**
         * Returns referentially equal to internal
         */
        // shut the up
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        get stats() { return this._stats; }
        lastUse = 0;
        switchDate = 0;
        static _subclasses = {};
        static derive(defType) {
            if (defType in InventoryItemBase._subclasses) {
                throw new Error(`Subclass for category '${objectDefinitions_1.DefinitionType[defType]}' already registered`);
            }
            // @ts-expect-error i don't know
            return InventoryItemBase._subclasses[defType] = class extends this {
                category = defType;
                definition;
                constructor(...args) {
                    // @ts-expect-error this has type This (no way)
                    super(...args);
                    this.definition = loots_1.Loots.reify(args[0]);
                    if (this.definition.defType !== defType) {
                        throw new TypeError(`Attempted to create a '${new.target.name}' object based on a definition with a mismatching item type (expected '${objectDefinitions_1.DefinitionType[defType]}', got '${objectDefinitions_1.DefinitionType[this.definition.defType]}')`);
                    }
                    // @ts-expect-error it's easier this way lol
                    this[`is${objectDefinitions_1.DefinitionType[defType]}`] = true;
                }
            };
        }
        /**
         * Creates a new `InventoryItem` given a string and a player
         * @param definition The definition of an item in the item schema
         * that will be represented by this instance
         * @param owner The `Player` this item belongs to
         */
        constructor(definition, owner) {
            if (!Object.values(InventoryItemBase._subclasses).some(cls => new.target.prototype instanceof cls)) {
                throw new Error(`Illegal subclass of BaseGameObject '${new.target.name}'; subclasses must be obtained by calling BaseGameObject.derive, or must be a subclass thereof`);
            }
            this.owner = owner;
        }
        /**
         * A method which *does nothing*, but that can be overridden by subclasses if desired. This method is called
         * whenever the player stops attacking while having this weapon equipped _or_ when the user starts attacking
         * with a weapon and switches off of it. In the latter case, this method will always be called _after_ the switch
         * has been done (so `this.owner.activeItem !== this` and `this.isActive === false`). Subclasses can use these facts
         * to differentiate the two cases.
         *
         * It is usually the case that subclasses overriding this method are interested in the cases where a player starts
         * attacking with this item and then stops attacking; for example, a throwable would show the cooking animation and start
         * the fuse in the `useItem` method and would then launch the projectile in this one. Properly managing and sharing state
         * between these two methods is thus quite important. As with the `useItem` method, subclasses' overrides are fully responsible
         * for taking care of any side-effects such as spawning objects and modifying state.
         */
        stopUse() { }
        refreshModifiers() {
            const wearerAttributes = this.definition.wearerAttributes;
            if (!wearerAttributes)
                return;
            const { active, passive, on } = wearerAttributes;
            const newModifiers = constants_1.GameConstants.player.defaultModifiers();
            const applyModifiers = (modifiers) => {
                newModifiers.maxHealth *= modifiers.maxHealth ?? 1;
                newModifiers.maxAdrenaline *= modifiers.maxAdrenaline ?? 1;
                newModifiers.baseSpeed *= modifiers.speedBoost ?? 1;
                newModifiers.size *= modifiers.sizeMod ?? 1;
                newModifiers.adrenDrain *= modifiers.adrenDrain ?? 1;
                newModifiers.minAdrenaline += modifiers.minAdrenaline ?? 0;
                newModifiers.hpRegen += modifiers.hpRegen ?? 0;
            };
            if (passive)
                applyModifiers(passive);
            if (active && this._isActive)
                applyModifiers(active);
            if (on) {
                const { damageDealt, kill } = on;
                for (const { modifiers, count } of [
                    { modifiers: damageDealt, count: this._stats.damage },
                    { modifiers: kill, count: this._stats.kills }
                ]) {
                    for (const entry of modifiers ?? []) {
                        for (let i = 0, limit = math_1.Numeric.min(count, entry.limit ?? Infinity); i < limit; i++)
                            applyModifiers(entry);
                    }
                }
            }
            const diff = {
                maxHealth: this._modifiers.maxHealth !== newModifiers.maxHealth,
                maxAdrenaline: this._modifiers.maxAdrenaline !== newModifiers.maxAdrenaline,
                minAdrenaline: this._modifiers.minAdrenaline !== newModifiers.minAdrenaline,
                size: this._modifiers.size !== newModifiers.size,
                adrenDrain: this._modifiers.adrenDrain !== newModifiers.adrenDrain,
                baseSpeed: this._modifiers.baseSpeed !== newModifiers.baseSpeed,
                hpRegen: this._modifiers.hpRegen !== newModifiers.hpRegen,
                shieldRegen: this._modifiers.shieldRegen !== newModifiers.shieldRegen,
                maxShield: this._modifiers.maxShield !== newModifiers.maxShield
            };
            if (Object.values(diff).some(v => v)) {
                const old = this.modifiers;
                this._modifiers.maxHealth = newModifiers.maxHealth;
                this._modifiers.maxAdrenaline = newModifiers.maxAdrenaline;
                this._modifiers.minAdrenaline = newModifiers.minAdrenaline;
                this._modifiers.size = newModifiers.size;
                this._modifiers.adrenDrain = newModifiers.adrenDrain;
                this._modifiers.baseSpeed = newModifiers.baseSpeed;
                this._modifiers.hpRegen = newModifiers.hpRegen;
                this._modifiers.shieldRegen = newModifiers.shieldRegen;
                this.owner.game.pluginManager.emit("inv_item_modifiers_changed", {
                    item: this,
                    oldMods: old,
                    newMods: this.modifiers,
                    diff
                });
            }
            this.owner.updateAndApplyModifiers();
        }
        _bufferAttack(cooldown, internalCallback) {
            const owner = this.owner;
            if (owner.downed)
                return;
            const now = owner.game.now;
            const timeToFire = cooldown - (now - this.lastUse);
            const timeToSwitch = owner.effectiveSwitchDelay - (now - this.switchDate);
            if (timeToFire <= 0
                && timeToSwitch <= 0) {
                internalCallback.call(this);
            }
            else {
                const bufferDuration = math_1.Numeric.max(timeToFire, timeToSwitch);
                // We only honor buffered inputs shorter than 200ms
                if (bufferDuration >= 200)
                    return;
                owner.bufferedAttack?.kill();
                owner.bufferedAttack = owner.game.addTimeout(() => {
                    if (owner.activeItem === this
                        && owner.attacking) {
                        owner.bufferedAttack?.kill();
                        this.useItem();
                    }
                }, bufferDuration);
            }
        }
        /**
         * A method that *does nothing*, but that may be overridden by subclasses to perform any cleanup
         * when this weapon instance is destroyed
         */
        destroy() { }
    }
    return InventoryItemBase;
})() {
}
exports.InventoryItemBase = InventoryItemBase;
class CountableInventoryItem extends InventoryItemBase {
}
exports.CountableInventoryItem = CountableInventoryItem;
//# sourceMappingURL=inventoryItem.js.map