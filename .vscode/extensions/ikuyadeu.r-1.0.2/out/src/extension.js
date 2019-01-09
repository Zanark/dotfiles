"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const package_1 = require("./package");
const preview_1 = require("./preview");
const rGitignore_1 = require("./rGitignore");
const rTerminal_1 = require("./rTerminal");
const selection_1 = require("./selection");
const util_1 = require("./util");
const wordPattern = /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\s]+)/g;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    function runSource(echo) {
        const wad = vscode_1.window.activeTextEditor.document;
        wad.save();
        let rPath = ToRStringLiteral(wad.fileName, '"');
        let encodingParam = util_1.config.get("source.encoding");
        if (encodingParam) {
            encodingParam = `encoding = "${encodingParam}"`;
            rPath = [rPath, encodingParam].join(", ");
        }
        if (echo) {
            rPath = [rPath, "echo = TRUE"].join(", ");
        }
        if (!rTerminal_1.rTerm) {
            const success = rTerminal_1.createRTerm(true);
            if (!success) {
                return;
            }
        }
        rTerminal_1.rTerm.sendText(`source(${rPath})`);
        setFocus();
    }
    async function runSelection() {
        const selection = selection_1.getSelection();
        if (!rTerminal_1.rTerm) {
            const success = rTerminal_1.createRTerm(true);
            if (!success) {
                return;
            }
            await util_1.delay(200); // Let RTerm warm up
        }
        if (selection.linesDownToMoveCursor > 0) {
            vscode_1.commands.executeCommand("cursorMove", { to: "down", value: selection.linesDownToMoveCursor });
            vscode_1.commands.executeCommand("cursorMove", { to: "wrappedLineEnd" });
        }
        for (const line of selection.selectedTextArray) {
            if (selection_1.checkForComment(line)) {
                continue;
            }
            await util_1.delay(8); // Increase delay if RTerm can't handle speed.
            rTerminal_1.rTerm.sendText(line);
        }
        setFocus();
    }
    function setFocus() {
        const focus = util_1.config.get("source.focus");
        if (focus === "terminal") {
            rTerminal_1.rTerm.show();
        }
    }
    vscode_1.languages.setLanguageConfiguration("r", {
        wordPattern,
    });
    context.subscriptions.push(vscode_1.commands.registerCommand("r.runSource", () => runSource(false)), vscode_1.commands.registerCommand("r.createRTerm", rTerminal_1.createRTerm), vscode_1.commands.registerCommand("r.runSourcewithEcho", () => runSource(true)), vscode_1.commands.registerCommand("r.runSelection", runSelection), vscode_1.commands.registerCommand("r.createGitignore", rGitignore_1.createGitignore), vscode_1.commands.registerCommand("r.previewDataframe", preview_1.previewDataframe), vscode_1.commands.registerCommand("r.previewEnvironment", preview_1.previewEnvironment), vscode_1.commands.registerCommand("r.loadAll", package_1.loadAllPkg), vscode_1.commands.registerCommand("r.test", package_1.testPkg), vscode_1.commands.registerCommand("r.install", package_1.installPkg), vscode_1.commands.registerCommand("r.build", package_1.buildPkg), vscode_1.commands.registerCommand("r.document", package_1.documentPkg), vscode_1.window.onDidCloseTerminal(rTerminal_1.deleteTerminal));
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
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map