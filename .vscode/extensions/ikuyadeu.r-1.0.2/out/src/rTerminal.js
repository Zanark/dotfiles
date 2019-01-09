"use srict";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const vscode_1 = require("vscode");
const util_1 = require("./util");
function createRTerm(preserveshow) {
    const termName = "R Interactive";
    const termPath = util_1.getRpath();
    if (!termPath) {
        return;
    }
    const termOpt = util_1.config.get("rterm.option");
    fs.pathExists(termPath, (err, exists) => {
        if (exists) {
            exports.rTerm = vscode_1.window.createTerminal(termName, termPath, termOpt);
            exports.rTerm.show(preserveshow);
            return true;
        }
        else {
            vscode_1.window.showErrorMessage("Cannot find R client.  Please check R path in preferences and reload.");
            return false;
        }
    });
}
exports.createRTerm = createRTerm;
function deleteTerminal(term) {
    if (term === exports.rTerm) {
        exports.rTerm = null;
    }
}
exports.deleteTerminal = deleteTerminal;
//# sourceMappingURL=rTerminal.js.map