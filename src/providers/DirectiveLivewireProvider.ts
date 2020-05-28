import * as vscode from 'vscode';
const Beautifier = require('js-beautify').html;

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('livewire');

export class DirectiveLivewireProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const livewireCompletion = new vscode.CompletionItem('wire');
        livewireCompletion.kind = vscode.CompletionItemKind.Property;
        livewireCompletion.insertText = new vscode.SnippetString('wire:');
        livewireCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

        // return all completion items as array
        return [
            livewireCompletion,
        ];
    }
}

export class DirectiveLivewireColonProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith(' wire:')) {
            return undefined;
        }

        return [
            new vscode.CompletionItem('morning', vscode.CompletionItemKind.Keyword),
            new vscode.CompletionItem('afternoon', vscode.CompletionItemKind.Keyword),
            new vscode.CompletionItem('evening', vscode.CompletionItemKind.Keyword),
        ];
    }
}
