import * as vscode from 'vscode';
import {Uri} from "vscode";
import {getAllComponentsWithParams} from "../util/util";

export class TagLivewireProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('<')) {
            return undefined;
        }
        
        const livewireCompletion = new vscode.CompletionItem('livewire');
        livewireCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireCompletion.insertText = new vscode.SnippetString('livewire:${1}>');
        livewireCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

        // return all completion items as array
        return [
            livewireCompletion,
        ];
    }
}

export class TagLivewireColonProvider {

    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const match = /<livewire:([A-Za-z0-9_.-]*)$/g.exec(linePrefix);
        if (!match) {
            return undefined;
        }

        const prefix = match[1] || '';
        const completions = await getAllComponentsWithParams(prefix);

        const words = prefix.split(/\W+/g);
        const prefixLen = prefix.length - (words.length ? words[words.length-1].length : 0);
        return completions.map(itm => {
            let params = '';
            if (itm.params && itm.params.length) {
                for (let i = 0; i < itm.params.length; i ++) {
                    params += ` :\${${i + 1}:${itm.params[i]}=''}`;
                }
            }
            const livewireCompletion = new vscode.CompletionItem(`${itm.name}`);
            livewireCompletion.kind = vscode.CompletionItemKind.Method;
            livewireCompletion.insertText = new vscode.SnippetString(`${itm.name.substr(prefixLen)}${params}`);
            return livewireCompletion;
        });
    }
}
