import * as vscode from 'vscode';

export class TagLivewireProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const livewireCompletion = new vscode.CompletionItem('livewire');
        livewireCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireCompletion.insertText = new vscode.SnippetString('livewire:');
        livewireCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

        // return all completion items as array
        return [
            livewireCompletion,
        ];
    }
}

export class TagLivewireColonProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('<livewire:')) {
            return undefined;
        }

        return [
            new vscode.CompletionItem('morning', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('afternoon', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('evening', vscode.CompletionItemKind.Method),
        ];
    }
}
