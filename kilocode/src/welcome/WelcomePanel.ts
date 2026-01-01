import * as vscode from "vscode"
import { getUri } from "../core/webview/getUri"

export class WelcomePanel {
    public static currentPanel: WelcomePanel | undefined
    private readonly _panel: vscode.WebviewPanel
    private readonly _disposables: vscode.Disposable[] = []

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables)
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri)
        this._setWebviewMessageListener(this._panel.webview)
    }

    public static createOrShow(context: vscode.ExtensionContext) {
        const extensionUri = context.extensionUri

        // If we already have a panel, show it
        if (WelcomePanel.currentPanel) {
            WelcomePanel.currentPanel._panel.reveal(vscode.ViewColumn.One)
            return
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            "raddWelcome",
            "Radd Command Center",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, "out"),
                    vscode.Uri.joinPath(extensionUri, "webview-ui/build"),
                    vscode.Uri.joinPath(extensionUri, "node_modules")
                ],
                retainContextWhenHidden: true
            }
        )

        // Set icon
        panel.iconPath = {
            light: vscode.Uri.joinPath(extensionUri, "assets", "icons", "radd.png"),
            dark: vscode.Uri.joinPath(extensionUri, "assets", "icons", "radd.png")
        }

        WelcomePanel.currentPanel = new WelcomePanel(panel, extensionUri)
    }

    public dispose() {
        WelcomePanel.currentPanel = undefined
        this._panel.dispose()
        while (this._disposables.length) {
            const x = this._disposables.pop()
            if (x) x.dispose()
        }
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "welcome.js"])
        const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"])
        const codiconsUri = getUri(webview, extensionUri, ["node_modules", "@vscode", "codicons", "dist", "codicon.css"])

        const fontUri = "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap"

        return `<!DOCTYPE html>
            <html lang="fa" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${fontUri}" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${stylesUri}">
                <link rel="stylesheet" type="text/css" href="${codiconsUri}">
                <title>Radd Command Center</title>
                <style>
                    body { font-family: 'Vazirmatn', sans-serif; }
                </style>
            </head>
            <body class="bg-zinc-950 text-white overflow-hidden">
                <div id="root"></div>
                <script type="module" src="${scriptUri}"></script>
            </body>
            </html>`
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                switch (message.type) {
                    case "newProject":
                        vscode.commands.executeCommand("workbench.action.openFolder")
                        break
                    case "openFolder":
                        vscode.commands.executeCommand("vscode.openFolder")
                        break
                    case "askAgent":
                        vscode.commands.executeCommand("kilo-code.focusChatInput")
                        break
                }
            },
            undefined,
            this._disposables
        )
    }
}
