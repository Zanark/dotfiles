'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const VSCode = require("vscode");
const Process = require("child_process");
class VSColorPicker {
    constructor(_extensionPath) {
        this._extensionPath = _extensionPath;
        this._config = { autoLaunch: true, autoLaunchDelay: 100 };
        this.MAX_VALUE_LEN = 20;
        this._timer = null;
        this._autoEditSelectionChanged = false;
        let configSection = VSCode.workspace.getConfiguration('vs-color-picker');
        this._config.autoLaunch = configSection.get('autoLaunch', this._config.autoLaunch);
        this._config.autoLaunchDelay = configSection.get('autoLaunchDelay', this._config.autoLaunchDelay);
    }
    OnTextEditorSelectionChange(event) {
        if (!this._config.autoLaunch) {
            return;
        }
        if (this._timer != null) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if (this._autoEditSelectionChanged) {
            this._autoEditSelectionChanged = false;
            return;
        }
        let postion = event.selections[0].active;
        let beforeString = event.textEditor.document.getText(new VSCode.Range(postion.line, 0, postion.line, postion.character));
        if (/:[\s\w]*#\w*$/.test(beforeString)) {
            let that = this;
            this._timer = setTimeout(function () {
                that.LaunchColorPicker();
                that._timer = null;
            }, this._config.autoLaunchDelay);
        }
    }
    LaunchColorPickerWindow(orignalColor, callback) {
        Process.exec(`ColorPicker.exe ${orignalColor}`, { cwd: this._extensionPath }, (error, stdout, stderr) => {
            if (stdout.length == 0) {
                return;
            }
            callback(stdout);
        });
    }
    LaunchColorPicker() {
        let editor = VSCode.window.activeTextEditor;
        let position = editor.selection.active;
        let line = position.line;
        let character = position.character;
        let str1 = this.Match(/:[\s\w]*#(\w*)$/, editor.document.getText(new VSCode.Range(line, 0, line, character)));
        let str2 = this.Match(/^(\w*)[\s;]?/, editor.document.getText(new VSCode.Range(line, character, line, character + this.MAX_VALUE_LEN)));
        this.LaunchColorPickerWindow(str1 + str2, (value) => {
            editor.edit((edit) => {
                edit.delete(new VSCode.Range(line, character, line, character + str2.length));
                edit.delete(new VSCode.Range(line, character - str1.length, line, character));
                edit.insert(editor.selection.active, value);
                this._autoEditSelectionChanged = true;
            });
        });
    }
    Match(reg, input) {
        if (!reg.test(input)) {
            return '';
        }
        return reg.exec(input)[1];
    }
    dispose() {
    }
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let picker = new VSColorPicker(VSCode.extensions.getExtension('lihui.vs-color-picker').extensionPath);
    VSCode.window.onDidChangeTextEditorSelection((e) => { picker.OnTextEditorSelectionChange(e); });
    VSCode.commands.registerCommand('extension.vs-color-picker', () => { picker.LaunchColorPicker(); });
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(picker);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map