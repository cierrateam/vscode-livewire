import * as vscode from 'vscode';
import { getComponentActions, getComponentProperties } from '../util/util';

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('blade');

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

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const match = /(?:^|\s+)wire:(\w*)(?:(?:\.?)([A-Za-z0-9_.]*)\.)?$/g.exec(linePrefix);
        if (!match || match.length < 3) {
            return undefined;
        }

        let attributes: string[] = [];
        switch (match[1]) {
            case '':
                attributes = [
                    'key',
                    'model',
                    'poll',
                    'init',
                    'loading',
                    'dirty',
                    'target',
                    'ignore',
                    'abort',
                    'afterprint',
                    'animationend',
                    'animationiteration',
                    'animationstart',
                    'beforeprint',
                    'beforeunload',
                    'blur',
                    'canplay',
                    'canplaythrough',
                    'change',
                    'click',
                    'contextmenu',
                    'copy',
                    'cut',
                    'dblclick',
                    'drag',
                    'dragend',
                    'dragenter',
                    'dragleave',
                    'dragover',
                    'dragstart',
                    'drop',
                    'durationchange',
                    'ended',
                    'error',
                    'focus',
                    'focusin',
                    'focusout',
                    'fullscreenchange',
                    'fullscreenerror',
                    'hashchange',
                    'input',
                    'invalid',
                    'keydown',
                    'keypress',
                    'keyup',
                    'load',
                    'loadeddata',
                    'loadedmetadata',
                    'loadstart',
                    'message',
                    'mousedown',
                    'mouseenter',
                    'mouseleave',
                    'mousemove',
                    'mouseover',
                    'mouseout',
                    'mouseup',
                    'offline',
                    'online',
                    'open',
                    'pagehide',
                    'pageshow',
                    'paste',
                    'pause',
                    'play',
                    'playing',
                    'popstate',
                    'progress',
                    'ratechange',
                    'resize',
                    'reset',
                    'scroll',
                    'search',
                    'seeked',
                    'seeking',
                    'select',
                    'show',
                    'stalled',
                    'storage',
                    'submit',
                    'suspend',
                    'timeupdate',
                    'toggle',
                    'touchcancel',
                    'touchend',
                    'touchmove',
                    'touchstart',
                    'transitionend',
                    'unload',
                    'volumechange',
                    'waiting',
                    'wheel',
                ];
                break;

            case 'click':
                attributes = [
                    'prefetch',
                ];
                break;

            case 'keydown':
                attributes = [
                    'enter',
                ];
                break;

            case 'model':
                attributes = [
                    'debounce',
                    'lazy',
                ];
                break;

            case 'loading':
            case 'dirty':
            case 'offline':
                if (!match[2]) {
                    attributes = [
                        'class',
                        'attr',
                    ];
                } else if (match[2] === 'class') {
                    attributes = [
                        'remove',
                    ];
                }
                break;

            case 'ignore':
                attributes = [
                    'self',
                ];
                break;
        }

        const completions = attributes.map(itm => {
            const completion = new vscode.CompletionItem(itm, vscode.CompletionItemKind.Field);
            completion.commitCharacters = ['.'];

            return completion;
        });

        return completions;


    }
}

export class DirectiveLivewireEventProvider {

    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const match = /(?:^|\s+)wire:(\w+)(?:\.(\w+))?(?:\.?([A-Za-z0-9_.]*))=(['"])?$/g.exec(linePrefix);
        if (!match || match.length < 4) {
            return undefined;
        }

        let attributes: string[] = [];
        switch (match[1]) {
            case 'click':
                attributes = await getComponentActions(document.fileName) || [];
                break;

            case 'model':
                attributes = await getComponentProperties(document.fileName) || [];
                break;
        }

        if (!match[4] && !attributes.length) {
            const edit = new vscode.WorkspaceEdit();
            if (vscode.window.activeTextEditor) {
                vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString('\'${1:}\''));
            }
            return undefined;
        }

        const completions = attributes.map(itm => {
            const completion = new vscode.CompletionItem(`${itm}`);
            completion.kind = vscode.CompletionItemKind.Value;
            completion.insertText = new vscode.SnippetString(`${match[4] ? '' : '\''}\${1:${itm}}${match[4] ? '' : '\''}`);

            return completion;
        });

        return completions;
    }
}
