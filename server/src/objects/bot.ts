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
import { type Game } from "../game";
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
        if (nearestEnemy && Geometry.distance(this.position, nearestEnemy.position) < 50) {
            this.fleeFrom(nearestEnemy.position);
        } else {
            const nearestWeapon = this.findNearestWeapon();
            if (nearestWeapon) {
                this.moveTowards(nearestWeapon.position);
            } else {
                this.explore();
            }
        }
    }

    private strategicBehavior(): void {
        const nearestEnemy = this.findNearestEnemy();
        const nearestWeapon = this.findNearestWeapon();

        if (nearestEnemy && this.canSeePlayer(nearestEnemy) && this.hasGoodWeapon()) {
            this.attackEnemy(nearestEnemy);
        } else if (nearestWeapon) {
            this.moveTowards(nearestWeapon.position);
        } else {
            this.explore();
        }
    }

    private survivalBehavior(): void {
        const nearestWeapon = this.findNearestWeapon();
        if (nearestWeapon) {
            this.moveTowards(nearestWeapon.position);
        } else {
            this.explore();
        }
    }

    private findNearestEnemy(): Player | undefined {
        let nearest: Player | undefined;
        let minDistance = Infinity;

        for (const player of this.game.livingPlayers) {
            if (player === this || player.dead || (!this.game.isTeamMode || this.teamID === player.teamID)) continue;

            const distance = Geometry.distance(this.position, player.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = player;
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

        // Move closer if too far
        if (distance > 30) {
            this.moveTowards(enemy.position);
        } else {
            // Stop and shoot
            this.stopMovement();
            this.faceTowards(enemy.position);

            // Shoot with some accuracy
            if (Math.random() < this.accuracy && this.inventory.hasWeapon(0)) {
                this.attacking = true;
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
        // Simple random exploration
        if (Math.random() < 0.1) { // 10% chance to change direction
            const directions = [
                () => { this.movement.right = true; },
                () => { this.movement.left = true; },
                () => { this.movement.down = true; },
                () => { this.movement.up = true; },
                () => { this.stopMovement(); }
            ];
            pickRandomInArray(directions)();
        }
    }

    // Override disconnect to handle bot cleanup
    disconnect(reason?: string): void {
        console.log(`Bot ${this.name} disconnected: ${reason || 'unknown reason'}`);
        super.disconnect(reason);
    }
}
