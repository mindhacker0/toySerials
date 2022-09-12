## deconstructor 解构 - 解开对象结构
```js
const zhaowa = {
    teacher:"yy",
    leader:"yiy"
}
//读取属性
const {teacher,leader} = zhaowa;
//数组
const arr = ['yy','yiy','yiiy'];
const [a,b,c] = arr;
```
### key 结构技巧
```js
const zhaowa = {
    teacher:{
        name:"yy",
        age:30
    },
    leader:"yiy",
    name:"es6"
};
//别名
const {
    teacher:{
        name,
        age
    },
    leader,
    name:className
} = zhaowa;
```
## 解构使用场景
### 形参解构
```js
const sum = arr =>{
    let res = 0;
    (arr||[]).forEach(each=>{
        res+=each;
    })
}
//解构 - 适用于确定项目数量下的运算优化
const sum = ([a,b,c])=>{
    return a+b+c;
}
```
### 结合初始值
```js
const course = ({teacher="",leader="",course="zhaowa"})=>{
    //运算
}
course({
    teacher:"yy",
    leader:"yiy",
    //course:"es6"
})
```
### 返回值
```js
const getCourse = ({teacher="",leader="",course="zhaowa"})=>{
    //运算
    return {
        teacher,
        leader
    }
}
```
### 变量交换
```js
let a = 1;
let b = 2;
[b,a] = [a,b];
```
### JSON处理
```js
//code判断
ajax.get().then(res=>{
    let code = res.code;
    if(code === 0){
        let data = res.data;
        let msg = res.msg;
        let {data,msg} = res;
    }
});
//json处理
const json = '{"teacher":"yy","leader":"yiy"}';
const obj = JSON.parse(json);
const {
    teacher,
    leader
} = obj;
```
## const 标志常量
```js
const LIMIT = 10;
const OBJ_MAP = {
    a:'A',
    A:'a'
};
const QUEUE = [1,2,3,4,5];
```
### 1.不允许重复声明赋值
```js
var arg1 = 'yy';
arg1 = 'es';

//es5中实现常量 arg2 = "yy";
Object.defineProperty(window,"arg2",{
    value:"yy";
    writeable:false
});
//es6
const arg3 = "yy";
arg3 = "es6";//NOK
```
### 2.块级作用域
```js
if(true){
    var arg1 = 'yy';
}
console.log(arg1);
{
    const arg1 = "yy";
}
console.log(arg1);
//追问 变量提升
console.log(arg2);
var arg2 = "yy";

console.log(arg3);
const arg3 = "es6";//arg3 not defined
//追问2 dead zone
{
    console.log(arg4);
    const arg4 = "yy";
}
```
### 3.const or let
```js
//const锁定的是地址
//解决引用类型内部属性需要固定
//破局 - Object.freeze()
Object.freeze(obj);
//冻结
const obj2 = {
    teacher:"yy",
    age:30
};
Object.freeze(obj2);
obj2.age = 20;
console.log(obj2);
//进一步追问 =>关于层级
const obj2 = {
    teacher:"yy",
    age:30,
    zhaowa:["es6","ts"]
};
Object.freeze(obj2);
obj2.zhaowa[0] = "free";
console.log(obj2);
//freeze 只能冻结根层，嵌套的引用类型无法完全冻结
//手写
function deepFreeze(obj){
    Object.freeze(obj);
    (Object.keys(obj)||[]).forEach(key=>{
        if(typeof obj[key] === 'object'){
            deepFreeze(obj[ley]);
        }
    })
}
```
## arrow_function 箭头函数
```js
//传统函数
function test(a,b){
    return a+b;
}
//传统函数表达式
var test2 = function(a,b){
    return a+b;
}
```
### 箭头函数的时代
```js
const test3 = (a,b)=>{
    return a+b;
}
//简写
const test4 = (a,b)=>a+b;
const test4 = x=>x++;
```
### 上下文
```js
const obj2 = {
    teacher:"yy",
    class:"es6",
    getTeacher:function(){
        return this.teacher;
    },
    getClass:()=>{
        return this.class;
    }
}
//箭头函数上下文
```
## 追问 箭头函数的场景
### 1. dom操作
```js
const btn = document.querySelector("#btn");
btn.addEventListener("click",function(){
    this.style.color = "#fff";
});
```
### 2. 类操作
```js
//箭头函数无法构造类
function obj(teacher,class){
    this.teacher = teacher;
    this.calss = class;
}
const obj = (teacher,class1)=>{
    this.teacher = teacher;
    this.calss = class1;
}
//箭头函数无法构造原型上的方法
Obj.prototype.learn = function(){
    console.log(this.teacher,this.leader);
}
```
### 3.参数
```js
const test = teacher=>{
    console.log(arguments);//报错
}
```
### 模板字符串
```js
const NAME = "zhaowa";
const CITY = "beijing";
let str = "we are <b>"+NAME+"</b>\n"+
"in\n"+
"<em>"+CITY+"</em>city,\n"+
"and start class";
let str1 = `we are ${NAME} in ${CITY} city`;
```
### 数组
forEach - 便历：无返回值=>遍历数组的每一项做取值或者改值
map - 映射：返回一个新的数组
filter
find
some / every
reduce

### Proxy
```js
let obj = {};
let _proxy = new Proxy(obj,{
    get(target,prop){
        return target[prop];
    }
    set(target,prop,val){
        if(typeof val === "string"){
            target[prop]  = val;
            return true;
        }
        return false;
    }
});
```
### Reflect
```js
let class = {
    name:"zhaowa",
    get teacher(){
        return this.name + this.age;
    }
};
Reflect.get(class,"name");
```
### SET & MAP
```js
//set 与数组类似，所有成员唯一
add delete clear forEach size has
let set = new Set([1,2,3]);
let newArr = [...set];
let newArr = Array.from(set);
//map与对象类似，key可以为各种类型的值
set get delete forEach keys values size
```
### symbol - 用于保证数个值一定不相等的场景 如：对象属性

### async & await generator for of
### 手写Object.entries
```js
Object.prototype.myEntries = prop=>{
//1.输入 entries => 类型判断
  if(Array.isArray(prop)){
    return prop.map((val,index)=>[index,val]);
  }
  if(Object.prototype.toString.call(prop) === '[Object Object]'){
    return Object.keys(prop).map(key=>[key,prop[key]]);
  }
  if(typeof prop === "number") return [];
  //2.做层级或者更多操作

}
```
### Promise.allSettled - 复现功能
```js
Promise.allSettled([P1,P1]).then(res=>{

},err=>{

});
Promise.prototype.myAllSettled = function(p_arr){
    let result = [];
    let count = 0;
    return new Promise((resolve,reject)=>{
        for(let p of p_arr){
            Promise.resolve(p).then(res=>{
                result[count] = {
                    status:"fullfilled",
                    result:res
                };
                ++count;
                if(count === p_arr.length){
                    resolve(result);
                }
            })
        }
    })
}
```