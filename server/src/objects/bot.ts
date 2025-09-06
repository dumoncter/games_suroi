import { GameConstants, InputActions, PlayerActions, ObjectCategory } from "@common/constants";
import { Skins } from "@common/definitions/items/skins";
import { Guns } from "@common/definitions/items/guns";
import { Melees } from "@common/definitions/items/melees";
import { Throwables } from "@common/definitions/items/throwables";
import { Loots } from "@common/definitions/loots";
import { CircleHitbox } from "@common/utils/hitbox";
import { Angle, Geometry } from "@common/utils/math";
import { pickRandomInArray } from "@common/utils/random";
import { Vec, type Vector } from "@common/utils/vector";
import { type Game, type Airdrop } from "../game";
import { type PlayerSocketData } from "./player";
import { Player } from "./player";
import { type Loot } from "./loot";
import { Obstacle } from "./obstacle";

export enum BotDifficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
    EXPERT = "expert"
}

export enum BotBehavior {
    AGGRESSIVE = "aggressive",
    DEFENSIVE = "defensive",
    STRATEGIC = "strategic",
    SURVIVAL = "survival"
}

export enum BotState {
    EXPLORING = "exploring",
    HUNTING = "hunting",
    LOOTING = "looting",
    FLEEING = "fleeing",
    UPGRADING = "upgrading",
    INTERACTING = "interacting"
}

export enum ItemPriority {
    CRITICAL = 5,  // Лучшее оружие, полное хил
    HIGH = 4,      // Хорошее оружие, броня
    MEDIUM = 3,    // Среднее оружие, аптечки
    LOW = 2,       // Простое оружие, патроны
    USELESS = 1    // Хлам
}

export interface BotConfig {
    readonly difficulty: BotDifficulty;
    readonly behavior: BotBehavior;
    readonly name: string;
    readonly teamID?: number;
}

export class Bot extends Player {
    readonly isBot = true;
    private readonly config: BotConfig;

    // Advanced AI State
    private currentState = BotState.EXPLORING;
    private currentTarget?: Player | Loot | Obstacle;
    private lastActionTime = 0;
    private actionCooldown = 50; // ms between actions (faster decisions)

    // Navigation
    private currentPath: Vector[] = [];
    private currentPathIndex = 0;
    private lastPosition: Vector = Vec(0, 0);
    private stuckTime = 0;

    // Memory System
    private knownLootLocations: Map<string, { position: Vector, item: Loot, priority: ItemPriority, lastSeen: number }> = new Map();
    private knownEnemyLocations: Map<string, { position: Vector, player: Player, lastSeen: number }> = new Map();
    private exploredAreas: Set<string> = new Set();
    private dangerZones: Map<string, number> = new Map(); // position -> danger level

    // Goals and Priorities
    private currentGoal?: { type: 'loot' | 'enemy' | 'safe_zone' | 'explore', target?: any, priority: number };
    private inventoryNeeds: { weapons: boolean, ammo: boolean, healing: boolean, armor: boolean } = {
        weapons: true, ammo: true, healing: true, armor: true
    };

    // Bot stats based on difficulty
    private readonly reactionTime: number;
    private readonly accuracy: number;
    private readonly movementSpeed: number;
    private readonly decisionMaking: number;

