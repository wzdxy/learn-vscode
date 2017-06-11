'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

import {window,commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "wordcount" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    
    //实例化一个计数器
    let wordCounter=new WordCounter();
    let controller=new WordCounterController(wordCounter);
    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);

    // let disposeable=commands.registerCommand('extension.sayHello',()=>{
    //     wordCounter.updateWordCount();
    // })
    // //添加一个 disposable 列表
    // context.subscriptions.push(wordCounter);
    // context.subscriptions.push(disposeable);



}

class WordCounterController{
    private _wordCounter:WordCounter;
    private _disposable:Disposable;
    constructor(wordCounter:WordCounter){
        this._wordCounter=wordCounter;
        //注册事件
        let subscriptions:Disposable[]=[];
        window.onDidChangeTextEditorSelection(this._onEvent,this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent,this, subscriptions);
        //更新
        this._wordCounter.updateWordCount();
        //
        this._disposable=Disposable.from(...subscriptions);
    }
    dispose(){
        this._disposable.dispose();
    }
    private _onEvent(){
        this._wordCounter.updateWordCount();
    }
}

class WordCounter{
    private _statusBarItem: StatusBarItem;
    public updateWordCount(){
        if(!this._statusBarItem){
            this._statusBarItem=window.createStatusBarItem(StatusBarAlignment.Left);
        }
        //获取编辑器
        let editor=window.activeTextEditor;
        if(!editor){
            this._statusBarItem.hide();
            return;
        }
        let doc=editor.document;
        //只支持MD格式
        if(doc.languageId==='markdown'){
            let wordCount=this._getWordCount(doc);
            //更新状态栏
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
            this._statusBarItem.show();
        }else{
            this._statusBarItem.hide();
        }
    }
    public _getWordCount(doc:TextDocument):number{
        let docContent=doc.getText();
        //去掉空白符号
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount=0;
        if(docContent!=""){
            wordCount=docContent.split(" ").length;
        }
        return wordCount;
    }
    dispose(){
        this._statusBarItem.dispose();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}