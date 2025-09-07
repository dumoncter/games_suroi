"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = exports.GamePlugin = exports.Events = void 0;
const misc_1 = require("../../../common/src/utils/misc");
const config_1 = require("./utils/config");
function makeEvent(...[cancellable]) {
    return { get cancellable() { return cancellable; } };
}
/*
    ok so i'd use "::" as a namespace indicator, but doing
    so forces all enum access to be done as SomeEnum["Foo::Bar"].

    that sounds fine, but for some very strange reason, in the
    context of computed properties on interfaces/types,
    SomeEnum["ABC"] is not regarded as being a literal type,
    whereas SomeEnum.ABC is

    so we're forced to use "_" instead
*/
exports.Events = {
    /**
     * Emitted when a player is about to be connected
     * to the server. No game object will have been created
     * at this point
     *
     * Cancelling this event will result in the corresponding
     * websocket being closed, preventing the player from
     * joining
     */
    player_will_connect: makeEvent(true),
    /**
     * Emitted after the instantiation of
     * the {@link Player} object and its placement
     *
     * This event cannot be cancelled
     */
    player_did_connect: makeEvent(),
    /**
     * Emitted at the start of {@link Game.activatePlayer()}.
     * Notably, a {@link JoinedPacket} will have been sent, but
     * the player will not have been added to any collections
     * (except a team, which is done before {@link Events.player_did_connect}
     * is fired), and the game will not have been started if need be
     *
     * Cancelling this event will disconnect the corresponding player
     */
    player_will_join: makeEvent(true),
    /**
     * Emitted at the end of {@link Game.activatePlayer()}.
     * Notably, a {@link JoinedPacket} will have been sent,
     * the player will have been added to all the relevant
     * collections, and the game will have been started if
     * need be
     *
     * This event cannot be cancelled
     */
    player_did_join: makeEvent(),
    /**
     * Emitted after the end {@link Game.removePlayer()}.
     * Notably, the socket will have been closed, the player
     * object may have been despawned, and the player will
     * have been removed from their team
     */
    player_disconnect: makeEvent(),
    /**
     * Emitted at the end of a player's {@link Player.update() first update pass}
     * (which is in charge of updating physical quantities,
     * updating health/adren/zoom, and using items)
     */
    player_update: makeEvent(),
    /**
     * Emitted on the first tick that a player is attacking (more
     * formally, on the first tick where a player is attacking
     * following a tick where the player was not attacking)
     *
     * Cancelling this event causes the active item's `useItem` method
     * not to be called, and the `startedAttacking` will not be cleared.
     * This means that next tick, the player will still be considered as
     * "starting to attack", and this event will be fired again. If this
     * is undesirable, the event handler can manually set the flag to
     * false.
     */
    player_start_attacking: makeEvent(true),
    /**
     * Emitted on the first tick that a player stops attacking
     * (more formally, on the first tick where a player is not
     * attacking following a tick where the player was attacking)
     *
     * Cancelling this event causes the active item's `stopUse` method
     * not to be called, and the `stoppedAttacking` will not be cleared.
     * This means that next tick, the player will still be considered as
     * "starting to attack", and this event will be fired again. If this
     * is undesirable, the event handler can manually set the flag to
     * false.
     */
    player_stop_attacking: makeEvent(true),
    /**
     * Emitted every time an {@link InputPacket} is received.
     * All side-effects from inputs will have already occurred
     * by the time this event is fired.
     */
    player_input: makeEvent(),
    /**
     * Emitted when a player is about to use a valid emote
     *
     * Cancelling this event will prevent the emote from being used
     */
    player_will_emote: makeEvent(true),
    /**
     * Emitted when a player uses a valid emote
     */
    player_did_emote: makeEvent(),
    /**
     * Emitted when a player is about to use a player ping
     *
     * Cancelling this event will prevent the player ping from being used
     */
    player_will_map_ping: makeEvent(true),
    /**
     * Emitted when a player uses a player ping
     */
    player_did_map_ping: makeEvent(),
    /**
     * Emitted when the player is about to receive damage.
     * The damage amount received is not clamped and does
     * not take protective modifiers into account; use the
     * {@link Events.player_will_piercing_damaged} for that purpose
     */
    player_damage: makeEvent(),
    /**
     * Emitted when the player is about to receive piercing
     * damage, which is simply defined as damage that ignores
     * protective modifiers (like gas or airdrop damage). Note
     * that regular damage is routed through this event as
     * well, after having been reduced appropriately.
     *
     * Also note that no fields will have been mutated by the
     * time this event is emitted; damage will not have been
     * applied, stats will not have been updated, and relevant
     * packets will not have been sent
     *
     * Cancelling this event will prevent the player from being
     * damaged
     */
    player_will_piercing_damaged: makeEvent(true),
    /**
     * Emitted after the player has received piercing
     * damage, which is simply defined as damage that ignores
     * protective modifiers (like gas or airdrop damage). Note
     * that regular damage is routed through this event as
     * well, after having been reduced appropriately.
     *
     * Damage dealt, damage taken, and on-hit effects will have
     * been applied, but the check for player death will not yet
     * have happened (meaning {@link Events.player_will_die} will
     * always fire after this event if applicable). Item modifiers
     * will also not yet have been updated (since those depend on
     * the death check), meaning that {@link Events.inv_item_stats_changed}
     * will not have been fired
     */
    player_did_piercing_damaged: makeEvent(),
    /**
     * Emitted when the player is about to die. Health is guaranteed
     * to be less than or equal to 0, and the `dead` flag will not
     * have been set.
     */
    player_will_die: makeEvent(),
    /**
     * Emitted when the player dies. By the time this event is
     * emitted, all player cleanup will have been finished;
     * the current action will have been cancelled; `health`,
     * `dead`, `downed`, and `canDespawn` flags will have been
     * set; `KillPacket` will have been created; and the
     * killer's kill count incremented. Movement variables,
     * attacking variables, and adrenaline will have been set,
     * A death emote will have been sent, and the inventory will
     * have been cleared. The player will not be present in the
     * game's object list, will have thrown their active
     * throwable at their feet (if present). The player's team
     * will have been wiped (if applicable), the player's death marker will
     * have been created, the game over packet will have been
     * sent, and this player will have been removed from kill
     * leader (if they were there)
     */
    player_did_die: makeEvent(),
    /**
     * Emitted for each winning player. By the time this event
     * is dispatched, win emote and game over packet will have
     * been sent
     */
    player_did_win: makeEvent(),
    /**
     * Emitted whenever an inventory item is equipped
     * When swapping between two items, the old item is
     * marked as unequipped before the new one is marked
     * as equipped
     */
    inv_item_equip: makeEvent(),
    /**
     * Emitted whenever an inventory item is unequipped
     * When swapping between two items, the old item is
     * marked as unequipped before the new one is marked
     * as equipped
     */
    inv_item_unequip: makeEvent(),
    /**
     * Emitted whenever an inventory item is 'used'. For firearms
     * and melees, this corresponds to attacking with them. For
     * grenades, this corresponds to starting the cooking process.
     *
     * In all cases, this event is emitted after any input buffering
     * has potentially been applied, and emitted after any pre-flight
     * checks have been performed (ex: item is active? owner is not
     * dead? etc) If the pre-flight checks fail, this event is not
     * emitted. If you wish to be informed of these, use
     * {@link Events.player_start_attacking} Cancelling this event
     * emulates a pre-flight check fail. Among other things, this
     * means that side-effects (such as setting `lastUse`) do not
     * occur.
     */
    inv_item_use: makeEvent(true),
    /**
     * Emitted whenever an inventory item stops being 'used'. For
     * all items, this is fired when the {@link InventoryItem#stopUse}
     * method is called.
     *
     * Cancelling this event will prevent the rest of the `stopUse`
     * method from running, but will *not* reset the `attacking` flag.
     */
    inv_item_stop_use: makeEvent(true),
    /**
     * Emitted whenever a weapon's stats have been changed
     */
    inv_item_stats_changed: makeEvent(),
    /**
     * Emitted whenever a weapon's modifiers have
     * been changed, usually as a result of stat changes
     */
    inv_item_modifiers_changed: makeEvent(),
    /**
     * Emitted at the start of the {@link GameMap.generateObstacle()}
     * method, which is invoked during map generation
     *
     * Also invoked when airdrops land
     *
     * Cancelling this event will lead to the obstacle not being generated
     */
    obstacle_will_generate: makeEvent(true),
    /**
     * Emitted at the end of the {@link GameMap.generateObstacle()}
     * method, which is invoked during map generation
     *
     * Also invoked when airdrops land
     */
    obstacle_did_generate: makeEvent(),
    /**
     * Emitted when an obstacle is about to sustain damage.
     * This event will not be fired for "invalid" attempts
     * to deal damage (such as trying to damage an `indestructible`
     * obstacle), and the obstacle's health will not have been
     * diminished (and therefore, no side-effects of obstacle
     * death will have occurred)
     *
     * Cancelling this event will lead to the obstacle sustaining no damage
     */
    obstacle_will_damage: makeEvent(true),
    /**
     * Emitted when an obstacle has sustained damage, but before
     * any death logic has been run or checked; {@link Events.obstacle_will_destroy}
     * will thus always fire after this event if applicable
     */
    obstacle_did_damage: makeEvent(),
    /**
     * Emitted when an obstacle is destroyed. Health and death
     * variables will have been updated, but no side-effects
     * (spawning explosions/decals/particles/loot) will have
     * occurred yet
     *
     * Cancelling this event will lead to no side effects occurring;
     * the obstacle will vanish, but no explosions, nor loot, nor decal,
     * (nor etc) will spawn
     */
    obstacle_will_destroy: makeEvent(true),
    /**
     * Emitted when an obstacle is destroyed. Health and death
     * variables will have been updated, and all side-effects
     * (spawning explosions/decals/particles/loot) will have
     * occurred
     */
    obstacle_did_destroy: makeEvent(),
    /**
     * Emitted when a player is about to interact with an obstacle.
     * All checks for validity will have succeeded ({@link Obstacle.canInteract()}
     * will have already returned `true`), but no side effects will
     * have occurred
     *
     * Cancelling this event will prevent the interaction from occurring
     */
    obstacle_will_interact: makeEvent(true),
    /**
     * Emitted after a player has interacted with an obstacle.
     * All checks for validity will have succeeded ({@link Obstacle.canInteract()}
     * will have already returned `true`), and all side effects will
     * have occurred
     */
    obstacle_did_interact: makeEvent(),
    /**
     * Emitted whenever {@link Game.addLoot()} is called,
     * before the loot object has both been created and added
     *
     * Cancelling this event will prevent the loot from being generated
     */
    loot_will_generate: makeEvent(true),
    /**
     * Emitted whenever {@link Game.addLoot()} is called,
     * after the loot object has both been created and added
     */
    loot_did_generate: makeEvent(),
    /**
     * Emitted when a player is about to interact
     * {@link Loot} object. All checks for validity
     * will have passed (in other words, {@link Loot.canInteract()}
     * will hav returned `true`); however, the redundancy
     * check (indicated by the `noPickup` argument) will
     * not have run; if `noPickup` is `true`,
     * {@link Events.loot_did_interact} will not be fired.
     *
     * Cancelling this event will prevent the interaction from occurring
     */
    loot_will_interact: makeEvent(true),
    /**
     * Emitted after a player successfully interacts with a
     * {@link Loot} object. By the time this event is fired,
     * the player's inventory will have (possibly) been mutated,
     * a {@link PickupPacket} will have been sent, and the loot
     * object will have been removed; the "new" loot
     * item (which is created if the old one isn't completely
     * consumed) will have also been created (meaning that
     * {@link Events.loot_will_generate} and
     * {@link Events.loot_did_generate} will have fired)
     */
    loot_did_interact: makeEvent(),
    /**
     * Emitted at the start of the {@link GameMap.generateBuilding()}
     * method, which is invoked during map generation
     *
     * Cancelling this event will prevent the building in question from generating
     */
    building_will_generate: makeEvent(true),
    /**
     * Emitted at the end of the {@link GameMap.generateBuilding()}
     * method, which is invoked during map generation
     */
    building_did_generate: makeEvent(),
    /**
     * Emitted when a building with a damageable ceiling has had
     * its ceiling damaged. This usually happens by destroying
     * one of the building's walls
     *
     * Cancelling this event prevents the damage from being applied
     */
    building_will_damage_ceiling: makeEvent(true),
    /**
     * Emitted when a building with a damageable ceiling is about
     * to receive damage to said ceiling, usually by means of
     * destroying one of its walls
     */
    building_did_damage_ceiling: makeEvent(),
    /**
     * Emitted when a building's ceiling is destroyed by means
     * of having too many of its walls destroyed. The building
     * will have been marked as "dead" and "partially dirty".
     */
    building_did_destroy_ceiling: makeEvent(),
    /**
     * Emitted when {@link Game.summonAirdrop()} is called.
     * A desired position will be received, but the actual
     * position will not have yet been determined
     *
     * Cancelling this event will prevent the airdrop from being summoned
     */
    airdrop_will_summon: makeEvent(true),
    /**
     * Emitted when {@link Game.summonAirdrop()} is called.
     * The position of the airdrop and its plane will have
     * been decided, and it will have been scheduled.
     */
    airdrop_did_summon: makeEvent(),
    /**
     * Emitted when a {@link Parachute} object hits the ground.
     * The parachute object will have been removed, and the
     * corresponding airdrop crate will have been generated
     * (meaning that this event is always fired after an
     * {@link Events.obstacle_did_generate}). No particles will
     * have been spawned, and no crushing damage will have been
     * applied
     */
    airdrop_landed: makeEvent(),
    /**
     * Emitted when a game is created, near the end of
     * {@link Game}'s constructor. Relevant websocket
     * listeners will have been set up, plugins will have been
     * loaded, and the {@link Grid grid}, {@link GameMap game map},
     * and {@link Gas gas} will have been loaded. The game
     * loop will not have been started
     */
    game_created: makeEvent(),
    /**
     * Emitted at the end of a game tick. All side-effects
     * will have occurred (including the potential dispatch
     * of {@link Events.game_end}), but the next tick will
     * not have been scheduled.
     */
    game_tick: makeEvent(),
    /**
     * Emitted when a player or team is determined to have
     * won the game, thereby ending it. The server will not
     * have been stopped yet
     */
    game_end: makeEvent()
};
// basically file-scoped access to an emit method
const pluginDispatchers = new misc_1.ExtendedMap();
class GamePlugin {
    game;
    _events = {};
    constructor(game) {
        this.game = game;
        this.initListeners();
        pluginDispatchers.set(this, (eventType, ...args) => {
            const events = this._events[eventType];
            if (events === undefined)
                return;
            let i = 0;
            for (const event of events) {
                try {
                    event(...args);
                }
                catch (e) {
                    console.error(`While dispatching event '${eventType}', listener at index ${i}`
                        + ` (source: ${this.constructor.name}) threw an error (provided below):`);
                    console.error(e);
                }
                ++i;
            }
        });
    }
    on(eventType, cb) {
        (this._events[eventType] ??= new Set()).add(cb);
    }
    off(eventType, cb) {
        if (!cb) {
            this._events[eventType] = undefined;
            return;
        }
        this._events[eventType]?.delete(cb);
    }
}
exports.GamePlugin = GamePlugin;
/**
 * This class manages plugins and game events
 */
