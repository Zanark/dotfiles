"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const vscode_1 = require("vscode");
const rTerminal_1 = require("./rTerminal");
const selection_1 = require("./selection");
const util_1 = require("./util");
async function previewEnvironment() {
    if (!rTerminal_1.rTerm) {
        const success = rTerminal_1.createRTerm(true);
        if (!success) {
            return;
        }
    }
    if (!checkcsv()) {
        return;
    }
    const tmpDir = makeTmpDir();
    const pathToTmpCsv = tmpDir + "/environment.csv";
    const envName = "name=ls()";
    const envClass = "class=sapply(ls(), function(x) {class(get(x))})";
    const envOut = "out=sapply(ls(), function(x) {capture.output(str(get(x)), silent = T)[1]})";
    const rWriteCsvCommand = "write.csv(data.frame("
        + envName + ","
        + envClass + ","
        + envOut + "), '"
        + pathToTmpCsv + "', row.names=FALSE, quote = TRUE)";
    rTerminal_1.rTerm.sendText(rWriteCsvCommand);
    await openTmpCSV(pathToTmpCsv, tmpDir);
}
exports.previewEnvironment = previewEnvironment;
async function previewDataframe() {
    if (!rTerminal_1.rTerm) {
        const success = rTerminal_1.createRTerm(true);
        if (!success) {
            return;
        }
    }
    if (!checkcsv()) {
        return;
    }
    const dataframeName = selection_1.getSelection();
    if (!util_1.checkForSpecialCharacters(dataframeName)) {
        vscode_1.window.showInformationMessage("This does not appear to be a dataframe.");
        return false;
    }
    const tmpDir = makeTmpDir();
    // Create R write CSV command.  Turn off row names and quotes, they mess with Excel Viewer.
    const pathToTmpCsv = tmpDir + "/" + dataframeName + ".csv";
    const rWriteCsvCommand = "write.csv(" + dataframeName + ", '"
        + pathToTmpCsv
        + "', row.names = FALSE, quote = FALSE)";
    rTerminal_1.rTerm.sendText(rWriteCsvCommand);
    await openTmpCSV(pathToTmpCsv, tmpDir);
}
exports.previewDataframe = previewDataframe;
async function openTmpCSV(pathToTmpCsv, tmpDir) {
    await util_1.delay(350); // Needed since file size has not yet changed
    if (!util_1.checkIfFileExists(pathToTmpCsv)) {
        vscode_1.window.showErrorMessage("Dataframe failed to display.");
        fs.removeSync(tmpDir);
        return false;
    }
    // Async poll for R to complete writing CSV.
    const success = await waitForFileToFinish(pathToTmpCsv);
    if (!success) {
        vscode_1.window.showWarningMessage("Visual Studio Code currently limits opening files to 20 MB.");
        fs.removeSync(tmpDir);
        return false;
    }
    if (process.platform === "win32") {
        const winattr = require("winattr");
        winattr.setSync(tmpDir, { hidden: true });
    }
    // Open CSV in Excel Viewer and clean up.
    vscode_1.workspace.openTextDocument(pathToTmpCsv).then(async (file) => {
        await vscode_1.commands.executeCommand("csv.preview", file.uri);
        fs.removeSync(tmpDir);
    });
}
async function waitForFileToFinish(filePath) {
    const fileBusy = true;
    let currentSize = 0;
    let previousSize = 1;
    while (fileBusy) {
        const stats = fs.statSync(filePath);
        currentSize = stats.size;
        // UPDATE: We are now limited to 20 mb by MODEL_TOKENIZATION_LIMIT
        // https://github.com/Microsoft/vscode/blob/master/src/vs/editor/common/model/textModel.ts#L34
        if (currentSize > 2 * 10000000) { // 20 MB
            return false;
        }
        if (currentSize === previousSize) {
            return true;
        }
        else {
            previousSize = currentSize;
        }
        await util_1.delay(50);
    }
}
function makeTmpDir() {
    let tmpDir = vscode_1.workspace.rootPath;
    if (process.platform === "win32") {
        tmpDir = tmpDir.replace(/\\/g, "/");
        tmpDir += "/tmp";
    }
    else {
        tmpDir += "/.tmp";
    }
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }
    return tmpDir;
}
function checkcsv() {
    const iscsv = vscode_1.extensions.getExtension("GrapeCity.gc-excelviewer");
    if (iscsv.isActive) {
        return true;
    }
    else {
        vscode_1.window.showInformationMessage("This function need to install `GrapeCity.gc-excelviewer`");
        return false;
    }
}
//# sourceMappingURL=preview.js.map