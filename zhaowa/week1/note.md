### 程序
静态创建
    确定作用域：当前变量和所有的父级变量
    变量申明：参数、变量、函数
动态执行
    this/context/指针
    变量使用
    函数引用
### 作用域 + 上下文
#### 作用域链 - 儿子能用父亲的东西
```javascript
let a = 'global';
console.log(a);
function course(){
    let b = 'zhaowa';
    console.log(b);
    session();//函数提升
    function session(){
        let c = 'this';
        console.log(c);
        teacher();
        function teacher(){
            let d = 'yy';
            console.log(d);
            console.log('test',b);//作用域向上查找
        }
    }
}
course();
//变量提升的优先级 变量靠前
console.log('name',zhaowa);
function zhaowa(){
    this.course = 'this';
}
zhaowa = "zhaowa";
//提升后相当于
var zhaowa;
function zhaowa(){
    this.course = 'this';
}
console.log('name',zhaowa);
zhaowa = "zhaowa";
//块级作用域
if(true){
    let e = 111;
    var f = 222;
    console.log(e);
    console.log(f);
}
console.log('e',e);//报错，只能限制在代码块内
console.log('f',f);
```
* 1. 对于作用域链，我们直接通过创建态来定位作用域链。
* 2. 手动取消全局，使用块级作用域
#### this 上下文 context
* this是在执行时动态读取上下文决定的，而不是创建时
考察重点 - 各使用态中的指针指向
#### 函数直接调用 - this指向的window
```javascript
function foo(){
    console.log("函数内部的this",this);
}
foo();
```
#### 隐式绑定 this指向调用的上一级 => 对象、数组等引用关系逻辑上
```javascript
function fn(){
    console.log("函数内部的this",this.a);
}
let obj = {
    a:9,
    fn
}
obj.fn();//9
```
#### 面试题
```javascript
const foo = {
    bar:100,
    fn:function(){
        console.log("函数内部的this",this,this.bar);
    }
}
//取出
let fn1 = foo.fn;
//执行
fn1();//window undefined 本质是window.fn()
//追问1：如何改变属性的指向
const o1 = {
    text:"o1",
    fn:function(){
        console.log("o1fn_this",this);
        return this.text;
    }
}
const o2 = {
    text:"o2",
    fn:function(){
        console.log("o2fn_this",this);
        return o1.fn();
    }
}
const o3 = {
    text:"o3",
    fn:function(){
        console.log("o3fn_this",this);
        //直接内部构造
        let fn = o1.fn;
        return fn();
    }
}
console.log("o1fn",o1.fn());//o1
console.log("o2fn",o2.fn());//o1
console.log("o3fn",o3.fn());//undefined
```
* 1. 在执行函数时，函数被上一级调用，去找发起方
* 2. 直接变成公共执行时，指向全局

#### 就是想把console.log("o2fn",o2.fn());的结果是o2
```javascript
//1 人为干涉，改变this指向 bind /apply / call
o1.fn.call(o2)
//2 不许人为干涉
const o1 = {
    text:"o1",
    fn:function(){
        console.log("o1fn_this",this);
        return this.text;
    }
}
const o2 = {
    text:"o2",
    fn:o1.fn
}
console.log("o1fn",o1.fn());//o1
console.log("o2fn",o2.fn());//o1
```
#### 显示绑定 （bind | apply | call)

```js
    function foo(){
        console.log("函数内部的this",this);
    }
    foo();
    //使用
    foo.call({a:1});
    foo.apply({a:1});
    const bindFoo = foo.bind({a:1});
    bindFoo();
```
#### 追问： call、bind、apply的区别
* 1. call <=> apply 传参不同 依次传入<=>数组
* 2. bind <=> call/apply 直接返回

#### 追问2：bind原理 / 手写bind
* 原理或者手写类题目，解题思路
* 1. 说明原理 - 写注释
* 2. 根据注释 - 补齐代码
```js
//1. 需求： 手写bind => bind存放位置 (挂载) => Function.prototype
Function.prototype.newBind = function(){
//2. bind是什么？ => 改变运行上下文 => 传入参数：newThis+args1~argsn
    const _this = this;
    const agrs = Array.prototype.slice.call(arguments);
    const newThis = args.shift();
//3. bind要返回什么? => 返回一个可执行函数 =>上下文被改变的原函数 （原函数传参不变）
    return function(){
        return _this.apply(newThis,args);
    }
}
Function.prototype.newApply = function(context){
    //边界检测
    //函数检测
    if(typeof this!=="function"){
        throw new Error('type error');
    }
    //参数检测
    context = context || window;
    
    context.fn = this;
    //区分传参 + 立即执行
    let result = arguments[1]?context.fn(...arguments[1]):context.fn();
    //销毁临时挂载
    delete context.fn;
    return result;
}
```
#### new -this指向new之后得到的实例
```js
class Course{
    constructor(name){
        this.name = name;
        console.log("函数内部的this",this);
    }
    test(){
        console.log("类方法中的this",this);
    }
}
const course = new Course('this');
course.test();
```
#### 追问：类中异步方法，this有没有区别
```js
class Course{
    constructor(name){
        this.name = name;
        console.log("函数内部的this",this);
    }
    test(){
        console.log("类方法中的this",this);
    }
    asyncTest(){
        console.log("异步方法外的this",this);
        setTimeout(function(){
            console.log("异步方法内的this",this);
        },500);
    }
}
const course = new Course('this');
course.test();
course.asyncTest();
```
* 1. 执行settimeout时，匿名方法执行上下文,在队列中和全局执行函数效果相同 - 指向window
* 2. 再追问，如何解决 - 记录this / bind等 / 箭头函数

### 聊完作用域、上下文 => 如何突破束缚
#### 闭包：一个函数和它周围状态的引用捆绑在一起的组合

#### 函数作为返回值的场景
```js
function mail(){
    let content = '信';
    return function(){
        cosole.log(content);
    }
}
const envelop = mail();
envelop();
```
* 函数可以作为返回值传递的
* 函数外部可以通过一定方式获取到内部局部作用域变量=>会导致内部局部变量被引用无法GC
#### 函数作为参数额时候
```js
//单一职责原则
let content;
//通用存储
function envelop(fn){
    content = 1;
    fn();
}
//业务逻辑
function mail(){
    cosole.log(content);
}
envelop(mail);
```
#### 函数嵌套
```js
let counter = 0;
function outerFn(){
    function innerFn(){
       counter++;
       console.log(counter);
    }
    return innerFn
}
outerFn()()
```
#### 事件处理 (异步) 的闭包
```js
let lis = document.getElementsByTagName("li");
for(var i=0;i<lis.length;i++){
    (function(i){
        lis[i].onclick = function(){
            console.log(i);
        }
    })(i);
}
```
#### 追问： 立即执行函数
```js
(function immediateA(a){
   return (function immediateB(b){
       console.log(a);
   })(1);
})(0);
```
* 推动了js的模块化发展

#### 实现私有变量 - 高频
```js
function createStack(){
    return {
        items:[],
        push(item){
            this.items.push(item);
        }
    }
}
const stack = {
    items:[],
    push:function(){}
}
function createStack(){
    const items = [];
    return {
        push(item){
            items.push(item);
        }
    }
} 
```
