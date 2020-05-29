import * as vscode from "vscode";

export const getAllComponents = async () => {
    let completions = [];

    try {
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(`${vscode.workspace.rootPath}/bootstrap/cache/livewire-components.php`));

        for (let i = 0; i < doc.lineCount; i++) {
            const match = /'(.*)'\s*=>\s*'(.*)',*/g.exec(doc.lineAt(i).text);
            if (match && match.length) {
                completions.push(match[1]);
            }
        }
    } catch (e) {}

    return completions;
};
