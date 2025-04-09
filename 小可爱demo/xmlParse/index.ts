import { inlineComment } from "./commet";
//类xml解析
export class TagNode {
    tagName:string = "";
    attrs:{[key:string]:string} = {};
    children:TagNode[] = [];
    constructor(){}
}
let curAttrName = "";
let curAttrValue = "";
let curNode:TagNode|null = null;
let tagValueEmbrace = "";//属性值的开头和结束字符
let rootdeclare = false;//xml定义标签
let parent:TagNode|null = null;
const root:TagNode[] = [];
const stack:TagNode[] = [];//结束保证栈为空
function clear(){
    curAttrName = "";   
    curAttrValue = "";
    curNode = null; 
    tagValueEmbrace = "";
    rootdeclare = false;
    parent = null;
    root.length = 0;
    stack.length = 0;
}
function start(s:string){
    // console.log("start",s)
    if(s === "<") return TagStartOpen;
}

function TagStartOpen(s:string){
    // console.log("TagStartOpen",s)
    //初始化将要处理的节点
    if(s === "?"){//xml声明
        curNode = new TagNode();
        rootdeclare = true;
        return TagName;
    }
    if(s === "!"){//单行注释
        return inlineComment(s);
    }
    if(s === "/"){//封闭标签
        return closeTagName;
    }
    curNode = new TagNode();
    return TagName(s);
}
function TagName(s:string){
    if(s!==" "&&s!==">"&&s!=="/"){
        curNode!.tagName+=s;
        return TagName;
    }else{//节点名字结束
        //console.log("TagName",curNode!.tagName);
        return TagAttribute(s);
    }
}
function TagAttribute(s:string){
    // console.log("TagAttribute",s);
    if(s === "/") return singleTagEnd;
    if(rootdeclare && s === "?") return singleTagEnd;//xml声明
    if(s===">") return TagStartClose(s);
    if(s===" ") return TagAttribute;
    else return TagAttributeName(s);
}
function TagAttributeName(s:string){
    // console.log("AttributeName",s)
    if(s!=="="){
        curAttrName+=s;
        return TagAttributeName;
    }else return TagAttributeSplits(s);
}
function TagAttributeSplits(s:string){
  return TagAttributeValueStart;
}
function TagAttributeValueStart(s:string){
    tagValueEmbrace = s;
    return TagAttributeValue;
}
function TagAttributeValue(s:string){
    // console.log("TagAttributeValue",s)
    if(s === tagValueEmbrace){
        curNode!.attrs[curAttrName] = curAttrValue;
        return TagAttributeEnd(s);
    }else{
        curAttrValue+=s;
        return TagAttributeValue;//下一个属性
    }
}
function TagAttributeEnd(s:string){
    //clear attr cache 
    curAttrName = "";
    curAttrValue = "";
    return TagAttribute;
}
function TagStartClose(s:string){
    //clear tag cache
    if(s === "?"){rootdeclare = false;return TagStartClose;}
    if(s === ">"){
        stack.push(curNode!);
        return TagContent;
    }
}

function TagContent(s:string){
    if(s === " "||s === "\r"||s === "\n") return TagContent;
    if(s === "<") return TagStartOpen;
    else{
        console.log("extra content",s);//其它未处理的内容
        return TagContent;
    }
}

function singleTagEnd(s:string){//单标签
    if(s === ">"){
        parent = stack.length?stack[stack.length-1]:null;
        if(parent) parent.children.push(curNode!);
        else root.push(curNode!);
        return TagContent;
    }
}

function closeTagName(s:string){
    if(s === ">"){
        return closeTagEnd(s);
    }
    else return closeTagName;
}
function closeTagEnd(s:string){
    const endNode = stack.pop();
    parent = stack.length?stack[stack.length-1]:null;
    if(parent) parent.children.push(endNode!);
    if(stack.length === 0 && endNode) root.push(endNode);//栈为空的节点为root下节点
    return TagContent;
}

function end(){
  
}

function xmlParse(xml:string){
    let mochine:any = start;
    let index = 0;
    clear();//清楚状态
    do{
        mochine = mochine(xml[index]);
        index++;
        if(index>=xml.length) mochine = end;
    }while(mochine !== end);
    return root;
}

export  {xmlParse,TagContent};
// bnf normal:
// <document> ::= <?xml version="1.0" encoding="UTF-8"?> <element> 
// <element> ::= <start-tag> <content> </end-tag>
// <start-tag> ::= < '<' name ( ' ' attribute )* '>' >
// <end-tag> ::= < '</' name '>' >
// <name> ::= <letter> { <letter> | <digit> | '.' | '-' | '_' } //tagName AttrName
// <attribute> ::= name '=' '"' value '"' 
// <value> ::= <character>* 
// <content> ::= <character>* | <element>* 
// <letter> ::= 'a' | 'b' | ... | 'z' | 'A' | 'B' | ... | 'Z'
// <digit> ::= '0' | '1' | ... | '9'
// <character> ::= any character (excluding '<', '>')
