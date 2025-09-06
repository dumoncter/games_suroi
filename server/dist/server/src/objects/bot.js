"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = exports.ItemPriority = exports.BotState = exports.BotBehavior = exports.BotDifficulty = void 0;
const constants_1 = require("../../../common/src/constants");
const skins_1 = require("../../../common/src/definitions/items/skins");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const math_1 = require("../../../common/src/utils/math");
const vector_1 = require("../../../common/src/utils/vector");
const player_1 = require("./player");
var BotDifficulty;
(function (BotDifficulty) {
    BotDifficulty["EASY"] = "easy";
    BotDifficulty["MEDIUM"] = "medium";
    BotDifficulty["HARD"] = "hard";
    BotDifficulty["EXPERT"] = "expert";
})(BotDifficulty || (exports.BotDifficulty = BotDifficulty = {}));
var BotBehavior;
(function (BotBehavior) {
    BotBehavior["AGGRESSIVE"] = "aggressive";
    BotBehavior["DEFENSIVE"] = "defensive";
    BotBehavior["STRATEGIC"] = "strategic";
    BotBehavior["SURVIVAL"] = "survival";
})(BotBehavior || (exports.BotBehavior = BotBehavior = {}));
var BotState;
(function (BotState) {
    BotState["EXPLORING"] = "exploring";
    BotState["HUNTING"] = "hunting";
    BotState["LOOTING"] = "looting";
    BotState["FLEEING"] = "fleeing";
    BotState["UPGRADING"] = "upgrading";
    BotState["INTERACTING"] = "interacting";
})(BotState || (exports.BotState = BotState = {}));
var ItemPriority;
(function (ItemPriority) {
    ItemPriority[ItemPriority["CRITICAL"] = 5] = "CRITICAL";
    ItemPriority[ItemPriority["HIGH"] = 4] = "HIGH";
    ItemPriority[ItemPriority["MEDIUM"] = 3] = "MEDIUM";
    ItemPriority[ItemPriority["LOW"] = 2] = "LOW";
    ItemPriority[ItemPriority["USELESS"] = 1] = "USELESS"; // Хлам
})(ItemPriority || (exports.ItemPriority = ItemPriority = {}));
class Bot extends player_1.Player {
    isBot = true;
    config;
    // Advanced AI State
    currentState = BotState.EXPLORING;
    currentTarget;
    lastActionTime = 0;
    actionCooldown = 50; // ms between actions (faster decisions)
    // Navigation
    currentPath = [];
    currentPathIndex = 0;
    lastPosition = (0, vector_1.Vec)(0, 0);
    stuckTime = 0;
    // Memory System
    knownLootLocations = new Map();
    knownEnemyLocations = new Map();
    exploredAreas = new Set();
    dangerZones = new Map(); // position -> danger level
    // Goals and Priorities
    currentGoal;
    inventoryNeeds = {
        weapons: true, ammo: true, healing: true, armor: true
    };
    // Combat and target tracking
    lastTargetCheck = 0;
    targetCheckInterval = 2000; // Check for new targets every 2 seconds
    combatMode = false;
    // Bot stats based on difficulty
    reactionTime;
    accuracy;
    movementSpeed;
    decisionMaking;
    constructor(game, position, config) {
        // Create mock socket data for bot
        const mockSocketData = {
            ip: "127.0.0.1",
            teamID: config.teamID?.toString(),
            autoFill: false,
            role: undefined,
            isDev: false,
            nameColor: undefined,
            lobbyClearing: false,
            weaponPreset: ""
        };
        super(game, undefined, position, undefined, undefined);
        this.config = config;
        this.name = config.name;
        // Set bot stats based on difficulty
        switch (config.difficulty) {
            case BotDifficulty.EASY:
                this.reactionTime = 800;
                this.accuracy = 0.3;
                this.movementSpeed = 0.8;
                this.decisionMaking = 0.4;
                break;
            case BotDifficulty.MEDIUM:
                this.reactionTime = 600;
                this.accuracy = 0.5;
                this.movementSpeed = 0.9;
                this.decisionMaking = 0.6;
                break;
            case BotDifficulty.HARD:
                this.reactionTime = 400;
                this.accuracy = 0.7;
                this.movementSpeed = 1.0;
                this.decisionMaking = 0.8;
                break;
            case BotDifficulty.EXPERT:
                this.reactionTime = 200;
                this.accuracy = 0.9;
                this.movementSpeed = 1.1;
                this.decisionMaking = 1.0;
                break;
        }
        // Initialize bot
        this.initializeBot();
    }
    initializeBot() {
        // Set basic loadout
        const defaultSkin = skins_1.Skins.fromStringSafe(constants_1.GameConstants.player.defaultSkin);
        if (defaultSkin) {
            this.loadout.skin = defaultSkin;
        }
        // Add basic health
        this.health = this.maxHealth;
        this.joined = true;
        // Add to game
        this.game.livingPlayers.add(this);
        this.game.connectedPlayers.add(this);
        this.game.grid.addObject(this);
        this.setDirty();
        this.game.aliveCountDirty = true;
        this.game.updateObjects = true;
        console.log(`Bot ${this.name} joined the game`);
    }
    update() {
        super.update();
        const now = this.game.now;
        if (now - this.lastActionTime < this.actionCooldown) {
            return;
        }
        this.lastActionTime = now;
        this.updateAI();
    }
    updateAI() {
        if (this.dead)
            return;
        const now = this.game.now;
        // Clear old inputs
        this.movement.up = false;
        this.movement.down = false;
        this.movement.left = false;
        this.movement.right = false;
        this.attacking = false;
        // Update memory and surroundings
        this.updateMemory();
        this.checkStuck();
        // Periodic target checking - be aggressive!
        if (now - this.lastTargetCheck > this.targetCheckInterval) {
            this.lastTargetCheck = now;
            this.checkForBetterTargets();
        }
        // Gas avoidance has highest priority
        if (this.shouldAvoidGas()) {
            this.currentState = BotState.FLEEING;
            this.avoidGas();
            return;
        }
        // Evaluate situation and set goals
        this.evaluateSituation();
        // Execute current goal based on state
        switch (this.currentState) {
            case BotState.EXPLORING:
                this.executeExploration();
                break;
            case BotState.LOOTING:
                this.executeLooting();
                break;
            case BotState.HUNTING:
                this.executeHunting();
                break;
            case BotState.FLEEING:
                this.executeFleeing();
                break;
            case BotState.UPGRADING:
                this.executeUpgrading();
                break;
            case BotState.INTERACTING:
                this.executeInteracting();
                break;
        }
        // Update explored areas
        this.updateExploredAreas();
    }
    shouldAvoidGas() {
        // Check if currently in gas
        if (this.game.gas.isInGas(this.position)) {
            return true;
        }
        // Check if bot will be in gas soon (predictive behavior)
        const currentRadius = this.game.gas.currentRadius;
        const newRadius = this.game.gas.newRadius;
        const distanceToCenter = math_1.Geometry.distance(this.position, this.game.gas.currentPosition);
        // If gas is shrinking and we're close to the edge, start moving to center
        if (newRadius < currentRadius && distanceToCenter > newRadius * 0.7) {
            return true;
        }
        // Always stay in safe zone with margin
        return distanceToCenter > currentRadius * 0.85;
    }
    updateMemory() {
        const now = this.game.now;
        // Update known loot locations
        for (const loot of this.game.grid.pool.getCategory(constants_1.ObjectCategory.Loot)) {
            if (loot.dead)
                continue;
            const key = `${Math.floor(loot.position.x / 10)}_${Math.floor(loot.position.y / 10)}`;
            const priority = this.evaluateItemPriority(loot);
            if (priority >= ItemPriority.LOW) {
                this.knownLootLocations.set(key, {
                    position: vector_1.Vec.clone(loot.position),
                    item: loot,
                    priority,
                    lastSeen: now
                });
            }
        }
        // Update known enemy locations
        for (const player of this.game.livingPlayers) {
            if (player === this || player.dead)
                continue;
            const key = `enemy_${player.id}`;
            this.knownEnemyLocations.set(key, {
                position: vector_1.Vec.clone(player.position),
                player,
                lastSeen: now
            });
        }
        // Clean old memory (older than 30 seconds)
        for (const [key, data] of this.knownLootLocations) {
            if (now - data.lastSeen > 30000) {
                this.knownLootLocations.delete(key);
            }
        }
        for (const [key, data] of this.knownEnemyLocations) {
            if (now - data.lastSeen > 30000) {
                this.knownEnemyLocations.delete(key);
            }
        }
    }
    evaluateItemPriority(item) {
        const itemId = item.definition.idString;
        // Weapons
        if (itemId.includes("ak47") || itemId.includes("scar") || itemId.includes("m4a1")) {
            return ItemPriority.CRITICAL;
        }
        if (itemId.includes("mp5") || itemId.includes("ump") || itemId.includes("vector")) {
            return ItemPriority.HIGH;
        }
        if (itemId.includes("ak47") || itemId.includes("mosin") || itemId.includes("m870")) {
            return ItemPriority.MEDIUM;
        }
        if (itemId.includes("glock") || itemId.includes("m9") || itemId.includes("mosin")) {
            return ItemPriority.LOW;
        }
        // Healing
        if (itemId.includes("cola") || itemId.includes("meds")) {
            return ItemPriority.HIGH;
        }
        if (itemId.includes("soda") || itemId.includes("painkillers")) {
            return ItemPriority.MEDIUM;
        }
        // Armor
        if (itemId.includes("helmet") || itemId.includes("vest")) {
            return ItemPriority.HIGH;
        }
        // Ammo
        if (itemId.includes("ammo")) {
            return this.needsAmmo() ? ItemPriority.MEDIUM : ItemPriority.LOW;
        }
        return ItemPriority.USELESS;
    }
    evaluateSituation() {
        const healthRatio = this.health / this.maxHealth;
        const hasGoodWeapon = this.hasGoodWeapon();
        const needsAmmo = this.needsAmmo();
        // Gas awareness - high priority
        const distanceToCenter = math_1.Geometry.distance(this.position, this.game.gas.currentPosition);
        const currentRadius = this.game.gas.currentRadius;
        const newRadius = this.game.gas.newRadius;
        // If gas is shrinking and we're in danger zone, prioritize moving to center
        if (newRadius < currentRadius && distanceToCenter > newRadius * 0.6) {
            this.currentState = BotState.FLEEING;
            this.currentGoal = { type: 'safe_zone', priority: 9 };
            return;
        }
        // Emergency situations
        if (healthRatio < 0.2) {
            this.currentState = BotState.FLEEING;
            this.currentGoal = { type: 'safe_zone', priority: 10 };
            return;
        }
        // Critical needs - prioritize weapon above everything
        if (!hasGoodWeapon) {
            this.currentState = BotState.LOOTING;
            this.currentGoal = { type: 'loot', priority: 10 };
            return;
        }
        if (needsAmmo) {
            this.currentState = BotState.LOOTING;
            this.currentGoal = { type: 'loot', priority: 9 };
            return;
        }
        // Combat opportunities - be aggressive!
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
            const enemyDistance = math_1.Geometry.distance(this.position, nearestEnemy.position);
            // Always hunt if enemy is close, even without perfect weapon
            if (enemyDistance < 100) {
                this.currentState = BotState.HUNTING;
                this.currentGoal = { type: 'enemy', target: nearestEnemy, priority: 8 };
                return;
            }
            // Hunt if we have advantage
            if (this.shouldEngageTarget(nearestEnemy) && hasGoodWeapon) {
                this.currentState = BotState.HUNTING;
                this.currentGoal = { type: 'enemy', target: nearestEnemy, priority: 7 };
                return;
            }
        }
        // Resource gathering - always look for good loot
        const bestLoot = this.findBestLoot();
        if (bestLoot && bestLoot.priority >= ItemPriority.LOW) {
            this.currentState = BotState.LOOTING;
            this.currentGoal = { type: 'loot', target: bestLoot.item, priority: 6 };
            return;
        }
        // If no good loot nearby, actively search for unexplored areas
        if (!bestLoot || bestLoot.priority < ItemPriority.HIGH) {
            this.currentState = BotState.EXPLORING;
            this.currentGoal = { type: 'explore', priority: 5 };
            return;
        }
        // Always be ready to fight - check for enemies constantly
        if (nearestEnemy && math_1.Geometry.distance(this.position, nearestEnemy.position) < 200) {
            this.currentState = BotState.HUNTING;
            this.currentGoal = { type: 'enemy', target: nearestEnemy, priority: 6 };
            return;
        }
        // Exploration
        this.currentState = BotState.EXPLORING;
        this.currentGoal = { type: 'explore', priority: 1 };
    }
    checkForBetterTargets() {
        // Always be on the lookout for better opportunities
        // Check for closer enemies
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
            const enemyDistance = math_1.Geometry.distance(this.position, nearestEnemy.position);
            // If enemy is very close, switch to combat immediately
            if (enemyDistance < 80 && (this.currentState !== BotState.HUNTING || this.currentTarget !== nearestEnemy)) {
                this.currentState = BotState.HUNTING;
                this.currentTarget = nearestEnemy;
                this.combatMode = true;
                return;
            }
        }
        // Check for better loot
        const bestLoot = this.findBestLoot();
        if (bestLoot && bestLoot.priority >= ItemPriority.HIGH) {
            if (this.currentState !== BotState.LOOTING || this.currentTarget !== bestLoot.item) {
                this.currentState = BotState.LOOTING;
                this.currentTarget = bestLoot.item;
                return;
            }
        }
        // If we're in exploration and find enemy, switch to hunting
        if (this.currentState === BotState.EXPLORING && nearestEnemy && math_1.Geometry.distance(this.position, nearestEnemy.position) < 120) {
            this.currentState = BotState.HUNTING;
            this.currentTarget = nearestEnemy;
            this.combatMode = true;
        }
    }
    findBestLoot() {
        let bestLoot;
        let bestPriority = ItemPriority.USELESS;
        for (const [, data] of this.knownLootLocations) {
            if (data.priority > bestPriority) {
                bestLoot = data.item;
                bestPriority = data.priority;
            }
        }
        return bestLoot ? { item: bestLoot, priority: bestPriority } : undefined;
    }
    checkStuck() {
        const distance = math_1.Geometry.distance(this.position, this.lastPosition);
        if (distance < 1) {
            this.stuckTime += this.game.dt;
            if (this.stuckTime > 2000) { // Stuck for 2 seconds
                this.handleStuck();
                this.stuckTime = 0;
            }
        }
        else {
            this.stuckTime = 0;
        }
        this.lastPosition = vector_1.Vec.clone(this.position);
    }
    handleStuck() {
        // Try to move in a different direction
        this.currentPath = [];
        this.currentPathIndex = 0;
        // Add some randomness to movement
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = 20 + Math.random() * 30;
        const newX = this.position.x + Math.cos(randomAngle) * randomDistance;
        const newY = this.position.y + Math.sin(randomAngle) * randomDistance;
        this.moveTowards((0, vector_1.Vec)(newX, newY));
    }
    avoidGas() {
        const optimalPosition = this.findOptimalSafePosition();
        if (optimalPosition) {
            // Create path to optimal position
            this.currentPath = [optimalPosition];
            this.currentPathIndex = 0;
            this.followPath();
        }
        else {
            // Fallback to center
            const safePosition = this.findSafePosition();
            if (safePosition) {
                this.moveTowards(safePosition);
            }
        }
    }
    findOptimalSafePosition() {
        const gasCenter = this.game.gas.currentPosition;
        const currentRadius = this.game.gas.currentRadius;
        const newRadius = this.game.gas.newRadius;
        // Calculate future safe radius (with margin)
        const futureSafeRadius = newRadius * 0.8; // 80% of new radius for safety
        // Find optimal position in future safe zone
        const distanceToCenter = math_1.Geometry.distance(this.position, gasCenter);
        if (distanceToCenter <= futureSafeRadius) {
            // Already in future safe zone, stay put or move slightly
            return undefined;
        }
        // Calculate direction to center
        const directionToCenter = vector_1.Vec.sub(gasCenter, this.position);
        const normalizedDirection = vector_1.Vec.normalize(directionToCenter);
        // Calculate target position inside future safe zone
        const targetDistance = futureSafeRadius * 0.9; // 90% into safe zone
        const targetPosition = vector_1.Vec.add(gasCenter, vector_1.Vec.scale(vector_1.Vec.normalize(vector_1.Vec.sub(this.position, gasCenter)), -targetDistance));
        // Make sure target is within map bounds
        const mapWidth = this.game.map.width;
        const mapHeight = this.game.map.height;
        const clampedX = math_1.Numeric.clamp(targetPosition.x, 50, mapWidth - 50);
        const clampedY = math_1.Numeric.clamp(targetPosition.y, 50, mapHeight - 50);
        return (0, vector_1.Vec)(clampedX, clampedY);
    }
    findSafePosition() {
        const safeZoneCenter = this.game.gas.newPosition;
        const safeZoneRadius = this.game.gas.newRadius;
        // Find position just inside the safe zone
        const directionToSafeZone = vector_1.Vec.sub(safeZoneCenter, this.position);
        const distanceToSafeZone = math_1.Geometry.distance(this.position, safeZoneCenter);
        if (distanceToSafeZone > safeZoneRadius) {
            // We're outside, move towards safe zone
            const direction = vector_1.Vec.normalize(directionToSafeZone);
            return vector_1.Vec.add(this.position, vector_1.Vec.scale(direction, 10));
        }
        return undefined;
    }
    defensiveBehavior() {
        const nearestEnemy = this.findNearestEnemy();
        const nearestWeapon = this.findNearestWeapon();
        const nearestAmmo = this.findAmmo();
        const nearestLoot = this.findNearestLoot();
        const nearestObstacle = this.findNearestObstacle();
        const needsAmmo = this.needsAmmo();
        const healthPercentage = this.health / this.maxHealth;
        if (nearestEnemy && math_1.Geometry.distance(this.position, nearestEnemy.position) < 50) {
            this.fleeFrom(nearestEnemy.position);
        }
        else {
            // Look for healing items if low health
            const healingItem = this.findHealingItem();
            if (healingItem && healthPercentage < 0.7) {
                this.moveTowardsAndInteract(healingItem);
                return;
            }
            // Look for ammo first if needed
            if (nearestAmmo && needsAmmo) {
                this.moveTowardsAndInteract(nearestAmmo);
                return;
            }
            // Look for weapons if we don't have good ones
            if (nearestWeapon && !this.hasGoodWeapon()) {
                this.moveTowardsAndInteract(nearestWeapon);
                return;
            }
            // Look for other valuable loot
            if (nearestLoot) {
                this.moveTowardsAndInteract(nearestLoot);
                return;
            }
            // Look for obstacles to interact with
            if (nearestObstacle && this.shouldInteractWithObstacle(nearestObstacle)) {
                this.moveTowardsAndInteract(nearestObstacle);
                return;
            }
            // Look for airdrops
            const nearestAirdrop = this.findNearestAirdrop();
            if (nearestAirdrop) {
                this.moveTowards(nearestAirdrop.position);
                return;
            }
            this.currentState = BotState.EXPLORING;
        }
    }
    strategicBehavior() {
        const nearestEnemy = this.findNearestEnemy();
        const nearestWeapon = this.findNearestWeapon();
        const nearestAmmo = this.findAmmo();
        // Evaluate situation
        const hasGoodWeapon = this.hasGoodWeapon();
        const healthPercentage = this.health / this.maxHealth;
        // Check if we need ammo
        const needsAmmo = this.needsAmmo();
        if (nearestEnemy && this.canSeePlayer(nearestEnemy)) {
            // Use improved target engagement logic
            if (this.shouldEngageTarget(nearestEnemy) && hasGoodWeapon && !needsAmmo) {
                this.attackEnemy(nearestEnemy);
                return;
            }
            // Flee if we're weak or enemy is too close
            const enemyDistance = math_1.Geometry.distance(this.position, nearestEnemy.position);
            if (healthPercentage < 0.3 || enemyDistance < 25) {
                this.fleeFrom(nearestEnemy.position);
                return;
            }
        }
        // Look for ammo first if we need it
        if (nearestAmmo && needsAmmo) {
            this.moveTowards(nearestAmmo.position);
            return;
        }
        // Look for weapons if we don't have good ones
        if (nearestWeapon && !hasGoodWeapon) {
            this.moveTowardsAndInteract(nearestWeapon);
            return;
        }
        // Look for ammo if we need it
        if (nearestAmmo && needsAmmo) {
            this.moveTowardsAndInteract(nearestAmmo);
            return;
        }
        // Look for healing items if low health
        const healingItem = this.findHealingItem();
        if (healingItem && healthPercentage < 0.7) {
            this.moveTowardsAndInteract(healingItem);
            return;
        }
        // Look for other valuable loot
        const nearestLoot = this.findNearestLoot();
        if (nearestLoot) {
            this.moveTowardsAndInteract(nearestLoot);
            return;
        }
        // Look for obstacles to interact with (crates, barrels)
        const nearestObstacle = this.findNearestObstacle();
        if (nearestObstacle && this.shouldInteractWithObstacle(nearestObstacle)) {
            this.moveTowardsAndInteract(nearestObstacle);
            return;
        }
        // Look for airdrops
        const nearestAirdrop = this.findNearestAirdrop();
        if (nearestAirdrop) {
            this.moveTowards(nearestAirdrop.position);
            return;
        }
        // Explore if no immediate threats or opportunities
        this.currentState = BotState.EXPLORING;
    }
    survivalBehavior() {
        const nearestWeapon = this.findNearestWeapon();
        const nearestAmmo = this.findAmmo();
        const nearestLoot = this.findNearestLoot();
        const nearestObstacle = this.findNearestObstacle();
        const healingItem = this.findHealingItem();
        const needsAmmo = this.needsAmmo();
        const healthPercentage = this.health / this.maxHealth;
        // Priority 1: Survival - healing if low health
        if (healingItem && healthPercentage < 0.6) {
            this.moveTowardsAndInteract(healingItem);
            return;
        }
        // Priority 2: Ammo if needed
        if (nearestAmmo && needsAmmo) {
            this.moveTowardsAndInteract(nearestAmmo);
            return;
        }
        // Priority 3: Weapons if we don't have good ones
        if (nearestWeapon && !this.hasGoodWeapon()) {
            this.moveTowardsAndInteract(nearestWeapon);
            return;
        }
        // Priority 4: Other valuable loot
        if (nearestLoot) {
            this.moveTowardsAndInteract(nearestLoot);
            return;
        }
        // Priority 5: Obstacles to interact with
        if (nearestObstacle && this.shouldInteractWithObstacle(nearestObstacle)) {
            this.moveTowardsAndInteract(nearestObstacle);
            return;
        }
        // Priority 6: Airdrops
        const nearestAirdrop = this.findNearestAirdrop();
        if (nearestAirdrop) {
            this.moveTowards(nearestAirdrop.position);
            return;
        }
        // Priority 7: Safe exploration
        this.currentState = BotState.EXPLORING;
    }
    findNearestEnemy() {
        let nearest;
        let minDistance = Infinity;
        for (const player of this.game.livingPlayers) {
            if (player === this || player.dead)
                continue;
            // In solo mode, all other players are enemies
            if (!this.game.isTeamMode) {
                const distance = math_1.Geometry.distance(this.position, player.position);
                if (distance < minDistance && distance < 200) { // Search within 200 units
                    minDistance = distance;
                    nearest = player;
                }
            }
            else {
                // In team mode, only non-teammates are enemies
                if (this.teamID !== player.teamID) {
                    const distance = math_1.Geometry.distance(this.position, player.position);
                    if (distance < minDistance && distance < 200) {
                        minDistance = distance;
                        nearest = player;
                    }
                }
            }
        }
        return nearest;
    }
    findNearestWeapon() {
        let nearest;
        let minDistance = Infinity;
        for (const loot of this.game.grid.pool.getCategory(constants_1.ObjectCategory.Loot)) {
            if (loot.dead)
                continue;
            // Check if it's a weapon
            if (loot.definition.idString.includes("gun") ||
                loot.definition.idString.includes("melee") ||
                loot.definition.idString.includes("throwable")) {
                const distance = math_1.Geometry.distance(this.position, loot.position);
                if (distance < minDistance && distance < 200) { // Only consider nearby loot
                    minDistance = distance;
                    nearest = loot;
                }
            }
        }
        return nearest;
    }
    canSeePlayer(player) {
        // Simple line of sight check
        const direction = vector_1.Vec.sub(player.position, this.position);
        const distance = math_1.Geometry.distance(this.position, player.position);
        if (distance > 100)
            return false; // Too far
        // Check for obstacles in line of sight
        const hitbox = new hitbox_1.CircleHitbox(5);
        const objects = this.game.grid.intersectsHitbox(hitbox);
        for (const obj of objects) {
            if (obj.isObstacle && !obj.dead) {
                return false; // Obstacle blocks view
            }
        }
        return true;
    }
    hasGoodWeapon() {
        // Check all weapon slots (0, 1, 2, 3)
        for (let slot = 0; slot < 4; slot++) {
            if (this.inventory.hasWeapon(slot)) {
                const weapon = this.inventory.getWeapon(slot);
                if (weapon && weapon.definition.tier !== undefined) {
                    return true;
                }
            }
        }
        return false;
    }
    attackEnemy(enemy) {
        const direction = vector_1.Vec.sub(enemy.position, this.position);
        const distance = math_1.Geometry.distance(this.position, enemy.position);
        // Face the enemy
        this.faceTowards(enemy.position);
        // Move closer if too far
        if (distance > 25) {
            this.moveTowards(enemy.position);
        }
        else {
            // Stop and shoot
            this.stopMovement();
            // Try to shoot with some accuracy
            if (Math.random() < this.accuracy) {
                // Check if we have weapon and can shoot
                if (this.inventory.hasWeapon(0)) {
                    const weapon = this.inventory.getWeapon(0);
                    if (weapon && 'ammo' in weapon) {
                        if (weapon.ammo > 0) {
                            this.attacking = true;
                        }
                        else {
                            // Try to reload
                            this.tryReload();
                        }
                    }
                    else {
                        // Melee weapon, always can attack
                        this.attacking = true;
                    }
                }
            }
        }
    }
    moveTowards(target) {
        const direction = vector_1.Vec.sub(target, this.position);
        const distance = math_1.Geometry.distance(this.position, target);
        if (distance < 5)
            return; // Close enough
        const normalizedDirection = vector_1.Vec.normalize(direction);
        // Set movement inputs
        this.movement.right = normalizedDirection.x > 0.1;
        this.movement.left = normalizedDirection.x < -0.1;
        this.movement.down = normalizedDirection.y > 0.1;
        this.movement.up = normalizedDirection.y < -0.1;
        // Face towards target
        this.faceTowards(target);
    }
    moveTowardsAndInteract(target) {
        const distance = math_1.Geometry.distance(this.position, target.position);
        if (distance < 5) {
            // Close enough, interact
            this.stopMovement();
            if (target.isLoot) {
                target.interact(this);
            }
        }
        else {
            // Move towards target
            this.moveTowards(target.position);
        }
    }
    fleeFrom(target) {
        const direction = vector_1.Vec.sub(this.position, target);
        const normalizedDirection = vector_1.Vec.normalize(direction);
        // Move away
        this.movement.right = normalizedDirection.x > 0;
        this.movement.left = normalizedDirection.x < 0;
        this.movement.down = normalizedDirection.y > 0;
        this.movement.up = normalizedDirection.y < 0;
    }
    faceTowards(target) {
        const direction = vector_1.Vec.sub(target, this.position);
        this.rotation = Math.atan2(direction.y, direction.x);
    }
    stopMovement() {
        this.movement.up = false;
        this.movement.down = false;
        this.movement.left = false;
        this.movement.right = false;
    }
    // Execute different AI states
    executeExploration() {
        // Prioritize safe exploration within future gas zone
        const safeExplorationTarget = this.findSafeExplorationTarget();
        if (safeExplorationTarget) {
            this.moveTowards(safeExplorationTarget);
        }
        else {
            // Look for any unexplored areas
            const unexploredArea = this.findUnexploredArea();
            if (unexploredArea && this.isPositionSafe(unexploredArea)) {
                this.moveTowards(unexploredArea);
            }
            else {
                // Random exploration in safe areas
                if (this.currentPath.length === 0 || Math.random() < 0.1) {
                    this.generateSafeExplorationPath();
                }
                this.followPath();
            }
        }
        // Check for nearby loot while exploring
        const nearbyLoot = this.findNearbyLoot(50);
        if (nearbyLoot && this.evaluateItemPriority(nearbyLoot) >= ItemPriority.MEDIUM) {
            this.currentState = BotState.LOOTING;
            this.currentTarget = nearbyLoot;
        }
        // Check for nearby enemies - be very aggressive
        const nearbyEnemy = this.findNearestEnemy();
        if (nearbyEnemy) {
            const enemyDistance = math_1.Geometry.distance(this.position, nearbyEnemy.position);
            // Engage enemies within reasonable distance
            if (enemyDistance < 120) {
                this.currentState = BotState.HUNTING;
                this.currentTarget = nearbyEnemy;
                return;
            }
        }
    }
    executeLooting() {
        if (!this.currentTarget) {
            this.currentState = BotState.EXPLORING;
            return;
        }
        const target = this.currentTarget;
        const distance = math_1.Geometry.distance(this.position, target.position);
        if (target.dead) {
            // Loot was taken by someone else
            this.currentState = BotState.EXPLORING;
            return;
        }
        if (distance < 5) {
            // Close enough to loot
            this.stopMovement();
            // Loot will be collected automatically by game mechanics
            // After looting, immediately look for enemies to fight
            const nearestEnemy = this.findNearestEnemy();
            if (nearestEnemy && math_1.Geometry.distance(this.position, nearestEnemy.position) < 150) {
                this.currentState = BotState.HUNTING;
                this.currentTarget = nearestEnemy;
            }
            else {
                this.currentState = BotState.EXPLORING;
            }
        }
        else {
            // Move towards loot
            this.moveTowards(target.position);
        }
    }
    executeHunting() {
        if (!this.currentTarget) {
            this.currentState = BotState.EXPLORING;
            return;
        }
        const target = this.currentTarget;
        if (target.dead) {
            this.currentState = BotState.EXPLORING;
            return;
        }
        const distance = math_1.Geometry.distance(this.position, target.position);
        const hasWeapon = this.inventory.hasWeapon(0);
        // If we have a weapon, use it
        if (hasWeapon) {
            this.attackEnemy(target);
        }
        else {
            // No weapon - try melee combat if close enough
            if (distance < 20) {
                this.meleeAttack(target);
            }
            else {
                // Too far for melee, need to find weapon first
                this.currentState = BotState.LOOTING;
                this.currentGoal = { type: 'loot', priority: 9 };
                return;
            }
        }
    }
    meleeAttack(target) {
        const distance = math_1.Geometry.distance(this.position, target.position);
        if (distance < 15) {
            // Close enough for melee
            this.stopMovement();
            this.faceTowards(target.position);
            // Try to attack with melee
            if (this.inventory.hasWeapon(2)) { // Melee slot
                this.attacking = true;
            }
            else {
                // No melee weapon, just punch
                this.attacking = true;
            }
        }
        else {
            // Move closer for melee
            this.moveTowards(target.position);
        }
    }
    executeFleeing() {
        // Use smart gas avoidance with predictive behavior
        this.avoidGas();
    }
    executeUpgrading() {
        // Check if we need to upgrade equipment
        this.evaluateEquipmentNeeds();
        // If we have critical needs, look for them
        if (this.inventoryNeeds.weapons) {
            this.currentState = BotState.LOOTING;
            return;
        }
        if (this.inventoryNeeds.ammo) {
            this.currentState = BotState.LOOTING;
            return;
        }
        // Otherwise continue exploring
        this.currentState = BotState.EXPLORING;
    }
    executeInteracting() {
        if (!this.currentTarget) {
            this.currentState = BotState.EXPLORING;
            return;
        }
        const target = this.currentTarget;
        const distance = math_1.Geometry.distance(this.position, target.position);
        if (distance < 5) {
            this.stopMovement();
            // Interaction will happen automatically
            this.currentState = BotState.EXPLORING;
        }
        else {
            this.moveTowards(target.position);
        }
    }
    findUnexploredArea() {
        // Simple exploration - look for areas we haven't visited
        const searchRadius = 200;
        const attempts = 10;
        for (let i = 0; i < attempts; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * searchRadius;
            const testX = this.position.x + Math.cos(angle) * distance;
            const testY = this.position.y + Math.sin(angle) * distance;
            const areaKey = `${Math.floor(testX / 50)}_${Math.floor(testY / 50)}`;
            if (!this.exploredAreas.has(areaKey)) {
                return (0, vector_1.Vec)(testX, testY);
            }
        }
        return undefined;
    }
    findNearbyLoot(radius) {
        for (const loot of this.game.grid.pool.getCategory(constants_1.ObjectCategory.Loot)) {
            if (loot.dead)
                continue;
            const distance = math_1.Geometry.distance(this.position, loot.position);
            if (distance <= radius) {
                return loot;
            }
        }
        return undefined;
    }
    generateExplorationPath() {
        const unexploredArea = this.findUnexploredArea();
        if (unexploredArea) {
            this.currentPath = [unexploredArea];
            this.currentPathIndex = 0;
        }
        else {
            // Random path
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const targetX = this.position.x + Math.cos(angle) * distance;
            const targetY = this.position.y + Math.sin(angle) * distance;
            this.currentPath = [(0, vector_1.Vec)(targetX, targetY)];
            this.currentPathIndex = 0;
        }
    }
    generateSafeExplorationPath() {
        const safeTarget = this.findSafeExplorationTarget();
        if (safeTarget) {
            this.currentPath = [safeTarget];
            this.currentPathIndex = 0;
        }
        else {
            // Generate random path within safe zone
            const gasCenter = this.game.gas.currentPosition;
            const newRadius = this.game.gas.newRadius;
            const safeRadius = newRadius * 0.7; // Stay within 70% of safe zone
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * safeRadius * 0.8; // 80% of safe radius
            const targetX = gasCenter.x + Math.cos(angle) * distance;
            const targetY = gasCenter.y + Math.sin(angle) * distance;
            // Ensure target is within map bounds
            const clampedX = math_1.Numeric.clamp(targetX, 50, this.game.map.width - 50);
            const clampedY = math_1.Numeric.clamp(targetY, 50, this.game.map.height - 50);
            this.currentPath = [(0, vector_1.Vec)(clampedX, clampedY)];
            this.currentPathIndex = 0;
        }
    }
    followPath() {
        if (this.currentPath.length === 0)
            return;
        const target = this.currentPath[this.currentPathIndex];
        const distance = math_1.Geometry.distance(this.position, target);
        if (distance < 10) {
            // Reached current waypoint
            this.currentPathIndex++;
            if (this.currentPathIndex >= this.currentPath.length) {
                this.currentPath = [];
                this.stopMovement();
                return;
            }
        }
        // Move towards target
        this.moveTowards(target);
    }
    evaluateEquipmentNeeds() {
        // Check if we need better weapons
        if (!this.hasGoodWeapon()) {
            this.inventoryNeeds.weapons = true;
        }
        // Check if we need ammo
        if (this.needsAmmo()) {
            this.inventoryNeeds.ammo = true;
        }
        // Check if we need healing
        const healthRatio = this.health / this.maxHealth;
        if (healthRatio < 0.8) {
            this.inventoryNeeds.healing = true;
        }
        // Check if we need armor
        // This would require checking current armor level
        this.inventoryNeeds.armor = false; // Simplified for now
    }
    updateExploredAreas() {
        const areaKey = `${Math.floor(this.position.x / 50)}_${Math.floor(this.position.y / 50)}`;
        this.exploredAreas.add(areaKey);
    }
    isPositionSafe(position) {
        const distanceToCenter = math_1.Geometry.distance(position, this.game.gas.currentPosition);
        const currentRadius = this.game.gas.currentRadius;
        const newRadius = this.game.gas.newRadius;
        // Position is safe if it's well within future safe zone
        return distanceToCenter <= newRadius * 0.75;
    }
    findSafeExplorationTarget() {
        const unexploredAreas = this.getUnexploredAreasInSafeZone();
        if (unexploredAreas.length > 0) {
            // Choose random safe unexplored area
            return unexploredAreas[Math.floor(Math.random() * unexploredAreas.length)];
        }
        return undefined;
    }
    getUnexploredAreasInSafeZone() {
        const safeAreas = [];
        const newRadius = this.game.gas.newRadius;
        const gasCenter = this.game.gas.currentPosition;
        // Check areas within future safe zone
        const areasToCheck = 20;
        for (let i = 0; i < areasToCheck; i++) {
            const angle = (Math.PI * 2 * i) / areasToCheck;
            const distance = newRadius * 0.6; // 60% into safe zone
            const x = gasCenter.x + Math.cos(angle) * distance;
            const y = gasCenter.y + Math.sin(angle) * distance;
            const areaKey = `${Math.floor(x / 50)}_${Math.floor(y / 50)}`;
            if (!this.exploredAreas.has(areaKey)) {
                safeAreas.push((0, vector_1.Vec)(x, y));
            }
        }
        return safeAreas;
    }
    tryReload() {
        // For now, just stop attacking if no ammo
        // In a full implementation, we'd need to check inventory for ammo
        // and trigger reload action
        this.attacking = false;
    }
    findAmmo() {
        let nearest;
        let minDistance = Infinity;
        for (const loot of this.game.grid.pool.getCategory(constants_1.ObjectCategory.Loot)) {
            if (loot.dead)
                continue;
            // Check if it's ammo
            if (loot.definition.idString.includes("ammo")) {
                const distance = math_1.Geometry.distance(this.position, loot.position);
                if (distance < minDistance && distance < 150) {
                    minDistance = distance;
                    nearest = loot;
                }
            }
        }
        return nearest;
    }
    needsAmmo() {
        if (this.inventory.hasWeapon(0)) {
            const weapon = this.inventory.getWeapon(0);
            if (weapon && 'ammo' in weapon) {
                return weapon.ammo === 0;
            }
        }
        return false;
    }
    findHealingItem() {
        let nearest;
        let minDistance = Infinity;
        for (const loot of this.game.grid.pool.getCategory(constants_1.ObjectCategory.Loot)) {
            if (loot.dead)
                continue;
            // Check if it's a healing item
            if (loot.definition.idString.includes("cola") ||
                loot.definition.idString.includes("meds") ||
                loot.definition.idString.includes("soda")) {
                const distance = math_1.Geometry.distance(this.position, loot.position);
                if (distance < minDistance && distance < 120) {
                    minDistance = distance;
                    nearest = loot;
                }
            }
        }
        return nearest;
    }
    findNearestLoot() {
        let nearest;
        let minDistance = Infinity;
        for (const loot of this.game.grid.pool.getCategory(constants_1.ObjectCategory.Loot)) {
            if (loot.dead)
                continue;
            // Skip ammo and weapons if we don't need them
            const isAmmo = loot.definition.idString.includes("ammo");
            const isWeapon = loot.definition.idString.includes("gun") ||
                loot.definition.idString.includes("melee") ||
                loot.definition.idString.includes("throwable");
            if ((isAmmo && !this.needsAmmo()) || (isWeapon && this.hasGoodWeapon())) {
                continue;
            }
            const distance = math_1.Geometry.distance(this.position, loot.position);
            if (distance < minDistance && distance < 100) {
                minDistance = distance;
                nearest = loot;
            }
        }
        return nearest;
    }
    findNearestObstacle() {
        let nearest;
        let minDistance = Infinity;
        for (const obstacle of this.game.grid.pool.getCategory(constants_1.ObjectCategory.Obstacle)) {
            if (obstacle.dead)
                continue;
            // Look for crates and barrels that can be interacted with
            if (obstacle.definition.idString.includes("crate") ||
                obstacle.definition.idString.includes("barrel")) {
                const distance = math_1.Geometry.distance(this.position, obstacle.position);
                if (distance < minDistance && distance < 80) {
                    minDistance = distance;
                    nearest = obstacle;
                }
            }
        }
        return nearest;
    }
    shouldInteractWithObstacle(obstacle) {
        // Don't interact with dangerous obstacles (explosive barrels)
        if (obstacle.definition.idString.includes("barrel") &&
            obstacle.definition.idString.includes("explosive")) {
            return false;
        }
        // Interact with crates and safe barrels
        return obstacle.definition.idString.includes("crate") ||
            (obstacle.definition.idString.includes("barrel") &&
                !obstacle.definition.idString.includes("explosive"));
    }
    findNearestAirdrop() {
        let nearest;
        let minDistance = Infinity;
        for (const airdrop of this.game.airdrops) {
            const distance = math_1.Geometry.distance(this.position, airdrop.position);
            if (distance < minDistance && distance < 500) { // Search within 500 units for airdrops
                minDistance = distance;
                nearest = airdrop;
            }
        }
        return nearest;
    }
    canAttackTarget(target) {
        // Check if target is visible and in range
        const distance = math_1.Geometry.distance(this.position, target.position);
        // Don't attack if too far
        if (distance > 150)
            return false;
        // Check line of sight (simplified)
        return this.canSeePlayer(target);
    }
    shouldEngageTarget(target) {
        const distance = math_1.Geometry.distance(this.position, target.position);
        const healthRatio = this.health / this.maxHealth;
        // Don't engage if we're heavily damaged and target is far
        if (healthRatio < 0.3 && distance > 50)
            return false;
        // Always engage if target is very close
        if (distance < 30)
            return true;
        // Engage based on behavior type - be more aggressive
        switch (this.config.behavior) {
            case BotBehavior.AGGRESSIVE:
                return distance < 150; // More aggressive
            case BotBehavior.STRATEGIC:
                return distance < 120 && healthRatio > 0.3; // Less health requirement
            case BotBehavior.DEFENSIVE:
                return distance < 80; // More aggressive than before
            case BotBehavior.SURVIVAL:
                return distance < 50; // More aggressive for survival
            default:
                return distance < 100; // Default more aggressive
        }
    }
    // Override disconnect to handle bot cleanup
    disconnect(reason) {
        console.log(`Bot ${this.name} disconnected: ${reason || 'unknown reason'}`);
        super.disconnect(reason);
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map