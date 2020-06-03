# Livewire Language Support
Laravel language support for VSCode. With this package you gain functionallities like autocomplete, snippets, auto-discovery of properties and more.

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

At the moment we're incombatible with various Blade extensions.
