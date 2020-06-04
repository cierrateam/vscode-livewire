import * as vscode from 'vscode';
import {getAllComponentsWithParams} from "../util/util";

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('blade');

export class ShortLivewireProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('@')) {
            return undefined;
        }
        
        const livewireScriptsCompletion = new vscode.CompletionItem('livewireScripts');
        livewireScriptsCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireScriptsCompletion.documentation = new vscode.MarkdownString("Include the JavaScript");

        const livewireStylesCompletion = new vscode.CompletionItem('livewireStyles');
        livewireStylesCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireStylesCompletion.documentation = new vscode.MarkdownString("Include the CSS Style");

        const livewireCompletion = new vscode.CompletionItem('livewire');
        livewireCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireCompletion.insertText = new vscode.SnippetString('livewire(${1})');
        livewireCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

        // return all completion items as array
        return [
            livewireCompletion,
            livewireScriptsCompletion,
            livewireStylesCompletion,
        ];
    }
}

export class ShortLivewireBarektProvider {

    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('@livewire(')) {
            return undefined;
        }

        const completions = await getAllComponentsWithParams();

        return completions.map(itm => {
            let completeText = `'${itm.name}'`;
            if (itm.params && itm.params.length) {
                const params = [];
                for (let i = 0; i < itm.params.length; i ++) {
                    params.push(`'\${${i + 2}:${itm.params[i]}}' => ''`);
                }
                completeText += `\${1:, [${params.join(', ')}]}`;
            }
            const livewireCompletion = new vscode.CompletionItem(`'${itm.name}'`);
            livewireCompletion.kind = vscode.CompletionItemKind.Method;
            livewireCompletion.insertText = new vscode.SnippetString(completeText);
            return livewireCompletion;
        });
    }
}
