"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGameObjectTemplate = void 0;
const constants_1 = require("../constants");
// lol you're so funny eslint
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeGameObjectTemplate = () => {
    class GameObjectBase {
        static _subclasses = {};
        constructor() {
            if (!Object.values(GameObjectBase._subclasses).some(cls => new.target.prototype instanceof cls)) {
                throw new Error(`Illegal subclass of BaseGameObject '${new.target.name}'; subclasses must be obtained by calling BaseGameObject.derive, or must be a subclass thereof`);
            }
        }
        static derive(category) {
            if (category in GameObjectBase._subclasses) {
                throw new Error(`Subclass for category '${constants_1.ObjectCategory[category]}' already registered`);
            }
            // @ts-expect-error i don't know
            return GameObjectBase._subclasses[category] = class extends this {
                type = category;
                constructor(...args) {
                    // @ts-expect-error this has type This (no way)
                    super(...args);
                    // @ts-expect-error it's easier this way lol
                    this[`is${constants_1.ObjectCategory[category]}`] = true;
                }
            };
        }
    }
    return GameObjectBase;
};
exports.makeGameObjectTemplate = makeGameObjectTemplate;
//# sourceMappingURL=gameObject.js.map