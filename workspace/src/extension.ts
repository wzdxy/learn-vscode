'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "workspace" is now active!');

    

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
        console.log('find');
        genarateContent();
        
    });

    context.subscriptions.push(disposable);
}

function genarateContent(){
    let mdFileList=[];
    vscode.workspace.findFiles('**/*.md').then(value=>{
        let rootPath=vscode.workspace.workspaceFolders[0].uri.path;
        value.forEach((item,idx)=>{        
            // let txt=fs.readFileSync(item.fsPath,'utf8');
            let fullPath=item.path;
            let relativePath=path.relative(String(rootPath),fullPath);
            mdFileList.push({
                fileName:path.basename(fullPath),
                fullPath:fullPath,
                relativePath:relativePath,
                pathLevels:relativePath.split(path.sep)
            })   
            console.log(relativePath);
        })
        console.log(mdFileList);
        return mdFileList;
    });
}

function fillToContentTree(mdFileList){
    let mainTree={
        'root':{
            title:'ROOT',children:{}
        }
    };
    for(let i=0,m=mdFileList.length;i<m;i++){
        let pathLevels=mdFileList[i].pathLevels;
        for(let j=0,depth=pathLevels.length;j<depth;j++){
            let level=pathLevels[j];
            // mainTree[level]=fillNode(mainTree,level,pathLevels);
        }
    }
}

function fill(parent,level,pathLevels){
    for(let j=0,depth=pathLevels.length;j<depth;j++){
        let level=pathLevels[j];
        parent[level]=fill(parent,level,pathLevels);
    }
}

function fillNode(parent,level,pathLevels){
    if(!parent.children.hasOwnProperty(level)){
        parent.children[level]={title:'',path:'',children:{}}
    }
    parent.children[level]

}

// this method is called when your extension is deactivated
export function deactivate() {
}