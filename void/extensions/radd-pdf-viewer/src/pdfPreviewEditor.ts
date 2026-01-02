import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Custom editor provider for PDF files
 * Uses pdf.js for rendering PDF documents with full Persian/RTL support
 */
export class PdfPreviewEditorProvider implements vscode.CustomReadonlyEditorProvider<PdfDocument> {
    private readonly _context: vscode.ExtensionContext;
    private _activeWebviewPanel: vscode.WebviewPanel | undefined;
    private _currentDocumentUri: vscode.Uri | undefined;

    public static readonly viewType = 'radd.pdfPreview';

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
    ): Promise<PdfDocument> {
        return new PdfDocument(uri);
    }

    async resolveCustomEditor(
        document: PdfDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        this._activeWebviewPanel = webviewPanel;
        this._currentDocumentUri = document.uri;

        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._context.extensionUri, 'media'),
                vscode.Uri.joinPath(this._context.extensionUri, 'node_modules', 'pdfjs-dist'),
            ],
        };

        // Get configuration
        const config = vscode.workspace.getConfiguration('radd.pdfViewer');
        const defaultZoom = config.get<string>('defaultZoom', 'page-fit');
        const sidebarVisible = config.get<boolean>('sidebarVisible', true);
        const spreadMode = config.get<string>('spreadMode', 'none');
        const renderTextLayer = config.get<boolean>('renderTextLayer', true);

        // Generate PDF data URI
        const pdfData = await vscode.workspace.fs.readFile(document.uri);
        const pdfBase64 = Buffer.from(pdfData).toString('base64');

        webviewPanel.webview.html = this._getHtmlForWebview(
            webviewPanel.webview,
            pdfBase64,
            document.uri.fsPath,
            { defaultZoom, sidebarVisible, spreadMode, renderTextLayer }
        );

        // Handle messages from the webview
        webviewPanel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.type) {
                    case 'copyText':
                        if (message.text) {
                            await vscode.env.clipboard.writeText(message.text);
                            vscode.window.showInformationMessage('متن کپی شد');
                        }
                        break;
                    case 'error':
                        vscode.window.showErrorMessage(`خطا در نمایش PDF: ${message.message}`);
                        break;
                    case 'pageChanged':
                        // Update status bar or other UI elements
                        break;
                    case 'extractedText':
                        // Store extracted text for AI queries
                        this._context.workspaceState.update(
                            `pdf-text:${document.uri.toString()}`,
                            message.text
                        );
                        break;
                }
            },
            undefined,
            this._context.subscriptions
        );

        // Track active panel
        webviewPanel.onDidChangeViewState(e => {
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
        pdfBase64: string,
        fileName: string,
        options: {
            defaultZoom: string;
            sidebarVisible: boolean;
            spreadMode: string;
            renderTextLayer: boolean;
        }
    ): string {
        const pdfJsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._context.extensionUri, 'node_modules', 'pdfjs-dist', 'build', 'pdf.min.mjs')
        );
        const pdfWorkerUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._context.extensionUri, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs')
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._context.extensionUri, 'media', 'pdfViewer.css')
        );

        const nonce = getNonce();
        const displayName = path.basename(fileName);

        return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data: blob:; font-src ${webview.cspSource} https://fonts.gstatic.com;">
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet">
    <title>${displayName}</title>
    <style>
        :root {
            --bg-color: #1e1e1e;
            --text-color: #cccccc;
            --border-color: #3c3c3c;
            --accent-color: #0d7377;
            --accent-hover: #14919b;
            --toolbar-bg: #252526;
            --sidebar-bg: #2d2d30;
            --page-bg: #525659;
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
            padding: 8px 16px;
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
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: 13px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
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

        .toolbar input[type="number"] {
            width: 60px;
            padding: 6px 8px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-color);
            font-family: inherit;
            text-align: center;
        }

        .toolbar select {
            padding: 6px 8px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-color);
            font-family: inherit;
            cursor: pointer;
        }

        .page-info {
            font-size: 13px;
            color: var(--text-color);
        }

        /* Main container */
        .main-container {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* Sidebar with page thumbnails */
        .sidebar {
            width: 200px;
            background: var(--sidebar-bg);
            border-left: 1px solid var(--border-color);
            overflow-y: auto;
            padding: 12px;
            display: ${options.sidebarVisible ? 'block' : 'none'};
        }

        .sidebar.hidden {
            display: none;
        }

        .thumbnail {
            background: white;
            margin-bottom: 12px;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            transition: border-color 0.2s ease;
        }

        .thumbnail:hover {
            border-color: var(--accent-color);
        }

        .thumbnail.active {
            border-color: var(--accent-color);
        }

        .thumbnail canvas {
            width: 100%;
            display: block;
        }

        .thumbnail-label {
            text-align: center;
            padding: 4px;
            font-size: 11px;
            background: var(--toolbar-bg);
        }

        /* PDF Viewer */
        .pdf-container {
            flex: 1;
            overflow: auto;
            padding: 20px;
            background: var(--page-bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }

        .page-wrapper {
            background: white;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .page-wrapper canvas {
            display: block;
        }

        /* Text layer for selection */
        .text-layer {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            opacity: 0.2;
            line-height: 1.0;
            pointer-events: auto;
        }

        .text-layer > span {
            color: transparent;
            position: absolute;
            white-space: pre;
            transform-origin: 0% 0%;
        }

        .text-layer ::selection {
            background: var(--accent-color);
        }

        /* Search panel */
        .search-panel {
            position: fixed;
            top: 60px;
            left: 20px;
            background: var(--toolbar-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 100;
        }

        .search-panel.visible {
            display: block;
        }

        .search-panel input {
            width: 200px;
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-color);
            font-family: inherit;
            margin-left: 8px;
        }

        .search-results {
            margin-top: 8px;
            font-size: 12px;
            color: var(--text-color);
        }

        /* Loading indicator */
        .loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }

        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid var(--border-color);
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }


        /* Error state */
        .error-message {
            text-align: center;
            padding: 40px;
            color: #f87171;
        }

        .error-message h2 {
            margin-bottom: 12px;
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-group">
            <button id="toggleSidebar" title="نمایش/مخفی کردن تصاویر کوچک">
                ☰
            </button>
            <button id="prevPage" title="صفحه قبل">◄</button>
            <input type="number" id="pageInput" min="1" value="1" title="شماره صفحه">
            <span class="page-info">از <span id="totalPages">-</span></span>
            <button id="nextPage" title="صفحه بعد">►</button>
        </div>
        <div class="toolbar-group">
            <button id="zoomOut" title="کوچک‌نمایی">−</button>
            <select id="zoomSelect" title="مقیاس">
                <option value="page-fit">اندازه صفحه</option>
                <option value="page-width">عرض صفحه</option>
                <option value="0.5">۵۰٪</option>
                <option value="0.75">۷۵٪</option>
                <option value="1">۱۰۰٪</option>
                <option value="1.25">۱۲۵٪</option>
                <option value="1.5">۱۵۰٪</option>
                <option value="2">۲۰۰٪</option>
            </select>
            <button id="zoomIn" title="بزرگ‌نمایی">+</button>
        </div>
        <div class="toolbar-group">
            <button id="searchBtn" title="جستجو (Ctrl+F)">🔍 جستجو</button>
        </div>
    </div>

    <div class="search-panel" id="searchPanel">
        <input type="text" id="searchInput" placeholder="جستجو در متن..." dir="auto">
        <button id="searchPrev">◄</button>
        <button id="searchNext">►</button>
        <button id="closeSearch">✕</button>
        <div class="search-results" id="searchResults"></div>
    </div>

    <div class="main-container">
        <div class="sidebar" id="sidebar"></div>
        <div class="pdf-container" id="pdfContainer">
            <div class="loading" id="loading">
                <div class="loading-spinner"></div>
                <div>در حال بارگذاری PDF...</div>
            </div>
        </div>
    </div>

    <script type="module" nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        // Import pdf.js
        const pdfjsLib = await import('${pdfJsUri}');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '${pdfWorkerUri}';

        // State
        let pdfDoc = null;
        let currentPage = 1;
        let currentScale = 1;
        let scaleMode = '${options.defaultZoom}';
        let renderTextLayer = ${options.renderTextLayer};
        let searchMatches = [];
        let currentSearchIndex = 0;

        // Elements
        const container = document.getElementById('pdfContainer');
        const sidebar = document.getElementById('sidebar');
        const loading = document.getElementById('loading');
        const pageInput = document.getElementById('pageInput');
        const totalPagesSpan = document.getElementById('totalPages');
        const zoomSelect = document.getElementById('zoomSelect');
        const searchPanel = document.getElementById('searchPanel');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        // Load PDF
        async function loadPdf() {
            try {
                const pdfData = atob('${pdfBase64}');
                const uint8Array = new Uint8Array(pdfData.length);
                for (let i = 0; i < pdfData.length; i++) {
                    uint8Array[i] = pdfData.charCodeAt(i);
                }

                pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise;
                totalPagesSpan.textContent = pdfDoc.numPages;
                pageInput.max = pdfDoc.numPages;

                loading.style.display = 'none';

                // Render all pages
                await renderAllPages();

                // Generate thumbnails
                await generateThumbnails();

                // Extract text for AI
                extractAllText();

            } catch (error) {
                loading.innerHTML = \`
                    <div class="error-message">
                        <h2>خطا در بارگذاری PDF</h2>
                        <p>\${error.message}</p>
                    </div>
                \`;
                vscode.postMessage({ type: 'error', message: error.message });
            }
        }

        // Render all pages
        async function renderAllPages() {
            container.innerHTML = '';
            
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const wrapper = await renderPage(page, i);
                container.appendChild(wrapper);
            }
        }

        // Render a single page
        async function renderPage(page, pageNum) {
            const viewport = getViewport(page);
            
            const wrapper = document.createElement('div');
            wrapper.className = 'page-wrapper';
            wrapper.id = \`page-\${pageNum}\`;
            wrapper.style.width = \`\${viewport.width}px\`;
            wrapper.style.height = \`\${viewport.height}px\`;

            // Canvas for rendering
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            wrapper.appendChild(canvas);

            // Render PDF page
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            // Text layer for selection
            if (renderTextLayer) {
                const textContent = await page.getTextContent();
                const textLayer = document.createElement('div');
                textLayer.className = 'text-layer';
                
                textContent.items.forEach(item => {
                    const span = document.createElement('span');
                    span.textContent = item.str;
                    span.style.left = \`\${item.transform[4] * (viewport.width / page.getViewport({ scale: 1 }).width)}px\`;
                    span.style.top = \`\${viewport.height - item.transform[5] * (viewport.height / page.getViewport({ scale: 1 }).height) - item.height}px\`;
                    span.style.fontSize = \`\${item.height}px\`;
                    textLayer.appendChild(span);
                });
                
                wrapper.appendChild(textLayer);
            }

            return wrapper;
        }

        // Get viewport based on scale mode
        function getViewport(page) {
            const defaultViewport = page.getViewport({ scale: 1 });
            let scale = 1;

            if (scaleMode === 'page-fit') {
                const containerWidth = container.clientWidth - 80;
                const containerHeight = container.clientHeight - 40;
                scale = Math.min(
                    containerWidth / defaultViewport.width,
                    containerHeight / defaultViewport.height
                );
            } else if (scaleMode === 'page-width') {
                const containerWidth = container.clientWidth - 80;
                scale = containerWidth / defaultViewport.width;
            } else {
                scale = parseFloat(scaleMode);
            }

            currentScale = scale;
            return page.getViewport({ scale });
        }

        // Generate thumbnails for sidebar
        async function generateThumbnails() {
            sidebar.innerHTML = '';
            
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 0.2 });

                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                if (i === 1) thumbnail.classList.add('active');
                thumbnail.onclick = () => goToPage(i);

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                const label = document.createElement('div');
                label.className = 'thumbnail-label';
                label.textContent = i;

                thumbnail.appendChild(canvas);
                thumbnail.appendChild(label);
                sidebar.appendChild(thumbnail);
            }
        }

        // Extract all text for AI
        async function extractAllText() {
            let fullText = '';
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += \`\\n--- صفحه \${i} ---\\n\${pageText}\`;
            }
            vscode.postMessage({ type: 'extractedText', text: fullText });
        }

        // Navigation
        function goToPage(pageNum) {
            if (pageNum < 1 || pageNum > pdfDoc.numPages) return;
            
            currentPage = pageNum;
            pageInput.value = pageNum;

            // Update thumbnail highlight
            document.querySelectorAll('.thumbnail').forEach((t, i) => {
                t.classList.toggle('active', i + 1 === pageNum);
            });

            // Scroll to page
            const pageEl = document.getElementById(\`page-\${pageNum}\`);
            if (pageEl) {
                pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            vscode.postMessage({ type: 'pageChanged', page: pageNum });
        }

        // Zoom functions
        async function setZoom(mode) {
            scaleMode = mode;
            zoomSelect.value = mode;
            await renderAllPages();
        }

        // Search functionality
        async function search(query) {
            searchMatches = [];
            currentSearchIndex = 0;

            if (!query) {
                searchResults.textContent = '';
                return;
            }

            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                
                const regex = new RegExp(query, 'gi');
                let match;
                while ((match = regex.exec(pageText)) !== null) {
                    searchMatches.push({ page: i, index: match.index });
                }
            }

            searchResults.textContent = \`\${searchMatches.length} نتیجه یافت شد\`;
            
            if (searchMatches.length > 0) {
                goToPage(searchMatches[0].page);
            }
        }

        // Event listeners
        document.getElementById('prevPage').onclick = () => goToPage(currentPage - 1);
        document.getElementById('nextPage').onclick = () => goToPage(currentPage + 1);
        document.getElementById('zoomIn').onclick = () => setZoom(Math.min(currentScale * 1.25, 4).toString());
        document.getElementById('zoomOut').onclick = () => setZoom(Math.max(currentScale * 0.8, 0.25).toString());
        document.getElementById('toggleSidebar').onclick = () => sidebar.classList.toggle('hidden');
        document.getElementById('searchBtn').onclick = () => searchPanel.classList.toggle('visible');
        document.getElementById('closeSearch').onclick = () => searchPanel.classList.remove('visible');
        
        zoomSelect.onchange = () => setZoom(zoomSelect.value);
        pageInput.onchange = () => goToPage(parseInt(pageInput.value));
        
        searchInput.oninput = () => search(searchInput.value);
        document.getElementById('searchPrev').onclick = () => {
            if (searchMatches.length > 0) {
                currentSearchIndex = (currentSearchIndex - 1 + searchMatches.length) % searchMatches.length;
                goToPage(searchMatches[currentSearchIndex].page);
            }
        };
        document.getElementById('searchNext').onclick = () => {
            if (searchMatches.length > 0) {
                currentSearchIndex = (currentSearchIndex + 1) % searchMatches.length;
                goToPage(searchMatches[currentSearchIndex].page);
            }
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                searchPanel.classList.add('visible');
                searchInput.focus();
            }
            if (e.key === 'Escape') {
                searchPanel.classList.remove('visible');
            }
        });

        // Messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'zoomIn':
                    setZoom(Math.min(currentScale * 1.25, 4).toString());
                    break;
                case 'zoomOut':
                    setZoom(Math.max(currentScale * 0.8, 0.25).toString());
                    break;
                case 'nextPage':
                    goToPage(currentPage + 1);
                    break;
                case 'prevPage':
                    goToPage(currentPage - 1);
                    break;
                case 'goToPage':
                    goToPage(message.page);
                    break;
                case 'openSearch':
                    searchPanel.classList.add('visible');
                    searchInput.focus();
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
        loadPdf();
    </script>
</body>
</html>`;
    }
}

/**
 * Represents a PDF document
 */
class PdfDocument implements vscode.CustomDocument {
    readonly uri: vscode.Uri;

    constructor(uri: vscode.Uri) {
        this.uri = uri;
    }

    dispose(): void {
        // Clean up
    }
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
