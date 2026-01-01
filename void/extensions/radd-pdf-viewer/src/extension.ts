import * as vscode from 'vscode';
import { PdfPreviewEditorProvider } from './pdfPreviewEditor';

export function activate(context: vscode.ExtensionContext): void {
    // Register the custom editor provider for PDF files
    const provider = new PdfPreviewEditorProvider(context);

    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            'radd.pdfPreview',
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: true,
            }
        )
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('radd.pdfViewer.zoomIn', () => {
            provider.postMessage({ type: 'zoomIn' });
        }),
        vscode.commands.registerCommand('radd.pdfViewer.zoomOut', () => {
            provider.postMessage({ type: 'zoomOut' });
        }),
        vscode.commands.registerCommand('radd.pdfViewer.nextPage', () => {
            provider.postMessage({ type: 'nextPage' });
        }),
        vscode.commands.registerCommand('radd.pdfViewer.prevPage', () => {
            provider.postMessage({ type: 'prevPage' });
        }),
        vscode.commands.registerCommand('radd.pdfViewer.goToPage', async () => {
            const pageNum = await vscode.window.showInputBox({
                prompt: 'شماره صفحه را وارد کنید',
                placeHolder: '1',
                validateInput: (value) => {
                    const num = parseInt(value);
                    if (isNaN(num) || num < 1) {
                        return 'لطفاً یک عدد معتبر وارد کنید';
                    }
                    return null;
                }
            });
            if (pageNum) {
                provider.postMessage({ type: 'goToPage', page: parseInt(pageNum) });
            }
        }),
        vscode.commands.registerCommand('radd.pdfViewer.searchText', () => {
            provider.postMessage({ type: 'openSearch' });
        }),
        vscode.commands.registerCommand('radd.pdfViewer.copyText', () => {
            provider.postMessage({ type: 'copySelection' });
        }),
        vscode.commands.registerCommand('radd.pdfViewer.askAI', async () => {
            // Integration with Radd Assistant - send current PDF info to AI
            const activeEditor = vscode.window.activeTextEditor;
            const pdfUri = provider.getCurrentDocumentUri();

            if (pdfUri) {
                // Execute the Radd Assistant command if available
                try {
                    await vscode.commands.executeCommand('radd-assistant.askAboutFile', pdfUri);
                } catch {
                    vscode.window.showInformationMessage(
                        'برای استفاده از این قابلیت، دستیار راد باید فعال باشد.',
                        'فعال‌سازی'
                    ).then(selection => {
                        if (selection === 'فعال‌سازی') {
                            vscode.commands.executeCommand('workbench.view.extension.radd-assistant');
                        }
                    });
                }
            }
        })
    );

    console.log('Radd PDF Viewer extension activated');
}

export function deactivate(): void {
    console.log('Radd PDF Viewer extension deactivated');
}
