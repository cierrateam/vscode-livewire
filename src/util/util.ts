import * as vscode from "vscode";

export const getAllComponents = async () => {
    let completions = [];

    try {
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/bootstrap/cache/livewire-components.php`));

        for (let i = 0; i < doc.lineCount; i++) {
            const match = /'(.*)'\s*=>\s*'(.*)',*/g.exec(doc.lineAt(i).text);
            if (match && match.length >= 2) {
                completions.push({
                    name: match[1],
                    srcFile: match[2],
                });
            }
        }
    } catch (e) {}

    return completions;
};

export const getAllComponentsWithParams = async () => {
    let completions = [];

    try {
        const components = await getAllComponents();
        for (const component of components) {
            const params = await getComponentParams(component.name, component.srcFile);
            completions.push({
                name: component.name,
                params,
            });
        }
    } catch (e) {}

    return completions;
};

export const getComponentClassSource = async (component: string, srcFile?: string) => {
    try {
        if (!srcFile) {
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/bootstrap/cache/livewire-components.php`));
            const match = new RegExp(`'${component}'\\s*=>\\s*'(.*)',*`, 'mg').exec(doc.getText());
            if (match && match.length) {
                srcFile = match[1];
            }
        }

        if (!srcFile) {
            throw new Error('Cannot find class src file');
        }

        srcFile = srcFile.replace(/\\\\/g, '/');
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/${srcFile}.php`));
        return doc.getText();

        // component = covertKebabCaseToPaskalCase(component);
        // const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/${srcFile}.php`));
        // const match = new RegExp(`class\\s*${component}[^{]*{[^]*`, 'mg').exec(doc.getText());
        // if (!match) {
        //     throw new Error('Cannot find class');
        // }
        // const regex = /[{|}]/mg;
        // let braceNum1 = 0, braceNum2 = 0;
        // do {
        //     const braceMatch = regex.exec(match[0]);
        //     if (!braceMatch) {
        //         break;
        //     }
        //     if (braceMatch[0] === '{') {
        //         braceNum1 ++;
        //     }
        //     if (braceMatch[0] === '}') {
        //         braceNum2 ++;
        //     }
        //     if (braceNum1 === braceNum2) {
        //         break;
        //     }
        // } while(true);

        // if (!regex.lastIndex) {
        //     throw new Error('Infinitive class');
        // }

        // return match[0].substr(0, regex.lastIndex);
    } catch (e) {
        return null;
    }
};

export const getComponentParams = async (component: string, srcFile?: string) => {
    try {
        const classText = await getComponentClassSource(component, srcFile);
        if (!classText) {
            throw new Error('Cannot find class');
        }
        const match = /function\s*mount\s*\(([^\)]*)/mg.exec(classText);
        if (!match || !match.length) {
            throw new Error('Cannot find mount() function');
        }
        const variables = match[1].split(/,/mg);
        const params = [];
        for (const variable of variables) {
            const words = variable.split(/\$/mg);
            if (words.length) {
                params.push(words[1]);
            }
        }
        return params;
    } catch (e) {
        return null;
    }
};

export const covertKebabCaseToPaskalCase = (text: string) => {
    let resText = '';
    const words = text.split('-');
    for (const word of words) {
        resText += word[0].toUpperCase();
        resText += word.substr(1);
    }
    return resText;
};

export const getComponentActions = async (viewFile: string) => {
    try {
        viewFile = viewFile.replace(/\\/g, '/');
        const viewMatch = new RegExp(`.*/resources/views/(.*).blade.php`).exec(viewFile);
        if (!viewMatch || !viewMatch.length) {
            throw new Error('View file path is not correct');
        }
        const view = viewMatch[1].replace(/\\/g, '\\.');
        console.log(view);
        const components = await getAllComponents();
        for (const component of components) {
            const classText = await getComponentClassSource(component.name, component.srcFile);
            if (!classText) {
                continue;
            }
            let match = new RegExp(view, 'mg').exec(classText);
            if (!match) {
                continue;
            }
            const regex = /^\s*(?:public\s+)?function\s*(\w+)/mg;
            const actions = [];
            while (true) {
                match = regex.exec(classText);
                if (!match) {
                    break;
                }
                if (match && match.length) {
                    if (match[1] !== 'mount' && match[1] !== 'render') {
                        actions.push(match[1]);
                    }
                }
            }
            return actions;
        }
        return null;
    } catch (e) {
        return null;
    }
};

export const getComponentProperties = async (viewFile: string) => {
    try {
        viewFile = viewFile.replace(/\\/g, '/');
        const viewMatch = new RegExp(`.*/resources/views/(.*).blade.php`).exec(viewFile);
        if (!viewMatch || !viewMatch.length) {
            throw new Error('View file path is not correct');
        }
        const view = viewMatch[1].replace(/\\/g, '\\.');
        console.log(view);
        const components = await getAllComponents();
        for (const component of components) {
            const classText = await getComponentClassSource(component.name, component.srcFile);
            if (!classText) {
                continue;
            }
            let match = new RegExp(view, 'mg').exec(classText);
            if (!match) {
                continue;
            }
            const regex = /public\s+\$(\w+)/mg;
            const actions = [];
            while (true) {
                match = regex.exec(classText);
                if (!match) {
                    break;
                }
                if (match && match.length) {
                    actions.push(match[1]);
                }
            }
            return actions;
        }
        return null;
    } catch (e) {
        return null;
    }
};
