"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rTerminal_1 = require("./rTerminal");
async function loadAllPkg() {
    if (!rTerminal_1.rTerm) {
        const success = rTerminal_1.createRTerm(true);
        if (!success) {
            return;
        }
    }
    const rLoadAllCommand = "devtools::load_all('.')";
    rTerminal_1.rTerm.sendText(rLoadAllCommand);
}
exports.loadAllPkg = loadAllPkg;
async function testPkg() {
    if (!rTerminal_1.rTerm) {
        const success = rTerminal_1.createRTerm(true);
        if (!success) {
            return;
        }
    }
    const rTestCommand = "devtools::test()";
    rTerminal_1.rTerm.sendText(rTestCommand);
}
exports.testPkg = testPkg;
async function installPkg() {
    if (!rTerminal_1.rTerm) {
        const success = rTerminal_1.createRTerm(true);
        if (!success) {
            return;
        }
    }
    const rInstallCommand = "devtools::install()";
    rTerminal_1.rTerm.sendText(rInstallCommand);
}
exports.installPkg = installPkg;
async function buildPkg() {
    if (!rTerminal_1.rTerm) {
        const success = rTerminal_1.createRTerm(true);
        if (!success) {
            return;
        }
    }
    const rBuildCommand = "devtools::build()";
    rTerminal_1.rTerm.sendText(rBuildCommand);
}
exports.buildPkg = buildPkg;
async function documentPkg() {
    if (!rTerminal_1.rTerm) {
        const success = rTerminal_1.createRTerm(true);
        if (!success) {
            return;
        }
    }
    const rDocumentCommand = "devtools::document()";
    rTerminal_1.rTerm.sendText(rDocumentCommand);
}
exports.documentPkg = documentPkg;
//# sourceMappingURL=package.js.map