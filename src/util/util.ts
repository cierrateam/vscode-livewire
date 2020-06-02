import * as vscode from "vscode";

export const getAllComponents = async () => {
    let completions = [];

    try {
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/bootstrap/cache/livewire-components.php`));

        for (let i = 0; i < doc.lineCount; i++) {
            const match = /'(.*)'\s*=>\s*'(.*)',*/g.exec(doc.lineAt(i).text);
            if (match && match.length) {
                const params = await getComponentParams(match[1], match[2]);
                completions.push({
                    name: match[1],
                    params,
                });
            }
        }
    } catch (e) {}


    return completions;
};

export const getComponentParams = async (component: string, srcFile?: string) => {
    let params = [];

    try {
        if (!srcFile) {
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/bootstrap/cache/livewire-components.php`));
            const match = new RegExp(`'${component}'\\s*=>\\s*'(.*)',*`, 'mg').exec(doc.getText());
            if (match && match.length) {
                srcFile = match[1];
            }
        }
        
        if (!srcFile) {
            return null;
        }
        
        component = covertKebabCaseToPaskalCase(component);
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/${srcFile}.php`));
        let match = new RegExp(`class\\s*${component}[^{]*{[^]*`, 'mg').exec(doc.getText());
        if (!match) {
            return null;
        }
        const regex = /[{|}]/mg;
        let braceNum1 = 0, braceNum2 = 0;
        do {
            const braceMatch = regex.exec(match[0]);
            if (!braceMatch) {
                break;
            }
            if (braceMatch[0] === '{') {
                braceNum1 ++;
            }
            if (braceMatch[0] === '}') {
                braceNum2 ++;
            }
            if (braceNum1 === braceNum2) {
                break;
            }
        } while(true);
        
        if (!regex.lastIndex) {
            return null;
        }
        
        const classText = match[0].substr(0, regex.lastIndex);
        match = /function\s*mount\s*\(([^\)]*)/mg.exec(classText);
        if (!match || !match.length) {
            return [];
        }
        const variables = match[1].split(/,/mg);
        for (const variable of variables) {
            const words = variable.split(/\$/mg);
            if (words.length) {
                params.push(words[1]);
            }
        }
    } catch (e) {}

    return params;
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
