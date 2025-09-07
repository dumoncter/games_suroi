"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const fs_1 = require("fs");
let configExists = (0, fs_1.existsSync)("config.json");
if (!configExists && (0, fs_1.existsSync)("config.example.json")) {
    (0, fs_1.writeFileSync)("config.json", (0, fs_1.readFileSync)("config.example.json", "utf8"));
    configExists = true;
}
exports.Config = (configExists ? JSON.parse((0, fs_1.readFileSync)("config.json", "utf8")) : {});
//# sourceMappingURL=config.js.map