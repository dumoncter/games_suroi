"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeleeItem = void 0;
const hitbox_1 = require("../../../../common/src/utils/hitbox");
const layer_1 = require("../../../../common/src/utils/layer");
const math_1 = require("../../../../common/src/utils/math");
const objectDefinitions_1 = require("../../../../common/src/utils/objectDefinitions");
const vector_1 = require("../../../../common/src/utils/vector");
const inventoryItem_1 = require("./inventoryItem");
/**
 * A class representing a melee weapon
 */
class MeleeItem extends inventoryItem_1.InventoryItemBase.derive(objectDefinitions_1.DefinitionType.Melee) {
    _autoUseTimeoutID;
    /**
     * Constructs a new melee weapon
     * @param idString The `idString` of a `MeleeDefinition` in the item schema that this object is to base itself off of
     * @param owner The `Player` that owns this melee weapon
     * @throws {TypeError} If the `idString` given does not point to a definition for a melee weapon
     */
    constructor(idString, owner, data) {
        super(idString, owner);
        if (this.category !== objectDefinitions_1.DefinitionType.Melee) {
            throw new TypeError(`Attempted to create a Melee object based on a definition for a non-melee object (Received a ${this.category} definition)`);
        }
        if (data) {
            this.stats.kills = data.kills;
            this.stats.damage = data.damage;
        }
    }
    /**
     * As the name implies, this version does not check whether the firing delay
     * has been respected. Used in conjunction with other time-keeping mechanisms,
     * namely setTimeout
     */
    _useItemNoDelayCheck(skipAttackCheck) {
        const owner = this.owner;
        const satisfiesPreflights = () => owner.activeItem === this
            && (owner.attacking || skipAttackCheck)
            && !owner.dead
            && !owner.downed
            && !owner.disconnected;
        if (!satisfiesPreflights()
            || this.owner.game.pluginManager.emit("inv_item_use", this) !== undefined) {
            return;
        }
        clearTimeout(this._autoUseTimeoutID);
        const definition = this.definition;
        this.lastUse = owner.game.now;
        owner.animation = 1 /* AnimationType.Melee */;
        owner.setPartialDirty();
        owner.action?.cancel();
        const hitDelay = definition.hitDelay ?? 50;
        this.owner.game.addTimeout(() => {
            if (!satisfiesPreflights())
                return;
            const position = vector_1.Vec.add(owner.position, vector_1.Vec.scale(vector_1.Vec.rotate(definition.offset, owner.rotation), owner.sizeMod));
            const hitbox = new hitbox_1.CircleHitbox(definition.radius * owner.sizeMod, position);
            const targets = [];
            for (const object of owner.game.grid.intersectsHitbox(hitbox)) {
                if ((object.dead && !(object.isBuilding && object.definition.hasDamagedCeiling))
                    || object === owner
                    || !(object.isPlayer || object.isObstacle || object.isBuilding || object.isProjectile)
                    || !object.damageable
                    || (object.isObstacle && (object.definition.isStair || object.definition.noMeleeCollision))
                    || !(0, layer_1.adjacentOrEquivLayer)(object, owner.layer)
                    || !object.hitbox?.collidesWith(hitbox))
                    continue;
                targets.push(object);
            }
            targets.sort((a, b) => {
                if (owner.game.isTeamMode && a.isPlayer && a.teamID === owner.teamID)
                    return Infinity;
                if (owner.game.isTeamMode && b.isPlayer && b.teamID === owner.teamID)
                    return -Infinity;
                return (a.hitbox?.distanceTo(owner.hitbox).distance ?? 0) - (b.hitbox?.distanceTo(owner.hitbox).distance ?? 0);
            });
            const numTargets = math_1.Numeric.min(targets.length, definition.maxTargets ?? 1);
            for (let i = 0; i < numTargets; i++) {
                const target = targets[i];
                let multiplier = 1;
                multiplier *= this.owner.mapPerkOrDefault("berserker" /* PerkIds.Berserker */, ({ damageMod }) => damageMod, 1);
                multiplier *= this.owner.mapPerkOrDefault("lycanthropy" /* PerkIds.Lycanthropy */, ({ damageMod }) => damageMod, 1);
                multiplier *= this.owner.mapPerkOrDefault("infected" /* PerkIds.Infected */, ({ damageMod }) => damageMod, 1);
                if (target.isObstacle) {
                    multiplier *= definition.piercingMultiplier !== undefined && target.definition.impenetrable
                        ? definition.piercingMultiplier
                        : definition.obstacleMultiplier;
                    if (target.definition.material === "ice") {
                        multiplier *= definition.iceMultiplier ?? 0.01;
                    }
                }
                if (target.isProjectile) {
                    multiplier *= definition.obstacleMultiplier;
                }
                target.damage({
                    amount: definition.damage * multiplier,
                    source: owner,
                    weaponUsed: this
                });
                if (target.isObstacle && !target.dead) {
                    target.interact(this.owner);
                }
            }
            if (definition.fireMode === 2 /* FireMode.Auto */ || owner.isMobile) {
                clearTimeout(this._autoUseTimeoutID);
                this._autoUseTimeoutID = setTimeout(() => this._useItemNoDelayCheck(false), (targets.length && definition.attackCooldown
                    ? definition.attackCooldown
                    : definition.cooldown) - hitDelay);
            }
        }, hitDelay);
    }
    stopUse() {
        // if (this.owner.game.pluginManager.emit("inv_item_stop_use", this) !== undefined) return;
        // there's no logic in this method, so just emit the event and exit. if there ever comes
        // the need to put logic here, uncomment the line above and remove the current one
        this.owner.game.pluginManager.emit("inv_item_stop_use", this);
    }
    itemData() {
        return {
            kills: this.stats.kills,
            damage: this.stats.damage
        };
    }
    useItem() {
        super._bufferAttack(this.definition.cooldown, () => this._useItemNoDelayCheck(true));
    }
}
exports.MeleeItem = MeleeItem;
//# sourceMappingURL=meleeItem.js.map