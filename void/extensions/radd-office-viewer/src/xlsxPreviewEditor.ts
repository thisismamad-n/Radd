import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Custom editor provider for Excel (.xlsx/.xls) files
 * Displays spreadsheet data in a readable table format
 */
export class XlsxPreviewEditorProvider implements vscode.CustomReadonlyEditorProvider<XlsxDocument> {
    private readonly _context: vscode.ExtensionContext;
    private _activeWebviewPanel: vscode.WebviewPanel | undefined;
    private _currentDocumentUri: vscode.Uri | undefined;

    public static readonly viewType = 'radd.xlsxPreview';

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    public getCurrentDocumentUri(): vscode.Uri | undefined {
        return this._currentDocumentUri;
    }

    public postMessage(message: any): void {
        if (this._activeWebviewPanel) {
            this._activeWebviewPanel.webview.postMessage(message);
        }
    }

    async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<XlsxDocument> {
        return new XlsxDocument(uri);
    }

    async resolveCustomEditor(
        document: XlsxDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        this._activeWebviewPanel = webviewPanel;
        this._currentDocumentUri = document.uri;

        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._context.extensionUri, 'media'),
                vscode.Uri.joinPath(this._context.extensionUri, 'node_modules'),
            ],
        };

        const config = vscode.workspace.getConfiguration('radd.officeViewer');
        const theme = config.get<string>('theme', 'auto');
        const showAICapabilities = config.get<boolean>('showAICapabilities', true);

        const xlsxData = await vscode.workspace.fs.readFile(document.uri);
        const xlsxBase64 = Buffer.from(xlsxData).toString('base64');

        webviewPanel.webview.html = this._getHtmlForWebview(
            webviewPanel.webview,
            xlsxBase64,
            document.uri.fsPath,
            { theme, showAICapabilities }
        );

        webviewPanel.webview.onDidReceiveMessage(
            async (message: { type: string; text?: string; message?: string }) => {
                switch (message.type) {
                    case 'copyText':
                        if (message.text) {
                            await vscode.env.clipboard.writeText(message.text);
                            vscode.window.showInformationMessage('متن کپی شد');
                        }
                        break;
                    case 'error':
                        vscode.window.showErrorMessage(`خطا در نمایش فایل: ${message.message}`);
                        break;
                    case 'extractedText':
                        this._context.workspaceState.update(
                            `doc-text:${document.uri.toString()}`,
                            message.text
                        );
                        break;
                    case 'askAI':
                        vscode.commands.executeCommand('radd.officeViewer.askAI');
                        break;
                }
            },
            undefined,
            this._context.subscriptions
        );

        webviewPanel.onDidChangeViewState((e: vscode.WebviewPanelOnDidChangeViewStateEvent) => {
            if (e.webviewPanel.active) {
                this._activeWebviewPanel = webviewPanel;
                this._currentDocumentUri = document.uri;
            }
        });

        webviewPanel.onDidDispose(() => {
            if (this._activeWebviewPanel === webviewPanel) {
                this._activeWebviewPanel = undefined;
                this._currentDocumentUri = undefined;
            }
        });
    }

    private _getHtmlForWebview(
        webview: vscode.Webview,
        xlsxBase64: string,
        fileName: string,
        options: { theme: string; showAICapabilities: boolean }
    ): string {
        const nonce = getNonce();
        const displayName = path.basename(fileName);
        const isDark = options.theme === 'dark' ||
            (options.theme === 'auto' && vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark);

        return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval'; img-src ${webview.cspSource} data: blob:; font-src ${webview.cspSource} https://fonts.gstatic.com;">
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet">
    <title>${displayName}</title>
    <style>
        :root {
            --bg-color: ${isDark ? '#1e1e1e' : '#ffffff'};
            --text-color: ${isDark ? '#cccccc' : '#333333'};
            --border-color: ${isDark ? '#3c3c3c' : '#e0e0e0'};
            --accent-color: #0d7377;
            --accent-hover: #14919b;
            --toolbar-bg: ${isDark ? '#252526' : '#f5f5f5'};
            --cell-bg: ${isDark ? '#2d2d30' : '#ffffff'};
            --header-bg: ${isDark ? '#383838' : '#f0f0f0'};
            --row-hover: ${isDark ? 'rgba(13, 115, 119, 0.1)' : 'rgba(13, 115, 119, 0.05)'};
            --info-bg: ${isDark ? 'rgba(13, 115, 119, 0.1)' : 'rgba(13, 115, 119, 0.05)'};
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif;
            background: var(--bg-color);
            color: var(--text-color);
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* Toolbar */
        .toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 16px;
            background: var(--toolbar-bg);
            border-bottom: 1px solid var(--border-color);
            gap: 12px;
            flex-wrap: wrap;
        }

        .toolbar-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .toolbar button {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-family: inherit;
            font-size: 13px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .toolbar button:hover {
            background: var(--accent-color);
            border-color: var(--accent-color);
            color: white;
        }

        .toolbar button.active {
            background: var(--accent-color);
            border-color: var(--accent-color);
            color: white;
        }

        .toolbar select {
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--bg-color);
            color: var(--text-color);
            font-family: inherit;
            cursor: pointer;
        }

        .document-title {
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .document-title .icon {
            font-size: 20px;
        }

        /* AI Info Banner */
        .ai-info-banner {
            background: var(--info-bg);
            border-bottom: 1px solid var(--accent-color);
            padding: 12px 20px;
            display: ${options.showAICapabilities ? 'flex' : 'none'};
            align-items: center;
            gap: 12px;
            font-size: 13px;
        }

        .ai-info-banner .icon {
            font-size: 24px;
        }

        .ai-info-banner .text {
            flex: 1;
        }

        .ai-info-banner .text strong {
            color: var(--accent-color);
        }

        .ai-info-banner button {
            background: linear-gradient(135deg, var(--accent-color), #6366f1);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-family: inherit;
            font-size: 13px;
        }

        .ai-info-banner .close-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            font-size: 18px;
            padding: 4px;
            opacity: 0.6;
        }

        .ai-info-banner .close-btn:hover {
            opacity: 1;
        }

        /* Sheet tabs */
        .sheet-tabs {
            display: flex;
            background: var(--toolbar-bg);
            border-bottom: 1px solid var(--border-color);
            padding: 0 16px;
            gap: 4px;
            overflow-x: auto;
        }

        .sheet-tab {
            padding: 10px 20px;
            cursor: pointer;
            border: none;
            background: transparent;
            color: var(--text-color);
            font-family: inherit;
            font-size: 13px;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }

        .sheet-tab:hover {
            background: var(--row-hover);
        }

        .sheet-tab.active {
            border-bottom-color: var(--accent-color);
            color: var(--accent-color);
            font-weight: 500;
        }

        /* Table container */
        .table-container {
            flex: 1;
            overflow: auto;
            padding: 16px;
        }

        .spreadsheet {
            border-collapse: collapse;
            font-size: 13px;
            min-width: 100%;
        }

        .spreadsheet th,
        .spreadsheet td {
            border: 1px solid var(--border-color);
            padding: 10px 14px;
            text-align: right;
            white-space: nowrap;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .spreadsheet th {
            background: var(--header-bg);
            font-weight: 600;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .spreadsheet th.row-header {
            background: var(--header-bg);
            color: var(--text-color);
            opacity: 0.7;
            font-weight: 400;
            width: 50px;
            text-align: center;
            position: sticky;
            left: 0;
            z-index: 11;
        }

        .spreadsheet tr:nth-child(even) td {
            background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
        }

        .spreadsheet tr:hover td {
            background: var(--row-hover);
        }

        .spreadsheet td.number {
            text-align: left;
            font-family: 'Consolas', monospace;
            direction: ltr;
        }

        /* Loading */
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 16px;
        }

        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid var(--border-color);
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Placeholder content */
        .placeholder-content {
            text-align: center;
            padding: 60px 40px;
        }

        .placeholder-content .icon {
            font-size: 72px;
            margin-bottom: 24px;
        }

        .placeholder-content h1 {
            font-size: 24px;
            margin-bottom: 12px;
        }

        .placeholder-content p {
            opacity: 0.7;
            margin-bottom: 30px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .capabilities-box {
            background: var(--info-bg);
            padding: 24px 32px;
            border-radius: 12px;
            text-align: right;
            max-width: 500px;
            margin: 0 auto 24px;
        }

        .capabilities-box h3 {
            color: var(--accent-color);
            margin-bottom: 16px;
            font-size: 16px;
        }

        .capabilities-box ul {
            list-style: none;
            line-height: 2.2;
        }

        .ai-button {
            background: linear-gradient(135deg, var(--accent-color), #6366f1) !important;
            border: none !important;
            color: white !important;
            padding: 14px 28px !important;
            font-size: 15px !important;
        }

        .ai-button:hover {
            transform: scale(1.02);
        }

        /* Stats bar */
        .stats-bar {
            padding: 8px 16px;
            background: var(--toolbar-bg);
            border-top: 1px solid var(--border-color);
            font-size: 12px;
            display: flex;
            gap: 24px;
            opacity: 0.8;
        }

        .stat-item {
            display: flex;
            gap: 6px;
        }

        .stat-label {
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-group">
            <span class="document-title">
                <span class="icon">📊</span>
                <span>${displayName}</span>
            </span>
        </div>
        <div class="toolbar-group">
            <button id="askAI" class="ai-button" title="پرسش از هوش مصنوعی">🤖 پرسش از راد</button>
        </div>
    </div>

    <div class="ai-info-banner" id="aiBanner">
        <span class="icon">🤖</span>
        <span class="text">
            <strong>دستیار راد</strong> می‌تواند داده‌های این فایل را تحلیل کند، نمودار بسازد، و به سوالات شما پاسخ دهد.
        </span>
        <button id="askAIBanner">شروع تحلیل</button>
        <button class="close-btn" id="closeBanner" title="بستن">✕</button>
    </div>

    <div class="sheet-tabs" id="sheetTabs"></div>

    <div class="table-container" id="tableContainer">
        <div class="loading" id="loading">
            <div class="loading-spinner"></div>
            <div>در حال بارگذاری فایل...</div>
        </div>
    </div>

    <div class="stats-bar" id="statsBar" style="display: none;">
        <div class="stat-item">
            <span class="stat-label">تعداد سطرها:</span>
            <span id="rowCount">-</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">تعداد ستون‌ها:</span>
            <span id="colCount">-</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">برگه فعال:</span>
            <span id="activeSheet">-</span>
        </div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        // State
        let workbook = null;
        let currentSheet = '';
        
        // Elements
        const tableContainer = document.getElementById('tableContainer');
        const sheetTabs = document.getElementById('sheetTabs');
        const loading = document.getElementById('loading');
        const statsBar = document.getElementById('statsBar');
        const aiBanner = document.getElementById('aiBanner');

        // Load Excel file
        async function loadExcel() {
            try {
                // For MVP, show placeholder with AI capabilities
                // Actual Excel parsing would require SheetJS or similar library
                showPlaceholder();
                
            } catch (error) {
                tableContainer.innerHTML = \`
                    <div class="error-message">
                        <h2>خطا در بارگذاری فایل</h2>
                        <p>\${error.message}</p>
                    </div>
                \`;
                vscode.postMessage({ type: 'error', message: error.message });
            }
        }

        function showPlaceholder() {
            sheetTabs.style.display = 'none';
            statsBar.style.display = 'none';
            
            tableContainer.innerHTML = \`
                <div class="placeholder-content">
                    <div class="icon">📊</div>
                    <h1>فایل Excel</h1>
                    <p>این فایل یک صفحه گسترده Microsoft Excel است.</p>
                    
                    <div class="capabilities-box">
                        <h3>🤖 قابلیت‌های دستیار راد برای این فایل:</h3>
                        <ul>
                            <li>✅ خواندن و درک تمام داده‌ها</li>
                            <li>✅ تحلیل آماری و محاسبات</li>
                            <li>✅ ایجاد نمودار و گزارش</li>
                            <li>✅ مقایسه و تطبیق داده‌ها</li>
                            <li>✅ تبدیل فرمت و استخراج اطلاعات</li>
                            <li>✅ پاسخ به سوالات درباره داده‌ها</li>
                        </ul>
                    </div>
                    
                    <button onclick="askAI()" class="ai-button" style="
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: inherit;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        🤖 شروع تحلیل با دستیار راد
                    </button>
                </div>
            \`;
        }

        function askAI() {
            vscode.postMessage({ type: 'askAI' });
        }

        // Render a sheet as table (for future use with actual data)
        function renderSheet(sheetName, data) {
            if (!data || data.length === 0) {
                tableContainer.innerHTML = '<p style="text-align: center; padding: 40px; opacity: 0.6;">این برگه خالی است</p>';
                return;
            }

            let html = '<table class="spreadsheet"><thead><tr><th class="row-header"></th>';
            
            // Header row
            const maxCols = Math.max(...data.map(row => row.length));
            for (let i = 0; i < maxCols; i++) {
                const colLetter = String.fromCharCode(65 + (i % 26));
                html += \`<th>\${colLetter}</th>\`;
            }
            html += '</tr></thead><tbody>';
            
            // Data rows
            data.forEach((row, rowIndex) => {
                html += \`<tr><th class="row-header">\${rowIndex + 1}</th>\`;
                for (let i = 0; i < maxCols; i++) {
                    const value = row[i] || '';
                    const isNumber = !isNaN(value) && value !== '';
                    html += \`<td class="\${isNumber ? 'number' : ''}">\${value}</td>\`;
                }
                html += '</tr>';
            });
            
            html += '</tbody></table>';
            tableContainer.innerHTML = html;
            
            // Update stats
            document.getElementById('rowCount').textContent = data.length;
            document.getElementById('colCount').textContent = maxCols;
            document.getElementById('activeSheet').textContent = sheetName;
            statsBar.style.display = 'flex';
        }

        // Event listeners
        document.getElementById('askAI').onclick = askAI;
        document.getElementById('askAIBanner').onclick = askAI;
        document.getElementById('closeBanner').onclick = () => {
            aiBanner.style.display = 'none';
        };

        // Messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'refresh':
                    loadExcel();
                    break;
                case 'copySelection':
                    const selection = window.getSelection().toString();
                    if (selection) {
                        vscode.postMessage({ type: 'copyText', text: selection });
                    }
                    break;
            }
        });

        // Initialize
        loadExcel();
    </script>
</body>
</html>`;
    }
}

class XlsxDocument implements vscode.CustomDocument {
    readonly uri: vscode.Uri;
    constructor(uri: vscode.Uri) { this.uri = uri; }
    dispose(): void { }
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
