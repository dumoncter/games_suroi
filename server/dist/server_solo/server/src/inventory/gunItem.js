"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GunItem = void 0;
const perks_1 = require("../../../../common/src/definitions/items/perks");
const hitbox_1 = require("../../../../common/src/utils/hitbox");
const layer_1 = require("../../../../common/src/utils/layer");
const math_1 = require("../../../../common/src/utils/math");
const objectDefinitions_1 = require("../../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../../common/src/utils/random");
const vector_1 = require("../../../../common/src/utils/vector");
const misc_1 = require("../utils/misc");
const action_1 = require("./action");
const inventoryItem_1 = require("./inventoryItem");
/**
 * A class representing a firearm
 */
class GunItem extends inventoryItem_1.InventoryItemBase.derive(objectDefinitions_1.DefinitionType.Gun) {
    ammo = 0;
    _consecutiveShots = 0;
    _shots = 0;
    get shots() { return this._shots; }
    _reloadTimeout;
    // those need to be nodejs timeouts because some guns fire rate are too close to the tick rate
    _burstTimeout;
    _autoFireTimeout;
    _altFire = false;
    cancelAllTimers() {
        this._reloadTimeout?.kill();
        clearTimeout(this._burstTimeout);
        clearTimeout(this._autoFireTimeout);
    }
    cancelReload() { this._reloadTimeout?.kill(); }
    /**
     * Constructs a new gun
     * @param idString The `idString` of a `GunDefinition` in the item schema that this object is to base itself off of
     * @param owner The `Player` that owns this gun
     * @throws {TypeError} If the `idString` given does not point to a definition for a gun
     */
    constructor(idString, owner, data) {
        super(idString, owner);
        if (this.category !== objectDefinitions_1.DefinitionType.Gun) {
            throw new TypeError(`Attempted to create a Gun object based on a definition for a non-gun object (Received a ${this.category} definition)`);
        }
        if (data) {
            this.stats.kills = data.kills;
            this.stats.damage = data.damage;
            this._shots = data.totalShots;
        }
    }
    /**
     * As the name implies, this version does not check whether the firing delay
     * has been respected. Used in conjunction with other time-keeping mechanisms,
     * namely setTimeout
     */
    _useItemNoDelayCheck(skipAttackCheck) {
        const owner = this.owner;
        const definition = this.definition;
        if ((!skipAttackCheck && !owner.attacking)
            || owner.dead
            || owner.downed
            || owner.disconnected
            || this !== owner.activeItem) {
            this._consecutiveShots = 0;
            return;
        }
        if (this.ammo <= 0) {
            if (!owner.inventory.items.hasItem(definition.ammoType)) {
                owner.animation = 7 /* AnimationType.GunClick */;
                owner.setPartialDirty();
            }
            this._consecutiveShots = 0;
            return;
        }
        if (this.owner.game.pluginManager.emit("inv_item_use", this) !== undefined) {
            this._consecutiveShots = 0;
            return;
        }
        owner.action?.cancel();
        clearTimeout(this._burstTimeout);
        owner.animation = this._altFire ? 6 /* AnimationType.GunFireAlt */ : 5 /* AnimationType.GunFire */;
        owner.setPartialDirty();
        owner.dirty.weapons = true;
        this._consecutiveShots++;
        this._shots++;
        const { moveSpread, shotSpread, fsaReset } = definition;
        let spread = owner.game.now - this.lastUse >= (fsaReset ?? Infinity)
            ? 0
            : math_1.Angle.degreesToRadians((owner.isMoving ? moveSpread : shotSpread) / 2);
        this.lastUse = owner.game.now;
        const jitter = definition.jitterRadius ?? 0;
        // when are we gonna have a perk that takes this mechanic and chucks it in the fucking trash where it belongs
        const offset = definition.isDual
            ? (this._altFire ? -1 : 1) * definition.leftRightOffset
            : (definition.bulletOffset ?? 0);
        const ownerPos = owner.position;
        const startPosition = offset !== 0
            ? vector_1.Vec.add(ownerPos, vector_1.Vec.rotate((0, vector_1.Vec)(0, offset), owner.rotation))
            : ownerPos;
        let position = vector_1.Vec.add(ownerPos, vector_1.Vec.scale(vector_1.Vec.rotate((0, vector_1.Vec)(definition.length, offset), owner.rotation), owner.sizeMod));
        let distToPos = math_1.Geometry.distanceSquared(startPosition, position);
        for (const object of owner.game.grid.intersectsHitbox(hitbox_1.RectangleHitbox.fromLine(startPosition, position))) {
            if (object.dead
                || object.hitbox === undefined
                || !(object.isObstacle || object.isBuilding)
                || !(0, layer_1.adjacentOrEqualLayer)(owner.layer, object.layer)
                || object.definition.noCollisions
                || (object.isObstacle && object.definition.isStair))
                continue;
            const intersection = object.hitbox.intersectsLine(startPosition, position);
            if (intersection === null)
                continue;
            if (distToPos > math_1.Geometry.distanceSquared(startPosition, intersection.point)) {
                position = vector_1.Vec.sub(intersection.point, vector_1.Vec.rotate((0, vector_1.Vec)(0.2 + jitter, 0), owner.rotation));
                distToPos = math_1.Geometry.distanceSquared(startPosition, position);
            }
        }
        const rangeOverride = owner.distanceToMouse - this.definition.length;
        const projCount = definition.bulletCount ?? 1;
        const modifiers = {
            damage: 1,
            dtc: 1,
            range: 1,
            speed: 1,
            tracer: {
                opacity: 1,
                width: 1,
                length: 1
            }
        };
        let saturate = false;
        let thin = false;
        const modifyForDamageMod = (damageMod) => {
            if (damageMod < 1)
                thin = true;
            if (damageMod > 1)
                saturate = true;
        };
        // ! evil starts here
        let modifiersModified = false; // lol
        let doSplinterGrouping = false;
        for (const perk of owner.perks) {
            switch (perk.idString) {
                case "flechettes" /* PerkIds.Flechettes */: {
                    if (definition.ballistics.onHitExplosion === undefined && !definition.summonAirdrop) {
                        doSplinterGrouping = true;
                        modifiers.damage *= perk.damageMod;
                        modifyForDamageMod(perk.damageMod);
                        modifiersModified = true;
                    }
                    break;
                }
                case "sabot_rounds" /* PerkIds.SabotRounds */: {
                    modifiers.range *= perk.rangeMod;
                    modifiers.speed *= perk.speedMod;
                    modifiers.damage *= perk.damageMod;
                    modifyForDamageMod(perk.damageMod);
                    modifiers.tracer.length *= perk.tracerLengthMod;
                    spread *= perk.spreadMod;
                    modifiersModified = true;
                    break;
                }
                case "close_quarters_combat" /* PerkIds.CloseQuartersCombat */: {
                    const sqCutoff = perk.cutoff ** 2;
                    if ([
                        ...this.owner.game.grid.intersectsHitbox(new hitbox_1.CircleHitbox(perk.cutoff, ownerPos), this.owner.layer)
                    ].some(obj => obj !== owner
                        && obj.isPlayer
                        && (!owner.game.isTeamMode || obj.teamID !== owner.teamID)
                        && math_1.Geometry.distanceSquared(ownerPos, obj.position) <= sqCutoff)) {
                        modifiers.damage *= perk.damageMod;
                        modifyForDamageMod(perk.damageMod);
                    }
                    break;
                }
                case "toploaded" /* PerkIds.Toploaded */: {
                    // assumption: threshholds are sorted from least to greatest
                    const ratio = 1 - this.ammo / (owner.hasPerk("extended_mags" /* PerkIds.ExtendedMags */)
                        ? definition.extendedCapacity ?? definition.capacity
                        : definition.capacity);
                    for (const [cutoff, mod] of perk.thresholds) {
                        if (ratio <= cutoff) {
                            modifiers.damage *= mod;
                            modifyForDamageMod(mod);
                            break;
                        }
                    }
                    break;
                }
                case "infected" /* PerkIds.Infected */: {
                    modifiers.damage *= perk.damageMod;
                    modifyForDamageMod(perk.damageMod);
                    break;
                }
                case "hollow_points" /* PerkIds.HollowPoints */: {
                    if (this.definition.ammoType === "12g" && this.definition.casingParticles && !this.definition.casingParticles[0].frame?.includes("slug"))
                        break;
                    modifiers.damage *= perk.damageMod;
                    modifyForDamageMod(perk.damageMod);
                    break;
                }
            }
        }
        // ! evil ends here
        const activeStair = owner.activeStair;
        const getStartingLayer = (0, layer_1.isStairLayer)(owner.layer) && activeStair !== undefined
            ? math_1.resolveStairInteraction.bind(null, activeStair.definition, activeStair.rotation, activeStair.hitbox, activeStair.layer)
            : (_) => owner.layer;
        const spawn = (position, spread, shotFX, split = false) => {
            owner.game.addBullet(this, owner, {
                position,
                rotation: owner.rotation + math_1.HALF_PI + spread,
                layer: getStartingLayer(position),
                rangeOverride,
                modifiers: modifiersModified ? modifiers : undefined,
                saturate,
                thin,
                split,
                shotFX: shotFX,
                lastShot: this.definition.ballistics.lastShotFX && this.ammo === 1
            });
        };
        const { split, deviation } = perks_1.PerkData["flechettes" /* PerkIds.Flechettes */];
        const pcM1 = projCount - 1;
        const sM1 = split - 1;
        let pattern;
        for (let i = 0; i < projCount; i++) {
            let finalSpawnPosition;
            let rotation;
            if (definition.consistentPatterning) {
                if (jitter === 0) {
                    finalSpawnPosition = position;
                    rotation = 8 * (i / pcM1 - 0.5) ** 3;
                }
                else {
                    const patternPoint = (pattern ??= (0, misc_1.getPatterningShape)(projCount, jitter))[i];
                    finalSpawnPosition = vector_1.Vec.add(position, vector_1.Vec.rotate(patternPoint, owner.rotation));
                    rotation = (patternPoint.y / jitter) ** 3;
                }
            }
            else {
                finalSpawnPosition = jitter === 0 ? position : (0, random_1.randomPointInsideCircle)(position, jitter);
                rotation = (0, random_1.randomFloat)(-1, 1);
            }
            rotation *= spread;
            const isFirstBullet = i === 0;
            if (!doSplinterGrouping) {
                spawn(finalSpawnPosition, rotation, isFirstBullet);
                continue;
            }
            const dev = math_1.Angle.degreesToRadians(deviation);
            for (let j = 0; j < split; j++) {
                const isFirstSplinterBullet = isFirstBullet && j === 0;
                spawn(finalSpawnPosition, (8 * (j / sM1 - 0.5) ** 3) * dev + rotation, isFirstSplinterBullet, isFirstSplinterBullet);
            }
        }
        owner.recoil.active = true;
        owner.recoil.time = owner.game.now + definition.recoilDuration;
        owner.recoil.multiplier = definition.recoilMultiplier;
        if (!definition.infiniteAmmo) {
            --this.ammo;
        }
        if (this.ammo <= 0) {
            this._consecutiveShots = 0;
            this._reloadTimeout = owner.game.addTimeout(this.reload.bind(this, true), definition.fireDelay);
            return;
        }
        if (definition.fireMode === 1 /* FireMode.Burst */) {
            if (this._consecutiveShots >= definition.burstProperties.shotsPerBurst) {
                this._consecutiveShots = 0;
                this._burstTimeout = setTimeout(this._useItemNoDelayCheck.bind(this, false), definition.burstProperties.burstCooldown);
                if (definition.isDual) {
                    this._altFire = !this._altFire;
                }
                return;
            }
        }
        else if (definition.isDual) {
            this._altFire = !this._altFire;
        }
        if ((definition.fireMode !== 0 /* FireMode.Single */ || owner.isMobile)
            && owner.activeItem === this) {
            clearTimeout(this._autoFireTimeout);
            this._autoFireTimeout = setTimeout(this._useItemNoDelayCheck.bind(this, false), definition.fireDelay);
        }
    }
    itemData() {
        return {
            kills: this.stats.kills,
            damage: this.stats.damage,
            totalShots: this._shots
        };
    }
    useItem() {
        const def = this.definition;
        super._bufferAttack(def.fireMode === 1 /* FireMode.Burst */
            ? def.burstProperties.burstCooldown
            : def.fireDelay, this._useItemNoDelayCheck.bind(this, true));
    }
    stopUse() {
        // if (this.owner.game.pluginManager.emit("inv_item_stop_use", this) !== undefined) return;
        // there's no logic in this method, so just emit the event and exit. if there ever comes
        // the need to put logic here, uncomment the line above and remove the current one
        this.owner.game.pluginManager.emit("inv_item_stop_use", this);
    }
    reload(skipFireDelayCheck = false) {
        const { owner, definition } = this;
        if (definition.infiniteAmmo
            || this.ammo >= (this.owner.hasPerk("extended_mags" /* PerkIds.ExtendedMags */) ? definition.extendedCapacity ?? definition.capacity : definition.capacity)
            || (!owner.inventory.items.hasItem(definition.ammoType) && !this.owner.hasPerk("infinite_ammo" /* PerkIds.InfiniteAmmo */))
            || owner.action !== undefined
            || owner.activeItem !== this
            || (!skipFireDelayCheck && owner.game.now - this.lastUse < definition.fireDelay)
            || owner.downed)
            return;
        owner.executeAction(new action_1.ReloadAction(owner, this));
    }
    destroy() {
        /* eslint-disable @typescript-eslint/no-meaningless-void-operator */
        // shut the fuck up, i'm using it to turn smth into undefined
        this._reloadTimeout = void this._reloadTimeout?.kill();
        this._burstTimeout = void clearTimeout(this._burstTimeout);
        this._autoFireTimeout = void clearTimeout(this._autoFireTimeout);
    }
}
exports.GunItem = GunItem;
//# sourceMappingURL=gunItem.js.map