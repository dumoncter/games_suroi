"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirectory = readDirectory;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
/**
 * Recursively read a directory.
 * @param dir The absolute path to the directory.
 * @returns An array representation of the directory's contents.
 */
function readDirectory(dir, filter) {
    let results = [];
    if (!(0, node_fs_1.existsSync)(dir))
        return results;
    for (const file of (0, node_fs_1.readdirSync)(dir)) {
        const filePath = (0, node_path_1.resolve)(dir, file);
        const stat = (0, node_fs_1.statSync)(filePath);
        if (stat?.isDirectory()) {
            results = results.concat(readDirectory(filePath, filter));
        }
        else if (filter === undefined || filter.test(filePath)) {
            results.push(filePath);
        }
    }
    return results;
}
//# sourceMappingURL=readDirectory.js.map