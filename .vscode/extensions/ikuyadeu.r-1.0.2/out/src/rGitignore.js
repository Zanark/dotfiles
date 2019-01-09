"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const vscode_1 = require("vscode");
const ignorePath = path.join(vscode_1.workspace.rootPath, ".gitignore");
// From "https://github.com/github/gitignore/raw/master/R.gitignore"
const ignoreFiles = [".Rhistory",
    ".Rapp.history",
    ".RData",
    "*-Ex.R",
    "/*.tar.gz",
    "/*.Rcheck/",
    ".Rproj.user/",
    "vignettes/*.html",
    "vignettes/*.pdf",
    ".httr-oauth",
    "/*_cache/",
    "/cache/",
    "*.utf8.md",
    "*.knit.md",
    "rsconnect/"].join("\n");
function createGitignore() {
    if (!vscode_1.workspace.rootPath) {
        vscode_1.window.showWarningMessage("Please open workspace to create .gitignore");
        return;
    }
    fs.writeFile(ignorePath, ignoreFiles, (err) => {
        try {
            if (err) {
                vscode_1.window.showErrorMessage(err.name);
            }
        }
        catch (e) {
            vscode_1.window.showErrorMessage(e.message);
        }
    });
}
exports.createGitignore = createGitignore;
//# sourceMappingURL=rGitignore.js.map