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

export interface BotConfig {
    readonly difficulty: BotDifficulty;
    readonly behavior: BotBehavior;
    readonly name: string;
    readonly teamID?: number;
}

export class Bot extends Player {
    readonly isBot = true;
    private readonly config: BotConfig;

    // AI State
    private currentTarget?: Player | Loot | Obstacle;
    private lastActionTime = 0;
    private actionCooldown = 100; // ms between actions
    private path: Vector[] = [];
    private currentPathIndex = 0;
    private currentPath: Vector[] = [];

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

        // Clear old inputs
        this.movement.up = false;
        this.movement.down = false;
        this.movement.left = false;
        this.movement.right = false;
        this.attacking = false;

        // Gas avoidance has highest priority
        if (this.shouldAvoidGas()) {
            this.avoidGas();
            return;
        }

        // Decide next action based on behavior
        switch (this.config.behavior) {
            case BotBehavior.AGGRESSIVE:
                this.aggressiveBehavior();
                break;
            case BotBehavior.DEFENSIVE:
                this.defensiveBehavior();
                break;
            case BotBehavior.STRATEGIC:
                this.strategicBehavior();
                break;
            case BotBehavior.SURVIVAL:
                this.survivalBehavior();
                break;
        }
    }

    private shouldAvoidGas(): boolean {
        return this.game.gas.isInGas(this.position);
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

    private aggressiveBehavior(): void {
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy && this.canSeePlayer(nearestEnemy)) {
            this.attackEnemy(nearestEnemy);
        } else {
            const nearestWeapon = this.findNearestWeapon();
            if (nearestWeapon) {
                this.moveTowards(nearestWeapon.position);
            } else {
                this.explore();
            }
        }
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

            this.explore();
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
        this.explore();
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
        this.explore();
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

    private explore(): void {
        // Realistic movement like human players
        if (this.currentPath.length === 0 || Math.random() < 0.05) { // 5% chance to choose new direction
            this.generateNewPath();
        }

        this.followPath();
    }

    private generateNewPath(): void {
        // Choose random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100; // 50-150 units

        const targetX = this.position.x + Math.cos(angle) * distance;
        const targetY = this.position.y + Math.sin(angle) * distance;

        // Create simple path (just direct line for now)
        this.currentPath = [Vec(targetX, targetY)];
        this.currentPathIndex = 0;
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