class PluginManager {
    game;
    _plugins = new Set();
    constructor(game) {
        this.game = game;
    }
    /**
     * Returns the `GamePlugin` instance which cancelled the event, or `undefined`
     * if the event was not cancelled
     */
    emit(eventType, ...args) {
        let cancelSource = undefined;
        let isCancelled = false;
        let plugin;
        let continueDispatch = true;
        const evData = [{
                stopImmediatePropagation() { continueDispatch = false; },
                ...(exports.Events[eventType].cancellable
                    ? {
                        cancel() { isCancelled = true; cancelSource = plugin; },
                        isCancelled: isCancelled
                    }
                    : {})
            }];
        for (plugin of this._plugins) {
            pluginDispatchers.get(plugin)?.(eventType, ...args, ...evData);
            if (!continueDispatch)
                break;
        }
        return cancelSource;
    }
    loadPlugin(pluginClass) {
        for (const plugin of this._plugins) {
            if (plugin instanceof pluginClass) {
                console.warn(`Plugin ${pluginClass.name} already loaded`);
                return;
            }
        }
        try {
            const plugin = new pluginClass(this.game);
            this._plugins.add(plugin);
            this.game.log(`Plugin ${pluginClass.name} loaded`);
        }
        catch (error) {
            console.error(`Failed to load plugin ${pluginClass.name}, err:`, error);
        }
    }
    unloadPlugin(plugin) {
        this._plugins.delete(plugin);
    }
    async loadPlugins() {
        if (!config_1.Config.plugins?.length)
            return;
        for (const plugin of config_1.Config.plugins) {
            // stfu
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const pluginClass = (await Promise.resolve(`${`./plugins/${plugin}`}`).then(s => __importStar(require(s)))).default;
            this.loadPlugin(pluginClass);
        }
    }
}
exports.PluginManager = PluginManager;
//# sourceMappingURL=pluginManager.js.map