import * as vscode from 'vscode';
import {Uri} from "vscode";
import {getAllComponents} from "../util/util";

export class TagLivewireProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const livewireCompletion = new vscode.CompletionItem('livewire');
        livewireCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireCompletion.insertText = new vscode.SnippetString('livewire:${1}');
        livewireCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

        // return all completion items as array
        return [
            livewireCompletion,
        ];
    }
}

export class TagLivewireColonProvider {

    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('<livewire:')) {
            return undefined;
        }

        let completions = await getAllComponents();

        return completions.map(itm => {
            let params = '';
            if (itm.params && itm.params.length) {
                for (let i = 0; i < itm.params.length; i ++) {
                    params += ` :\${${i + 1}:${itm.params[i]}=''}`;
                }
            }
            const livewireCompletion = new vscode.CompletionItem(`'${itm.name}'`);
            livewireCompletion.kind = vscode.CompletionItemKind.Method;
            livewireCompletion.insertText = new vscode.SnippetString(`${itm.name}${params}>`);
            return livewireCompletion;
        });
    }
}
