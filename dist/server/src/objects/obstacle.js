"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obstacle = void 0;
const constants_1 = require("../../../common/src/constants");
const perks_1 = require("../../../common/src/definitions/items/perks");
const obstacles_1 = require("../../../common/src/definitions/obstacles");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const math_1 = require("../../../common/src/utils/math");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const vector_1 = require("../../../common/src/utils/vector");
const inventoryItem_1 = require("../inventory/inventoryItem");
const lootHelpers_1 = require("../utils/lootHelpers");
const misc_1 = require("../utils/misc");
const gameObject_1 = require("./gameObject");
class Obstacle extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.Obstacle) {
    fullAllocBytes = 10;
    partialAllocBytes = 6;
    damageable = true;
    health;
    maxHealth;
    maxScale;
    collidable;
    playMaterialDestroyedSound = true;
    waterOverlay = false;
    powered = false;
    variation;
    spawnHitbox;
    loot = [];
    lootSpawnOffset;
    definition;
    isDoor;
    door;
    activated;
    parentBuilding;
    scale = 1;
    hitbox;
    puzzlePiece;
    // TODO replace flyoverpref with actual height values
    get height() {
        if (this.door && !this.door.isOpen)
            return Infinity;
        switch (this.definition.allowFlyover) {
            case constants_1.FlyoverPref.Always:
                return 0.2;
            case constants_1.FlyoverPref.Sometimes:
                return 0.5;
        }
        return Infinity;
    }
    constructor(game, type, position, rotation = 0, layer = 0, scale = 1, variation = 0, lootSpawnOffset, parentBuilding, puzzlePiece, locked, activated, waterOverlay) {
        super(game, position);
        this.rotation = rotation;
        this.scale = this.maxScale = scale;
        this.variation = variation;
        this.layer = layer;
        this.lootSpawnOffset = lootSpawnOffset;
        this.parentBuilding = parentBuilding;
        this.activated = activated;
        const definition = this.definition = obstacles_1.Obstacles.reify(type);
        this.waterOverlay = waterOverlay ?? definition.spawnWithWaterOverlay ?? false;
        this.health = this.maxHealth = this.definition.health;
        const hitboxRotation = this.definition.rotationMode === constants_1.RotationMode.Limited ? rotation : 0;
        this.hitbox = definition.hitbox.transform(this.position, this.scale, hitboxRotation);
        this.spawnHitbox = (definition.spawnHitbox ?? definition.hitbox).transform(this.position, this.scale, hitboxRotation);
        this.collidable = !definition.noCollisions;
        if (definition.hasLoot) {
            this.loot = (0, lootHelpers_1.getLootFromTable)(this.game.modeName, definition.lootTable ?? definition.idString);
        }
        if (definition.spawnWithLoot) {
            for (const item of (0, lootHelpers_1.getLootFromTable)(this.game.modeName, definition.lootTable ?? definition.idString)) {
                this.game.addLoot(item.idString, this.position, this.layer, { count: item.count, pushVel: 0, jitterSpawn: false });
            }
        }
        // noinspection JSAssignmentUsedAsCondition
        if (this.isDoor = (definition.isDoor === true)) {
            const hitboxes = (0, math_1.calculateDoorHitboxes)(definition, this.position, this.rotation);
            this.door = {
                operationStyle: definition.operationStyle ?? "swivel",
                isOpen: false,
                locked: locked ?? definition.locked ?? false,
                closedHitbox: this.hitbox.clone(),
                openHitbox: hitboxes.openHitbox,
                openAltHitbox: hitboxes.openAltHitbox,
                offset: 0,
                powered: false
            };
            if (this.game.mode.unlockStage !== undefined && this.definition.unlockableWithStage && this.door.locked) {
                this.game.unlockableDoors.push(this);
            }
        }
        this.puzzlePiece = puzzlePiece;
        if (puzzlePiece) {
            this.parentBuilding?.puzzlePieces.push(this);
        }
    }
    damage(params) {
        const definition = this.definition;
        const { amount, source, weaponUsed, position } = params;
        if (this.health === 0 || definition.indestructible)
            return;
        const weaponIsItem = weaponUsed instanceof inventoryItem_1.InventoryItemBase;
        const weaponDef = weaponIsItem ? weaponUsed.definition : undefined;
        if ((definition.impenetrable
            && (!((weaponDef?.defType === objectDefinitions_1.DefinitionType.Melee
                && weaponDef.piercingMultiplier !== undefined)
                || source instanceof Obstacle)
                || (weaponDef?.defType === objectDefinitions_1.DefinitionType.Melee && definition.hardness !== undefined && (weaponDef.maxHardness === undefined || definition.hardness > weaponDef.maxHardness))))
            || this.game.pluginManager.emit("obstacle_will_damage", {
                obstacle: this,
                ...params
            })) {
            return;
        }
        this.health -= amount;
        this.setPartialDirty();
        const dead = this.health <= 0 || this.dead;
        if (!dead) {
            const oldScale = this.scale;
            // Calculate new scale & scale hitbox
            const destroyScale = definition.scale?.destroy ?? 1;
            this.scale = this.health / this.maxHealth * (this.maxScale - destroyScale) + destroyScale;
            this.hitbox.scale(this.scale / oldScale);
        }
        this.game.pluginManager.emit("obstacle_did_damage", {
            obstacle: this,
            ...params
        });
        if (dead) {
            this.health = 0;
            this.dead = true;
            if (definition.weaponSwap && source instanceof gameObject_1.BaseGameObject && source.isPlayer) {
                source.swapWeaponRandomly(weaponIsItem ? weaponUsed : weaponUsed?.weapon, true, definition.weaponSwap.modeRestricted, definition.weaponSwap.weighted);
                //                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^
                // FIXME this cast to Explosion is not ideal and could cause issues in future if weaponUsed isn't an explosion
            }
            if (this.game.pluginManager.emit("obstacle_will_destroy", {
                obstacle: this,
                source,
                weaponUsed,
                amount
            }))
                return;
            if (!this.definition.isWindow || this.definition.noCollisionAfterDestroyed)
                this.collidable = false;
            this.scale = definition.scale?.spawnMin ?? 1;
            if (definition.explosion !== undefined && source instanceof gameObject_1.BaseGameObject) {
                //                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // FIXME This is implying that obstacles won't explode if destroyed by non–game objects
                this.game.addExplosion(definition.explosion, this.position, source, this.layer, weaponIsItem ? weaponUsed : weaponUsed?.weapon);
                //                                                                                                          ^^^^^^^^^^^^^^^^^^^^^^^^^
                // FIXME this cast to Explosion is not ideal and could cause issues in future if weaponUsed isn't an explosion
            }
            if (source instanceof gameObject_1.BaseGameObject && source.isPlayer) {
                // Plumpkin Bomb
                if (source.hasPerk("plumpkin_bomb" /* PerkIds.PlumpkinBomb */)
                    && definition.material === "pumpkin") {
                    this.playMaterialDestroyedSound = false;
                    this.game.addExplosion("pumpkin_explosion", this.position, source, this.layer);
                }
                // Infected perk
                if (definition.applyPerkOnDestroy
                    && definition.applyPerkOnDestroy.mode === this.game.modeName
                    && definition.applyPerkOnDestroy.chance > Math.random()
                    && !(definition.applyPerkOnDestroy.perk === "infected" /* PerkIds.Infected */ && source.hasPerk("immunity" /* PerkIds.Immunity */)) // evil
                ) {
                    source.addPerk(definition.applyPerkOnDestroy.perk);
                    if (definition.applyPerkOnDestroy.perk === "infected" /* PerkIds.Infected */) { // evil
                        source.setDirty();
                    }
                }
            }
            if (definition.particlesOnDestroy !== undefined) {
                this.game.addSyncedParticles(definition.particlesOnDestroy, this.position, this.layer);
            }
            if (this.puzzlePiece)
                this.parentBuilding?.solvePuzzle();
            const lootSpawnPosition = position ?? source?.position ?? this.position;
            for (const item of this.loot) {
                this.game.addLoot(item.idString, this.lootSpawnOffset
                    ? vector_1.Vec.add(this.position, this.lootSpawnOffset)
                    : this.loot.length > 1
                        ? this.hitbox.randomPoint()
                        : this.position, this.layer, { count: item.count })?.push(math_1.Angle.betweenPoints(this.position, lootSpawnPosition), 0.02);
            }
            if (source instanceof gameObject_1.BaseGameObject && source.isPlayer && source.hasPerk("loot_baron" /* PerkIds.LootBaron */) && this.definition.hasLoot) {
                const perkBonus = perks_1.PerkData["loot_baron" /* PerkIds.LootBaron */].lootBonus;
                const lootTable = (0, lootHelpers_1.getLootFromTable)(this.game.modeName, definition.lootTable ?? definition.idString);
                for (let i = 0; i < perkBonus; i++) {
                    for (const item of lootTable) {
                        this.game.addLoot(item.idString, this.lootSpawnOffset
                            ? vector_1.Vec.add(this.position, this.lootSpawnOffset)
                            : this.loot.length > 1
                                ? this.hitbox.randomPoint()
                                : this.position, this.layer, { count: item.count })?.push(math_1.Angle.betweenPoints(this.position, lootSpawnPosition), 0.02);
                    }
                }
            }
            if (definition.isWall) {
                this.parentBuilding?.damageCeiling();
                for (const object of this.game.grid.intersectsHitbox(this.hitbox)) {
                    if (object.isObstacle && object.definition.isDoor) {
                        const definition = object.definition;
                        switch (definition.operationStyle) {
                            case "slide": {
                                // TODO this ig?
                                break;
                            }
                            case "swivel":
                            default: {
                                const detectionHitbox = new hitbox_1.CircleHitbox(1, vector_1.Vec.addAdjust(object.position, definition.hingeOffset, object.rotation));
                                if (this.hitbox.collidesWith(detectionHitbox)) {
                                    object.damage({
                                        amount: Infinity,
                                        source,
                                        weaponUsed
                                    });
                                }
                                break;
                            }
                        }
                    }
                    if (object.isObstacle && object.definition.wallAttached) {
                        const detectionHitbox = new hitbox_1.CircleHitbox(2, object.position);
                        if (this.hitbox.collidesWith(detectionHitbox)) {
                            object.damage({
                                amount: Infinity,
                                source,
                                weaponUsed
                            });
                        }
                    }
                }
            }
            if (definition.regenerateAfterDestroyed) {
                this.game.addTimeout(() => {
                    this.dead = false;
                    this.health = this.maxHealth;
                    this.scale = this.maxScale;
                    const hitboxRotation = this.definition.rotationMode === constants_1.RotationMode.Limited ? this.rotation : 0;
                    this.hitbox = definition.hitbox.transform(this.position, this.scale, hitboxRotation);
                    this.collidable = !definition.noCollisions;
                    this.setPartialDirty();
                }, definition.regenerateAfterDestroyed);
            }
            this.game.pluginManager.emit("obstacle_did_destroy", {
                obstacle: this,
                source,
                weaponUsed,
                amount
            });
        }
    }
    canInteract(player) {
        return !this.dead && !this.definition?.damage
            && (player === undefined
                || this.definition.interactOnlyFromSide === undefined
                || this.definition.interactOnlyFromSide === this.hitbox.getSide(player.position))
            && ((this.isDoor
                && ( // Either the door must not be locked or automatic, or there must not be a player triggering it
                (!this.door?.locked && !this.definition.automatic)
                    || player === undefined)) || (this.definition.isActivatable === true
                && (this.definition.requiredItem === undefined || player?.activeItemDefinition.idString === this.definition.requiredItem)
                && !this.activated));
    }
    /**
     * Resolves the interaction between a given game object or bullet and this stair by shifting the object's layer as appropriate.
     * Two things are assumed and are prerequisite:
     * - This `Obstacle` instance is indeed one corresponding to a stair (such that `this.definition.isStair`)
     * - The given game object or bullet's hitbox overlaps this obstacle's (such that `gameObject.hitbox.collidesWith(this.hitbox)`)
     *
     * note that setters will be called _even if the new layer and old layer match_.
     */
    handleStairInteraction(object) {
        object.layer = (0, math_1.resolveStairInteraction)(this.definition, this.rotation, // stairs cannot have full rotation mode
        this.hitbox, this.layer, object.position);
    }
    interact(player) {
        if ((player !== undefined && !this.canInteract(player))
            || this.door?.locked === true
            || this.game.pluginManager.emit("obstacle_will_interact", {
                obstacle: this,
                player
            }) !== undefined)
            return;
        const definition = this.definition;
        if (definition.isDoor) {
            // optional chaining not required but makes both eslint and tsc happy
            if (!(this.door?.isOpen && definition.openOnce)) {
                this.toggleDoor(player);
            }
            if (definition.isActivatable) {
                this.activated = true;
            }
        }
        else if (definition.isActivatable) {
            this.activated = true;
            if (this.parentBuilding && this.puzzlePiece) {
                this.parentBuilding.togglePuzzlePiece(this);
            }
            const replaceWith = definition.replaceWith;
            if (replaceWith !== undefined) {
                this.game.addTimeout(() => {
                    this.dead = true;
                    this.collidable = false;
                    this.setDirty();
                    const idString = (0, misc_1.getRandomIDString)(replaceWith.idString);
                    if (idString === objectDefinitions_1.NullString) {
                        return;
                    }
                    this.game.map.generateObstacle(idString, this.position, { rotation: this.rotation, layer: this.layer });
                }, replaceWith.delay);
            }
        }
        this.setDirty();
        this.game.pluginManager.emit("obstacle_did_interact", {
            obstacle: this,
            player
        });
    }
    toggleDoor(player) {
        if (!this.door)
            return;
        if (!(this.hitbox instanceof hitbox_1.RectangleHitbox)) {
            throw new Error("Door with non-rectangular hitbox");
        }
        let hitbox = this.hitbox;
        this.door.isOpen = !this.door.isOpen;
        if (this.door.isOpen) {
            switch (this.door.operationStyle) {
                case "swivel": {
                    if (player !== undefined) {
                        let isOnOtherSide = false;
                        switch (this.rotation) {
                            case 0:
                                isOnOtherSide = player.position.y < this.position.y;
                                break;
                            case 1:
                                isOnOtherSide = player.position.x < this.position.x;
                                break;
                            case 2:
                                isOnOtherSide = player.position.y > this.position.y;
                                break;
                            case 3:
                                isOnOtherSide = player.position.x > this.position.x;
                                break;
                        }
                        if (isOnOtherSide) {
                            this.door.offset = 3;
                            // swivel door => alt hitbox
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            hitbox = this.door.openAltHitbox.clone();
                        }
                        else {
                            this.door.offset = 1;
                            if (this.definition.requiresPower && !this.door.locked) {
                                this.door.offset = 3;
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                hitbox = this.door.openAltHitbox.clone();
                            }
                            else
                                hitbox = this.door.openHitbox.clone();
                        }
                    }
                    else {
                        this.door.offset = 1;
                        hitbox = this.door.openHitbox.clone();
                    }
                    break;
                }
                case "slide": {
                    hitbox = this.door.openHitbox.clone();
                    this.door.offset = 1;
                    /*
                        changing the value of offset is really just for interop
                        with existing code, which already sends this value to the
                        client
                    */
                    break;
                }
            }
        }
        else {
            this.door.offset = 0;
            hitbox = this.door.closedHitbox.clone();
        }
        if (this.definition.interactionDelay) {
            this.door.powered = false;
            this.door.locked = true;
            this.setDirty();
        }
        (0, misc_1.runOrWait)(this.game, () => {
            if (this.door) {
                this.door.powered = true;
                this.door.locked = false;
                this.setDirty();
            }
            this.hitbox = hitbox;
            this.spawnHitbox = hitbox;
            this.game.grid.updateObject(this);
        }, this.definition.interactionDelay ?? 0);
    }
    get data() {
        return {
            scale: this.scale,
            dead: this.dead,
            playMaterialDestroyedSound: this.playMaterialDestroyedSound,
            waterOverlay: this.waterOverlay,
            powered: this.powered,
            full: {
                activated: this.activated,
                definition: this.definition,
                door: this.door,
                position: this.position,
                layer: this.layer,
                variation: this.variation,
                rotation: {
                    rotation: this.rotation,
                    orientation: this.rotation
                }
            }
        };
    }
}
exports.Obstacle = Obstacle;
//# sourceMappingURL=obstacle.js.map