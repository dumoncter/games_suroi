"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerContainer = void 0;
exports.isGroundLayer = isGroundLayer;
exports.isStairLayer = isStairLayer;
exports.equalLayer = equalLayer;
exports.equalOrOneAboveLayer = equalOrOneAboveLayer;
exports.equalOrOneBelowLayer = equalOrOneBelowLayer;
exports.isAdjacent = isAdjacent;
exports.adjacentOrEqualLayer = adjacentOrEqualLayer;
exports.equivLayer = equivLayer;
exports.adjacentOrEquivLayer = adjacentOrEquivLayer;
exports.isVisibleFromLayer = isVisibleFromLayer;
exports.getLayerContainer = getLayerContainer;
const constants_1 = require("../constants");
/**
 * Returns whether or not the provided layer is a "ground" layer.
 * @param layer The layer to evaluate.
 * @returns `true` if the layer is a "ground" layer; `false` otherwise.
 */
function isGroundLayer(layer) {
    return layer % 2 === 0;
}
/**
 * Returns whether or not the provided layer is a "stair" layer; stair layers serve as transitions
 * between ground layers.
 * @param layer The layer to evaluate.
 * @returns `true` if the layer is a "stair" layer; `false` otherwise.
 */
function isStairLayer(layer) {
    return layer % 2 !== 0;
}
/**
 * Returns whether or not the two layers are equal.
 * @param focusLayer The reference layer.
 * @param evalLayer The layer to evaluate relative to the reference layer.
 * @returns `true` if the two layers are the same; `false` otherwise.
 */
function equalLayer(referenceLayer, evalLayer) {
    return referenceLayer === evalLayer;
}
/**
 * Returns whether or not the layer being evaluated is at the same level, or one level immediately above, the reference
 * layer.
 * @param focusLayer The reference layer.
 * @param evalLayer The layer to evaluate relative to the reference layer.
 * @returns `true` if the evaluated layer is the same, or one layer above, the reference layer.
 */
function equalOrOneAboveLayer(referenceLayer, evalLayer) {
    return (referenceLayer === evalLayer) || (referenceLayer + 1 === evalLayer);
}
/**
 * Returns whether or not the layer being evaluated is at the same level, or one level immediately below, the reference
 * layer.
 * @param focusLayer The reference layer.
 * @param evalLayer The layer to evaluate relative to the reference layer.
 * @returns `true` if the evaluated layer is the same, or one layer above, the reference layer.
 */
function equalOrOneBelowLayer(referenceLayer, evalLayer) {
    return (referenceLayer === evalLayer) || (referenceLayer - 1 === evalLayer);
}
/**
 * Returns whether or not the layer being evaluated is adjacent (either one above or below) to the
 * given reference layer.
 * @returns `true` if the evaluated layer is a neighbor of the reference layer
 */
function isAdjacent(num1, num2) {
    return (num1 - 1 === num2) || (num1 + 1 === num2);
}
/**
 * Returns whether or not the layer being evaluated is identical or adjacent (either one above or below) to the
 * given reference layer.
 * @returns `true` if the evaluated layer is equal to or a neighbor of the reference layer
 */
function adjacentOrEqualLayer(referenceLayer, evalLayer) {
    return (referenceLayer - 1 === evalLayer) || (referenceLayer + 1 === evalLayer) || (referenceLayer === evalLayer);
}
function equivLayer(referenceObject, evalObject) {
    if (referenceObject.definition?.isStair)
        return adjacentOrEqualLayer(referenceObject.layer, evalObject.layer);
    switch (referenceObject.definition?.collideWithLayers) {
        case 0 /* Layers.All */: return true;
        case 1 /* Layers.Adjacent */: return adjacentOrEqualLayer(referenceObject.layer, evalObject.layer);
        case 2 /* Layers.Equal */:
        default:
            return equalLayer(referenceObject.layer, evalObject.layer);
    }
}
function adjacentOrEquivLayer(referenceObject, evalLayer) {
    const buildingOrObstacle = referenceObject.isObstacle || referenceObject.isBuilding;
    return (!buildingOrObstacle
        || referenceObject.definition.collideWithLayers !== 2 /* Layers.Equal */
        || equalLayer(referenceObject.layer, evalLayer)) && ((buildingOrObstacle
        && referenceObject.definition.collideWithLayers === 0 /* Layers.All */)
        || adjacentOrEqualLayer(referenceObject.layer, evalLayer));
}
/**
 * Determines whether a given object is visible from layer `observerLayer`, whilst taking into account any
 * visibility overrides in any buildings specified in `collisionCandidates`
 * @param observerLayer The layer from which we are attempting to observe the object
 * @param object The object which we are trying to observe
 * @param collisionCandidates A list of objects the observer is colliding with (or more generally, a list of
 * objects in which the visibility overrides to be honored will be contained). Omitting this parameter simply
 * leads to no visibility overrides being considered
 * @param colliderPredicate A function that, given a collider, determines whether `object` is within it. If
 * omitted, it defaults to `object.hitbox?.collidesWith(collider)`
 */
function isVisibleFromLayer(observerLayer, object) {
    const objectLayer = object.layer;
    return ( // the object is visible if…
    adjacentOrEqualLayer(observerLayer, objectLayer) // the layers are adjacent.
        || (object.definition && object.definition.visibleFromLayers === 0 /* Layers.All */) // or it appears on all layers
        || ( // otherwise…
        objectLayer < observerLayer // it must be below us
            && ( // and the ground layer mustn't be between us and it (aka object on -1, us on 1).
            objectLayer >= constants_1.Layer.Ground
                || observerLayer < constants_1.Layer.Ground)));
}
var LayerContainer;
(function (LayerContainer) {
    LayerContainer[LayerContainer["Basement"] = 0] = "Basement";
    LayerContainer[LayerContainer["Ground"] = 1] = "Ground";
    LayerContainer[LayerContainer["Upstairs"] = 2] = "Upstairs";
})(LayerContainer || (exports.LayerContainer = LayerContainer = {}));
function getLayerContainer(objectLayer, activeLayer) {
    switch (objectLayer) {
        case constants_1.Layer.Basement:
            return LayerContainer.Basement;
        case constants_1.Layer.ToBasement:
            return activeLayer <= constants_1.Layer.ToBasement ? LayerContainer.Basement : LayerContainer.Ground;
        case constants_1.Layer.Ground:
            return LayerContainer.Ground;
        case constants_1.Layer.ToUpstairs:
            return activeLayer >= constants_1.Layer.ToUpstairs ? LayerContainer.Upstairs : LayerContainer.Ground;
        case constants_1.Layer.Upstairs:
            return LayerContainer.Upstairs;
    }
}
//# sourceMappingURL=layer.js.map