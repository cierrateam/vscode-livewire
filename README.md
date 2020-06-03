# Livewire Language Support
![Release Vscode Plugin](https://github.com/cierrateam/vscode-livewire/workflows/Release%20Vscode%20Plugin/badge.svg)<br>
Laravel language support for VSCode. Autocomplete, Snippets, Auto-Discover and more.

## Features

In general thw whole syntax of livewire is supported. For example `wire:click` or `wire:ignore`.

#### Syntax Highlighting
Nothing red anymore! The `<livewire:component/>` tag and all the properties are nice colored.

#### Snippets
Following snippets are included:
- @livewire
- @livewireStyles
- @livewireScripts

#### Auto-Complete Components
This package automatically discovers components you have in your application and gives you the availability for a quick autocomplete.

#### Auto-Discover Mount Properties
At your components you maybe have some paramters: `<livewire:counter :title="Cierras Counter" />`. This parameters are defined in your `mount()` function. We're automatically discovering the component and creating this parameters for you, to fill them out.


## Known Issues

At the moment Components from third-party libraries are not supported for the autocomplete feature.
