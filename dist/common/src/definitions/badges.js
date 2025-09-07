"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badges = void 0;
const objectDefinitions_1 = require("../utils/objectDefinitions");
const badge = (name, roles) => ({
    idString: `bdg_${name.toLowerCase().split(" ").join("_")}`,
    name,
    defType: objectDefinitions_1.DefinitionType.Badge,
    roles
});
exports.Badges = new objectDefinitions_1.ObjectDefinitions([
    // Roles
    badge("Developr", ["developr", "pap"]),
    badge("Dev Managr", ["dev_managr"]),
    badge("Designr", ["designr"]),
    badge("VIP Designr", ["vip_designr"]),
    badge("Sound Designr", ["sound_designr"]),
    badge("Moderatr", ["moderatr"]),
    badge("Administratr", ["administratr"]),
    badge("Content Creatr", ["content_creatr", "lead_content_creatr"]),
    badge("Donatr", ["donatr"]),
    badge("Marketr", ["marketr"]),
    badge("Ownr", ["hasanger"]),
    // Player
    badge("Bleh"),
    badge("Froog"),
    badge("AEGIS Logo"),
    badge("Flint Logo"),
    badge("NSD Logo"),
    badge("Suroi Logo"),
    badge("Duel"),
    badge("Fire"),
    badge("Colon Three"),
    badge("Suroi General Chat")
]);
//# sourceMappingURL=badges.js.map