import * as vscode from 'vscode';
import { DocxPreviewEditorProvider } from './docxPreviewEditor';
import { XlsxPreviewEditorProvider } from './xlsxPreviewEditor';

export function activate(context: vscode.ExtensionContext): void {
    // Register DOCX custom editor
    const docxProvider = new DocxPreviewEditorProvider(context);
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            'radd.docxPreview',
            docxProvider,
            {
                webviewOptions: { retainContextWhenHidden: true },
                supportsMultipleEditorsPerDocument: true,
            }
        )
    );

    // Register XLSX custom editor
    const xlsxProvider = new XlsxPreviewEditorProvider(context);
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            'radd.xlsxPreview',
            xlsxProvider,
            {
                webviewOptions: { retainContextWhenHidden: true },
                supportsMultipleEditorsPerDocument: true,
            }
        )
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('radd.officeViewer.refreshDocument', () => {
            docxProvider.postMessage({ type: 'refresh' });
            xlsxProvider.postMessage({ type: 'refresh' });
        }),
        vscode.commands.registerCommand('radd.officeViewer.toggleTheme', () => {
            docxProvider.postMessage({ type: 'toggleTheme' });
            xlsxProvider.postMessage({ type: 'toggleTheme' });
        }),
        vscode.commands.registerCommand('radd.officeViewer.copyText', () => {
            docxProvider.postMessage({ type: 'copySelection' });
            xlsxProvider.postMessage({ type: 'copySelection' });
        }),
        vscode.commands.registerCommand('radd.officeViewer.askAI', async () => {
            const uri = docxProvider.getCurrentDocumentUri() || xlsxProvider.getCurrentDocumentUri();
            if (uri) {
                try {
                    await vscode.commands.executeCommand('radd-assistant.askAboutFile', uri);
                } catch {
                    showAIActivationMessage();
                }
            }
        }),
        vscode.commands.registerCommand('radd.officeViewer.exportAsText', async () => {
            const uri = docxProvider.getCurrentDocumentUri() || xlsxProvider.getCurrentDocumentUri();
            if (uri) {
                const text = await context.workspaceState.get<string>(`doc-text:${uri.toString()}`);
                if (text) {
                    const doc = await vscode.workspace.openTextDocument({ content: text, language: 'plaintext' });
                    await vscode.window.showTextDocument(doc);
                }
            }
        })
    );

    console.log('Radd Office Viewer extension activated');
}

function showAIActivationMessage(): void {
    vscode.window.showInformationMessage(
        'برای استفاده از این قابلیت، دستیار راد باید فعال باشد.',
        'فعال‌سازی'
    ).then((selection: string | undefined) => {
        if (selection === 'فعال‌سازی') {
            vscode.commands.executeCommand('workbench.view.extension.radd-assistant');
        }
    });
}

export function deactivate(): void {
    console.log('Radd Office Viewer extension deactivated');
}
