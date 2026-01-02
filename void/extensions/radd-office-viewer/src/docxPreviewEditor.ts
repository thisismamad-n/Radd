import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Custom editor provider for Word (.docx) files
 * Uses mammoth.js for text extraction and docx-preview for rendering
 */
export class DocxPreviewEditorProvider implements vscode.CustomReadonlyEditorProvider<DocxDocument> {
    private readonly _context: vscode.ExtensionContext;
    private _activeWebviewPanel: vscode.WebviewPanel | undefined;
    private _currentDocumentUri: vscode.Uri | undefined;

    public static readonly viewType = 'radd.docxPreview';

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
    ): Promise<DocxDocument> {
        return new DocxDocument(uri);
    }

    async resolveCustomEditor(
        document: DocxDocument,
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

        // Get configuration
        const config = vscode.workspace.getConfiguration('radd.officeViewer');
        const theme = config.get<string>('theme', 'auto');

        // Read document
        const docData = await vscode.workspace.fs.readFile(document.uri);
        const docBase64 = Buffer.from(docData).toString('base64');

        webviewPanel.webview.html = this._getHtmlForWebview(
            webviewPanel.webview,
            docBase64,
            document.uri.fsPath,
            { theme }
        );

        // Handle messages
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
                        vscode.window.showErrorMessage(`خطا در نمایش سند: ${message.message}`);
                        break;
                    case 'extractedText':
                        this._context.workspaceState.update(
                            `doc-text:${document.uri.toString()}`,
                            message.text
                        );
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
        docBase64: string,
        fileName: string,
        options: { theme: string }
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
            --doc-bg: ${isDark ? '#2d2d30' : '#ffffff'};
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

        /* Document container */
        .document-container {
            flex: 1;
            overflow: auto;
            padding: 40px;
            background: ${isDark ? '#1a1a1a' : '#f0f0f0'};
        }

        .document-content {
            max-width: 800px;
            margin: 0 auto;
            background: var(--doc-bg);
            padding: 60px 80px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, ${isDark ? '0.4' : '0.1'});
            border-radius: 4px;
            min-height: 100%;
            line-height: 1.8;
        }

        .document-content h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: var(--text-color);
        }

        .document-content h2 {
            font-size: 20px;
            margin: 24px 0 16px;
            color: var(--text-color);
        }

        .document-content p {
            margin-bottom: 16px;
            text-align: justify;
        }

        .document-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .document-content table th,
        .document-content table td {
            border: 1px solid var(--border-color);
            padding: 10px;
            text-align: right;
        }

        .document-content table th {
            background: var(--toolbar-bg);
            font-weight: 600;
        }

        .document-content img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
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

        /* Error */
        .error-message {
            text-align: center;
            padding: 60px;
            color: #f87171;
        }

        .error-message h2 {
            margin-bottom: 16px;
            font-size: 20px;
        }

        .error-message p {
            color: var(--text-color);
            opacity: 0.8;
        }

        /* RTL document support */
        .document-content[dir="rtl"] {
            text-align: right;
        }

        .document-content[dir="ltr"] {
            text-align: left;
            direction: ltr;
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-group">
            <span class="document-title">
                <span class="icon">📄</span>
                <span>${displayName}</span>
            </span>
        </div>
        <div class="toolbar-group">
            <button id="toggleDir" title="تغییر جهت متن">↔️ تغییر جهت</button>
            <button id="zoomIn" title="بزرگ‌نمایی">🔍+</button>
            <button id="zoomOut" title="کوچک‌نمایی">🔍−</button>
        </div>
    </div>

    <div class="document-container">
        <div class="document-content" id="documentContent" dir="rtl">
            <div class="loading" id="loading">
                <div class="loading-spinner"></div>
                <div>در حال بارگذاری سند...</div>
            </div>
        </div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        // State
        let currentZoom = 1;
        let isRTL = true;
        
        // Elements
        const documentContent = document.getElementById('documentContent');
        const loading = document.getElementById('loading');

        // Load and render document using mammoth.js approach
        async function loadDocument() {
            try {
                // Decode base64 document
                const docData = atob('${docBase64}');
                const uint8Array = new Uint8Array(docData.length);
                for (let i = 0; i < docData.length; i++) {
                    uint8Array[i] = docData.charCodeAt(i);
                }

                // Parse DOCX using a simple approach
                // For MVP, we'll extract text content from the XML inside the docx
                const html = await extractDocxContent(uint8Array);
                
                documentContent.innerHTML = html;
                
                // Extract plain text for reference
                const plainText = documentContent.innerText;
                vscode.postMessage({ type: 'extractedText', text: plainText });

            } catch (error) {
                documentContent.innerHTML = \`
                    <div class="error-message">
                        <h2>خطا در بارگذاری سند</h2>
                        <p>\${error.message}</p>
                    </div>
                \`;
                vscode.postMessage({ type: 'error', message: error.message });
            }
        }

        // DOCX content extractor using ZIP and XML parsing
        async function extractDocxContent(data) {
            try {
                // DOCX files are ZIP archives containing XML files
                // We'll use the native Compression Streams API where available
                // or a simple ZIP parser to extract document.xml
                
                const zip = await parseZip(data);
                const documentXml = zip['word/document.xml'];
                
                if (!documentXml) {
                    throw new Error('فایل word/document.xml یافت نشد');
                }
                
                // Parse the XML and extract text content
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(documentXml, 'application/xml');
                
                // Extract paragraphs from the document
                const html = processDocumentXml(xmlDoc);
                return html;
                
            } catch (error) {
                console.error('Error extracting DOCX:', error);
                throw error;
            }
        }
        
        // Simple ZIP parser for DOCX files
        async function parseZip(data) {
            const files = {};
            let offset = 0;
            const view = new DataView(data.buffer);
            
            while (offset < data.length - 4) {
                const signature = view.getUint32(offset, true);
                
                // Local file header signature
                if (signature === 0x04034b50) {
                    const compressionMethod = view.getUint16(offset + 8, true);
                    const compressedSize = view.getUint32(offset + 18, true);
                    const uncompressedSize = view.getUint32(offset + 22, true);
                    const fileNameLength = view.getUint16(offset + 26, true);
                    const extraFieldLength = view.getUint16(offset + 28, true);
                    
                    const fileNameStart = offset + 30;
                    const fileNameBytes = data.slice(fileNameStart, fileNameStart + fileNameLength);
                    const fileName = new TextDecoder().decode(fileNameBytes);
                    
                    const dataStart = fileNameStart + fileNameLength + extraFieldLength;
                    const fileData = data.slice(dataStart, dataStart + compressedSize);
                    
                    // Only process XML files we need
                    if (fileName.endsWith('.xml') || fileName.endsWith('.rels')) {
                        if (compressionMethod === 0) {
                            // No compression
                            files[fileName] = new TextDecoder().decode(fileData);
                        } else if (compressionMethod === 8) {
                            // Deflate compression - use DecompressionStream if available
                            try {
                                const blob = new Blob([fileData]);
                                const ds = new DecompressionStream('deflate-raw');
                                const decompressedStream = blob.stream().pipeThrough(ds);
                                const decompressedBlob = await new Response(decompressedStream).blob();
                                files[fileName] = await decompressedBlob.text();
                            } catch (e) {
                                console.warn('Decompression failed for:', fileName, e);
                            }
                        }
                    }
                    
                    offset = dataStart + compressedSize;
                } else if (signature === 0x02014b50) {
                    // Central directory - we're done with file entries
                    break;
                } else {
                    offset++;
                }
            }
            
            return files;
        }
        
        // Process document.xml and convert to HTML
        function processDocumentXml(xmlDoc) {
            const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
            let html = '';
            
            // Get all paragraph elements
            const paragraphs = xmlDoc.getElementsByTagNameNS(ns, 'p');
            
            for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs[i];
                let paragraphHtml = '';
                let isHeading = false;
                let headingLevel = 0;
                
                // Check for heading style
                const pStyle = p.getElementsByTagNameNS(ns, 'pStyle')[0];
                if (pStyle) {
                    const styleVal = pStyle.getAttribute('w:val') || '';
                    if (styleVal.match(/Heading(\\d)/i) || styleVal.match(/^\\d$/)) {
                        isHeading = true;
                        headingLevel = parseInt(styleVal.match(/\\d/)?.[0] || '1');
                    }
                }
                
                // Get all runs (text segments) in the paragraph
                const runs = p.getElementsByTagNameNS(ns, 'r');
                
                for (let j = 0; j < runs.length; j++) {
                    const run = runs[j];
                    const texts = run.getElementsByTagNameNS(ns, 't');
                    
                    // Check formatting
                    const rPr = run.getElementsByTagNameNS(ns, 'rPr')[0];
                    let isBold = false;
                    let isItalic = false;
                    let isUnderline = false;
                    
                    if (rPr) {
                        isBold = rPr.getElementsByTagNameNS(ns, 'b').length > 0;
                        isItalic = rPr.getElementsByTagNameNS(ns, 'i').length > 0;
                        isUnderline = rPr.getElementsByTagNameNS(ns, 'u').length > 0;
                    }
                    
                    for (let k = 0; k < texts.length; k++) {
                        let text = texts[k].textContent || '';
                        
                        // Escape HTML
                        text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        
                        // Apply formatting
                        if (isBold) text = '<strong>' + text + '</strong>';
                        if (isItalic) text = '<em>' + text + '</em>';
                        if (isUnderline) text = '<u>' + text + '</u>';
                        
                        paragraphHtml += text;
                    }
                }
                
                // Wrap in appropriate tag
                if (paragraphHtml.trim()) {
                    if (isHeading && headingLevel >= 1 && headingLevel <= 6) {
                        html += '<h' + headingLevel + '>' + paragraphHtml + '</h' + headingLevel + '>';
                    } else {
                        html += '<p>' + paragraphHtml + '</p>';
                    }
                } else {
                    // Empty paragraph = line break
                    html += '<br>';
                }
            }
            
            // Handle tables
            const tables = xmlDoc.getElementsByTagNameNS(ns, 'tbl');
            // Tables are more complex, for now just extract text
            
            return html || '<p style="opacity: 0.6; text-align: center;">محتوای متنی در این سند یافت نشد.</p>';
        }

        // Zoom functionality
        function setZoom(zoom) {
            currentZoom = Math.max(0.5, Math.min(2, zoom));
            documentContent.style.transform = \`scale(\${currentZoom})\`;
            documentContent.style.transformOrigin = 'top center';
        }

        // Toggle direction
        function toggleDirection() {
            isRTL = !isRTL;
            documentContent.dir = isRTL ? 'rtl' : 'ltr';
        }

        // Event listeners
        document.getElementById('zoomIn').onclick = () => setZoom(currentZoom + 0.1);
        document.getElementById('zoomOut').onclick = () => setZoom(currentZoom - 0.1);
        document.getElementById('toggleDir').onclick = toggleDirection;

        // Messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'refresh':
                    loadDocument();
                    break;
                case 'toggleTheme':
                    document.body.classList.toggle('dark');
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
        loadDocument();
    </script>
</body>
</html>`;
    }
}

class DocxDocument implements vscode.CustomDocument {
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