    constructor(
        game: Game,
        position: Vector,
        config: BotConfig
    ) {
        // Create mock socket data for bot
        const mockSocketData: PlayerSocketData = {
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

    private initializeBot(): void {
        // Set basic loadout
        const defaultSkin = Skins.fromStringSafe(GameConstants.player.defaultSkin);
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

    update(): void {
        super.update();

        const now = this.game.now;
        if (now - this.lastActionTime < this.actionCooldown) {
            return;
        }

        this.lastActionTime = now;
        this.updateAI();
    }

    private updateAI(): void {
        if (this.dead) return;

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

    private shouldAvoidGas(): boolean {
        return this.game.gas.isInGas(this.position);
    }

    private updateMemory(): void {
        const now = this.game.now;

        // Update known loot locations
        for (const loot of this.game.grid.pool.getCategory(ObjectCategory.Loot)) {
            if (loot.dead) continue;

            const key = `${Math.floor(loot.position.x / 10)}_${Math.floor(loot.position.y / 10)}`;
            const priority = this.evaluateItemPriority(loot);

            if (priority >= ItemPriority.LOW) {
                this.knownLootLocations.set(key, {
                    position: Vec.clone(loot.position),
                    item: loot,
                    priority,
                    lastSeen: now
                });
            }
        }

        // Update known enemy locations
        for (const player of this.game.livingPlayers) {
            if (player === this || player.dead) continue;

            const key = `enemy_${player.id}`;
            this.knownEnemyLocations.set(key, {
                position: Vec.clone(player.position),
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

    private evaluateItemPriority(item: Loot): ItemPriority {
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

    private evaluateSituation(): void {
        const healthRatio = this.health / this.maxHealth;
        const hasGoodWeapon = this.hasGoodWeapon();
        const needsAmmo = this.needsAmmo();

        // Emergency situations
        if (healthRatio < 0.2) {
            this.currentState = BotState.FLEEING;
            this.currentGoal = { type: 'safe_zone', priority: 10 };
            return;
        }

        // Critical needs
        if (!hasGoodWeapon) {
            this.currentState = BotState.LOOTING;
            this.currentGoal = { type: 'loot', priority: 9 };
            return;
        }

        if (needsAmmo) {
            this.currentState = BotState.LOOTING;
            this.currentGoal = { type: 'loot', priority: 8 };
            return;
        }

        // Combat opportunities
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy && this.shouldEngageTarget(nearestEnemy) && hasGoodWeapon) {
            this.currentState = BotState.HUNTING;
            this.currentGoal = { type: 'enemy', target: nearestEnemy, priority: 7 };
            return;
        }

        // Resource gathering
        const bestLoot = this.findBestLoot();
        if (bestLoot && bestLoot.priority >= ItemPriority.MEDIUM) {
            this.currentState = BotState.LOOTING;
            this.currentGoal = { type: 'loot', target: bestLoot.item, priority: 6 };
            return;
        }

        // Exploration
        this.currentState = BotState.EXPLORING;
        this.currentGoal = { type: 'explore', priority: 1 };
    }

    private findBestLoot(): { item: Loot, priority: ItemPriority } | undefined {
        let bestLoot: Loot | undefined;
        let bestPriority = ItemPriority.USELESS;

        for (const [, data] of this.knownLootLocations) {
            if (data.priority > bestPriority) {
                bestLoot = data.item;
                bestPriority = data.priority;
            }
        }

        return bestLoot ? { item: bestLoot, priority: bestPriority } : undefined;
    }

    private checkStuck(): void {
        const distance = Geometry.distance(this.position, this.lastPosition);

        if (distance < 1) {
            this.stuckTime += this.game.dt;
            if (this.stuckTime > 2000) { // Stuck for 2 seconds
                this.handleStuck();
                this.stuckTime = 0;
            }
        } else {
            this.stuckTime = 0;
        }

        this.lastPosition = Vec.clone(this.position);
    }

    private handleStuck(): void {
        // Try to move in a different direction
        this.currentPath = [];
        this.currentPathIndex = 0;

        // Add some randomness to movement
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = 20 + Math.random() * 30;
        const newX = this.position.x + Math.cos(randomAngle) * randomDistance;
        const newY = this.position.y + Math.sin(randomAngle) * randomDistance;

        this.moveTowards(Vec(newX, newY));
    }

    private avoidGas(): void {
        const safePosition = this.findSafePosition();
        if (safePosition) {
            this.moveTowards(safePosition);
        }
    }

    private findSafePosition(): Vector | undefined {
        const safeZoneCenter = this.game.gas.newPosition;
        const safeZoneRadius = this.game.gas.newRadius;

        // Find position just inside the safe zone
        const directionToSafeZone = Vec.sub(safeZoneCenter, this.position);
        const distanceToSafeZone = Geometry.distance(this.position, safeZoneCenter);

        if (distanceToSafeZone > safeZoneRadius) {
            // We're outside, move towards safe zone
            const direction = Vec.normalize(directionToSafeZone);
            return Vec.add(this.position, Vec.scale(direction, 10));
        }

        return undefined;
    }


    private defensiveBehavior(): void {
        const nearestEnemy = this.findNearestEnemy();
        const nearestWeapon = this.findNearestWeapon();
        const nearestAmmo = this.findAmmo();
        const nearestLoot = this.findNearestLoot();
        const nearestObstacle = this.findNearestObstacle();
        const needsAmmo = this.needsAmmo();
        const healthPercentage = this.health / this.maxHealth;

        if (nearestEnemy && Geometry.distance(this.position, nearestEnemy.position) < 50) {
            this.fleeFrom(nearestEnemy.position);
        } else {
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

    private strategicBehavior(): void {
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
            const enemyDistance = Geometry.distance(this.position, nearestEnemy.position);
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

    private survivalBehavior(): void {
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

    private findNearestEnemy(): Player | undefined {
        let nearest: Player | undefined;
        let minDistance = Infinity;

        for (const player of this.game.livingPlayers) {
            if (player === this || player.dead) continue;

            // In solo mode, all other players are enemies
            if (!this.game.isTeamMode) {
                const distance = Geometry.distance(this.position, player.position);
                if (distance < minDistance && distance < 200) { // Search within 200 units
                    minDistance = distance;
                    nearest = player;
                }
            } else {
                // In team mode, only non-teammates are enemies
                if (this.teamID !== player.teamID) {
                    const distance = Geometry.distance(this.position, player.position);
                    if (distance < minDistance && distance < 200) {
                        minDistance = distance;
                        nearest = player;
                    }
                }
            }
        }

        return nearest;
    }

    private findNearestWeapon(): Loot | undefined {
        let nearest: Loot | undefined;
        let minDistance = Infinity;

        for (const loot of this.game.grid.pool.getCategory(ObjectCategory.Loot)) {
            if (loot.dead) continue;

            // Check if it's a weapon
            if (loot.definition.idString.includes("gun") ||
                loot.definition.idString.includes("melee") ||
                loot.definition.idString.includes("throwable")) {

                const distance = Geometry.distance(this.position, loot.position);
                if (distance < minDistance && distance < 200) { // Only consider nearby loot
                    minDistance = distance;
                    nearest = loot;
                }
            }
        }

        return nearest;
    }

    private canSeePlayer(player: Player): boolean {
        // Simple line of sight check
        const direction = Vec.sub(player.position, this.position);
        const distance = Geometry.distance(this.position, player.position);

        if (distance > 100) return false; // Too far

        // Check for obstacles in line of sight
        const hitbox = new CircleHitbox(5);
        const objects = this.game.grid.intersectsHitbox(hitbox);

        for (const obj of objects) {
            if (obj.isObstacle && !obj.dead) {
                return false; // Obstacle blocks view
            }
        }

        return true;
    }

    private hasGoodWeapon(): boolean {
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

    private attackEnemy(enemy: Player): void {
        const direction = Vec.sub(enemy.position, this.position);
        const distance = Geometry.distance(this.position, enemy.position);

        // Face the enemy
        this.faceTowards(enemy.position);

        // Move closer if too far
        if (distance > 25) {
            this.moveTowards(enemy.position);
        } else {
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
                        } else {
                            // Try to reload
                            this.tryReload();
                        }
                    } else {
                        // Melee weapon, always can attack
                        this.attacking = true;
                    }
                }
            }
        }
    }


    private moveTowards(target: Vector): void {
        const direction = Vec.sub(target, this.position);
        const distance = Geometry.distance(this.position, target);

        if (distance < 5) return; // Close enough

        const normalizedDirection = Vec.normalize(direction);

        // Set movement inputs
        this.movement.right = normalizedDirection.x > 0.1;
        this.movement.left = normalizedDirection.x < -0.1;
        this.movement.down = normalizedDirection.y > 0.1;
        this.movement.up = normalizedDirection.y < -0.1;

        // Face towards target
        this.faceTowards(target);
    }

    private moveTowardsAndInteract(target: Loot | Obstacle): void {
        const distance = Geometry.distance(this.position, target.position);

        if (distance < 5) {
            // Close enough, interact
            this.stopMovement();
            if (target.isLoot) {
                (target as Loot).interact(this);
            }
        } else {
            // Move towards target
            this.moveTowards(target.position);
        }
    }

    private fleeFrom(target: Vector): void {
        const direction = Vec.sub(this.position, target);
        const normalizedDirection = Vec.normalize(direction);

        // Move away
        this.movement.right = normalizedDirection.x > 0;
        this.movement.left = normalizedDirection.x < 0;
        this.movement.down = normalizedDirection.y > 0;
        this.movement.up = normalizedDirection.y < 0;
    }


    private faceTowards(target: Vector): void {
        const direction = Vec.sub(target, this.position);
        this.rotation = Math.atan2(direction.y, direction.x);
    }

    private stopMovement(): void {
        this.movement.up = false;
        this.movement.down = false;
        this.movement.left = false;
        this.movement.right = false;
    }

    // Execute different AI states
    private executeExploration(): void {
        // Look for unexplored areas
        const unexploredArea = this.findUnexploredArea();
        if (unexploredArea) {
            this.moveTowards(unexploredArea);
        } else {
            // Random exploration
            if (this.currentPath.length === 0 || Math.random() < 0.1) {
                this.generateExplorationPath();
            }
            this.followPath();
        }

        // Check for nearby loot while exploring
        const nearbyLoot = this.findNearbyLoot(50);
        if (nearbyLoot && this.evaluateItemPriority(nearbyLoot) >= ItemPriority.MEDIUM) {
            this.currentState = BotState.LOOTING;
            this.currentTarget = nearbyLoot;
        }

        // Check for nearby enemies
        const nearbyEnemy = this.findNearestEnemy();
        if (nearbyEnemy && this.shouldEngageTarget(nearbyEnemy)) {
            this.currentState = BotState.HUNTING;
            this.currentTarget = nearbyEnemy;
        }
    }

    private executeLooting(): void {
        if (!this.currentTarget) {
            this.currentState = BotState.EXPLORING;
            return;
        }

        const target = this.currentTarget as Loot;
        const distance = Geometry.distance(this.position, target.position);

        if (target.dead) {
            // Loot was taken by someone else
            this.currentState = BotState.EXPLORING;
            return;
        }

        if (distance < 5) {
            // Close enough to loot
            this.stopMovement();
            // Loot will be collected automatically by game mechanics
            this.currentState = BotState.EXPLORING;
        } else {
            // Move towards loot
            this.moveTowards(target.position);
        }
    }

    private executeHunting(): void {
        if (!this.currentTarget) {
            this.currentState = BotState.EXPLORING;
            return;
        }

        const target = this.currentTarget as Player;
        if (target.dead) {
            this.currentState = BotState.EXPLORING;
            return;
        }

        this.attackEnemy(target);
    }

    private executeFleeing(): void {
        const safePosition = this.findSafePosition();
        if (safePosition) {
            this.moveTowards(safePosition);
        } else {
            // Move away from danger
            const dangerDirection = Vec.sub(this.position, this.game.gas.currentPosition);
            const fleePosition = Vec.add(this.position, Vec.scale(Vec.normalize(dangerDirection), 100));
            this.moveTowards(fleePosition);
        }
    }

    private executeUpgrading(): void {
        // Check if we need to upgrade equipment
        this.evaluateEquipmentNeeds();
        this.currentState = BotState.EXPLORING;
    }

    private executeInteracting(): void {
        if (!this.currentTarget) {
            this.currentState = BotState.EXPLORING;
            return;
        }

        const target = this.currentTarget as Obstacle;
        const distance = Geometry.distance(this.position, target.position);

        if (distance < 5) {
            this.stopMovement();
            // Interaction will happen automatically
            this.currentState = BotState.EXPLORING;
        } else {
            this.moveTowards(target.position);
        }
    }

    private findUnexploredArea(): Vector | undefined {
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
                return Vec(testX, testY);
            }
        }

        return undefined;
    }

    private findNearbyLoot(radius: number): Loot | undefined {
        for (const loot of this.game.grid.pool.getCategory(ObjectCategory.Loot)) {
            if (loot.dead) continue;

            const distance = Geometry.distance(this.position, loot.position);
            if (distance <= radius) {
                return loot;
            }
        }
        return undefined;
    }

    private generateExplorationPath(): void {
        const unexploredArea = this.findUnexploredArea();
        if (unexploredArea) {
            this.currentPath = [unexploredArea];
            this.currentPathIndex = 0;
        } else {
            // Random path
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const targetX = this.position.x + Math.cos(angle) * distance;
            const targetY = this.position.y + Math.sin(angle) * distance;

            this.currentPath = [Vec(targetX, targetY)];
            this.currentPathIndex = 0;
        }
    }

    private followPath(): void {
        if (this.currentPath.length === 0) return;

        const target = this.currentPath[this.currentPathIndex];
        const distance = Geometry.distance(this.position, target);

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

    private evaluateEquipmentNeeds(): void {
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

    private updateExploredAreas(): void {
        const areaKey = `${Math.floor(this.position.x / 50)}_${Math.floor(this.position.y / 50)}`;
        this.exploredAreas.add(areaKey);
    }

    private tryReload(): void {
        // For now, just stop attacking if no ammo
        // In a full implementation, we'd need to check inventory for ammo
        // and trigger reload action
        this.attacking = false;
    }

    private findAmmo(): Loot | undefined {
        let nearest: Loot | undefined;
        let minDistance = Infinity;

        for (const loot of this.game.grid.pool.getCategory(ObjectCategory.Loot)) {
            if (loot.dead) continue;

            // Check if it's ammo
            if (loot.definition.idString.includes("ammo")) {
                const distance = Geometry.distance(this.position, loot.position);
                if (distance < minDistance && distance < 150) {
                    minDistance = distance;
                    nearest = loot;
                }
            }
        }

        return nearest;
    }

    private needsAmmo(): boolean {
        if (this.inventory.hasWeapon(0)) {
            const weapon = this.inventory.getWeapon(0);
            if (weapon && 'ammo' in weapon) {
                return weapon.ammo === 0;
            }
        }
        return false;
    }

    private findHealingItem(): Loot | undefined {
        let nearest: Loot | undefined;
        let minDistance = Infinity;

        for (const loot of this.game.grid.pool.getCategory(ObjectCategory.Loot)) {
            if (loot.dead) continue;

            // Check if it's a healing item
            if (loot.definition.idString.includes("cola") ||
                loot.definition.idString.includes("meds") ||
                loot.definition.idString.includes("soda")) {
                const distance = Geometry.distance(this.position, loot.position);
                if (distance < minDistance && distance < 120) {
                    minDistance = distance;
                    nearest = loot;
                }
            }
        }

        return nearest;
    }

    private findNearestLoot(): Loot | undefined {
        let nearest: Loot | undefined;
        let minDistance = Infinity;

        for (const loot of this.game.grid.pool.getCategory(ObjectCategory.Loot)) {
            if (loot.dead) continue;

            // Skip ammo and weapons if we don't need them
            const isAmmo = loot.definition.idString.includes("ammo");
            const isWeapon = loot.definition.idString.includes("gun") ||
                           loot.definition.idString.includes("melee") ||
                           loot.definition.idString.includes("throwable");

            if ((isAmmo && !this.needsAmmo()) || (isWeapon && this.hasGoodWeapon())) {
                continue;
            }

            const distance = Geometry.distance(this.position, loot.position);
            if (distance < minDistance && distance < 100) {
                minDistance = distance;
                nearest = loot;
            }
        }

        return nearest;
    }

    private findNearestObstacle(): Obstacle | undefined {
        let nearest: Obstacle | undefined;
        let minDistance = Infinity;

        for (const obstacle of this.game.grid.pool.getCategory(ObjectCategory.Obstacle)) {
            if (obstacle.dead) continue;

            // Look for crates and barrels that can be interacted with
            if (obstacle.definition.idString.includes("crate") ||
                obstacle.definition.idString.includes("barrel")) {
                const distance = Geometry.distance(this.position, obstacle.position);
                if (distance < minDistance && distance < 80) {
                    minDistance = distance;
                    nearest = obstacle;
                }
            }
        }

        return nearest;
    }

    private shouldInteractWithObstacle(obstacle: Obstacle): boolean {
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

    private findNearestAirdrop(): Airdrop | undefined {
        let nearest: Airdrop | undefined;
        let minDistance = Infinity;

        for (const airdrop of this.game.airdrops) {
            const distance = Geometry.distance(this.position, airdrop.position);
            if (distance < minDistance && distance < 500) { // Search within 500 units for airdrops
                minDistance = distance;
                nearest = airdrop;
            }
        }

        return nearest;
    }

    private canAttackTarget(target: Player): boolean {
        // Check if target is visible and in range
        const distance = Geometry.distance(this.position, target.position);

        // Don't attack if too far
        if (distance > 150) return false;

        // Check line of sight (simplified)
        return this.canSeePlayer(target);
    }

    private shouldEngageTarget(target: Player): boolean {
        const distance = Geometry.distance(this.position, target.position);
        const healthRatio = this.health / this.maxHealth;

        // Don't engage if we're heavily damaged and target is far
        if (healthRatio < 0.3 && distance > 50) return false;

        // Always engage if target is very close
        if (distance < 30) return true;

        // Engage based on behavior type
        switch (this.config.behavior) {
            case BotBehavior.AGGRESSIVE:
                return distance < 120;
            case BotBehavior.STRATEGIC:
                return distance < 100 && healthRatio > 0.4;
            case BotBehavior.DEFENSIVE:
                return distance < 50;
            case BotBehavior.SURVIVAL:
                return distance < 30; // Only when very close
            default:
                return distance < 80;
        }
    }

    // Override disconnect to handle bot cleanup
    disconnect(reason?: string): void {
        console.log(`Bot ${this.name} disconnected: ${reason || 'unknown reason'}`);
        super.disconnect(reason);
    }
}
