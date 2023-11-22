import { xhr } from ".";
import { Vector } from "@/game/matrix";
//加载解析Obj文件
export const loadObject = async function (url){
    const content = await xhr(url,{resType:'text'});
    return content?objParser(content):null;
}
//obj file parser
//只支持注释 v vn vt f,目前不支持其它token
//文件结构参考:https://www.cnblogs.com/zhiminzeng/p/16550905.html
class Comment{//注释
    constructor(){
        this.content = "";
        this.rangeStart = 0;
        this.rangeEnd = 0;
    }
}
class Vertex{//顶点
    constructor(){
        this.vector = new Vector(4);
        this.rangeStart = 0;
        this.rangeEnd = 0;
    }
}
class Normal{//法向量
    constructor(){
        this.vector = new Vector(4);
        this.rangeStart = 0;
        this.rangeEnd = 0;
    }
}
class Texture{//纹理坐标
    constructor(){
        this.vector = new Vector(3);
        this.rangeStart = 0;
        this.rangeEnd = 0;
    }
}
//not support vp
class Face{//面
    constructor(){
        this.vertex = [];//顶点
        this.texture = [];//纹理
        this.normal = [];//法向量
        this.rangeStart = 0;
        this.rangeEnd = 0;
    }
}
const initContext = function(context){
    context.ptr = null;
    context.strNow = '';
    context.params = {};
    context.start = 0;
    context.end = 0;
}
const begain = function (s,context){//开始
    context.strNow += s;
    context.start = context.index;
    if(context.strNow === '\r') return carrige;//空行
    if(context.strNow === '#') return commentStart(s,context);
    if(context.strNow === 'v ') return vertexStart(s,context);
    if(context.strNow === 'vn ') return normalStart(s,context);
    if(context.strNow === 'vt ') return textureStart(s,context);
    if(context.strNow === 'f ') return faceStart(s,context);
    return begain;
}
const commentStart = function (s,context){//注释开始
    context.ptr = new Comment();
    return comment;
}
const comment = function (s,context){//注释
    if(s === '\r'){
        context.ptr.rangeStart = context.start;
        context.ptr.rangeEnd = context.index-1;
        context.ptr.content = context.strNow;
        context.global.comment.push(context.ptr);
        initContext(context);
        return carrige;
    }else{
        context.strNow+=s;
        return comment;
    }
}
const vertexStart = function (s,context){//顶点开始
    context.ptr = new Vertex();
    context.params.vector = [];
    context.params.number = '';
    return vertex;
}
const vertex = function(s,context){//顶点解析
    if(s === '\r'){
        if(context.params.number){
            context.params.vector.push(Number(context.params.number));
            context.params.number = "";
        }
        context.ptr.rangeStart = context.start;
        context.ptr.rangeEnd = context.index-1;
        context.ptr.vector = new Vector(context.params.vector);
        context.global.vertex.push(context.ptr);
        initContext(context);
        return carrige;
    }else{
        if(s!==' ') context.params.number+=s;
        else if(context.params.number){
            context.params.vector.push(Number(context.params.number));
            context.params.number = "";
        }
        context.strNow+=s;
        return vertex;
    }
};
const normalStart = function (s,context){//normal开始
    context.ptr = new Normal();
    context.params.vector = [];
    context.params.number = '';
    return normal;
}
const normal = function(s,context){//贴图坐标解析
    if(s === '\r'){
        if(context.params.number){
            context.params.vector.push(Number(context.params.number));
            context.params.number = "";
        }
        context.ptr.rangeStart = context.start;
        context.ptr.rangeEnd = context.index-1;
        context.ptr.vector = new Vector(context.params.vector);
        context.global.normal.push(context.ptr);
        initContext(context);
        return carrige;
    }else{
        if(s!==' ') context.params.number+=s;
        else if(context.params.number){
            context.params.vector.push(Number(context.params.number));
            context.params.number = "";
        }
        context.strNow+=s;
        return normal;
    }
}
const textureStart = function (s,context){//texture开始
    context.ptr = new Texture();
    context.params.vector = [];
    context.params.number = '';
    return texture;
}
const texture = function(s,context){//贴图坐标解析
    if(s === '\r'){
        if(context.params.number){
            context.params.vector.push(Number(context.params.number));
            context.params.number = "";
        }
        context.ptr.rangeStart = context.start;
        context.ptr.rangeEnd = context.index-1;
        context.ptr.vector = new Vector(context.params.vector);
        context.global.texture.push(context.ptr);
        initContext(context);
        return carrige;
    }else{
        if(s!==' ') context.params.number+=s;
        else if(context.params.number){
            context.params.vector.push(Number(context.params.number));
            context.params.number = "";
        }
        context.strNow+=s;
        return texture;
    }
}
//face 
const faceStart = function (s,context){//face开始
    context.ptr = new Face();
    context.params.vertex = [];
    context.params.texture = [];
    context.params.normal = [];
    context.params.number = '';
    return face;
}
const face = function(s,context){//贴图坐标解析 #下标从1开始
    if(s === '\r'){
        if(context.params.number){
            let arr = context.params.number.split("/").map((val)=>parseInt(val));
            const typeMap = [context.params.vertex,context.params.texture,context.params.normal];
            const baseMap = [context.global.vertex,context.global.texture,context.global.normal]
            for(let k=0;k<arr.length;++k){
                typeMap[k].push(baseMap[k][arr[k]-1]);
            }
            context.params.number = "";
        }
        context.ptr.rangeStart = context.start;
        context.ptr.rangeEnd = context.index-1;
        context.ptr.vertex = context.params.vertex;
        context.ptr.texture = context.params.texture;
        context.ptr.normal = context.params.normal;
        context.global.face.push(context.ptr);
        initContext(context);
        return carrige;
    }else{
        if(s!==' ') context.params.number+=s;
        else if(context.params.number){
            let arr = context.params.number.split("/").map((val)=>parseInt(val));
            const typeMap = [context.params.vertex,context.params.texture,context.params.normal];
            const baseMap = [context.global.vertex,context.global.texture,context.global.normal]
            for(let k=0;k<arr.length;++k){
                typeMap[k].push(baseMap[k][arr[k]-1]);
            }
            context.params.number = "";
        }
        context.strNow+=s;
        return face;
    }
}
const carrige = function(s,context){//回车
    if(context.ptr === null) context.strNow = '';
    if(s === '\n') return begain;//新的一行
}

export const objParser = function (string){
    let index = 0;
    let state = begain;
    const context = {//上下文
        global:{vertex:[],normal:[],texture:[],comment:[],face:[]},
        ptr:null,
        strNow:'',
        params:{},
        index:0,
        start:0,
        end:0
    };
    while(index<string.length){
      context.index = index;
      state = state(string[index],context);
      index++;  
    }    
    return context.global;
}