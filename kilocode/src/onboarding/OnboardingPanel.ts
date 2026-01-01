import * as vscode from "vscode"
import { getUri } from "../core/webview/getUri"

export class OnboardingPanel {
    public static currentPanel: OnboardingPanel | undefined
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
        if (OnboardingPanel.currentPanel) {
            OnboardingPanel.currentPanel._panel.reveal(vscode.ViewColumn.One)
            return
        }
        const panel = vscode.window.createWebviewPanel(
            "raddOnboarding",
            "Radd Onboarding",
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
            light: vscode.Uri.joinPath(extensionUri, "assets", "icons", "rocket.png"),
            dark: vscode.Uri.joinPath(extensionUri, "assets", "icons", "rocket.png")
        }

        OnboardingPanel.currentPanel = new OnboardingPanel(panel, extensionUri)
    }

    public dispose() {
        OnboardingPanel.currentPanel = undefined
        this._panel.dispose()
        while (this._disposables.length) {
            const x = this._disposables.pop()
            if (x) x.dispose()
        }
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "onboarding.js"])
        // Try to load index.css which usually contains tailwind
        const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"])
        const codiconsUri = getUri(webview, extensionUri, ["node_modules", "@vscode", "codicons", "dist", "codicon.css"])

        // Font (Vazirmatn) - loading from Google Fonts for simplicity in MVP, but should bundle for offline
        const fontUri = "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap"

        return `<!DOCTYPE html>
            <html lang="fa" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${fontUri}" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${stylesUri}">
                <link rel="stylesheet" type="text/css" href="${codiconsUri}">
                <title>Radd Onboarding</title>
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
                if (message.type === "onboardingComplete") {
                    this.dispose()
                    vscode.commands.executeCommand("radd.onboardingFinished")
                }
                if (message.type === "openFolder") {
                    vscode.commands.executeCommand("vscode.openFolder")
                }
                if (message.type === "createSample") {
                    this.dispose()
                    vscode.commands.executeCommand("radd.createSampleWorkspace")
                }
            },
            undefined,
            this._disposables
        )
    }
}
