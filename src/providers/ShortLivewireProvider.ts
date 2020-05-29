import * as vscode from 'vscode';
import {getAllComponents} from "../util/util";
const Beautifier = require('js-beautify').html;

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('livewire');

export class ShortLivewireProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const livewireScriptsCompletion = new vscode.CompletionItem('livewireScripts');
        livewireScriptsCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireScriptsCompletion.documentation = new vscode.MarkdownString("Include the JavaScript");

        const livewireStylesCompletion = new vscode.CompletionItem('livewireStyles');
        livewireStylesCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireStylesCompletion.documentation = new vscode.MarkdownString("Include the CSS Style");

        const livewireCompletion = new vscode.CompletionItem('livewire');
        livewireCompletion.kind = vscode.CompletionItemKind.Snippet;
        livewireCompletion.insertText = new vscode.SnippetString('livewire(${1}${2:, [\'${3:key}\' => \'${4:value}\']})');
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

        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('@livewire(')) {
            return undefined;
        }

        let completions = await getAllComponents();

        return completions.map(itm => new vscode.CompletionItem(`'${itm}'`, vscode.CompletionItemKind.Method));
    }
}
