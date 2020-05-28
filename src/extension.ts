import * as vscode from 'vscode';
import {ShortLivewireBarektProvider, ShortLivewireProvider} from "./providers/ShortLivewireProvider";
import {TagLivewireColonProvider, TagLivewireProvider} from "./providers/TagLivewireProvider";
import {DirectiveLivewireColonProvider, DirectiveLivewireProvider} from "./providers/DirectiveLivewireProvider";
const Beautifier = require('js-beautify').html;

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('livewire');


function activate(context: vscode.ExtensionContext) {
	console.log('Livewire activated!');

	const LANGUAGES = { scheme: 'file', language: 'livewire' };

	let providerShort = vscode.languages.registerCompletionItemProvider(LANGUAGES, new ShortLivewireProvider(), '@');
	let providerShortBarekt = vscode.languages.registerCompletionItemProvider(LANGUAGES, new ShortLivewireBarektProvider(), '(');

	let providerTag = vscode.languages.registerCompletionItemProvider(LANGUAGES, new TagLivewireProvider(), '<');
	let providerTagColon = vscode.languages.registerCompletionItemProvider(LANGUAGES, new TagLivewireColonProvider(), ':');

	let providerDirective = vscode.languages.registerCompletionItemProvider(LANGUAGES, new DirectiveLivewireProvider(), ' ');
	let providerDirectiveColon = vscode.languages.registerCompletionItemProvider(LANGUAGES, new DirectiveLivewireColonProvider(), ':');

	context.subscriptions.push(
		providerShort,
        providerShortBarekt,
		providerTag,
		providerTagColon,
		providerDirective,
        providerDirectiveColon,
	);
}

function deactivate() {}

export {
	activate,
	deactivate,
};
