import * as vscode from 'vscode';
import {ShortLivewireBarektProvider, ShortLivewireProvider} from "./providers/ShortLivewireProvider";
import {TagLivewireColonProvider, TagLivewireProvider} from "./providers/TagLivewireProvider";
import {DirectiveLivewireColonProvider, DirectiveLivewireEventProvider, DirectiveLivewireProvider} from "./providers/DirectiveLivewireProvider";

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('blade');


function activate(context: vscode.ExtensionContext) {
	console.log('Livewire activated!');

	const LANGUAGES = { scheme: 'file', language: 'blade' };

	let providerShort = vscode.languages.registerCompletionItemProvider(LANGUAGES, new ShortLivewireProvider(), '@');
	let providerShortBarekt = vscode.languages.registerCompletionItemProvider(LANGUAGES, new ShortLivewireBarektProvider(), '(');

	let providerTag = vscode.languages.registerCompletionItemProvider(LANGUAGES, new TagLivewireProvider(), '<');
	let providerTagColon = vscode.languages.registerCompletionItemProvider(LANGUAGES, new TagLivewireColonProvider(), ':');

	let providerDirective = vscode.languages.registerCompletionItemProvider(LANGUAGES, new DirectiveLivewireProvider(), ' ');
	let providerDirectiveColon = vscode.languages.registerCompletionItemProvider(LANGUAGES, new DirectiveLivewireColonProvider(), ':', '.');
	let providerDirectiveEvent = vscode.languages.registerCompletionItemProvider(LANGUAGES, new DirectiveLivewireEventProvider(), '=', '\'', '\"');

	context.subscriptions.push(
		providerShort,
        providerShortBarekt,
		providerTag,
		providerTagColon,
		providerDirective,
		providerDirectiveColon,
		providerDirectiveEvent,
	);
}

function deactivate() {}

export {
	activate,
	deactivate,
};
