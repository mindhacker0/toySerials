const RENDER_TO_DOM = Symbol.for('render to dom');
class ElementWrapper{
    constructor(type){
        this.type = type;
        this.root = document.createElement(type);
    }
    setAttribute(name,value){
        if(name.match(/^on([\s\S]+)$/)){
            if(typeof value !== 'function'){return console.error(`${RegExp.$1} event must bind with a function.`)}
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/,v=>v.toLocaleLowerCase()),value);
        }else{
            if(name === "className") name = "class";
            this.root.setAttribute(name,value);
        }
    }
    appendChild(component){
        let range = document.createRange();
        range.setStart(this.root,this.root.childNodes.length);
        range.setEnd(this.root,this.root.childNodes.length);
        component[RENDER_TO_DOM](range);
    }
    get vdom(){
        return {
            type:this.type,
            props:this.props,
            children:this.children.map(v=>v.vdom)
        }
    }
    [RENDER_TO_DOM](range){
        range.deleteContents();
        range.insertNode(this.root);
    }
}
class TextWrapper{
    constructor(content){
        this.root = document.createTextNode(content);
    }
    [RENDER_TO_DOM](range){
        range.deleteContents();
        range.insertNode(this.root);
    }
}
class Component{
    constructor(){
        this.props = Object.create(null);
        this.props.children = [];
        this._root = null;
        this.state = null;
        this._range = null;
    }
    setState(partState,callback){
        let merge = function(oldState,newState){
            for(var i in newState){
                if(oldState[i] === null || typeof oldState[i] !== 'object'){
                    oldState[i] = newState[i];
                }else{
                    // if(typeof oldState[i] === 'object' && typeof oldState[i] === 'undefined'){
                    //     oldState[i] = (newState[i] instanceof Array)?new Array():Object.create(null);
                    // }
                    merge(oldState[i],newState[i]);
                }
            }
        }
        merge(this.state,partState);
        console.log(partState,this.state);
        this.rerender();
    }
    setAttribute(name,value){
       this.props[name] = value;
    }
    appendChild(component){
        this.props.children.push(component);
    }
    [RENDER_TO_DOM](range){
        this._range = range;
        this.render()[RENDER_TO_DOM](range);
    }
    rerender(){
       let oldRange = this._range;
       let range = document.createRange();
       range.setStart(oldRange.startContainer,oldRange.startOffset);
       range.setEnd(oldRange.startContainer,oldRange.startOffset);
       this[RENDER_TO_DOM](range);
       //let selection = window.getSelection();
       oldRange.setStart(range.endContainer,range.endOffset);
       //selection.addRange(oldRange);
       oldRange.deleteContents();
    }
}
function createElement(type,attributes,...children){
    let e;
    if(typeof type === 'string'){
        e = new ElementWrapper(type);
    }else{
        e = new type;
    }
    for(let p in attributes){
        e.setAttribute(p,attributes[p]);
    }
    let insertChildren = function(children){
        for(let child of children){
            if(child === null || JSON.stringify(child) === '{}') continue;
            if(typeof child === 'object'){
                if(child instanceof Array){
                    insertChildren(child);  
                    continue;  
                }
            }else{
                child = new TextWrapper(String(child));
            }
            //console.log(child,children);
            e.appendChild(child);
        }
    }
    insertChildren(children);
    return e;
}
function render(component,parentElement){
    let range = document.createRange();
    range.setStart(parentElement,0);
    range.setEnd(parentElement,parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
}

export default class React{
    static render = render;
    static createElement = createElement;
    static Component = Component;
}