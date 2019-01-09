"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const vscode_1 = require("vscode");
exports.config = vscode_1.workspace.getConfiguration("r");
function getRpath() {
    if (process.platform === "win32") {
        return exports.config.get("rterm.windows");
    }
    else if (process.platform === "darwin") {
        return exports.config.get("rterm.mac");
    }
    else if (process.platform === "linux") {
        return exports.config.get("rterm.linux");
    }
    else {
        vscode_1.window.showErrorMessage(process.platform + " can't use R");
        return "";
    }
}
exports.getRpath = getRpath;
function ToRStringLiteral(s, quote) {
    if (s === null) {
        return "NULL";
    }
    return (quote +
        s.replace(/\\/g, "\\\\")
            .replace(/"""/g, "\\" + quote)
            .replace(/\\n/g, "\\n")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\a/g, "\\a")
            .replace(/\\f/g, "\\f")
            .replace(/\\v/g, "\\v") +
        quote);
}
exports.ToRStringLiteral = ToRStringLiteral;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.delay = delay;
function checkForSpecialCharacters(text) {
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(text);
}
exports.checkForSpecialCharacters = checkForSpecialCharacters;
function checkIfFileExists(filePath) {
    return fs.existsSync(filePath);
}
exports.checkIfFileExists = checkIfFileExists;
function assertRTerminalCreation(rTerm) {
    if (!rTerm) {
        vscode_1.window.showErrorMessage("Could not create R terminal.");
        return false;
    }
    else {
        return true;
    }
}
exports.assertRTerminalCreation = assertRTerminalCreation;
//# sourceMappingURL=util.js.map