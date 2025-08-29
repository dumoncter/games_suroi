"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const constants_1 = require("../../../common/src/constants");
const emotes_1 = require("../../../common/src/definitions/emotes");
const ammos_1 = require("../../../common/src/definitions/items/ammos");
const armors_1 = require("../../../common/src/definitions/items/armors");
const backpacks_1 = require("../../../common/src/definitions/items/backpacks");
const guns_1 = require("../../../common/src/definitions/items/guns");
const healingItems_1 = require("../../../common/src/definitions/items/healingItems");
const melees_1 = require("../../../common/src/definitions/items/melees");
const perks_1 = require("../../../common/src/definitions/items/perks");
const scopes_1 = require("../../../common/src/definitions/items/scopes");
const skins_1 = require("../../../common/src/definitions/items/skins");
const throwables_1 = require("../../../common/src/definitions/items/throwables");
const loots_1 = require("../../../common/src/definitions/loots");
const mapIndicators_1 = require("../../../common/src/definitions/mapIndicators");
const obstacles_1 = require("../../../common/src/definitions/obstacles");
const gameOverPacket_1 = require("../../../common/src/packets/gameOverPacket");
const killPacket_1 = require("../../../common/src/packets/killPacket");
const packetStream_1 = require("../../../common/src/packets/packetStream");
const reportPacket_1 = require("../../../common/src/packets/reportPacket");
const updatePacket_1 = require("../../../common/src/packets/updatePacket");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const layer_1 = require("../../../common/src/utils/layer");
const math_1 = require("../../../common/src/utils/math");
const misc_1 = require("../../../common/src/utils/misc");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../common/src/utils/random");
const suroiByteStream_1 = require("../../../common/src/utils/suroiByteStream");
const terrain_1 = require("../../../common/src/utils/terrain");
const vector_1 = require("../../../common/src/utils/vector");
const crypto_1 = require("crypto");
const action_1 = require("../inventory/action");
const inventory_1 = require("../inventory/inventory");
const inventoryItem_1 = require("../inventory/inventoryItem");
const throwableItem_1 = require("../inventory/throwableItem");
const config_1 = require("../utils/config");
const deathMarker_1 = require("./deathMarker");
const emote_1 = require("./emote");
const explosion_1 = require("./explosion");
const gameObject_1 = require("./gameObject");
const mapIndicator_1 = require("./mapIndicator");
const obstacle_1 = require("./obstacle");
const serverHelpers_1 = require("../utils/serverHelpers");
class Player extends gameObject_1.BaseGameObject.derive(constants_1.ObjectCategory.Player) {
    static baseHitbox = new hitbox_1.CircleHitbox(constants_1.GameConstants.player.radius);
    fullAllocBytes = 16;
    partialAllocBytes = 12;
    damageable = true;
    _hitbox;
    get hitbox() { return this._hitbox; }
    name;
    ip;
    halloweenThrowableSkin = false;
    activeBloodthirstEffect = false;
    activeDisguise;
    bulletTargetHitCount = 0;
    targetHitCountExpiration;
    overdriveTimeout;
    activeOverdrive = false;
    overdriveKills = 0;
    overdriveCooldown;
    canUseOverdrive = true;
    teamID;
    colorIndex = 0; // Assigned in the team.ts file.
    isConsumingItem = false;
    // Rate Limiting: Team Pings & Emotes.
    emoteCount = 0;
    lastRateLimitUpdate = 0;
    blockEmoting = false;
    timeWhenLastOutsideOfGas = Date.now();
    additionalGasDamage = 0;
    initializedSpecialSpectatingCase = false;
    loadout;
    joined = false;
    disconnected = false;
    _team;
    get team() { return this._team; }
    set team(value) {
        if (!this.game.isTeamMode) {
            console.warn("Trying to set a player's team while the game isn't in team mode");
            return;
        }
        if (this._team === this.team)
            return;
        this.dirty.teammates = true;
        this._team = value;
    }
    _kills = 0;
    get kills() { return this._kills; }
    set kills(kills) {
        if (this._kills === kills)
            return;
        this._kills = kills;
        this.game.updateKillLeader(this);
    }
    _maxHealth = constants_1.GameConstants.player.defaultHealth;
    get maxHealth() { return this._maxHealth; }
    set maxHealth(maxHealth) {
        if (this._maxHealth === maxHealth)
            return;
        this._maxHealth = maxHealth;
        this.dirty.maxMinStats = true;
        this._team?.setDirty();
        if (this._health <= this._maxHealth) {
            this._normalizedHealth = math_1.Numeric.remap(this._health, 0, maxHealth, 0, 1);
            this.dirty.health = true;
        }
        else {
            this.health = this._health;
        }
    }
    _health = this._maxHealth;
    _normalizedHealth = math_1.Numeric.remap(this._health, 0, this._maxHealth, 0, 1);
    get normalizedHealth() { return this._normalizedHealth; }
    get health() { return this._health; }
    set health(health) {
        const clamped = math_1.Numeric.min(health, this._maxHealth);
        if (this._health === clamped)
            return;
        this._health = clamped;
        this._team?.setDirty();
        this.dirty.health = true;
        this._normalizedHealth = math_1.Numeric.remap(this.health, 0, this.maxHealth, 0, 1);
    }
    _maxAdrenaline = constants_1.GameConstants.player.maxAdrenaline;
    _normalizedAdrenaline = 0;
    get normalizedAdrenaline() { return this._normalizedAdrenaline; }
    get maxAdrenaline() { return this._maxAdrenaline; }
    set maxAdrenaline(maxAdrenaline) {
        if (this._maxAdrenaline === maxAdrenaline)
            return;
        this._maxAdrenaline = maxAdrenaline;
        this.dirty.maxMinStats = true;
        if (this._adrenaline < this._maxAdrenaline) {
            this._normalizedAdrenaline = math_1.Numeric.remap(this.adrenaline, this.minAdrenaline, this.maxAdrenaline, 0, 1);
            this.dirty.adrenaline = true;
        }
        else {
            this.adrenaline = this._adrenaline;
        }
    }
    _minAdrenaline = 0;
    get minAdrenaline() { return this._minAdrenaline; }
    set minAdrenaline(minAdrenaline) {
        const min = math_1.Numeric.min(minAdrenaline, this._maxAdrenaline);
        if (this._minAdrenaline !== min) {
            this._minAdrenaline = min;
            this.dirty.maxMinStats = true;
        }
        this.adrenaline = this._adrenaline;
    }
    _adrenaline = this._minAdrenaline;
    get adrenaline() { return this._adrenaline; }
    set adrenaline(adrenaline) {
        const clamped = math_1.Numeric.clamp(adrenaline, this._minAdrenaline, this._maxAdrenaline);
        if (this._adrenaline === clamped)
            return;
        this._adrenaline = clamped;
        this.dirty.adrenaline = true;
        this._normalizedAdrenaline = math_1.Numeric.remap(this.adrenaline, this.minAdrenaline, this.maxAdrenaline, 0, 1);
    }
    _maxShield = constants_1.GameConstants.player.maxShield;
    _normalizedShield = 0;
    get normalizedShield() { return this._normalizedShield; }
    get maxShield() { return this._maxShield; }
    set maxShield(maxShield) {
        if (this._maxShield === maxShield)
            return;
        this._maxShield = maxShield;
        this.dirty.maxMinStats = true;
        if (this._shield < this._maxShield) {
            this._normalizedShield = math_1.Numeric.remap(this.shield, 0, this.maxShield, 0, 1);
            this.dirty.shield = true;
        }
        else {
            this.shield = this._shield;
        }
    }
    hadShield = false;
    _shield = 0;
    get shield() { return this._shield; }
    set shield(shield) {
        const clamped = math_1.Numeric.clamp(shield, 0, this._maxShield);
        if (this._shield === clamped)
            return;
        this._shield = clamped;
        this.dirty.shield = true;
        this._normalizedShield = math_1.Numeric.remap(this.shield, 0, this.maxShield, 0, 1);
        const hasBubble = this.shield > 0;
        if (this.hasBubble !== hasBubble) {
            this.hasBubble = hasBubble;
            this.setDirty();
            if (!hasBubble && this.hasPerk("experimental_forcefield" /* PerkIds.ExperimentalForcefield */)) {
                this._setShieldTimeout();
            }
        }
    }
    _setShieldTimeout() {
        this.shieldTimeout = this.game.addTimeout(() => {
            if (!this.dead && this.hasPerk("experimental_forcefield" /* PerkIds.ExperimentalForcefield */))
                this.shield = 100;
        }, perks_1.PerkData["experimental_forcefield" /* PerkIds.ExperimentalForcefield */].shieldRespawnTime);
    }
    _sizeMod = 1;
    get sizeMod() { return this._sizeMod; }
    set sizeMod(size) {
        if (this._sizeMod === size)
            return;
        this._sizeMod = size;
        this._hitbox = Player.baseHitbox.transform(this._hitbox.position, size);
        this.dirty.size = true;
        this.setDirty();
    }
    _modifiers = constants_1.GameConstants.player.defaultModifiers();
    killedBy;
    downedBy;
    damageDone = 0;
    damageTaken = 0;
    joinTime;
    recoil = {
        active: false,
        time: 0,
        multiplier: 1
    };
    effectSpeedMultiplier = 1; // TODO find a better way to do this maybe
    effectSpeedTimeout;
    isMoving = false;
    movement = {
        up: false,
        down: false,
        left: false,
        right: false,
        // mobile
        moving: false,
        angle: 0
    };
    isMobile;
    /**
     * Whether the player is attacking as of last update
     */
    attacking = false;
    /**
     * Whether the player started attacking last update
     */
    startedAttacking = false;
    /**
     * Whether the player stopped attacking last update
     */
    stoppedAttacking = false;
    /**
     * Whether the player is turning as of last update
     */
    turning = false;
    /**
     * The distance from the player position to the player mouse in game units
     */
    distanceToMouse = constants_1.GameConstants.player.maxMouseDist;
    /**
     * Keeps track of various fields which are "dirty"
     * and therefore need to be sent to the client for
     * updating
     */
    dirty = {
        id: true,
        teammates: true,
        highlightedPlayers: true,
        health: true,
        maxMinStats: true,
        adrenaline: true,
        shield: true,
        size: true,
        weapons: true,
        slotLocks: true,
        items: true,
        zoom: true,
        layer: true,
        activeC4s: true,
        perks: true,
        teamID: true
    };
    inventory = new inventory_1.Inventory(this);
    get activeItemIndex() {
        return this.inventory.activeWeaponIndex;
    }
    get activeItem() {
        return this.inventory.activeWeapon;
    }
    get activeItemDefinition() {
        return this.activeItem.definition;
    }
    bufferedAttack;
    _animation = {
        type: 0 /* AnimationType.None */,
        dirty: true
    };
    get animation() { return this._animation.type; }
    set animation(animType) {
        const animation = this._animation;
        animation.type = animType;
        animation.dirty = true;
    }
    /**
     * Objects the player can see
     */
    visibleObjects = new Set();
    updateObjects = true;
    /**
     * Objects near the player hitbox
     */
    nearObjects = new Set();
    /**
     * Ticks since last visible objects update
     */
    ticksSinceLastUpdate = 0;
    _scope;
    _tempScope;
    _scopeTimeout;
    get effectiveScope() { return this._tempScope ?? this._scope; }
    set effectiveScope(target) {
        const scope = scopes_1.Scopes.reify(target);
        if (this._scope === scope)
            return;
        // This timeout prevents objects from visibly disappearing when switching from a higher to a lower scope
        this._scopeTimeout?.kill();
        if ((this._scope?.zoomLevel ?? 0) > scope.zoomLevel) {
            this._tempScope = this._scope;
            this._scope = scope;
            this._scopeTimeout = this.game.addTimeout(() => {
                this._tempScope = undefined;
                this.updateObjects = true;
            }, 2000);
        }
        else {
            this._tempScope = undefined;
            this.updateObjects = true;
        }
        this._scope = scope;
        this.dirty.zoom = true;
    }
    socket;
    _action = {
        type: undefined,
        dirty: true
    };
    get action() { return this._action.type; }
    set action(value) {
        const action = this._action;
        const wasReload = action.type?.type === 1 /* PlayerActions.Reload */;
        action.type = value;
        action.dirty = true;
        if (!wasReload
            && value === undefined
            && this.activeItem.isGun
            && this.activeItem.ammo <= 0
            && this.inventory.items.hasItem(this.activeItemDefinition.ammoType)
            && !this.isConsumingItem // we do not want a forced reload action when we are using a healing item otherwise we will "reload" fists
        ) {
            // The action slot is now free, meaning our player isn't doing anything
            // Let's try reloading our empty gun then, unless we just cancelled a reload
            action.type = new action_1.ReloadAction(this, this.activeItem);
            action.dirty = true;
        }
    }
    spectating;
    startedSpectating = false;
    spectators = new Set();
    lastSpectateActionTime = 0;
    reportedPlayerIDs = new Map();
    lastPingTime = 0;
    role;
    isDev;
    hasColor;
    nameColor;
    /**
     * Used to make players invulnerable for 5 seconds after spawning or until they move
     */
    invulnerable = true;
    /**
     * Determines if the player can despawn
     * Set to false once the player picks up loot
     */
    canDespawn = true;
    lastFreeSwitch = 0;
    effectiveSwitchDelay = 0;
    isInsideBuilding = false;
    floor = "water" /* FloorNames.Water */;
    screenHitbox = hitbox_1.RectangleHitbox.fromRect(1, 1);
    downed = false;
    beingRevivedBy;
    activeStair;
    get position() {
        return this._hitbox.position;
    }
    set position(position) {
        if (vector_1.Vec.equals(position, this.position))
            return;
        this._hitbox.position = position;
        this._team?.setDirty();
    }
    baseSpeed = constants_1.GameConstants.player.baseSpeed;
    _movementVector = (0, vector_1.Vec)(0, 0);
    get movementVector() { return vector_1.Vec.clone(this._movementVector); }
    spawnPosition = (0, vector_1.Vec)(this.game.map.width / 2, this.game.map.height / 2);
    _mapPings = [];
    c4s = new Set();
    backEquippedMelee;
    hasBubble = false;
    perks = [];
    perkUpdateMap; // key = perk, value = last updated
    _perkData = {};
    _pingSeq = 0;
    // key = proj, value = angle
    stuckProjectiles;
    immunityTimeout;
    shieldTimeout;
    mapIndicator;
    highlightedPlayers;
    highlightedIndicators;
    recentlyHitPlayers;
    constructor(game, socket, position, layer, team) {
        super(game, position);
        if (layer !== undefined) {
            this.layer = layer;
        }
        if (team) {
            this._team = team;
            this.teamID = team.id;
            team.reassignColorIndexes();
            team.addPlayer(this);
            team.setDirty();
        }
        this.socket = socket;
        const data = socket?.getUserData() ?? {};
        this.name = constants_1.GameConstants.player.defaultName;
        this.ip = data.ip;
        this.role = data.role;
        this.isDev = data.isDev ?? false;
        this.nameColor = data.nameColor ?? 0;
        this.hasColor = data.nameColor !== undefined;
        game.addTimeout(() => {
            if (!this.joined) {
                this.disconnect("JoinPacket not received after 5 seconds");
            }
        }, 5000);
        this.loadout = {
            skin: loots_1.Loots.fromString("hazel_jumpsuit"),
            emotes: [
                emotes_1.Emotes.fromStringSafe("happy_face"),
                emotes_1.Emotes.fromStringSafe("thumbs_up"),
                emotes_1.Emotes.fromStringSafe("suroi_logo"),
                emotes_1.Emotes.fromStringSafe("sad_face"),
                undefined,
                undefined,
                undefined,
                undefined
            ]
        };
        this.rotation = 0;
        this.joinTime = game.now;
        this._hitbox = Player.baseHitbox.transform(position);
        this.inventory.addOrReplaceWeapon(2, "fists");
        // TODO make a constant for this or something
        this.inventory.scope = "2x_scope";
        this.effectiveScope = "2x_scope";
        // Weapon preset
        if (this.isDev
            && data.lobbyClearing
            && data.weaponPreset
            && config_1.Config.allowLobbyClearing) {
            const [weaponA, weaponB, melee, killsA, killB, killsM] = data.weaponPreset.split(" ");
            const backpack = this.inventory.backpack;
            const determinePreset = (slot, weaponName, kills) => {
                const weaponDef = loots_1.Loots.fromStringSafe(weaponName);
                let defType;
                if (weaponDef === undefined // no such item
                    || ![objectDefinitions_1.DefinitionType.Gun, objectDefinitions_1.DefinitionType.Melee].includes(defType = weaponDef.defType) // neither gun nor melee
                    || constants_1.GameConstants.player.inventorySlotTypings[slot] !== defType // invalid type
                )
                    return;
                this.inventory.addOrReplaceWeapon(slot, weaponDef);
                const weapon = this.inventory.getWeapon(slot);
                let killCount;
                if (!Number.isNaN(killCount = parseInt(kills ?? "", 10))) {
                    weapon.stats.kills = killCount;
                    weapon.refreshModifiers();
                }
                if (!weapon.isGun)
                    return;
                weapon.ammo = weaponDef.capacity;
                const ammoPtr = weaponDef.ammoType;
                const ammoType = ammos_1.Ammos.fromString(ammoPtr);
                if (ammoType.ephemeral)
                    return;
                this.inventory.items.setItem(ammoPtr, backpack.maxCapacity[ammoPtr]);
            };
            this.inventory.backpack = loots_1.Loots.fromString("tactical_pack");
            this.inventory.vest = loots_1.Loots.fromString("developr_vest");
            this.inventory.helmet = loots_1.Loots.fromString("tactical_helmet");
            for (const { idString: item } of [...healingItems_1.HealingItems, ...scopes_1.Scopes]) {
                this.inventory.items.setItem(item, backpack.maxCapacity[item]);
            }
            this.inventory.scope = "8x_scope";
            for (const scopeDef of scopes_1.Scopes.definitions) {
                this.inventory.items.setItem(scopeDef.idString, 1);
            }
            determinePreset(0, weaponA, killsA);
            determinePreset(1, weaponB, killB);
            determinePreset(2, melee, killsM);
        }
        // good chance that if these were changed, they're meant to be applied
        if (this.maxHealth !== constants_1.GameConstants.player.defaultHealth) {
            this.health = this.maxHealth;
        }
        if (this.maxAdrenaline !== constants_1.GameConstants.player.maxAdrenaline) {
            this.adrenaline = this.maxAdrenaline;
        }
        this.dirty.weapons = true;
        this.updateAndApplyModifiers();
    }
    giveGun(idString) {
        const primaryItem = this.inventory.getWeapon(this.inventory.appendWeapon(idString));
        const primaryDefinition = primaryItem.definition;
        primaryItem.ammo = primaryDefinition.capacity;
        if (!ammos_1.Ammos.fromString(primaryDefinition.ammoType).ephemeral) {
            this.inventory.items.setItem(primaryDefinition.ammoType, this.inventory.backpack.maxCapacity[primaryDefinition.ammoType]);
        }
    }
    giveThrowable(idString, count) {
        const { inventory } = this;
        inventory.items.incrementItem(idString, count ?? inventory.backpack.maxCapacity[idString]);
        inventory.useItem(idString);
        // we hope `throwableItemMap` is correctly sync'd
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inventory.throwableItemMap.get(idString).count = inventory.items.getItem(idString);
    }
    static _weaponSwapWeights = {
        [objectDefinitions_1.DefinitionType.Gun]: {
            [guns_1.Tier.S]: 0.15,
            [guns_1.Tier.A]: 0.2,
            [guns_1.Tier.B]: 0.5,
            [guns_1.Tier.C]: 0.818,
            [guns_1.Tier.D]: 0.182
        },
        [objectDefinitions_1.DefinitionType.Melee]: {
            [guns_1.Tier.S]: 0.125,
            [guns_1.Tier.A]: 0.5,
            [guns_1.Tier.B]: 0.4,
            [guns_1.Tier.C]: 0.4,
            [guns_1.Tier.D]: 0.2
        },
        [objectDefinitions_1.DefinitionType.Throwable]: {
            [guns_1.Tier.S]: 0.4,
            [guns_1.Tier.C]: 1,
            [guns_1.Tier.D]: 0.5
        }
    };
    static _weaponTiersCache = {};
    tryRefund(item = this.activeItem) {
        const bulletCount = item.category === objectDefinitions_1.DefinitionType.Gun && item.definition.bulletCount ? item.definition.bulletCount : 1;
        if (item.category !== objectDefinitions_1.DefinitionType.Gun
            || item.owner !== this
            || bulletCount !== 1
            || !this.inventory.weapons.includes(item))
            return;
        const { hitReq: hitsNeeded, refund, margin } = perks_1.PerkData["precision_recycling" /* PerkIds.PrecisionRecycling */];
        this.targetHitCountExpiration?.kill();
        this.targetHitCountExpiration = this.game.addTimeout(() => {
            this.bulletTargetHitCount = 0;
        }, margin * item.definition.fireDelay);
        if (this.bulletTargetHitCount < hitsNeeded) {
            ++this.bulletTargetHitCount;
        }
        if (this.bulletTargetHitCount >= hitsNeeded) {
            const cap = this.mapPerk("extended_mags" /* PerkIds.ExtendedMags */, () => item.definition.extendedCapacity) ?? item.definition.capacity;
            const target = math_1.Numeric.min(item.ammo + refund, cap);
            if (item.ammo !== target) {
                item.ammo = target;
                this.dirty.weapons = true;
            }
            this.bulletTargetHitCount = 0;
        }
    }
    swapWeaponRandomly(item = this.activeItem, force = false, modeRestricted, weighted) {
        if (item.definition.noSwap || this.hasPerk("lycanthropy" /* PerkIds.Lycanthropy */))
            return; // womp womp
        let slot = item === this.activeItem
            ? this.activeItemIndex
            : this.inventory.weapons.findIndex(i => i === item);
        // this happens if the item to be swapped isn't currently in the inventory
        // in that case, we just take the first slot matching that item's type
        if (slot === -1) {
            slot = constants_1.GameConstants.player.inventorySlotTypings.findIndex(slot => slot === item.definition.defType);
        }
        if (slot === -1) {
            (0, serverHelpers_1.serverWarn)(`Attempted to swap an item of invalid type ${objectDefinitions_1.DefinitionType[item.definition.defType]}`);
            return;
        }
        const allWeapons = this.game.allLoots;
        const spawnable = modeRestricted ? this.game.spawnableLoots : allWeapons;
        const { inventory } = this;
        const { items, backpack: { maxCapacity }, throwableItemMap } = inventory;
        const type = constants_1.GameConstants.player.inventorySlotTypings[slot];
        // only used if weapon swap is weighted
        const weights = Player._weaponSwapWeights[type] ?? {};
        const chosenTier = (0, random_1.weightedRandom)(Object.keys(weights).map(s => parseInt(s)), Object.values(weights));
        const cache = Player._weaponTiersCache[type] ??= {};
        const potentials = weighted
            ? cache[chosenTier] ??= spawnable.forType(type).filter(({ tier }) => tier === chosenTier).filter(item => !item.noSwap)
            : spawnable.forType(type).filter(item => !item.noSwap);
        const chosenItem = (0, random_1.pickRandomInArray)(type === objectDefinitions_1.DefinitionType.Throwable
            ? potentials.filter(({ idString: thr }) => (items.hasItem(thr) ? items.getItem(thr) : 0) < maxCapacity[thr])
            : potentials);
        if (chosenItem === undefined)
            return;
        switch (chosenItem.defType) { // chosenItem.defType === type, but the former helps ts narrow chosenItem's type
            case objectDefinitions_1.DefinitionType.Gun: {
                this.action?.cancel();
                const { capacity, ammoType, ammoSpawnAmount, summonAirdrop } = chosenItem;
                // Give the player ammo for the new gun if they do not have any ammo for it.
                if (!items.hasItem(ammoType) && !summonAirdrop) {
                    items.setItem(ammoType, math_1.Numeric.min(ammoSpawnAmount, maxCapacity[ammoType]));
                    this.dirty.items = true;
                }
                inventory.replaceWeapon(slot, chosenItem, force);
                const item = this.inventory.getWeapon(slot);
                item.ammo = capacity;
                item.lastUse = item.switchDate = this.lastFreeSwitch = this.game.now;
                this.effectiveSwitchDelay = 500;
                break;
            }
            case objectDefinitions_1.DefinitionType.Melee: {
                inventory.replaceWeapon(slot, chosenItem, force);
                break;
            }
            case objectDefinitions_1.DefinitionType.Throwable: {
                const { idString } = chosenItem;
                const count = items.hasItem(idString) ? items.getItem(idString) : 0;
                const max = maxCapacity[idString];
                const toAdd = math_1.Numeric.min(max - count, 3);
                // toAdd is greater than 0
                const newCount = math_1.Numeric.clamp(count + toAdd, 0, max);
                items.setItem(idString, newCount);
                const item = throwableItemMap.getAndGetDefaultIfAbsent(idString, () => new throwableItem_1.ThrowableItem(chosenItem, this, undefined, newCount));
                item.count = newCount;
                const slot = inventory.slotsByDefType[objectDefinitions_1.DefinitionType.Throwable]?.[0];
                if (slot !== undefined && !inventory.hasWeapon(slot)) {
                    inventory.replaceWeapon(slot, item, force);
                }
                this.dirty.weapons = true;
                this.dirty.items = true;
                break;
            }
        }
        this.sendEmote(emotes_1.Emotes.fromStringSafe(chosenItem.idString), true);
    }
    fillInventory(max = false) {
        const { inventory } = this;
        inventory.scope = "4x_scope";
        inventory.backpack = max
            ? Array.from(backpacks_1.Backpacks).sort(({ level: lvlA }, { level: lvlB }) => lvlB - lvlA)[0]
            : (0, random_1.pickRandomInArray)(backpacks_1.Backpacks.definitions);
        this.inventory.vest = max
            ? Array.from(armors_1.Armors).filter(({ armorType }) => armorType === armors_1.ArmorType.Vest).sort(({ level: lvlA }, { level: lvlB }) => lvlB - lvlA)[0]
            : Math.random() > 0.9
                ? undefined
                : (0, random_1.pickRandomInArray)(armors_1.Armors.definitions.filter(({ armorType }) => armorType === armors_1.ArmorType.Vest));
        this.inventory.helmet = max
            ? Array.from(armors_1.Armors).filter(({ armorType }) => armorType === armors_1.ArmorType.Helmet).sort(({ level: lvlA }, { level: lvlB }) => lvlB - lvlA)[0]
            : Math.random() > 0.9
                ? undefined
                : (0, random_1.pickRandomInArray)(armors_1.Armors.definitions.filter(({ armorType }) => armorType === armors_1.ArmorType.Helmet));
        const { items } = inventory;
        items.setItem("2x_scope", 1);
        items.setItem("4x_scope", 1);
        items.setItem("8x_scope", 1);
        items.setItem("16x_scope", 1);
        throwables_1.Throwables.definitions.forEach(({ idString }) => this.giveThrowable(idString));
        for (const [item, maxCapacity] of Object.entries(inventory.backpack.maxCapacity)) {
            items.setItem(item, maxCapacity);
            if (inventory.throwableItemMap.has(item)) {
                // we hope `throwableItemMap` is correctly sync'd
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                inventory.throwableItemMap.get(item).count = maxCapacity;
            }
        }
        this.giveGun((0, random_1.pickRandomInArray)(guns_1.Guns.definitions).idString);
        this.giveGun((0, random_1.pickRandomInArray)(guns_1.Guns.definitions).idString);
        this.inventory.addOrReplaceWeapon(2, (0, random_1.pickRandomInArray)(melees_1.Melees.definitions));
    }
    spawnPos(position) {
        this.spawnPosition = position;
    }
    emoteRateLimit() {
        if (this.blockEmoting)
            return true;
        this.emoteCount++;
        // After constantly spamming more than 5 emotes, block for 5 seconds.
        if (this.emoteCount > constants_1.GameConstants.player.rateLimitPunishmentTrigger) {
            this.blockEmoting = true;
            this.setDirty();
            this.game.addTimeout(() => {
                this.blockEmoting = false;
                this.setDirty();
                this.emoteCount = 0;
            }, constants_1.GameConstants.player.emotePunishmentTime);
            return true;
        }
        return false;
    }
    /**
     * @param isFromServer If the emoji should skip checking if the player has that emoji in their emoji wheel
     */
    sendEmote(source, isFromServer = false) {
        if (this.emoteRateLimit() || !source)
            return;
        const indexOf = this.loadout.emotes.indexOf(source);
        if (!isFromServer && (indexOf < 0 || indexOf > 5))
            return;
        if (this.game.pluginManager.emit("player_will_emote", { player: this, emote: source }))
            return;
        this.game.emotes.push(new emote_1.Emote(source, this));
        this.game.pluginManager.emit("player_did_emote", {
            player: this,
            emote: source
        });
    }
    sendMapPing(ping, position) {
        if (this.emoteRateLimit() || !ping.isPlayerPing)
            return;
        if (this.game.pluginManager.emit("player_will_map_ping", {
            player: this,
            ping,
            position
        }))
            return;
        if (this._team) {
            for (const player of this._team.players) {
                /*
                    FIXME i have no idea why this is here but i'm leaving it alone
                          someone please check if this is redundant
                */
                if (!player)
                    continue;
                player._mapPings.push({
                    definition: ping,
                    position,
                    playerId: this.id
                });
            }
            return;
        }
        this._mapPings.push({
            definition: ping,
            position,
            playerId: this.id
        });
        this.game.pluginManager.emit("player_did_map_ping", {
            player: this,
            ping,
            position
        });
    }
    update() {
        const dt = this.game.dt;
        // Building & smoke checks
        let isInsideBuilding = false;
        let scopeTarget;
        const syncedParticles = new Set();
        for (const object of this.nearObjects) {
            if (!isInsideBuilding
                && object?.isBuilding
                && (!object.dead || (object.dead && object.definition.hasDamagedCeiling))
                && object.scopeHitbox?.collidesWith(this._hitbox)
                && !config_1.Config.disableBuildingCheck) {
                isInsideBuilding = true;
                scopeTarget ??= object.definition.ceilingScope;
            }
            else if (object.isSyncedParticle
                && object.hitbox?.collidesWith(this._hitbox)
                && (0, layer_1.adjacentOrEqualLayer)(object.layer, this.layer)) {
                syncedParticles.add(object);
            }
        }
        this.isInsideBuilding = isInsideBuilding;
        // Recoil
        const recoilMultiplier = this.recoil.active && (this.recoil.active = (this.recoil.time >= this.game.now))
            ? this.recoil.multiplier
            : 1;
        // Speed multiplier for perks
        const perkSpeedMod = this.mapPerkOrDefault("advanced_athletics" /* PerkIds.AdvancedAthletics */, ({ waterSpeedMod, smokeSpeedMod }) => {
            return ((terrain_1.FloorTypes[this.floor].overlay ? waterSpeedMod : 1) // man do we need a better way of detecting water lol
                * (syncedParticles.size !== 0 ? smokeSpeedMod : 1));
        }, 1)
            * this.mapPerkOrDefault("claustrophobic" /* PerkIds.Claustrophobic */, ({ speedMod }) => isInsideBuilding ? speedMod : 1, 1);
        const adrenSpeedMod = (() => {
            /*
                The relation between speed and adrenaline is modelled around these three points:

                adren. | speed multiplier
                -------|---------------
                   0   |       1
                  30   |     1.10
                  100  |     1.15

                Using a logarithmic regression model, we obtain:

                a = 0.944297822457
                b = -0.0158132859327
                c = 0.699999999995
                d = 3.51269916486

                y = b•log[c](x + d) + a

                or, using the change of base law,
                y = b•log(x + d) / log(c) + a

                https://www.desmos.com/calculator/sgimzzda0b
            */
            const a = 0.944297822457;
            const b = -0.0158132859327;
            const c = 0.699999999995;
            const d = 3.51269916486;
            return b * Math.log(this._adrenaline + d) / Math.log(c) + a;
        })();
        // Calculate speed
        const speed = this.baseSpeed // Base speed
            * (terrain_1.FloorTypes[this.floor].speedMultiplier ?? 1) // Speed multiplier from floor player is standing in
            * recoilMultiplier // Recoil from items
            * perkSpeedMod // See above
            * (this.action?.speedMultiplier ?? 1) // Speed modifier from performing actions
            * adrenSpeedMod // Speed boost from adrenaline
            * (this.downed ? 0.5 : (this.activeItemDefinition.speedMultiplier ?? 1)) // Active item/knocked out speed modifier
            * (this.beingRevivedBy ? 0.5 : 1) // Being revived speed multiplier
            * this.effectSpeedMultiplier // Effect speed multiplier (currently only used for vaccinator slowdown)
            * this._modifiers.baseSpeed; // Current on-wearer modifier
        // Calculate movement
        let movement;
        const playerMovement = this.movement;
        if (this.isMobile && playerMovement.moving) {
            movement = vector_1.Vec.fromPolar(playerMovement.angle);
        }
        else {
            let x = +playerMovement.right - +playerMovement.left;
            let y = +playerMovement.down - +playerMovement.up;
            if (x * y !== 0) {
                // If the product is non-zero, then both of the components must be non-zero
                x *= Math.SQRT1_2;
                y *= Math.SQRT1_2;
            }
            movement = (0, vector_1.Vec)(x, y);
        }
        // Update position
        const oldPosition = vector_1.Vec.clone(this.position);
        this._movementVector = vector_1.Vec.scale(movement, speed);
        this.position = vector_1.Vec.add(this.position, vector_1.Vec.scale(this.movementVector, dt));
        // Find and resolve collisions
        this.nearObjects = this.game.grid.intersectsHitbox(this._hitbox, this.layer);
        for (let step = 0; step < 10; step++) {
            let collided = false;
            for (const potential of this.nearObjects) {
                const { isObstacle, isBuilding } = potential;
                if ((isObstacle || isBuilding)
                    && this.mapPerkOrDefault("advanced_athletics" /* PerkIds.AdvancedAthletics */, () => {
                        return potential.definition.material !== "tree"
                            && (!isObstacle
                                || !potential.definition.isWindow
                                || !potential.dead);
                    }, true)
                    && potential.collidable
                    && potential.hitbox?.collidesWith(this._hitbox)) {
                    if (isObstacle && potential.definition.isStair) {
                        const oldLayer = this.layer;
                        potential.handleStairInteraction(this);
                        if (this.layer !== oldLayer)
                            this.setDirty();
                        this.activeStair = potential;
                    }
                    else {
                        collided = true;
                        this._hitbox.resolveCollision(potential.hitbox);
                        if (isObstacle && potential.activated && potential.definition.damage) {
                            this.damage({
                                amount: potential.definition.damage,
                                source: killPacket_1.DamageSources.Obstacle,
                                weaponUsed: potential
                            });
                        }
                    }
                }
            }
            if (!collided)
                break;
        }
        // Clamp position to world boundaries
        this.position.x = math_1.Numeric.clamp(this.position.x, this._hitbox.radius, this.game.map.width - this._hitbox.radius);
        this.position.y = math_1.Numeric.clamp(this.position.y, this._hitbox.radius, this.game.map.height - this._hitbox.radius);
        this.isMoving = !vector_1.Vec.equals(oldPosition, this.position);
        if (this.isMoving) {
            this.game.grid.updateObject(this);
            this.floor = this.game.map.terrain.getFloor(this.position, this.layer);
            this.mapIndicator?.updatePosition(this.position);
        }
        if (this.isMoving || this.turning) {
            this.disableInvulnerability();
            this.setPartialDirty();
        }
        this.turning = false;
        // Health regen
        let toRegen = this._modifiers.hpRegen;
        if (this._adrenaline >= 0) {
            /*
                The relation between healing and adrenaline is modelled around these three points:

                adren. | healing (hp/s)
                -------|---------------
                   0   |       1
                  30   |     1.875
                  100  |      2.75

                Using a logarithmic regression model, we obtain:

                a = -2.2153107223876285
                b = -1.9660534157593246
                c = 0.14899999980029943
                d = 22.5

                y = b•log[c](x + d) + a

                or, using the change of base law,
                y = b•log(x + d) / log(c) + a

                https://www.desmos.com/calculator/idwbtpnzbv
            */
            const a = -2.2153107223876285;
            const b = -1.9660534157593246;
            const c = 0.14899999980029943;
            const d = 22.5;
            const adrenRegen = b * Math.log(this._adrenaline + d) / Math.log(c) + a;
            // Regenerate health
            toRegen += adrenRegen * this.mapPerkOrDefault("laced_stimulants" /* PerkIds.LacedStimulants */, ({ healDmgRate, lowerHpLimit }) => (this.health <= lowerHpLimit ? 1 : -healDmgRate), (this.adrenaline > 0 || (this.normalizedHealth < 0.3 && !this.hasPerk("infected" /* PerkIds.Infected */))) && !this.downed ? 1 : 0);
            // Drain adrenaline
            this.adrenaline -= 0.0005 * this._modifiers.adrenDrain * dt;
        }
        this.health += dt / 1000 * toRegen;
        // Shield regen
        if (this.hasBubble) {
            const _toRegen = this._modifiers.shieldRegen;
            this.shield += dt / 1000 * _toRegen;
        }
        // Shoot gun/use item
        if (this.startedAttacking && this.game.pluginManager.emit("player_start_attacking", this) === undefined) {
            this.startedAttacking = false;
            this.disableInvulnerability();
            this.activeItem.useItem();
        }
        if (this.stoppedAttacking && this.game.pluginManager.emit("player_stop_attacking", this) === undefined) {
            this.stoppedAttacking = false;
            this.activeItem.stopUse();
        }
        // Gas damage
        const gas = this.game.gas;
        const now = Date.now();
        const applyScaleDamageFactor = (now - this.timeWhenLastOutsideOfGas) >= 10000;
        if (gas.doDamage && gas.isInGas(this.position)) {
            this.piercingDamage({
                amount: gas.scaledDamage(this.position) + (applyScaleDamageFactor ? (gas.getDef().scaleDamageFactor ?? 0) + this.additionalGasDamage : 0),
                source: killPacket_1.DamageSources.Gas
            });
            if (applyScaleDamageFactor) {
                this.additionalGasDamage = this.additionalGasDamage + (gas.getDef().scaleDamageFactor ?? 0);
            }
        }
        else if (!gas.isInGas(this.position)) {
            this.timeWhenLastOutsideOfGas = now;
            this.additionalGasDamage = 0;
        }
        // Knocked out damage
        if (this.downed && !this.beingRevivedBy) {
            this.piercingDamage({
                amount: constants_1.GameConstants.player.bleedOutDPMs * dt,
                source: killPacket_1.DamageSources.BleedOut
            });
        }
        // Cancel reviving when out of range
        if (this.action instanceof action_1.ReviveAction) {
            if (vector_1.Vec.squaredLen(vector_1.Vec.sub(this.position, this.action.target.position)) >= 7 ** 2) {
                this.action.cancel();
            }
        }
        // Smoke effects
        for (const syncedParticle of syncedParticles) {
            const def = syncedParticle.definition;
            const depletion = def.depletePerMs;
            const { snapScopeTo, scopeOutPreMs = 0 } = def;
            // If lifetime - age > scope out time, we have the potential to zoom in the scope
            if (snapScopeTo
                && syncedParticle._lifetime - (this.game.now - syncedParticle._creationDate) >= scopeOutPreMs) {
                scopeTarget ??= snapScopeTo;
            }
            // TODO if this is ever used, make a new damage type; gas is misleading
            if (depletion?.health) {
                this.piercingDamage({
                    amount: depletion.health * dt,
                    source: killPacket_1.DamageSources.Gas
                });
            }
            if (depletion?.adrenaline) {
                this.adrenaline -= depletion.adrenaline * dt;
            }
        }
        // Set scope
        if (this.downed || (isInsideBuilding && !scopeTarget)) {
            scopeTarget = scopes_1.DEFAULT_SCOPE;
        }
        this.effectiveScope = scopeTarget ?? this.inventory.scope;
        // Rate limit team pings & emotes
        if (this.emoteCount > 0 && !this.blockEmoting && (this.game.now - this.lastRateLimitUpdate > constants_1.GameConstants.player.rateLimitInterval)) {
            this.emoteCount--;
            this.lastRateLimitUpdate = this.game.now;
        }
        // Update perks
        if (this.perkUpdateMap !== undefined) {
            for (const [perk, lastUpdated] of this.perkUpdateMap.entries()) {
                if (this.game.now - lastUpdated <= (perk.updateInterval ?? 1000))
                    continue;
                this.perkUpdateMap.set(perk, this.game.now);
                // ! evil starts here
                switch (perk.idString) {
                    case "bloodthirst" /* PerkIds.Bloodthirst */: {
                        this.piercingDamage({
                            amount: perk.healthLoss
                        });
                        break;
                    }
                    case "baby_plumpkin_pie" /* PerkIds.BabyPlumpkinPie */: {
                        this.swapWeaponRandomly(undefined, true);
                        break;
                    }
                    case "torn_pockets" /* PerkIds.TornPockets */: {
                        const items = this.inventory.items;
                        const candidates = new Set(ammos_1.Ammos.definitions.filter(({ ephemeral }) => !ephemeral).map(({ idString }) => idString));
                        const counts = Object.entries(items.asRecord()).filter(([str, count]) => ammos_1.Ammos.hasString(str) && candidates.has(str) && count !== 0);
                        // no ammo at all
                        if (counts.length === 0)
                            break;
                        const chosenAmmo = ammos_1.Ammos.fromString((0, random_1.weightedRandom)(counts.map(([str]) => str), counts.map(([, cnt]) => cnt)));
                        const amountToDrop = math_1.Numeric.min(this.inventory.items.getItem(chosenAmmo.idString), perk.dropCount);
                        this.game.addLoot(chosenAmmo, this.position, this.layer, { count: amountToDrop })
                            ?.push(this.rotation + Math.PI, 0.025);
                        items.decrementItem(chosenAmmo.idString, amountToDrop);
                        this.dirty.items = true;
                        break;
                    }
                    case "rotten_plumpkin" /* PerkIds.RottenPlumpkin */: {
                        this.sendEmote(emotes_1.Emotes.fromStringSafe(perk.emote), true);
                        this.piercingDamage({
                            amount: perk.healthLoss
                        });
                        this.adrenaline -= this.adrenaline * (perk.adrenLoss / 100);
                        break;
                    }
                    case "shrouded" /* PerkIds.Shrouded */: {
                        this.game.addSyncedParticle("shrouded_particle", this.position, (0, random_1.randomPointInsideCircle)(this.position, 5), this.layer, this.id);
                        break;
                    }
                    case "infected" /* PerkIds.Infected */: {
                        if (this.health > perk.minHealth) {
                            this.health = math_1.Numeric.max(this.health - perk.dps, perk.minHealth);
                        }
                        const detectionHitbox = new hitbox_1.CircleHitbox(perk.infectionRadius, this.position);
                        for (const player of this.game.grid.intersectsHitbox(detectionHitbox)) {
                            if (!player.isPlayer
                                || !player.hitbox.collidesWith(detectionHitbox)
                                || Math.random() > perk.infectionChance
                                || player.hasPerk("immunity" /* PerkIds.Immunity */))
                                continue;
                            player.addPerk(perks_1.Perks.fromString("infected" /* PerkIds.Infected */));
                            player.setDirty();
                        }
                        break;
                    }
                }
                // ! evil ends here
            }
        }
        // Update Thermal Goggles & Hollow Points perks
        // TODO this is dogshit there's gotta be a cleaner way to do this
        const hasThermalGoggles = this.hasPerk("thermal_goggles" /* PerkIds.ThermalGoggles */);
        const hasHollowPoints = this.hasPerk("hollow_points" /* PerkIds.HollowPoints */);
        if (hasThermalGoggles || hasHollowPoints) {
            let indicatedPlayers;
            if (hasThermalGoggles) {
                const detectionHitbox = new hitbox_1.CircleHitbox(perks_1.PerkData["thermal_goggles" /* PerkIds.ThermalGoggles */].detectionRadius, this.position);
                indicatedPlayers = [];
                this.highlightedPlayers = [];
                const alreadyHighlighted = [
                    perks_1.PerkData["thermal_goggles" /* PerkIds.ThermalGoggles */],
                    perks_1.PerkData["experimental_forcefield" /* PerkIds.ExperimentalForcefield */],
                    perks_1.PerkData["hollow_points" /* PerkIds.HollowPoints */]
                ];
                for (const player of this.game.grid.intersectsHitbox(detectionHitbox)) {
                    if (!player.isPlayer
                        || player === this
                        || player.dead
                        || (this.game.isTeamMode && player.teamID === this.teamID)
                        || !player.hitbox.collidesWith(detectionHitbox))
                        continue;
                    if (this.visibleObjects.has(player)) {
                        this.highlightedPlayers.push(player);
                    }
                    if (player.perks.some(perk => alreadyHighlighted.includes(perk)))
                        continue;
                    indicatedPlayers.push(player);
                    const indicator = this.highlightedIndicators?.get(player);
                    if (indicator) {
                        indicator.updatePosition(player.position);
                    }
                    else {
                        (this.highlightedIndicators ??= new Map())
                            .set(player, new mapIndicator_1.MapIndicator(this.game, "player_indicator", player.position));
                    }
                }
                this.dirty.highlightedPlayers = true; // TODO determine if the list of highlighted players actually changed
            }
            for (const [player, indicator] of this.highlightedIndicators ?? []) {
                const lastHitTime = this.recentlyHitPlayers?.get(player);
                if (lastHitTime !== undefined) {
                    if (this.game.now - lastHitTime < perks_1.PerkData["hollow_points" /* PerkIds.HollowPoints */].highlightDuration) {
                        indicator.updatePosition(player.position);
                        continue;
                    }
                    this.recentlyHitPlayers?.delete(player);
                }
                if (indicatedPlayers?.includes(player))
                    continue;
                if (indicator.dead) {
                    this.game.mapIndicatorIDAllocator.give(indicator.id);
                    this.highlightedIndicators?.delete(player);
                }
                indicator.dead = true;
            }
        }
        // Update stuck projectiles (currently only seedshot seeds)
        if (this.stuckProjectiles) {
            for (const [proj, angle] of this.stuckProjectiles) {
                if (proj.detonated || proj.dead) {
                    this.stuckProjectiles.delete(proj);
                    continue;
                }
                const finalAngle = math_1.Angle.normalize(this.rotation + angle);
                proj.position = vector_1.Vec.add(this.position, vector_1.Vec.fromPolar(finalAngle, this.sizeMod * constants_1.GameConstants.player.radius * 1.2));
                proj.rotation = finalAngle;
                proj.setPartialDirty();
            }
        }
        // Update automatic doors
        const openedDoors = [];
        const unopenedDoors = [];
        for (const door of this.game.grid.intersectsHitbox(new hitbox_1.CircleHitbox(10, this.position), this.layer)) {
            if (door.dead
                || !door?.isObstacle
                || !door.definition.isDoor
                || !door.definition.automatic
                || door.door?.isOpen
                || !isInsideBuilding // womp womp
            )
                continue;
            if (math_1.Geometry.distanceSquared(door.position, this.position) > 100) {
                unopenedDoors.push(door);
                continue;
            }
            door.interact();
            openedDoors.push(door);
        }
        for (const door of unopenedDoors) {
            if (openedDoors.every(d => math_1.Geometry.distanceSquared(door.position, d.position) > 300))
                continue; // Don't open the door if there are no other open doors in range
            door.interact();
            openedDoors.push(door);
        }
        const closeDoors = () => {
            if (openedDoors.every(obj => math_1.Geometry.distanceSquared(obj.position, this.position) >= 100)) {
                for (const door of openedDoors) {
                    if (!door.dead)
                        door.interact();
                }
            }
            else {
                this.game.addTimeout(closeDoors, 1000);
            }
        };
        this.game.addTimeout(closeDoors, 1000);
        this.game.pluginManager.emit("player_update", this);
    }
    _firstPacket = true;
    _packetStream = new packetStream_1.PacketStream(new suroiByteStream_1.SuroiByteStream(new ArrayBuffer(1 << 16)));
    /**
     * Calculate visible objects, check team, and send packets
     */
    secondUpdate() {
        const packet = updatePacket_1.UpdatePacket.create();
        const player = this.spectating ?? this;
        const game = this.game;
        const fullObjects = new Set();
        // Calculate visible objects
        this.ticksSinceLastUpdate++;
        if (this.ticksSinceLastUpdate > 8 || game.updateObjects || this.updateObjects) {
            this.ticksSinceLastUpdate = 0;
            this.updateObjects = false;
            const dim = player.effectiveScope.zoomLevel * 2 + 8;
            this.screenHitbox = hitbox_1.RectangleHitbox.fromRect(dim, dim, player.position);
            const newVisibleObjects = game.grid.intersectsHitbox(this.screenHitbox);
            packet.deletedObjects = [];
            for (const object of this.visibleObjects) {
                if (newVisibleObjects.has(object))
                    continue;
                this.visibleObjects.delete(object);
                packet.deletedObjects.push(object.id);
            }
            for (const object of newVisibleObjects) {
                if (this.visibleObjects.has(object))
                    continue;
                this.visibleObjects.add(object);
                fullObjects.add(object);
            }
        }
        for (const object of game.fullDirtyObjects) {
            if (!this.visibleObjects.has(object))
                continue;
            fullObjects.add(object);
        }
        packet.fullObjectsCache = fullObjects;
        packet.partialObjectsCache = [];
        for (const object of game.partialDirtyObjects) {
            if (!this.visibleObjects.has(object) || fullObjects.has(object))
                continue;
            packet.partialObjectsCache.push(object);
        }
        const inventory = player.inventory;
        let forceInclude = false;
        if (this.startedSpectating && this.spectating) {
            forceInclude = true;
            this.startedSpectating = false;
        }
        const playerData = packet.playerData = {
            pingSeq: this._pingSeq,
            blockEmoting: player.blockEmoting
        };
        if (player.dirty.maxMinStats || forceInclude) {
            playerData.minMax = {
                maxHealth: player._maxHealth,
                minAdrenaline: player._minAdrenaline,
                maxAdrenaline: player._maxAdrenaline
            };
        }
        if (player.dirty.health || forceInclude) {
            playerData.health = player._normalizedHealth;
        }
        if (player.dirty.adrenaline || forceInclude) {
            playerData.adrenaline = player._normalizedAdrenaline;
        }
        if (player.dirty.shield || forceInclude) {
            playerData.shield = player._normalizedShield;
        }
        if (player.dirty.zoom || forceInclude) {
            playerData.zoom = player._scope.zoomLevel;
        }
        if (player.dirty.id || forceInclude) {
            playerData.id = {
                id: player.id,
                spectating: this.spectating !== undefined
            };
        }
        if ((player.dirty.teammates || forceInclude) && player._team) {
            playerData.teammates = player._team.players;
        }
        if (player.dirty.highlightedPlayers || forceInclude) {
            playerData.highlightedPlayers = this.highlightedPlayers;
        }
        if (player.dirty.weapons || forceInclude) {
            playerData.inventory = {
                activeWeaponIndex: inventory.activeWeaponIndex,
                weapons: inventory.weapons.map(slot => {
                    const item = slot;
                    return (item && {
                        definition: item.definition,
                        count: item.isGun
                            ? item.ammo
                            : item instanceof inventoryItem_1.CountableInventoryItem
                                ? item.count
                                : undefined,
                        stats: item.stats
                    });
                })
            };
        }
        if (player.dirty.slotLocks || forceInclude) {
            playerData.lockedSlots = player.inventory.lockedSlots;
        }
        if (player.dirty.items || forceInclude) {
            playerData.items = {
                items: inventory.items.asRecord(),
                scope: inventory.scope
            };
        }
        if (player.dirty.layer || forceInclude) {
            playerData.layer = player.layer;
        }
        if (player.dirty.activeC4s || forceInclude) {
            playerData.activeC4s = this.c4s.size > 0;
        }
        if (player.dirty.perks || forceInclude) {
            playerData.perks = player.perks;
        }
        if (player.dirty.teamID || forceInclude) {
            playerData.teamID = player.teamID;
        }
        // Cull bullets
        /*
            oversight: this works by checking if the bullet's trajectory overlaps the player's
                       viewing port; if it does, the player will eventually see the bullet,
                       and we should thus send it. however, it overlooks the fact that the
                       viewing port can move as the bullet travels. this causes a potential
                       for ghost bullets, but since most projectiles travel their range within
                       well under a second (usually between 0.3–0.8 seconds), the chance of this
                       happening is quite low (except with slow-projectile weapons like the radio
                       and firework launcher).

                       fixing this is therefore not worth the performance penalty
        */
        packet.bullets = [];
        for (const bullet of game.newBullets) {
            if (!math_1.Collision.lineIntersectsRectTest(bullet.initialPosition, bullet.finalPosition, this.screenHitbox.min, this.screenHitbox.max))
                continue;
            packet.bullets.push(bullet);
        }
        // Cull explosions
        packet.explosions = [];
        for (const explosion of game.explosions) {
            if (!this.screenHitbox.isPointInside(explosion.position)
                || math_1.Geometry.distanceSquared(explosion.position, this.position) > constants_1.GameConstants.explosionMaxDistSquared)
                continue;
            packet.explosions.push(explosion);
        }
        // Emotes
        packet.emotes = [];
        for (const emote of game.emotes) {
            if (!this.visibleObjects.has(emote.player))
                continue;
            packet.emotes.push(emote);
        }
        // Gas
        const gas = game.gas;
        if (gas.dirty || this._firstPacket) {
            packet.gas = gas;
        }
        if (gas.completionRatioDirty || this._firstPacket) {
            packet.gasProgress = gas.completionRatio;
        }
        const newPlayers = this._firstPacket
            ? game.grid.pool.getCategory(constants_1.ObjectCategory.Player)
            : game.newPlayers;
        // New/deleted players
        packet.newPlayers = [];
        for (const newPlayer of newPlayers) {
            const { id, teamID, name, hasColor, nameColor, loadout: { badge } } = newPlayer;
            packet.newPlayers.push({
                id,
                name,
                hasColor,
                nameColor: hasColor ? nameColor : undefined,
                badge
            });
            // Add new teammates to full objects
            if (!this.game.isTeamMode || teamID !== player.teamID)
                continue;
            fullObjects.add(newPlayer);
        }
        packet.deletedPlayers = game.deletedPlayers;
        if (game.aliveCountDirty || this._firstPacket) {
            packet.aliveCount = game.aliveCount;
        }
        packet.planes = game.planes;
        packet.mapPings = [...game.mapPings, ...this._mapPings];
        this._mapPings.length = 0;
        const indicators = [...game.mapIndicators, ...(this.highlightedIndicators?.values() ?? [])];
        packet.mapIndicators = this._firstPacket
            ? indicators.map(indicator => ({ ...indicator, positionDirty: true, definitionDirty: true }))
            : indicators.filter(indicator => indicator.positionDirty || indicator.definitionDirty || indicator.dead);
        if (game.killLeaderDirty || this._firstPacket) {
            packet.killLeader = {
                id: game.killLeader?.id ?? -1,
                kills: game.killLeader?.kills ?? 0
            };
        }
        // serialize and send update packet
        this.sendPacket(packet);
        this._firstPacket = false;
        this._packetStream.stream.index = 0;
        for (const packet of this._packets) {
            this._packetStream.serialize(packet);
        }
        for (const packet of this.game.packets) {
            this._packetStream.serialize(packet);
        }
        this._packets.length = 0;
        this.sendData(this._packetStream.getBuffer());
    }
    /**
     * Clean up internal state after all packets have been sent
     * to all recipients. The only code that should be present here
     * is clean up code that cannot be in `secondUpdate` because packets
     * depend on it
     */
    postPacket() {
        for (const key in this.dirty) {
            this.dirty[key] = false;
        }
        this._animation.dirty = false;
        this._action.dirty = false;
    }
    addPerk(perk) {
        const perkDef = perks_1.Perks.reify(perk);
        if (this.perks.includes(perkDef))
            return;
        this.perks.push(perkDef);
        if ("updateInterval" in perkDef) {
            (this.perkUpdateMap ??= new Map())
                .set(perkDef, this.game.now);
        }
        if (this.hasPerk("hollow_points" /* PerkIds.HollowPoints */) && this.hasPerk("experimental_forcefield" /* PerkIds.ExperimentalForcefield */) && this.hasPerk("thermal_goggles" /* PerkIds.ThermalGoggles */)) {
            this.addPerk("overdrive" /* PerkIds.Overdrive */);
        }
        // ! evil starts here
        // some perks need to perform setup when added
        switch (perkDef.idString) {
            case "costumed" /* PerkIds.Costumed */: {
                const { choices } = perks_1.PerkData["costumed" /* PerkIds.Costumed */];
                this.activeDisguise = obstacles_1.Obstacles.fromString((0, random_1.weightedRandom)(Object.keys(choices), Object.values(choices)));
                this.setDirty();
                break;
            }
            case "plumpkin_bomb" /* PerkIds.PlumpkinBomb */: {
                this.halloweenThrowableSkin = true;
                this.setDirty();
                break;
            }
            case "lycanthropy" /* PerkIds.Lycanthropy */: {
                [this._perkData["Lycanthropy::old_skin"], this.loadout.skin] = [this.loadout.skin, skins_1.Skins.fromString("werewolf")];
                this.setDirty();
                this.action?.cancel();
                const inventory = this.inventory;
                inventory.dropWeapon(0, true)?.destroy();
                inventory.dropWeapon(1, true)?.destroy();
                inventory.dropWeapon(2, true)?.destroy();
                // Drop all throwables
                while (inventory.getWeapon(3)) {
                    inventory.dropWeapon(3, true)?.destroy();
                }
                inventory.lockAllSlots();
                /* TODO: continue crying */
                break;
            }
            case "extended_mags" /* PerkIds.ExtendedMags */: {
                const weapons = this.inventory.weapons;
                const maxWeapons = constants_1.GameConstants.player.maxWeapons;
                for (let i = 0; i < maxWeapons; i++) {
                    const weapon = weapons[i];
                    if (!weapon?.isGun)
                        continue;
                    const def = weapon.definition;
                    if (def.extendedCapacity === undefined)
                        continue;
                    const extra = weapon.ammo - def.extendedCapacity;
                    if (extra > 0) {
                        // firepower is anti-boosting this weapon, we need to shave the extra rounds off
                        weapon.ammo = def.extendedCapacity;
                        this.inventory.giveItem(def.ammoType, extra);
                    }
                }
                break;
            }
            case "combat_expert" /* PerkIds.CombatExpert */: {
                if (this.action?.type === 1 /* PlayerActions.Reload */)
                    this.action?.cancel();
                break;
            }
            case "precision_recycling" /* PerkIds.PrecisionRecycling */: {
                this.bulletTargetHitCount = 0;
                break;
            }
            case "experimental_forcefield" /* PerkIds.ExperimentalForcefield */: {
                if (!this.hadShield) {
                    this.shield = 100;
                }
                else {
                    this._setShieldTimeout();
                }
                break;
            }
            case "overdrive" /* PerkIds.Overdrive */: {
                this.overdriveTimeout?.kill();
                this.overdriveKills = 0;
                break;
            }
        }
        // ! evil ends here
        this.updateAndApplyModifiers();
        this.dirty.perks = true;
    }
    hasPerk(perk) {
        return this.perks.includes(perks_1.Perks.reify(perk));
    }
    removePerk(perk) {
        const perkDef = perks_1.Perks.reify(perk);
        if (!this.perks.includes(perkDef))
            return;
        (0, misc_1.removeFrom)(this.perks, perkDef);
        if (this.hasPerk("overdrive" /* PerkIds.Overdrive */)) {
            this.removePerk("overdrive" /* PerkIds.Overdrive */);
        }
        const perkUpdateMap = this.perkUpdateMap;
        if ("updateInterval" in perkDef && perkUpdateMap !== undefined) {
            perkUpdateMap?.delete(perkDef);
            if (perkUpdateMap?.size === 0) {
                this.perkUpdateMap = undefined;
            }
        }
        // ! evil starts here
        // some perks need to perform cleanup on removal
        switch (perkDef.idString) {
            case "lycanthropy" /* PerkIds.Lycanthropy */: {
                this.loadout.skin = skins_1.Skins.fromStringSafe(this._perkData["Lycanthropy::old_skin"]) ?? skins_1.Skins.fromString("hazel_jumpsuit");
                this.inventory.unlockAllSlots();
                this.setDirty();
                break;
            }
            case "extended_mags" /* PerkIds.ExtendedMags */: {
                const weapons = this.inventory.weapons;
                const maxWeapons = constants_1.GameConstants.player.maxWeapons;
                for (let i = 0; i < maxWeapons; i++) {
                    const weapon = weapons[i];
                    if (!weapon?.isGun)
                        continue;
                    const def = weapon.definition;
                    const extra = weapon.ammo - def.capacity;
                    if (extra > 0) {
                        // firepower boosted this weapon, we need to shave the extra rounds off
                        weapon.ammo = def.capacity;
                        this.inventory.giveItem(def.ammoType, extra);
                    }
                }
                break;
            }
            case "plumpkin_bomb" /* PerkIds.PlumpkinBomb */: {
                this.halloweenThrowableSkin = false;
                this.setDirty();
                break;
            }
            case "costumed" /* PerkIds.Costumed */: {
                this.activeDisguise = undefined;
                this.setDirty();
                break;
            }
            case "combat_expert" /* PerkIds.CombatExpert */: {
                if (this.action?.type === 1 /* PlayerActions.Reload */)
                    this.action?.cancel();
                break;
            }
            case "precision_recycling" /* PerkIds.PrecisionRecycling */: {
                this.bulletTargetHitCount = 0;
                this.targetHitCountExpiration?.kill();
                this.targetHitCountExpiration = undefined;
                break;
            }
            case "infected" /* PerkIds.Infected */: { // evil
                const immunity = perks_1.PerkData["immunity" /* PerkIds.Immunity */];
                this.addPerk(immunity);
                this.immunityTimeout?.kill();
                this.immunityTimeout = this.game.addTimeout(() => this.removePerk(immunity), immunity.duration);
                this.setDirty();
                break;
            }
            case "experimental_forcefield" /* PerkIds.ExperimentalForcefield */: {
                this.hadShield = true;
                this.shield = 0;
                break;
            }
            case "overdrive" /* PerkIds.Overdrive */: {
                this.overdriveTimeout?.kill();
                this.overdriveKills = 0;
                break;
            }
        }
        // ! evil ends here
        this.updateAndApplyModifiers();
        this.dirty.perks = true;
    }
    mapPerk(perk, mapper) {
        const def = perks_1.Perks.reify(perk);
        if (this.perks.includes(def)) {
            return mapper(def);
        }
    }
    mapPerkOrDefault(perk, mapper, defaultValue) {
        const def = perks_1.Perks.reify(perk);
        if (this.perks.includes(def)) {
            return mapper(def);
        }
        return defaultValue;
    }
    updateMapIndicator() {
        const { helmet, vest, backpack } = this.inventory;
        const helmetIndicator = helmet?.mapIndicator;
        const vestIndicator = vest?.mapIndicator;
        const backpackIndicator = backpack.mapIndicator;
        const specialEquipmentCount = [helmetIndicator, vestIndicator, backpackIndicator].filter(i => i !== undefined).length;
        let indicator;
        switch (specialEquipmentCount) {
            case 0:
                break;
            case 1:
                if (helmetIndicator)
                    indicator = helmetIndicator;
                else if (vestIndicator)
                    indicator = vestIndicator;
                else if (backpackIndicator)
                    indicator = backpackIndicator;
                break;
            case 2:
            case 3:
            default:
                indicator = "juggernaut_indicator";
                break;
        }
        if (indicator) {
            if (this.mapIndicator) {
                this.mapIndicator.definition = mapIndicators_1.MapIndicators.fromString(indicator);
                this.mapIndicator.definitionDirty = true;
            }
            else {
                this.mapIndicator = new mapIndicator_1.MapIndicator(this.game, indicator, this.position);
                this.game.mapIndicators.push(this.mapIndicator);
            }
        }
        else if (this.mapIndicator) {
            this.mapIndicator.dead = true;
            this.mapIndicator = undefined;
        }
    }
    spectate(packet) {
        if (!this.dead)
            return;
        const game = this.game;
        if (game.now - this.lastSpectateActionTime < 200)
            return;
        this.lastSpectateActionTime = game.now;
        let toSpectate;
        const { spectatablePlayers } = game;
        switch (packet.spectateAction) {
            case 0 /* SpectateActions.BeginSpectating */: {
                if (this.game.isTeamMode && this._team?.hasLivingPlayers()) {
                    // Find closest teammate
                    toSpectate = this._team.getLivingPlayers()
                        .reduce((a, b) => math_1.Geometry.distanceSquared(a.position, this.position) < math_1.Geometry.distanceSquared(b.position, this.position) ? a : b);
                }
                else if (this.killedBy !== undefined && !this.killedBy.dead) {
                    toSpectate = this.killedBy;
                }
                else if (spectatablePlayers.length > 1) {
                    toSpectate = (0, random_1.pickRandomInArray)(spectatablePlayers);
                }
                break;
            }
            case 1 /* SpectateActions.SpectatePrevious */:
                if (this.spectating !== undefined) {
                    toSpectate = spectatablePlayers[math_1.Numeric.absMod(spectatablePlayers.indexOf(this.spectating) - 1, spectatablePlayers.length)];
                }
                break;
            case 2 /* SpectateActions.SpectateNext */:
                if (this.spectating !== undefined) {
                    toSpectate = spectatablePlayers[math_1.Numeric.absMod(spectatablePlayers.indexOf(this.spectating) + 1, spectatablePlayers.length)];
                }
                break;
            case 3 /* SpectateActions.SpectateSpecific */: {
                toSpectate = spectatablePlayers.find(player => player.id === packet.playerID);
                break;
            }
            case 4 /* SpectateActions.SpectateKillLeader */: {
                toSpectate = game.killLeader;
                break;
            }
            case 5 /* SpectateActions.Report */: {
                if (!this.spectating)
                    return;
                if (this.reportedPlayerIDs.get(this.spectating.id))
                    return;
                this.reportedPlayerIDs.set(this.spectating.id, true);
                const reportID = (0, crypto_1.randomBytes)(4).toString("hex");
                this.sendPacket(reportPacket_1.ReportPacket.create({
                    playerID: this.spectating.id,
                    reportID: reportID
                }));
                // Send the report to the API server
                if (config_1.Config.apiServer) {
                    // SERVER HOSTERS assign your custom server an ID somewhere then pass it into the report body region: region
                    const reportJson = {
                        id: reportID,
                        reporterName: this.name,
                        suspectName: this.spectating.name,
                        suspectIP: this.spectating.ip,
                        reporterIP: this.ip
                    };
                    fetch(`${config_1.Config.apiServer.url}/reports`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "api-key": config_1.Config.apiServer.apiKey },
                        body: JSON.stringify(reportJson)
                    }).then(response => response.json())
                        .then(console.log)
                        .catch((e) => console.error(e));
                }
                // Send the report to Discord
                if (config_1.Config.apiServer?.reportWebhookUrl) {
                    const reportData = {
                        embeds: [
                            {
                                title: "Report Received",
                                description: `Report ID: \`${reportID}\``,
                                color: 16711680,
                                fields: [
                                    {
                                        name: "Username",
                                        value: `\`${this.spectating.name}\``
                                    },
                                    {
                                        name: "Time reported",
                                        value: this.game.now
                                    },
                                    {
                                        name: "Reporter",
                                        value: this.name
                                    }
                                ]
                            }
                        ]
                    };
                    fetch(config_1.Config.apiServer.reportWebhookUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(reportData)
                    }).catch(error => {
                        console.error("Error: ", error);
                    });
                }
            }
        }
        if (toSpectate === undefined)
            return;
        if (this.spectating !== undefined && !this.initializedSpecialSpectatingCase) {
            toSpectate = this.spectating;
            this.initializedSpecialSpectatingCase = true;
        }
        if (this.game.isTeamMode) {
            this.teamID = toSpectate.teamID;
            this.setDirty();
        }
        this.spectating?.spectators.delete(this);
        this.updateObjects = true;
        this.startedSpectating = true;
        this.spectating = toSpectate;
        toSpectate.spectators.add(this);
    }
    disableInvulnerability() {
        if (this.invulnerable) {
            this.invulnerable = false;
            this.setDirty();
        }
    }
    _packets = [];
    sendPacket(packet) {
        this._packets.push(packet);
    }
    disconnect(reason) {
        this.game.removePlayer(this, reason);
    }
    sendData(buffer) {
        try {
            this.socket?.send(buffer, true, false);
        }
        catch (e) {
            console.warn("Error sending packet. Details:", e);
        }
    }
    _clampDamageAmount(amount) {
        if (this.health - amount > this.maxHealth) {
            amount = -(this.maxHealth - this.health);
        }
        if (this.health - amount <= 0) {
            amount = this.health;
        }
        if (this.dead)
            amount = 0;
        return amount;
    }
    heal(amount) {
        this.health += amount;
    }
    damage(params) {
        if (this.invulnerable)
            return;
        const { source, weaponUsed } = params;
        let { amount } = params;
        if (amount < 0) {
            return this.heal(-amount);
        }
        this.game.pluginManager.emit("player_damage", {
            amount,
            player: this,
            source,
            weaponUsed
        });
        if (this.shield <= 0) {
            // Reductions are merged additively
            amount *= 1 - ((this.inventory.helmet?.damageReduction ?? 0) + (this.inventory.vest?.damageReduction ?? 0));
            amount = this._clampDamageAmount(amount);
        }
        this.piercingDamage({
            amount,
            source,
            weaponUsed
        });
    }
    /**
     * Deals damage whilst ignoring protective modifiers but not invulnerability
     */
    piercingDamage(params) {
        const { source, weaponUsed } = params;
        let { amount } = params;
        if (this.invulnerable
            || (this.game.isTeamMode
                && source instanceof Player
                && source.teamID === this.teamID
                && source.id !== this.id
                && !this.disconnected
                && amount > 0))
            return;
        if (amount < 0) {
            return this.heal(-amount);
        }
        if (this.shield <= 0) {
            amount = this._clampDamageAmount(amount);
        }
        if (this.game.pluginManager.emit("player_will_piercing_damaged", {
            player: this,
            amount,
            source,
            weaponUsed
        }))
            return;
        this.canDespawn = false;
        const canTrackStats = weaponUsed instanceof inventoryItem_1.InventoryItemBase;
        const attributes = canTrackStats ? weaponUsed.definition.wearerAttributes?.on : undefined;
        const sourceIsPlayer = source instanceof Player;
        const applyPlayerFX = sourceIsPlayer
            ? (modifiers) => {
                source.health += modifiers.healthRestored ?? 0;
                source.adrenaline += modifiers.adrenalineRestored ?? 0;
            }
            : () => { };
        let statsChanged = false;
        const oldStats = canTrackStats ? { ...weaponUsed.stats } : undefined;
        // Decrease health; update damage done and damage taken
        if (this.shield <= 0) {
            this.health -= amount;
        }
        else {
            const initialShield = this.shield;
            this.shield -= amount;
            // If the shield broke, account for remaining damage
            const remainingDamage = amount - initialShield;
            if (remainingDamage > 0) {
                this.damage({ ...params, amount: remainingDamage });
            }
        }
        if (amount > 0) {
            this.damageTaken += amount;
            if (canTrackStats && !this.dead) {
                const damageDealt = weaponUsed.stats.damage += amount;
                statsChanged = true;
                if (sourceIsPlayer) {
                    for (const entry of attributes?.damageDealt ?? []) {
                        if (damageDealt >= (entry.limit ?? Infinity))
                            continue;
                        applyPlayerFX(entry);
                    }
                }
            }
            if (sourceIsPlayer) {
                if (source !== this) {
                    source.damageDone += amount;
                }
            }
        }
        this.game.pluginManager.emit("player_did_piercing_damaged", {
            player: this,
            amount,
            source,
            weaponUsed
        });
        if (this.health <= 0 && !this.dead) {
            if (this.game.isTeamMode
                && this._team?.players.some(p => !p.dead && !p.downed && !p.disconnected && p !== this)
                && !this.downed) {
                this.down(source, weaponUsed);
            }
            else {
                if (canTrackStats) {
                    const kills = ++weaponUsed.stats.kills;
                    statsChanged = true;
                    if (sourceIsPlayer) {
                        for (const entry of attributes?.kill ?? []) {
                            if (kills >= (entry.limit ?? Infinity))
                                continue;
                            applyPlayerFX(entry);
                        }
                    }
                }
                this.die(params);
            }
        }
        if (statsChanged && canTrackStats) {
            this.game.pluginManager.emit("inv_item_stats_changed", {
                item: weaponUsed,
                // canTrackStats ensures this object's existence
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                oldStats: oldStats,
                newStats: { ...weaponUsed.stats },
                diff: {
                    kills: oldStats?.kills !== weaponUsed.stats.kills,
                    damage: oldStats?.damage !== weaponUsed.stats.damage
                }
            });
        }
        this.updateAndApplyModifiers();
        if (sourceIsPlayer)
            source.updateAndApplyModifiers();
    }
    _calculateModifiers() {
        const newModifiers = constants_1.GameConstants.player.defaultModifiers();
        const eventMods = {
            kill: [],
            damageDealt: []
        };
        const maxWeapons = constants_1.GameConstants.player.maxWeapons;
        for (let i = 0; i < maxWeapons; i++) {
            const weapon = this.inventory.getWeapon(i);
            if (weapon === undefined)
                continue;
            const modifiers = weapon.modifiers;
            newModifiers.maxAdrenaline *= modifiers.maxAdrenaline;
            newModifiers.maxHealth *= modifiers.maxHealth;
            newModifiers.baseSpeed *= modifiers.baseSpeed;
            newModifiers.size *= modifiers.size;
            newModifiers.adrenDrain *= modifiers.adrenDrain;
            newModifiers.minAdrenaline += modifiers.minAdrenaline;
            newModifiers.hpRegen += modifiers.hpRegen;
        }
        // ! evil starts here
        for (const perk of this.perks) {
            switch (perk.idString) {
                case "plumpkin_gamble" /* PerkIds.PlumpkinGamble */: { // AW DANG IT
                    this.removePerk(perk);
                    const halloweenPerks = perks_1.Perks.definitions.filter(perkDef => !perkDef.plumpkinGambleIgnore && perkDef.category === 1 /* PerkCategories.Halloween */);
                    this.addPerk((0, random_1.pickRandomInArray)(halloweenPerks));
                    break;
                }
                case "lycanthropy" /* PerkIds.Lycanthropy */: {
                    newModifiers.baseSpeed *= perk.speedMod;
                    newModifiers.maxHealth *= perk.healthMod;
                    newModifiers.hpRegen += perk.regenRate;
                    break;
                }
                case "second_wind" /* PerkIds.SecondWind */: {
                    newModifiers.baseSpeed *= this._health / this._maxHealth < 0.5 ? perk.speedMod : 1;
                    break;
                }
                case "experimental_treatment" /* PerkIds.ExperimentalTreatment */: {
                    newModifiers.adrenDrain *= perk.adrenDecay;
                    newModifiers.minAdrenaline += perk.adrenSet * newModifiers.maxAdrenaline * constants_1.GameConstants.player.maxAdrenaline;
                    newModifiers.maxHealth *= perk.healthMod;
                    break;
                }
                case "engorged" /* PerkIds.Engorged */: {
                    const base = newModifiers.maxHealth * constants_1.GameConstants.player.defaultHealth;
                    eventMods.kill.push({
                        maxHealth: (base + perk.healthMod) / base,
                        sizeMod: perk.sizeMod
                    });
                    break;
                }
                case "berserker" /* PerkIds.Berserker */: {
                    if (this.activeItem.isMelee) {
                        newModifiers.baseSpeed *= perk.speedMod;
                    }
                    break;
                }
                case "low_profile" /* PerkIds.LowProfile */: {
                    newModifiers.size *= perk.sizeMod;
                    break;
                }
                case "infected" /* PerkIds.Infected */: {
                    newModifiers.baseSpeed *= perk.speedMod;
                    newModifiers.maxHealth *= perk.healthMod;
                    newModifiers.adrenDrain *= perk.adrenDrainMod;
                    break;
                }
                case "experimental_forcefield" /* PerkIds.ExperimentalForcefield */: {
                    newModifiers.shieldRegen += perk.shieldRegenRate;
                    break;
                }
                case "overdrive" /* PerkIds.Overdrive */: {
                    newModifiers.size *= perk.sizeMod;
                    /* if (this.overdriveTimeout !== undefined) break;
                    this.overdriveTimeout = this.game.addTimeout(() => {
                        this.overdriveKills = 0;
                    }, perk.achieveTime); */
                    break;
                }
            }
        }
        // ! evil ends here
        const applyModifiers = (modifiers) => {
            newModifiers.maxHealth *= modifiers.maxHealth ?? 1;
            newModifiers.maxAdrenaline *= modifiers.maxAdrenaline ?? 1;
            newModifiers.baseSpeed *= modifiers.speedBoost ?? 1;
            newModifiers.size *= modifiers.sizeMod ?? 1;
            newModifiers.adrenDrain *= modifiers.adrenDrain ?? 1;
            newModifiers.minAdrenaline += modifiers.minAdrenaline ?? 0;
            newModifiers.hpRegen += modifiers.hpRegen ?? 0;
        };
        for (const [modifiers, count] of [
            [eventMods.kill, this._kills],
            [eventMods.damageDealt, this.damageDone]
        ]) {
            for (const entry of modifiers) {
                const limit = math_1.Numeric.min(entry.limit ?? Infinity, count);
                // don't honor healthRestored and adrenalineRestored here (handled in Player#die method)
                for (let i = 0; i < limit; i++) {
                    applyModifiers(entry);
                }
            }
        }
        return newModifiers;
    }
    updateAndApplyModifiers() {
        const { maxHealth, maxAdrenaline, minAdrenaline, maxShield, size } = this._modifiers = this._calculateModifiers();
        this.maxHealth = constants_1.GameConstants.player.defaultHealth * maxHealth;
        this.maxAdrenaline = constants_1.GameConstants.player.maxAdrenaline * maxAdrenaline;
        this.maxShield = constants_1.GameConstants.player.maxShield * maxShield;
        this.minAdrenaline = minAdrenaline;
        this.sizeMod = size;
    }
    updateBackEquippedMelee() {
        const old = this.backEquippedMelee?.idString;
        this.backEquippedMelee = this.inventory.weapons.find(w => {
            return w
                && w.definition.defType === objectDefinitions_1.DefinitionType.Melee
                && w.definition.onBack
                && w !== this.activeItem;
        })?.definition;
        if (old !== this.backEquippedMelee?.idString) {
            this.setDirty();
        }
    }
    static _itemToDamageSource(item) {
        if (item instanceof explosion_1.Explosion)
            return killPacket_1.DamageSources.Explosion;
        else if (item instanceof obstacle_1.Obstacle)
            return killPacket_1.DamageSources.Obstacle;
        else if (item.isGun)
            return killPacket_1.DamageSources.Gun;
        else if (item.isMelee)
            return killPacket_1.DamageSources.Melee;
        else /* if (item.isThrowable) */
            return killPacket_1.DamageSources.Throwable;
    }
    // dies of death
    die(params) {
        if (this.health > 0 || this.dead)
            return;
        this.game.pluginManager.emit("player_will_die", {
            player: this,
            ...params
        });
        const { source, weaponUsed } = params;
        this.health = 0;
        this.dead = true;
        const wasDowned = this.downed;
        this.downed = false;
        this.canDespawn = false;
        this._team?.setDirty();
        if (this.mapIndicator)
            this.mapIndicator.dead = true;
        const action = this.beingRevivedBy?.action;
        if (action instanceof action_1.ReviveAction) {
            action.cancel();
        }
        const packet = killPacket_1.KillPacket.create();
        packet.victimId = this.id;
        packet.downed = wasDowned;
        packet.killed = true;
        if (weaponUsed) {
            packet.weaponUsed = weaponUsed.definition;
            packet.damageSource = Player._itemToDamageSource(weaponUsed);
        }
        const downedBy = this.downedBy?.player;
        if (source === killPacket_1.DamageSources.Gas
            || source === killPacket_1.DamageSources.Obstacle
            || source === killPacket_1.DamageSources.BleedOut
            || source === killPacket_1.DamageSources.FinallyKilled) {
            packet.damageSource = source;
            if (downedBy !== undefined) {
                packet.creditedId = downedBy.id;
                if (downedBy !== this)
                    packet.kills = ++downedBy.kills;
            }
            if (this.game.mode.weaponSwap && downedBy !== undefined) {
                if (weaponUsed instanceof explosion_1.Explosion) {
                    downedBy.swapWeaponRandomly(weaponUsed.weapon, true);
                }
                else if (!(weaponUsed instanceof obstacle_1.Obstacle)) {
                    downedBy.swapWeaponRandomly(weaponUsed, true);
                }
            }
        }
        else if (source instanceof Player && source !== this) {
            this.killedBy = source;
            packet.attackerId = source.id;
            // Give kill credit to the player who downed if they're on the same team as the killer.
            // Otherwise, the killer always gets credit.
            if (downedBy && downedBy.teamID === source.teamID) {
                packet.creditedId = downedBy.id;
                packet.kills = ++downedBy.kills;
            }
            else {
                packet.kills = ++source.kills;
            }
            // Killstreak credit always goes to the killer regardless of the above.
            if (weaponUsed !== undefined
                && weaponUsed.definition.defType !== objectDefinitions_1.DefinitionType.Explosion
                && weaponUsed instanceof inventoryItem_1.InventoryItemBase) {
                packet.killstreak = weaponUsed.stats.kills;
            }
            // Apply perk effects. Perk effects are also always applied to the killer.
            for (const perk of source.perks) {
                switch (perk.idString) {
                    case "baby_plumpkin_pie" /* PerkIds.BabyPlumpkinPie */: {
                        source.swapWeaponRandomly(undefined, true);
                        break;
                    }
                    case "engorged" /* PerkIds.Engorged */: {
                        if (source.kills <= perk.killsLimit) {
                            source.sizeMod *= perk.sizeMod;
                            source.maxHealth *= perk.healthMod;
                            source.updateAndApplyModifiers();
                        }
                        break;
                    }
                    case "bloodthirst" /* PerkIds.Bloodthirst */: {
                        if (source.activeBloodthirstEffect)
                            break;
                        source.activeBloodthirstEffect = true;
                        source.health += perk.healBonus;
                        source.adrenaline += perk.adrenalineBonus;
                        source.baseSpeed *= perk.speedMod;
                        this.game.addTimeout(() => {
                            source.baseSpeed /= perk.speedMod;
                            source.activeBloodthirstEffect = false;
                        }, perk.speedBoostDuration);
                        break;
                    }
                    case "overdrive" /* PerkIds.Overdrive */: {
                        if (source.activeOverdrive || !source.canUseOverdrive)
                            break;
                        if (source.overdriveKills++ >= perk.requiredKills) {
                            source.overdriveKills = 0;
                            source.health += perk.healBonus;
                            source.adrenaline += perk.adrenalineBonus;
                            source.baseSpeed *= perk.speedMod;
                            source.canUseOverdrive = false;
                            source.activeOverdrive = true;
                            source.setDirty();
                            this.game.addTimeout(() => {
                                source.baseSpeed /= perk.speedMod;
                                source.activeOverdrive = false;
                                source.setDirty();
                                this.overdriveCooldown?.kill();
                                this.overdriveCooldown = this.game.addTimeout(() => {
                                    source.canUseOverdrive = true;
                                }, perk.cooldown);
                            }, perk.speedBoostDuration);
                        }
                        break;
                    }
                }
            }
            // Weapon swap
            if (this.game.mode.weaponSwap) {
                if (weaponUsed instanceof explosion_1.Explosion) {
                    source.swapWeaponRandomly(weaponUsed.weapon, true);
                }
                else if (!(weaponUsed instanceof obstacle_1.Obstacle)) {
                    source.swapWeaponRandomly(weaponUsed, true);
                }
            }
            source.updateAndApplyModifiers();
        }
        this.game.packets.push(packet);
        // Reset movement and attacking variables
        this.movement.up = this.movement.down = this.movement.left = this.movement.right = false;
        this.startedAttacking = false;
        this.attacking = false;
        this.stoppedAttacking = false;
        this.game.aliveCountDirty = true;
        this.adrenaline = 0;
        this.dirty.items = true;
        this.action?.cancel();
        this.sendEmote(this.loadout.emotes[7], true);
        this.game.livingPlayers.delete(this);
        this.game.updateGameData({ aliveCount: this.game.aliveCount });
        this.game.fullDirtyObjects.add(this);
        (0, misc_1.removeFrom)(this.game.spectatablePlayers, this);
        if (this.activeItem.isThrowable) {
            this.activeItem.stopUse();
        }
        this.teamWipe();
        //
        // Drop loot
        //
        const { position, layer } = this;
        // Drop weapons
        this.inventory.unlockAllSlots();
        this.inventory.dropWeapons();
        // Drop inventory items
        for (const item in this.inventory.items.asRecord()) {
            const count = this.inventory.items.getItem(item);
            const def = loots_1.Loots.fromString(item);
            if (count > 0) {
                if (def.noDrop || ("ephemeral" in def && def.ephemeral))
                    continue;
                if (def.defType === objectDefinitions_1.DefinitionType.Ammo && count !== Infinity) {
                    let left = count;
                    let subtractAmount = 0;
                    do {
                        left -= subtractAmount = math_1.Numeric.min(left, def.maxStackSize);
                        this.game.addLoot(item, position, layer, { count: subtractAmount });
                    } while (left > 0);
                    continue;
                }
                this.game.addLoot(item, position, layer, { count });
                this.inventory.items.setItem(item, 0);
            }
        }
        // Drop equipment
        for (const itemType of ["helmet", "vest", "backpack"]) {
            const item = this.inventory[itemType];
            if (item && !item.noDrop) {
                this.game.addLoot(item, position, layer);
            }
        }
        this.inventory.helmet = this.inventory.vest = undefined;
        // Drop skin
        const { skin } = this.loadout;
        if (skin.hideFromLoadout && !skin.noDrop) {
            this.game.addLoot(skin, position, layer);
        }
        // Drop perks
        for (const perk of this.perks) {
            if (!perk.noDrop) {
                this.game.addLoot(perk, position, layer);
            }
            else if (perk.noDrop && perk.category === 1 /* PerkCategories.Halloween */) {
                this.game.addLoot("plumpkin_gamble" /* PerkIds.PlumpkinGamble */, position, layer);
            }
        }
        // Disguise funnies
        if (this.activeDisguise !== undefined) {
            const disguiseObstacle = this.game.map.generateObstacle(this.activeDisguise?.idString, this.position, { layer: this.layer });
            const disguiseDef = obstacles_1.Obstacles.reify(this.activeDisguise);
            if (disguiseObstacle !== undefined) {
                this.game.addTimeout(() => {
                    disguiseObstacle.damage({
                        amount: disguiseObstacle.health
                    });
                }, 10); // small delay so sound plays
            }
            if (disguiseDef.explosion) {
                this.game.addExplosion(disguiseDef.explosion, this.position, this, this.layer);
            }
        }
        // Create death marker
        this.game.grid.addObject(new deathMarker_1.DeathMarker(this, layer));
        // remove all c4s
        for (const c4 of this.c4s) {
            c4.damage({ amount: Infinity });
        }
        if (this.mapIndicator) {
            this.mapIndicator.dead = true;
        }
        if (!this.disconnected) {
            this.sendGameOverPacket();
        }
        // Remove player from kill leader
        if (this === this.game.killLeader) {
            this.game.findNewKillLeader();
        }
        this.game.pluginManager.emit("player_did_die", {
            player: this,
            ...params
        });
    }
    teamWipe() {
        let team;
        let players;
        if ((players = (team = this._team)?.players)?.every(p => p.dead || p.disconnected || p.downed)) {
            for (const player of players) {
                if (player === this)
                    continue;
                player.health = 0;
                player.die({
                    source: killPacket_1.DamageSources.FinallyKilled
                });
            }
            // team can't be nullish here because if it were, it would fail the conditional this code is wrapped in
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.game.teams.delete(team);
        }
    }
    down(source, weaponUsed) {
        const packet = killPacket_1.KillPacket.create();
        packet.victimId = this.id;
        packet.downed = true;
        packet.killed = false;
        if (source instanceof Player) {
            this.downedBy = {
                player: source,
                item: weaponUsed instanceof inventoryItem_1.InventoryItemBase ? weaponUsed : undefined
            };
            if (weaponUsed) {
                packet.weaponUsed = weaponUsed.definition;
                packet.damageSource = Player._itemToDamageSource(weaponUsed);
            }
            if (source !== this) {
                packet.attackerId = source.id;
            }
        }
        else if (source === killPacket_1.DamageSources.Obstacle) {
            packet.weaponUsed = weaponUsed?.definition;
            packet.damageSource = source;
        }
        else if (source === killPacket_1.DamageSources.Gas) {
            packet.damageSource = source;
        }
        this.game.packets.push(packet);
        this.canDespawn = false;
        this.downed = true;
        this.action?.cancel();
        this.activeItem.stopUse();
        this.health = 100;
        this.adrenaline = this.minAdrenaline;
        this.setDirty();
        this._team?.setDirty();
    }
    revive() {
        this.downed = false;
        this.beingRevivedBy = undefined;
        this.downedBy = undefined;
        this.health = 30;
        this.setDirty();
        this._team?.setDirty();
    }
    canInteract(player) {
        return !player.downed
            && this.downed
            && !this.beingRevivedBy
            && this !== player
            && this.teamID === player.teamID
            && (0, layer_1.adjacentOrEqualLayer)(this.layer, player.layer);
    }
    interact(reviver) {
        this.beingRevivedBy = reviver;
        this.setDirty();
        reviver.animation = 8 /* AnimationType.Revive */;
        reviver.executeAction(new action_1.ReviveAction(reviver, this));
    }
    sendGameOverPacket(won = false) {
        const teammates = (this.team && this.spectating === undefined
            ? this.team.players
            : [this]).map(player => ({
            playerID: player.id,
            kills: player.kills,
            damageDone: player.damageDone,
            damageTaken: player.damageTaken,
            alive: !player.dead,
            timeAlive: (player.game.now - player.joinTime) / 1000
        }));
        const packet = gameOverPacket_1.GameOverPacket.create({
            rank: won ? 1 : this.game.aliveCount + 1,
            teammates
        });
        this.sendPacket(packet);
        for (const spectator of this.spectators) {
            spectator.sendPacket(packet);
        }
    }
    processInputs(packet) {
        this.movement = {
            ...packet.movement,
            ...(packet.isMobile ? packet.mobile : { moving: false, angle: 0 })
        };
        this._pingSeq = packet.pingSeq;
        const wasAttacking = this.attacking;
        const isAttacking = packet.attacking;
        this.attacking = isAttacking;
        this.startedAttacking ||= !wasAttacking && isAttacking;
        this.stoppedAttacking ||= wasAttacking && !isAttacking;
        if (this.turning = packet.turning) {
            this.rotation = packet.rotation;
            this.distanceToMouse = packet.distanceToMouse;
        }
        const inventory = this.inventory;
        for (const action of packet.actions) {
            const type = action.type;
            switch (type) {
                case 11 /* InputActions.UseItem */: {
                    inventory.useItem(action.item);
                    break;
                }
                case 1 /* InputActions.EquipLastItem */:
                case 0 /* InputActions.EquipItem */: {
                    const target = type === 0 /* InputActions.EquipItem */
                        ? action.slot
                        : inventory.lastWeaponIndex;
                    // If a user is reloading the gun in slot 2, then we don't cancel the reload if they "switch" to slot 2
                    if (this.action?.type !== 1 /* PlayerActions.Reload */ || (target !== this.activeItemIndex && inventory.hasWeapon(target))) {
                        this.action?.cancel();
                    }
                    inventory.setActiveWeaponIndex(target);
                    break;
                }
                case 2 /* InputActions.DropWeapon */: {
                    this.action?.cancel();
                    inventory.dropWeapon(action.slot)?.destroy();
                    break;
                }
                case 3 /* InputActions.DropItem */: {
                    if (!this.game.isTeamMode && action.item.defType !== objectDefinitions_1.DefinitionType.Perk)
                        break;
                    this.action?.cancel();
                    inventory.dropItem(action.item);
                    break;
                }
                case 4 /* InputActions.SwapGunSlots */: {
                    inventory.swapGunSlots();
                    break;
                }
                case 5 /* InputActions.LockSlot */: {
                    inventory.lock(action.slot);
                    break;
                }
                case 6 /* InputActions.UnlockSlot */: {
                    if (this.hasPerk("lycanthropy" /* PerkIds.Lycanthropy */))
                        break;
                    inventory.unlock(action.slot);
                    break;
                }
                case 7 /* InputActions.ToggleSlotLock */: {
                    const slot = action.slot;
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    inventory.isLocked(slot)
                        ? (this.hasPerk("lycanthropy" /* PerkIds.Lycanthropy */) || inventory.unlock(slot))
                        : inventory.lock(slot);
                    break;
                }
                case 14 /* InputActions.Loot */:
                case 8 /* InputActions.Interact */: {
                    const interactable = {
                        object: undefined,
                        dist: Number.MAX_VALUE
                    };
                    const uninteractable = {
                        object: undefined,
                        dist: Number.MAX_VALUE
                    };
                    const detectionHitbox = new hitbox_1.CircleHitbox(3 * this._sizeMod, this.position);
                    const nearObjects = this.game.grid.intersectsHitbox(detectionHitbox, this.layer);
                    for (const object of nearObjects) {
                        const { isLoot, isObstacle, isPlayer } = object;
                        const isInteractable = (isLoot || isObstacle || isPlayer) && object.canInteract(this) === true;
                        if ((isLoot || (type === 8 /* InputActions.Interact */ && isInteractable))
                            && object.hitbox?.collidesWith(detectionHitbox)
                            && !(isLoot && [objectDefinitions_1.DefinitionType.Throwable, objectDefinitions_1.DefinitionType.Gun].includes(object.definition.defType) && this.hasPerk("lycanthropy" /* PerkIds.Lycanthropy */))) {
                            const dist = math_1.Geometry.distanceSquared(object.position, this.position);
                            if (isInteractable) {
                                if (dist < interactable.dist) {
                                    interactable.dist = dist;
                                    interactable.object = object;
                                }
                            }
                            else if (isLoot && dist < uninteractable.dist) {
                                uninteractable.dist = dist;
                                uninteractable.object = object;
                            }
                        }
                    }
                    if (interactable.object) {
                        interactable.object.interact(this);
                        if (interactable.object.isObstacle && interactable.object.isDoor) {
                            // If the closest object is a door, interact with other doors within range
                            for (const object of nearObjects) {
                                if (object.isObstacle
                                    && object.isDoor
                                    && !object.door?.locked
                                    && object !== interactable.object
                                    && object.hitbox.collidesWith(detectionHitbox)) {
                                    object.interact(this);
                                }
                            }
                        }
                    }
                    else {
                        uninteractable.object?.interact(this, uninteractable.object.canInteract(this));
                    }
                    this.canDespawn = false;
                    this.disableInvulnerability();
                    break;
                }
                case 9 /* InputActions.Reload */:
                    if (this.activeItem.isGun) {
                        this.activeItem.reload();
                    }
                    break;
                case 10 /* InputActions.Cancel */:
                    this.action?.cancel();
                    break;
                case 12 /* InputActions.Emote */:
                    {
                        let isValid = false;
                        for (const definitionList of [emotes_1.Emotes, ammos_1.Ammos, healingItems_1.HealingItems, guns_1.Guns, melees_1.Melees, throwables_1.Throwables]) {
                            if (this.game.isTeamMode && definitionList.hasString(action.emote.idString)) {
                                isValid = true;
                                break;
                            }
                        }
                        this.sendEmote(action.emote, isValid);
                    }
                    break;
                case 13 /* InputActions.MapPing */:
                    this.sendMapPing(action.ping, action.position);
                    break;
                case 15 /* InputActions.ExplodeC4 */:
                    for (const c4 of this.c4s) {
                        if (c4.activateC4())
                            this.c4s.delete(c4);
                    }
                    this.dirty.activeC4s = true;
                    break;
            }
        }
        this.game.pluginManager.emit("player_input", {
            player: this,
            packet
        });
    }
    executeAction(action) {
        if (this.downed)
            return;
        this.action?.cancel();
        this.action = action;
    }
    get data() {
        const data = {
            position: this.position,
            rotation: this.rotation,
            full: {
                layer: this.layer,
                dead: this.dead,
                downed: this.downed,
                beingRevived: !!this.beingRevivedBy,
                teamID: this.teamID ?? 0,
                invulnerable: this.invulnerable,
                activeItem: this.activeItem.definition,
                skin: this.loadout.skin,
                helmet: this.inventory.helmet,
                vest: this.inventory.vest,
                backpack: this.inventory.backpack,
                halloweenThrowableSkin: this.halloweenThrowableSkin,
                activeDisguise: this.activeDisguise,
                infected: this.hasPerk("infected" /* PerkIds.Infected */),
                backEquippedMelee: this.backEquippedMelee,
                hasBubble: this.hasBubble,
                activeOverdrive: this.activeOverdrive
            }
        };
        if (this.dirty.size) {
            data.full.sizeMod = this._sizeMod;
        }
        if (this._animation.dirty) {
            data.animation = this.animation;
        }
        if (this._action.dirty) {
            data.action = this.action instanceof action_1.HealingAction
                ? { type: 2 /* PlayerActions.UseItem */, item: this.action.item }
                : { type: (this.action?.type ?? 0 /* PlayerActions.None */) };
        }
        return data;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map