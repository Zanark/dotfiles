"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
// import path = require("path");
const vscode_1 = require("vscode");
const rTerminal_1 = require("./rTerminal");
const util_1 = require("./util");
const diagnostics = vscode_1.languages.createDiagnosticCollection("R");
const lintRegex = /(.+?):(\d+):(\d+): ((?:error)|(?:warning|style)): (.+)/g;
function lintr() {
    if (!(util_1.config.get("lintr.enabled") &&
        vscode_1.window.activeTextEditor.document.languageId === "r")) {
        return;
    }
    let rPath = util_1.config.get("lintr.executable");
    if (!rPath) {
        rPath = util_1.getRpath();
    }
    if (!rPath) {
        return;
    }
    let rCommand;
    const cache = util_1.config.get("lintr.cache") ? "TRUE" : "FALSE";
    const linters = util_1.config.get("lintr.linters");
    const isPackage = util_1.config.get("lintr.ispackage");
    const fPath = util_1.ToRStringLiteral(vscode_1.window.activeTextEditor.document.fileName, "'");
    const lintrArgs = `cache = ${cache}, linters = ${linters}`;
    const lintrExec = getLintrCommand(isPackage, lintrArgs, fPath);
    if (process.platform === "win32") {
        rCommand = `\"suppressPackageStartupMessages(library(lintr));${lintrExec}\"`;
    }
    else {
        rCommand = `suppressPackageStartupMessages(library(lintr));${lintrExec}`;
    }
    const parameters = [
        "--vanilla",
        "--slave",
        "--restore",
        "--no-save",
        "-e",
        rCommand,
        "--args",
        "@"
    ];
    cp.execFile(rPath, parameters, (error, stdout, stderr) => {
        if (stderr) {
            // console.log("stderr:" + stderr.toString());
        }
        if (error) {
            vscode_1.window.showInformationMessage("lintr is not installed", "install lintr", "disable lintr").then((item) => {
                if (item === "install lintr") {
                    installLintr();
                    return;
                }
                else if (item === "disable lintr") {
                    util_1.config.update("lintr.enabled", false);
                    diagnostics.clear();
                    return;
                }
            });
        }
        let match = lintRegex.exec(stdout);
        const diagsCollection = {};
        diagnostics.clear();
        while (match !== null) {
            let filename = match[1];
            if (isPackage) {
                filename = vscode_1.workspace.rootPath + "/" + filename;
            }
            const range = new vscode_1.Range(new vscode_1.Position(Number(match[2]) - 1, match[3] === undefined ? 0
                : Number(match[3]) - 1), new vscode_1.Position(Number(match[2]) - 1, match[3] === undefined ? Number.MAX_SAFE_INTEGER
                : Number(match[3]) - 1));
            const message = match[5];
            const severity = parseSeverity(match[4]);
            const diag = new vscode_1.Diagnostic(range, message, severity);
            if (diagsCollection[filename] === undefined) {
                diagsCollection[filename] = [];
            }
            diagsCollection[filename].push(diag);
            match = lintRegex.exec(stdout);
            diagnostics.set(vscode_1.Uri.file(filename), diagsCollection[filename]);
        }
        return [];
    });
}
exports.lintr = lintr;
function installLintr() {
    if (!rTerminal_1.rTerm) {
        vscode_1.commands.executeCommand("r.createRTerm");
    }
    rTerminal_1.rTerm.show();
    rTerminal_1.rTerm.sendText("install.packages(\"lintr\")");
}
exports.installLintr = installLintr;
function parseSeverity(severity) {
    switch (severity) {
        case "error":
            return vscode_1.DiagnosticSeverity.Error;
        case "warning":
            return vscode_1.DiagnosticSeverity.Warning;
        case "style":
            return vscode_1.DiagnosticSeverity.Information;
        default:
            return vscode_1.DiagnosticSeverity.Hint;
    }
}
function getLintrCommand(isPackage, lintrArgs, fPath) {
    if (isPackage) {
        return `lint_package("${vscode_1.workspace.rootPath}", ${lintrArgs})`;
    }
    else {
        return `lint(${fPath}, ${lintrArgs})`;
    }
}
//# sourceMappingURL=rLint.js.map