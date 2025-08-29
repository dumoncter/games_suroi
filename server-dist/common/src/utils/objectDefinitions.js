"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullString = exports.DefinitionType = exports.ObjectDefinitions = void 0;
/**
 * A class representing a list of definitions
 * @template Def The specific type of `ObjectDefinition` this class holds
 */
class ObjectDefinitions {
    definitions;
    idStringToDef = Object.create(null);
    idStringToNumber = Object.create(null);
    /**
     * Whether there are more than 256 definitions in this schema, requiring 2 bytes to serialize
     */
    overLength;
    constructor(definitions) {
        this.definitions = definitions;
        let idx = 0;
        for (const def of definitions) {
            const idString = def.idString;
            if (idString in this.idStringToDef) {
                throw new Error(`Duplicate idString '${idString}' in schema`);
            }
            // casting here is necessary to modify the readonly defs
            this.idStringToDef[idString] = def;
            this.idStringToNumber[idString] = idx++;
        }
        this.overLength = idx > 255;
    }
    reify(type) {
        return typeof type === "string"
            ? this.fromString(type)
            : type;
    }
    fromString(idString) {
        const def = this.fromStringSafe(idString);
        if (def === undefined) {
            throw new ReferenceError(`Unknown idString '${idString}' for this schema`);
        }
        return def;
    }
    fromStringSafe(idString) {
        return this.idStringToDef[idString];
    }
    hasString(idString) {
        return idString in this.idStringToDef;
    }
    writeToStream(stream, def) {
        const idString = typeof def === "string" ? def : def.idString;
        if (!this.hasString(idString)) {
            throw new Error(`Unknown idString '${idString}' for this schema`);
        }
        const idx = this.idStringToNumber[idString];
        if (this.overLength) {
            stream.writeUint16(idx);
        }
        else {
            stream.writeUint8(idx);
        }
    }
    readFromStream(stream) {
        const idx = this.overLength ? stream.readUint16() : stream.readUint8();
        const def = this.definitions[idx];
        if (def === undefined) {
            throw new RangeError(`Bad index ${idx} in schema`);
        }
        if (!this.hasString(def.idString)) {
            throw new Error(`Unknown idString '${def.idString}' for this schema`);
        }
        return def;
    }
    [Symbol.iterator]() {
        return this.definitions[Symbol.iterator]();
    }
}
exports.ObjectDefinitions = ObjectDefinitions;
var DefinitionType;
(function (DefinitionType) {
    DefinitionType[DefinitionType["Ammo"] = 0] = "Ammo";
    DefinitionType[DefinitionType["Armor"] = 1] = "Armor";
    DefinitionType[DefinitionType["Backpack"] = 2] = "Backpack";
    DefinitionType[DefinitionType["Badge"] = 3] = "Badge";
    DefinitionType[DefinitionType["Building"] = 4] = "Building";
    DefinitionType[DefinitionType["Bullet"] = 5] = "Bullet";
    DefinitionType[DefinitionType["Decal"] = 6] = "Decal";
    DefinitionType[DefinitionType["Emote"] = 7] = "Emote";
    DefinitionType[DefinitionType["Explosion"] = 8] = "Explosion";
    DefinitionType[DefinitionType["Gun"] = 9] = "Gun";
    DefinitionType[DefinitionType["HealingItem"] = 10] = "HealingItem";
    DefinitionType[DefinitionType["MapPing"] = 11] = "MapPing";
    DefinitionType[DefinitionType["MapIndicator"] = 12] = "MapIndicator";
    DefinitionType[DefinitionType["Melee"] = 13] = "Melee";
    DefinitionType[DefinitionType["Obstacle"] = 14] = "Obstacle";
    DefinitionType[DefinitionType["Perk"] = 15] = "Perk";
    DefinitionType[DefinitionType["Scope"] = 16] = "Scope";
    DefinitionType[DefinitionType["Skin"] = 17] = "Skin";
    DefinitionType[DefinitionType["SyncedParticle"] = 18] = "SyncedParticle";
    DefinitionType[DefinitionType["Throwable"] = 19] = "Throwable";
})(DefinitionType || (exports.DefinitionType = DefinitionType = {}));
/**
 * Used to communicate that no idString matches or is applicable, can be used as a key and value
 */
exports.NullString = Symbol("null idString");
//# sourceMappingURL=objectDefinitions.js.map