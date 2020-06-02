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

        let attributes: string[] = [];
        if (linePrefix.endsWith(' wire:')) {
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
        } else if (linePrefix.endsWith('wire:click.')) {
            attributes = [
                'prefetch',
            ];
        } else if (linePrefix.endsWith('wire:keydown.')) {
            attributes = [
                'enter',
            ];
        } else if (linePrefix.endsWith('wire:model.')) {
            attributes = [
                'debounce',
                'lazy',
            ];
        } else if (linePrefix.endsWith('wire:loading.') || linePrefix.endsWith('wire:dirty.') || linePrefix.endsWith('wire:offline.')) {
            attributes = [
                'class',
                'attr',
            ];
        } else if (linePrefix.endsWith('wire:loading.class.') || linePrefix.endsWith('wire:dirty.class.') || linePrefix.endsWith('wire:offline.class.')) {
            attributes = [
                'remove',
            ];
        } else if (linePrefix.endsWith('wire:ignore.')) {
            attributes = [
                'self',
            ];
        }

        const completions = attributes.map(itm => {
            const completion = new vscode.CompletionItem(itm, vscode.CompletionItemKind.Field);
            completion.commitCharacters = ['.'];

            return completion;
        });

        return completions;


    }
}
