"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const net_1 = require("net");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
let client;
function activate(context) {
    // The server is implemented in node
    // let serverModule = context.asAbsolutePath(path.join('R'));
    // The debug options for the server
    const serverOptions = function foo() {
        return new Promise((resolve, reject) => {
            let childProcess;
            const server = net_1.createServer((socket) => {
                // When the language server connects, grab socket, stop listening and resolve
                // this.socket = socket
                server.close();
                resolve({ reader: socket, writer: socket });
            });
            server.listen(0, "127.0.0.1", () => {
                const port = server.address().port;
                const runArgs = ["--quiet", "--slave", "-e", `languageserver::run(port=${port})`];
                // const debugArgs = ["--quiet", "--slave", "-e", `languageserver::run(debug=TRUE, port=${port})`];
                // Once we have a port assigned spawn the Language Server with the port
                childProcess = cp.spawn(getRpath(), runArgs);
                childProcess.stderr.on("data", (chunk) => {
                    // tslint:disable-next-line:no-console
                    console.error(chunk + "");
                    // window.showErrorMessage(chunk + "");
                });
                childProcess.stdout.on("data", (chunk) => {
                    // tslint:disable-next-line:no-console
                    console.error(chunk + "");
                });
                return childProcess;
            });
        });
    };
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: "file", language: "r" }, { scheme: "file", language: "rmd" }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contain in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/*.r"),
        },
    };
    // Create the language client and start the client.
    client = new vscode_languageclient_1.LanguageClient("rlangsvr", "Language Server R", serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
}
exports.activate = activate;
exports.config = vscode_1.workspace.getConfiguration("r");
function getRpath() {
    const path = exports.config.get("rpath.lsp");
    if (path !== "") {
        return path;
    }
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
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map