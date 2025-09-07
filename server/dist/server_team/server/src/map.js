"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMap = void 0;
const constants_1 = require("../../../common/src/constants");
const buildings_1 = require("../../../common/src/definitions/buildings");
const obstacles_1 = require("../../../common/src/definitions/obstacles");
const mapPacket_1 = require("../../../common/src/packets/mapPacket");
const packetStream_1 = require("../../../common/src/packets/packetStream");
const hitbox_1 = require("../../../common/src/utils/hitbox");
const layer_1 = require("../../../common/src/utils/layer");
const math_1 = require("../../../common/src/utils/math");
const misc_1 = require("../../../common/src/utils/misc");
const objectDefinitions_1 = require("../../../common/src/utils/objectDefinitions");
const random_1 = require("../../../common/src/utils/random");
const terrain_1 = require("../../../common/src/utils/terrain");
const vector_1 = require("../../../common/src/utils/vector");
const maps_1 = require("./data/maps");
const building_1 = require("./objects/building");
const obstacle_1 = require("./objects/obstacle");
const lootHelpers_1 = require("./utils/lootHelpers");
const misc_2 = require("./utils/misc");
class GameMap {
    game;
    mapDef;
    width;
    height;
    oceanSize;
    beachSize;
    beachHitbox;
    islandHitbox;
    seed;
    terrain;
    _packet;
    /**
     * A cached map packet buffer
     * Since the map is static, there's no reason to serialize a map packet for each player that joins the game
     */
    buffer;
    _beachPadding;
    quadBuildings = { 1: [], 2: [], 3: [], 4: [] };
    quadMajorBuildings = [];
    majorBuildingPositions = [];
    occupiedBridgePositions = [];
    clearings = [];
    mapScale;
    static getRandomRotation(mode) {
        switch (mode) {
            case constants_1.RotationMode.Full:
                // @ts-expect-error not sure why ts thinks the return type should be 0
                return (0, random_1.randomRotation)();
            case constants_1.RotationMode.Limited:
                // @ts-expect-error see above
                return (0, random_1.random)(0, 3);
            case constants_1.RotationMode.Binary:
                // @ts-expect-error see above
                return (0, random_1.random)(0, 1);
            case constants_1.RotationMode.None:
            default:
                return 0;
        }
    }
    static getRandomBuildingOrientation(mode = constants_1.RotationMode.Limited) {
        switch (mode) {
            case constants_1.RotationMode.Binary:
                return (0, random_1.pickRandomInArray)([0, 2]);
            default:
                return GameMap.getRandomRotation(mode);
        }
    }
    constructor(game, mapData, options = {}) {
        this.game = game;
        const [name, ...params] = mapData.split(":");
        const mapDef = maps_1.Maps[name];
        const { scale = 1, maxMajorBuildings } = options;
        this.mapScale = scale === 1
            ? (num) => num
            : (num) => {
                const val = Math.round(num * (((mapDef.width * scale) ** 2) / (mapDef.width ** 2)));
                if (val < 1)
                    return 1;
                return val;
            };
        this.game.log(`Map scale: ${scale}`);
        if (scale !== 1 && mapDef.quadBuildingLimit) {
            for (const [idString, amount] of Object.entries(mapDef.quadBuildingLimit)) {
                mapDef.quadBuildingLimit[idString] = math_1.Numeric.max(this.mapScale(amount), this.mapScale(mapDef.buildings?.[idString] ?? 1));
            }
        }
        const packet = mapPacket_1.MapPacket.create({ objects: [] });
        this._packet = packet;
        this.seed = packet.seed = (0, random_1.random)(0, 2 ** 31);
        this.game.log(`Map seed: ${this.seed}`);
        this.width = packet.width = mapDef.width * scale;
        this.height = packet.height = mapDef.height * scale;
        this.oceanSize = packet.oceanSize = mapDef.oceanSize;
        this.beachSize = packet.beachSize = mapDef.beachSize;
        this.mapDef = mapDef;
        // + 8 to account for the jagged points
        const beachPadding = this._beachPadding = mapDef.oceanSize + mapDef.beachSize + math_1.Numeric.min(mapDef.oceanSize + mapDef.beachSize, 8);
        const oceanSize = mapDef.oceanSize + math_1.Numeric.min(mapDef.oceanSize, 8);
        this.beachHitbox = new hitbox_1.GroupHitbox(new hitbox_1.RectangleHitbox((0, vector_1.Vec)(this.width - beachPadding, oceanSize), (0, vector_1.Vec)(this.width - oceanSize, this.height - oceanSize)), new hitbox_1.RectangleHitbox((0, vector_1.Vec)(oceanSize, oceanSize), (0, vector_1.Vec)(this.width - beachPadding, beachPadding)), new hitbox_1.RectangleHitbox((0, vector_1.Vec)(oceanSize, oceanSize), (0, vector_1.Vec)(beachPadding, this.height - beachPadding)), new hitbox_1.RectangleHitbox((0, vector_1.Vec)(oceanSize, this.height - beachPadding), (0, vector_1.Vec)(this.width - beachPadding, this.height - oceanSize)));
        this.islandHitbox = new hitbox_1.RectangleHitbox((0, vector_1.Vec)(oceanSize, oceanSize), (0, vector_1.Vec)(this.width - oceanSize, this.height - oceanSize));
        const rivers = [];
        if (mapDef.rivers || mapDef.trails) {
            const seededRandom = new random_1.SeededRandom(this.seed);
            if (mapDef.trails)
                rivers.push(...this._generateRivers(mapDef.trails, seededRandom, true));
            if (mapDef.rivers)
                rivers.push(...this._generateRivers(mapDef.rivers, seededRandom));
        }
        packet.rivers = rivers;
        this.terrain = new terrain_1.Terrain(this.width, this.height, mapDef.oceanSize, mapDef.beachSize, this.seed, rivers);
        const majorBuildings = Array.from(mapDef.majorBuildings ?? []);
        const numToRemove = maxMajorBuildings === undefined ? 0 : majorBuildings.length - maxMajorBuildings;
        if (numToRemove > 0) {
            for (let i = 0; i < numToRemove; i++) {
                (0, misc_1.removeFrom)(majorBuildings, (0, random_1.pickRandomInArray)(majorBuildings));
            }
        }
        majorBuildings.forEach(building => this._generateBuildings(building, 1));
        Object.entries(mapDef.buildings ?? {}).forEach(([building, count]) => this._generateBuildings(building, count));
        this._generateClearings(mapDef.clearings);
        if (mapDef.rivers) {
            this._generateRiverObstacles(mapDef.rivers, false);
        }
        if (mapDef.trails) {
            this._generateRiverObstacles(mapDef.trails, true);
        }
        for (const clump of mapDef.obstacleClumps ?? []) {
            this._generateObstacleClumps(clump);
        }
        Object.entries(mapDef.obstacles ?? {}).forEach(([obstacle, count]) => this._generateObstacles(obstacle, count));
        Object.entries(mapDef.loots ?? {}).forEach(([loot, count]) => this._generateLoots(loot, count));
        mapDef.onGenerate?.(this, params);
        if (mapDef.places) {
            packet.places = mapDef.places.map(({ name, position }) => {
                const absPosition = (0, vector_1.Vec)(this.width * (position.x + (0, random_1.randomFloat)(-0.04, 0.04)), this.height * (position.y + (0, random_1.randomFloat)(-0.04, 0.04)));
                return { name, position: absPosition };
            });
        }
        const stream = new packetStream_1.PacketStream(new ArrayBuffer(1 << 16));
        stream.serialize(packet);
        this.buffer = stream.getBuffer();
    }
    _generateRivers(definition, randomGenerator, isTrail = false) {
        const { minAmount, maxAmount, maxWideAmount, wideChance, minWidth, maxWidth, minWideWidth, maxWideWidth, centered } = definition;
        const rivers = [];
        const amount = this.mapScale(randomGenerator.getInt(minAmount, maxAmount));
        // generate a list of widths and sort by biggest, to make sure wide rivers generate first
        let wideAmount = 0;
        const widths = Array.from({ length: amount }, () => {
            if (wideAmount < maxWideAmount && randomGenerator.get() < wideChance) {
                wideAmount++;
                return randomGenerator.getInt(minWideWidth, maxWideWidth);
            }
            else {
                return randomGenerator.getInt(minWidth, maxWidth);
            }
        }).sort((a, b) => b - a);
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const center = (0, vector_1.Vec)(halfWidth, halfHeight);
        const padding = isTrail ? constants_1.GameConstants.trailPadding : this.oceanSize / 2;
        const width = this.width - padding;
        const height = this.height - padding;
        const bounds = new hitbox_1.RectangleHitbox((0, vector_1.Vec)(padding, padding), (0, vector_1.Vec)(width, height));
        let i = 0;
        let attempts = 0;
        while (i < amount && attempts < 100) {
            attempts++;
            let start;
            const horizontal = !!randomGenerator.getInt();
            const reverse = !!randomGenerator.getInt();
            if (centered) {
                if (horizontal) {
                    start = (0, vector_1.Vec)(padding, halfHeight);
                }
                else {
                    start = (0, vector_1.Vec)(halfWidth, padding);
                }
            }
            else {
                if (horizontal) {
                    const topHalf = randomGenerator.get(padding, halfHeight);
                    const bottomHalf = randomGenerator.get(halfHeight, height);
                    start = (0, vector_1.Vec)(padding, reverse ? bottomHalf : topHalf);
                }
                else {
                    const leftHalf = randomGenerator.get(padding, halfWidth);
                    const rightHalf = randomGenerator.get(halfWidth, width);
                    start = (0, vector_1.Vec)(reverse ? rightHalf : leftHalf, padding);
                }
            }
            const startAngle = math_1.Angle.betweenPoints(center, start) + (reverse ? 0 : Math.PI);
            const riverWidth = widths[i];
            if (this._generateRiver(start, startAngle, riverWidth, bounds, isTrail, rivers, centered, randomGenerator))
                i++;
        }
        return rivers;
    }
    _generateRiver(startPos, startAngle, width, bounds, isTrail, rivers, lockAngle, randomGenerator) {
        const riverPoints = [];
        riverPoints.push(startPos);
        let angle = startAngle;
        const points = isTrail ? 25 : 60;
        for (let i = 1; i < points; i++) {
            const lastPoint = riverPoints[i - 1];
            const center = (0, vector_1.Vec)(this.width / 2, this.height / 2);
            const distFactor = math_1.Geometry.distance(lastPoint, center) / (this.width / 2);
            const maxDeviation = math_1.Numeric.lerp(0.8, 0.1, distFactor);
            const minDeviation = math_1.Numeric.lerp(0.3, 0.1, distFactor);
            angle = (lockAngle ? startAngle : angle) + randomGenerator.get(-randomGenerator.get(minDeviation, maxDeviation), randomGenerator.get(minDeviation, maxDeviation)) * (lockAngle ? 0.5 : 1);
            const pos = vector_1.Vec.add(lastPoint, vector_1.Vec.fromPolar(angle, randomGenerator.getInt(30, 80)));
            // end the river if it collides with another river
            let collided = false;
            for (const river of rivers) {
                if (river.isTrail !== isTrail)
                    continue; // Trails should only end when colliding with other trails, same for rivers
                const points = river.points;
                for (let j = 1; j < points.length; j++) {
                    const intersection = math_1.Collision.lineIntersectsLine(lastPoint, pos, points[j - 1], points[j]);
                    if (intersection) {
                        const dist = math_1.Geometry.distance(intersection, riverPoints[i - 1]);
                        if (dist > 16)
                            riverPoints[i] = intersection;
                        collided = true;
                        break;
                    }
                }
                if (collided)
                    break;
            }
            if (collided)
                break;
            if (!bounds.isPointInside(pos)) {
                riverPoints[i] = (0, vector_1.Vec)(math_1.Numeric.clamp(pos.x, bounds.min.x, bounds.max.x), math_1.Numeric.clamp(pos.y, bounds.min.y, bounds.max.y));
                break;
            }
            riverPoints[i] = pos;
        }
        if (riverPoints.length < 20 || riverPoints.length > 59)
            return false;
        const mapBounds = new hitbox_1.RectangleHitbox((0, vector_1.Vec)(this.oceanSize, this.oceanSize), (0, vector_1.Vec)(this.width - this.oceanSize, this.height - this.oceanSize));
        rivers.push(new terrain_1.River(width, riverPoints, rivers, mapBounds, isTrail));
        return true;
    }
    _generateRiverObstacles(riverDef, onTrails) {
        for (const river of this.terrain.rivers) {
            if (onTrails !== river.isTrail)
                continue;
            for (const obstacle in riverDef.obstacles) {
                const amount = riverDef.obstacles[obstacle] * river.width * river.points.length / 500;
                const definition = obstacles_1.Obstacles.reify(obstacle);
                const hitbox = definition.spawnHitbox ?? definition.hitbox;
                for (let i = 0; i < amount; i++) {
                    const position = this.getRandomPosition(hitbox, {
                        getPosition: () => {
                            return river.getRandomPosition(definition.spawnMode === constants_1.MapObjectSpawnMode.Trail, hitbox.type === hitbox_1.HitboxType.Circle ? hitbox.radius : 0);
                        },
                        spawnMode: definition.spawnMode,
                        ignoreClearings: true,
                        river
                    });
                    if (position) {
                        this.generateObstacle(definition, position);
                    }
                }
            }
        }
    }
    _generateClearings(clearingDef) {
        if (!clearingDef)
            return;
        const { minWidth, minHeight, maxWidth, maxHeight, count: initialCount, obstacles } = clearingDef;
        const count = this.mapScale(initialCount);
        for (let i = 0; i < count; i++) {
            const width = this.mapScale((0, random_1.randomFloat)(minWidth, maxWidth));
            const height = this.mapScale((0, random_1.randomFloat)(minHeight, maxHeight));
            let hitbox = hitbox_1.RectangleHitbox.fromRect(width, height);
            let position;
            let attempts = 0;
            let validPositionFound = false;
            while (!validPositionFound && attempts < 100) {
                if ((position = this.getRandomPosition(hitbox)) !== undefined) {
                    validPositionFound = true;
                    this.clearings.push(hitbox = hitbox_1.RectangleHitbox.fromRect(width, height, position));
                    break;
                }
                attempts++;
            }
            if (attempts >= 100 && !validPositionFound) {
                this.game.warn("Failed to find valid position for clearing");
                continue;
            }
            for (const obstacle of obstacles) {
                this._generateObstacles(obstacle.idString, (0, random_1.random)(obstacle.min, obstacle.max), () => hitbox.randomPoint());
            }
        }
    }
    _generateBuildings(definition, count) {
        count = this.mapScale(count);
        const buildingDef = buildings_1.Buildings.reify(definition);
        if (!buildingDef.bridgeHitbox) {
            const { idString, rotationMode, spawnHitbox, bunkerSpawnHitbox: bunkerHitbox, spawnMode = constants_1.MapObjectSpawnMode.Grass, spawnRadius, spawnOrientation, spawnOffset } = buildingDef;
            const { width, height } = this;
            const { majorBuildings = [], quadBuildingLimit = {} } = this.mapDef;
            for (let i = 0; i < count; i++) {
                let position;
                let orientation;
                let foundPosition = false;
                let attempts = 0;
                while (!foundPosition && attempts < 100) {
                    orientation = GameMap.getRandomBuildingOrientation(rotationMode);
                    position = this.getRandomPosition(spawnHitbox, {
                        orientation,
                        spawnMode,
                        spawnOffset,
                        spawnRadius,
                        bunkerHitbox,
                        orientationConsumer: (newOrientation) => {
                            orientation = spawnOrientation ? math_1.Numeric.addOrientations(newOrientation, spawnOrientation) : newOrientation;
                        },
                        maxAttempts: 400
                    });
                    if (position === undefined) {
                        attempts++;
                        continue;
                    }
                    const { x, y } = position;
                    let quad;
                    if (x < width / 2 && y < height / 2) {
                        quad = 1;
                    }
                    else if (x >= width / 2 && y < height / 2) {
                        quad = 2;
                    }
                    else if (x < width / 2 && y >= height / 2) {
                        quad = 3;
                    }
                    else {
                        quad = 4;
                    }
                    if (majorBuildings.includes(idString)) {
                        if (this.quadMajorBuildings.includes(quad)
                            // undefined position would cause continue above
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            || this.majorBuildingPositions.some(pos => math_1.Geometry.distanceSquared(pos, position) < 150000)) {
                            attempts++;
                            continue;
                        }
                        else {
                            this.quadMajorBuildings.push(quad);
                            this.majorBuildingPositions.push(position);
                        }
                    }
                    else if (idString in quadBuildingLimit) {
                        if (this.quadBuildings[quad].filter(b => b === idString).length >= quadBuildingLimit[idString]) {
                            attempts++;
                            continue;
                        }
                        else {
                            this.quadBuildings[quad].push(idString);
                        }
                    }
                    foundPosition = true;
                }
                if (position !== undefined && foundPosition) {
                    this.generateBuilding(buildingDef, position, orientation);
                }
                else {
                    this.game.warn(`Failed to place building ${idString} after ${attempts} attempts`);
                }
            }
        }
        else {
            const { bridgeHitbox, bridgeMinRiverWidth, bridgeSpawnRanges, asymmetricalBridgeHitbox, spawnHitbox, spawnOffset } = buildingDef;
            let spawnedCount = 0;
            if (spawnOffset && "min" in spawnOffset) {
                throw new Error("min/max spawnOffset unsupported for bridges");
            }
            const generateBridge = (river, [start, end]) => {
                if (spawnedCount >= count)
                    return;
                let shortestDistance = Number.MAX_VALUE;
                let bestPosition;
                let realPosition;
                let bestOrientation = 0;
                for (let pos = start; pos <= end; pos += 0.05) {
                    const position = river.getPosition(pos);
                    if (this.occupiedBridgePositions.some(pos => vector_1.Vec.equals(pos, position)))
                        continue;
                    // Find the best orientation
                    const direction = vector_1.Vec.direction(river.getTangent(pos));
                    for (const orientation of (asymmetricalBridgeHitbox ? [0, 1, 2, 3] : [0, 1])) {
                        const distance = Math.abs(math_1.Angle.minimize(direction, misc_2.CARDINAL_DIRECTIONS[orientation]));
                        if (distance >= shortestDistance)
                            continue;
                        const finalPosition = spawnOffset ? vector_1.Vec.addAdjust(position, spawnOffset, orientation) : position;
                        if (this.isInRiver(bridgeHitbox.transform(finalPosition, 1, orientation)))
                            continue;
                        const hitbox = spawnHitbox.transform(finalPosition, 1, orientation);
                        if (hitbox.collidesWith(this.beachHitbox))
                            continue;
                        // spawn hitbox check
                        let collided = false;
                        for (const object of this.game.grid.intersectsHitbox(hitbox)) {
                            const objectHitbox = "spawnHitbox" in object && object.spawnHitbox;
                            if (!objectHitbox)
                                continue;
                            if (hitbox.collidesWith(objectHitbox)) {
                                collided = true;
                                break;
                            }
                        }
                        if (collided)
                            continue;
                        shortestDistance = distance;
                        bestPosition = position;
                        realPosition = finalPosition;
                        bestOrientation = orientation;
                    }
                }
                if (!bestPosition || !realPosition)
                    return;
                this.occupiedBridgePositions.push(bestPosition);
                const finalOrientation = asymmetricalBridgeHitbox
                    ? bestOrientation
                    : bestOrientation === 0
                        ? (0, random_1.randomBoolean)() ? 0 : 2
                        : (0, random_1.randomBoolean)() ? 1 : 3;
                this.generateBuilding(buildingDef, realPosition, finalOrientation);
                spawnedCount++;
            };
            const ranges = (bridgeSpawnRanges ?? [[0.1, 0.4], [0.6, 0.9]])
                // shuffle array: https://stackoverflow.com/a/46545530/5905216
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            for (const river of this.terrain.rivers) {
                if (river.isTrail || river.width < (bridgeMinRiverWidth ?? 0))
                    continue;
                for (const range of ranges) {
                    generateBridge(river, range);
                }
            }
        }
    }
    generateBuilding(definition, position, orientation, layer) {
        definition = buildings_1.Buildings.reify(definition);
        orientation ??= GameMap.getRandomBuildingOrientation(definition.rotationMode);
        layer ??= 0;
        if (this.game.pluginManager.emit("building_will_generate", {
            definition,
            position,
            orientation,
            layer
        }))
            return;
        const building = new building_1.Building(this.game, definition, vector_1.Vec.clone(position), orientation, layer);
        const obstacleDefinitionData = definition.obstacles ?? [];
        // ---------------------------------------------------------------------------
        // Stage 1: Collect all replaceable obstacles.
        // ---------------------------------------------------------------------------
        const replaceableObstacles = [];
        for (const obstacleData of obstacleDefinitionData) {
            if (obstacleData.replaceableBy !== undefined) {
                replaceableObstacles.push(obstacleData);
            }
        }
        // ---------------------------------------------------------------------------
        // ---------------------------------------------------------------------------
        // Stage 2: Pick Random
        // ---------------------------------------------------------------------------
        const chosenReplaceableObstacle = (0, random_1.pickRandomInArray)(replaceableObstacles);
        // ---------------------------------------------------------------------------
        for (const obstacleData of obstacleDefinitionData) {
            let idString = (0, misc_2.getRandomIDString)(obstacleData.idString);
            if (idString === objectDefinitions_1.NullString)
                continue;
            if (obstacleData.outdoors && this.game.mode.obstacleVariants) {
                idString = `${idString}_${this.game.modeName}`;
            }
            // ------------------------------------------------------------------------------------------------
            // Stage 3: Find it and then replace it by changing the idString before generation.
            // ------------------------------------------------------------------------------------------------
            let isChosenObstacle = false;
            if (obstacleData.replaceableBy !== undefined) {
                isChosenObstacle = idString === chosenReplaceableObstacle.idString && vector_1.Vec.equals(obstacleData.position, chosenReplaceableObstacle.position);
                if (isChosenObstacle && chosenReplaceableObstacle.replaceableBy !== undefined) {
                    idString = chosenReplaceableObstacle.replaceableBy;
                }
            }
            // ------------------------------------------------------------------------------------------------
            const obstacleDef = obstacles_1.Obstacles.fromString(idString);
            let obstacleRotation = obstacleData.rotation ?? GameMap.getRandomRotation(obstacleDef.rotationMode);
            if (obstacleDef.rotationMode === constants_1.RotationMode.Limited) {
                obstacleRotation = math_1.Numeric.addOrientations(orientation, obstacleRotation);
            }
            let lootSpawnOffset;
            if (obstacleData.lootSpawnOffset)
                lootSpawnOffset = vector_1.Vec.addAdjust((0, vector_1.Vec)(0, 0), obstacleData.lootSpawnOffset, orientation);
            const obstacle = this.generateObstacle(obstacleDef, vector_1.Vec.addAdjust(position, obstacleData.position, orientation), {
                rotation: obstacleRotation,
                layer: layer + (obstacleData.layer ?? 0),
                scale: obstacleData.scale ?? 1,
                variation: obstacleData.variation,
                lootSpawnOffset,
                parentBuilding: building,
                puzzlePiece: isChosenObstacle ? isChosenObstacle : obstacleData.puzzlePiece,
                locked: obstacleData.locked,
                activated: obstacleData.activated,
                waterOverlay: obstacleData.waterOverlay
            }, obstacleData.outdoors);
            if (obstacle && (obstacleDef.isActivatable
                || obstacleDef.isDoor)) {
                building.interactableObstacles.add(obstacle);
            }
        }
        for (const lootData of definition.lootSpawners ?? []) {
            for (const item of (0, lootHelpers_1.getLootFromTable)(this.game.modeName, lootData.table)) {
                this.game.addLoot(item.idString, vector_1.Vec.addAdjust(position, lootData.position, orientation), layer, { count: item.count, jitterSpawn: false });
            }
        }
        const subBuildingsData = definition.subBuildings ?? [];
        const replaceableSubBuildings = [];
        for (const subBuilding of subBuildingsData) {
            if (subBuilding.replaceableBy !== undefined) {
                replaceableSubBuildings.push(subBuilding);
            }
        }
        const chosenReplaceableSubBuilding = (0, random_1.pickRandomInArray)(replaceableSubBuildings);
        for (const subBuilding of subBuildingsData) {
            let idString = (0, misc_2.getRandomIDString)(subBuilding.idString);
            if (idString === objectDefinitions_1.NullString)
                continue;
            let isChosenSubBuilding = false;
            if (subBuilding.replaceableBy !== undefined) {
                isChosenSubBuilding = idString === chosenReplaceableSubBuilding.idString && vector_1.Vec.equals(subBuilding.position, chosenReplaceableSubBuilding.position);
                if (isChosenSubBuilding && chosenReplaceableSubBuilding.replaceableBy !== undefined) {
                    idString = chosenReplaceableSubBuilding.replaceableBy;
                }
            }
            const finalOrientation = math_1.Numeric.addOrientations(orientation, subBuilding.orientation ?? 0);
            this.generateBuilding(idString, vector_1.Vec.addAdjust(position, subBuilding.position, finalOrientation), finalOrientation, layer + (subBuilding.layer ?? 0));
        }
        for (const floor of definition.floors ?? []) {
            this.terrain.addFloor(floor.type, floor.hitbox.transform(position, 1, orientation), floor.layer ?? layer);
        }
        if (!definition.hideOnMap)
            this._packet.objects.push(building);
        this.game.grid.addObject(building);
        this.game.pluginManager.emit("building_did_generate", building);
        return building;
    }
    _generateObstacles(definition, count, getPosition) {
        // i don't know why "definition = Obstacles.reify(definition)" doesn't work anymore, but it doesn't
        const def = obstacles_1.Obstacles.reify(definition);
        const { scale = { spawnMin: 1, spawnMax: 1 }, variations, rotationMode } = def;
        const { spawnMin, spawnMax } = scale;
        const effSpawnHitbox = def.spawnHitbox ?? def.hitbox;
        count = this.mapScale(count);
        for (let i = 0; i < count; i++) {
            const scale = (0, random_1.randomFloat)(spawnMin, spawnMax);
            const variation = (variations !== undefined ? (0, random_1.random)(0, variations - 1) : 0);
            const rotation = GameMap.getRandomRotation(rotationMode);
            let orientation = 0;
            if (rotationMode === constants_1.RotationMode.Limited) {
                orientation = rotation;
            }
            const position = this.getRandomPosition(effSpawnHitbox, {
                getPosition,
                scale,
                orientation,
                spawnMode: def.spawnMode,
                ignoreClearings: this.mapDef.clearings?.allowedObstacles.includes(def.idString)
            });
            if (!position) {
                this.game.warn(`Failed to find valid position for obstacle ${def.idString}`);
                continue;
            }
            this.generateObstacle(def, position, { layer: constants_1.Layer.Ground, scale, variation });
        }
    }
    generateObstacle(definition, position, { rotation, layer, scale, variation, lootSpawnOffset, parentBuilding, puzzlePiece, locked, activated, waterOverlay } = {}, ignoreHideOnMap) {
        const def = obstacles_1.Obstacles.reify(definition);
        layer ??= 0;
        scale ??= (0, random_1.randomFloat)(def.scale?.spawnMin ?? 1, def.scale?.spawnMax ?? 1);
        if (variation === undefined && def.variations !== undefined) {
            variation = (0, random_1.random)(0, def.variations - 1);
        }
        rotation ??= GameMap.getRandomRotation(def.rotationMode);
        if (this.game.pluginManager.emit("obstacle_will_generate", {
            type: def,
            position,
            rotation,
            layer,
            scale,
            variation,
            lootSpawnOffset,
            parentBuilding,
            puzzlePiece,
            locked,
            activated,
            waterOverlay
        }))
            return;
        const obstacle = new obstacle_1.Obstacle(this.game, def, vector_1.Vec.clone(position), rotation, layer, scale, variation, lootSpawnOffset, parentBuilding, puzzlePiece, locked, activated, waterOverlay);
        if ((!def.hideOnMap || ignoreHideOnMap)
            && !def.invisible
            && (obstacle.layer === constants_1.Layer.Ground || def.hideOnMap === false) // explicitly specifying false ignores layer
        )
            this._packet.objects.push(obstacle);
        this.game.grid.addObject(obstacle);
        this.game.updateObjects = true;
        this.game.pluginManager.emit("obstacle_did_generate", obstacle);
        return obstacle;
    }
    _generateObstacleClumps(clumpDef) {
        const clumpAmount = this.mapScale(clumpDef.clumpAmount);
        const { obstacles, minAmount, maxAmount, radius: initialRadius, jitter: initialJitter } = clumpDef.clump;
        const radius = this.mapScale(initialRadius);
        const jitter = this.mapScale(initialJitter);
        const spawnMode = obstacles_1.Obstacles.reify(clumpDef.clump.obstacles[0]).spawnMode;
        for (let i = 0; i < clumpAmount; i++) {
            const position = this.getRandomPosition(new hitbox_1.CircleHitbox(radius + jitter), { spawnMode });
            if (!position) {
                this.game.warn("Spawn position cannot be found");
                continue;
            }
            const amountOfObstacles = this.mapScale((0, random_1.random)(minAmount, maxAmount));
            const offset = (0, random_1.randomRotation)();
            const step = math_1.τ / amountOfObstacles;
            for (let j = 0; j < amountOfObstacles; j++) {
                this.generateObstacle((0, random_1.pickRandomInArray)(obstacles), vector_1.Vec.add((0, random_1.randomPointInsideCircle)(position, jitter), vector_1.Vec.fromPolar(j * step + offset, radius)));
            }
        }
    }
    _generateLoots(table, count) {
        for (let i = 0; i < count; i++) {
            const loot = (0, lootHelpers_1.getLootFromTable)(this.game.modeName, table);
            const position = this.getRandomPosition(new hitbox_1.CircleHitbox(5), { spawnMode: constants_1.MapObjectSpawnMode.GrassAndSand });
            if (!position) {
                this.game.warn(`Failed to find valid position for loot generated from table '${table}'`);
                continue;
            }
            for (const item of loot) {
                this.game.addLoot(item.idString, position, constants_1.Layer.Ground, { count: item.count, jitterSpawn: false });
            }
        }
    }
    getRandomPosition(initialHitbox, params) {
        let position = (0, vector_1.Vec)(0, 0);
        const scale = params?.scale ?? 1;
        let orientation = params?.orientation ?? 0;
        const maxAttempts = params?.maxAttempts ?? 200;
        const collidableObjects = params?.collidableObjects ?? {
            [constants_1.ObjectCategory.Obstacle]: true,
            [constants_1.ObjectCategory.Building]: true
        };
        const spawnMode = params?.spawnMode ?? constants_1.MapObjectSpawnMode.Grass;
        let river = params?.river;
        const getPosition = params?.getPosition ?? (() => {
            switch (spawnMode) {
                case constants_1.MapObjectSpawnMode.Grass: {
                    return () => (0, random_1.randomVector)(this._beachPadding + width, this.width - this._beachPadding - width, this._beachPadding + height, this.height - this._beachPadding - height);
                }
                case constants_1.MapObjectSpawnMode.GrassAndSand: {
                    return () => (0, random_1.randomVector)(this.oceanSize + width, this.width - this.oceanSize - width, this.oceanSize + height, this.height - this.oceanSize - height);
                }
                // TODO: evenly distribute objects based on river size
                case constants_1.MapObjectSpawnMode.River: {
                    // rivers that aren't trails must have a waterHitbox
                    return () => {
                        river ??= (0, random_1.pickRandomInArray)(this.terrain.rivers.filter(({ isTrail }) => !isTrail));
                        return river.getRandomPosition(false, initialHitbox.type === hitbox_1.HitboxType.Circle ? initialHitbox.radius : 0);
                    };
                }
                case constants_1.MapObjectSpawnMode.Beach: {
                    return () => {
                        params?.orientationConsumer?.(orientation = GameMap.getRandomBuildingOrientation(constants_1.RotationMode.Limited));
                        const beachRect = this.beachHitbox.hitboxes[orientation].clone();
                        switch (orientation) {
                            case 1:
                            case 3: {
                                beachRect.min.x += width;
                                beachRect.max.x -= width;
                                break;
                            }
                            case 0:
                            case 2: {
                                beachRect.min.y += height;
                                beachRect.max.y -= height;
                                break;
                            }
                        }
                        let spawnOffset = params?.spawnOffset;
                        let point;
                        if (spawnOffset && "min" in spawnOffset) {
                            const { min, max } = spawnOffset;
                            spawnOffset = (0, random_1.randomVector)(min.x, max.x, min.y, max.y);
                            switch (orientation) {
                                case 1:
                                case 3: {
                                    point = (0, vector_1.Vec)((0, random_1.randomFloat)(beachRect.min.x, beachRect.max.x), beachRect.getCenter().y);
                                    break;
                                }
                                case 0:
                                case 2: {
                                    point = (0, vector_1.Vec)(beachRect.getCenter().x, (0, random_1.randomFloat)(beachRect.min.y, beachRect.max.y));
                                    break;
                                }
                            }
                        }
                        else {
                            point = beachRect.randomPoint();
                        }
                        return spawnOffset ? vector_1.Vec.addAdjust(point, spawnOffset, orientation) : point;
                    };
                }
                case constants_1.MapObjectSpawnMode.Trail: {
                    return () => {
                        river ??= (0, random_1.pickRandomInArray)(this.terrain.rivers.filter(({ isTrail }) => isTrail));
                        return river.getRandomPosition(true, initialHitbox.type === hitbox_1.HitboxType.Circle ? initialHitbox.radius : 0);
                    };
                }
                case constants_1.MapObjectSpawnMode.Ring: {
                    return () => vector_1.Vec.add((0, vector_1.Vec)(this.width / 2, this.height / 2), vector_1.Vec.fromPolar((0, random_1.randomRotation)(), params?.spawnRadius ?? 0));
                }
            }
        })();
        const rect = initialHitbox.toRectangle();
        const width = rect.max.x - rect.min.x;
        const height = rect.max.y - rect.min.y;
        let attempts = 0;
        let collided = true;
        while (collided && attempts < maxAttempts) {
            attempts++;
            collided = false;
            position = getPosition();
            if (!position || params?.collides?.(position)) {
                collided = true;
                continue;
            }
            const checkHitbox = (hitbox, layer) => {
                for (const object of this.game.grid.intersectsHitbox(hitbox)) {
                    let objectHitbox;
                    if ("spawnHitbox" in object) {
                        objectHitbox = object.spawnHitbox;
                    }
                    else if (object.hitbox) {
                        objectHitbox = object.hitbox;
                    }
                    else {
                        continue;
                    }
                    if (collidableObjects[object.type]
                        && (0, layer_1.equalLayer)(object.layer, layer)
                        && hitbox.collidesWith(objectHitbox)) {
                        collided = true;
                        break;
                    }
                }
            };
            const hitbox = initialHitbox.transform(position, scale, orientation);
            checkHitbox(hitbox, constants_1.Layer.Ground);
            const bunkerHitbox = params?.bunkerHitbox?.transform(position, scale, orientation);
            if (bunkerHitbox)
                checkHitbox(bunkerHitbox, constants_1.Layer.Basement);
            if (collided)
                continue;
            switch (spawnMode) {
                case constants_1.MapObjectSpawnMode.Grass:
                case constants_1.MapObjectSpawnMode.GrassAndSand:
                case constants_1.MapObjectSpawnMode.Beach:
                case constants_1.MapObjectSpawnMode.Ring: {
                    for (const river of this.terrain.getRiversInHitbox(hitbox)) {
                        if ((spawnMode !== constants_1.MapObjectSpawnMode.GrassAndSand || river.isTrail)
                            && (river.bankHitbox.isPointInside(position) || hitbox.collidesWith(river.bankHitbox))) {
                            collided = true;
                            break;
                        }
                        if (spawnMode === constants_1.MapObjectSpawnMode.GrassAndSand
                            && (river.waterHitbox?.isPointInside(position) || river.waterHitbox?.collidesWith(hitbox))) {
                            collided = true;
                            break;
                        }
                    }
                    if (!params?.ignoreClearings) {
                        for (const clearing of this.clearings) {
                            if (clearing.collidesWith(hitbox)) {
                                collided = true;
                                break;
                            }
                        }
                    }
                    break;
                }
                case constants_1.MapObjectSpawnMode.River: {
                    if (!this.islandHitbox.isPointInside(position)) {
                        collided = true;
                        break;
                    }
                    let points;
                    if (hitbox instanceof hitbox_1.CircleHitbox) {
                        const radius = hitbox.radius;
                        points = [
                            vector_1.Vec.subComponent(position, 0, radius),
                            vector_1.Vec.subComponent(position, radius, 0),
                            vector_1.Vec.addComponent(position, 0, radius),
                            vector_1.Vec.addComponent(position, radius, 0)
                        ];
                    }
                    else if (hitbox instanceof hitbox_1.RectangleHitbox) {
                        const { min, max } = hitbox;
                        points = [
                            min,
                            (0, vector_1.Vec)(max.x, min.y),
                            (0, vector_1.Vec)(min.x, max.y),
                            max
                        ];
                    }
                    else {
                        points = [];
                    }
                    for (const point of points) {
                        if (!river?.waterHitbox?.isPointInside(point)) {
                            collided = true;
                            break;
                        }
                        if (collided)
                            break;
                    }
                    break;
                }
                case constants_1.MapObjectSpawnMode.Trail: {
                    if (this.isInRiver(hitbox)) {
                        collided = true;
                        break;
                    }
                    break;
                }
            }
        }
        return attempts < maxAttempts ? position : undefined;
    }
    isInRiver(hitbox) {
        for (const river of this.terrain.getRiversInHitbox(hitbox)) {
            if (river.waterHitbox?.collidesWith(hitbox)) {
                return true;
            }
        }
        return false;
    }
}
exports.GameMap = GameMap;
//# sourceMappingURL=map.js.map