## promise 解析
* 啥是异步
```js
//异步执行
let count = 1;
let timer = setTimeout(function(){
    count++;
    console.log("in",count);
},1000);
console.log("out");
//循环执行 + 终止
let count = 1;
let timer = setInterval(function(){
    count++;
    console.log("in",count);
},1000);
console.log("out");
setTimeout(function(){
   clearInterval(timer);
   console.log("clear");
},1000);
//看不见的队列，存放着他需要默默执行的命令
```
### 1. 进程 & 线程
#### a.概念与区别 - 见图

#### b.面试题：
* 映射到前端 - 浏览器。chrome新开一个窗口，是进程还是线程。 进程
* 发散：
方向一：窗口 （进程间） 通信？ storage、cookie => 多种存储区别 => 应用场景
方向二：浏览器原理 (中高级岗位面试居多)

浏览器原理：
1.GUI渲染线程 
1.1 解析HTML、CSS、构建DOM树=>布局
1.2 与JS引擎线程互斥，当执行JS引擎线程时，GUI渲染会被挂起，当任务队列空闲时，主线程才回去执行GUI
2.JS引擎线程
2.1 处理JS，解析执行脚本
2.2 分配、处理、执行了待执行脚本的同时，处理待执行事件，维护事件队列
2.3 阻塞GUI渲染=>js为何会阻塞GUI渲染=>
3.定时器触发线程
3.1 异步定时器的处理和执行-setTimeout setInterval
3.2 接收JS引擎分配的定时器任务，并执行
3.3 处理完成交于事件触发线程
4.异步HTTP请求线程
4.1 异步执行请求类操作
4.2 接收JS引起线程异步请求操作
4.3 监听回调，交给事件触发线程做处理
5.事件触发线程
5.1 接收所有来源的事件
5.2 将回调的事件依次加入到任务队列的队尾，交给js引擎执行

### 2. EVNENT-LOOP
#### a.执行栈
* JS单线程语言，单步执行
```js
function func2(){
    throw new Error("plz check your call stack");
}
function func1(){
    func2();
}
function run(){
    func1();
}
run();
```
#### b.面试题
* JS堆栈执行顺序与堆栈溢出 / 爆栈/性能卡顿/死循环=> JS性能优化
```js
function func(){
    func();
}
func();
// vue - computed 对某个ob变量做了赋值 => 禁止
```
* 执行顺序题
解题思路 - 任务维度
```js
setTimeout(()=>{
    console.log("timeout");
});
new Promise((rs,rj)=>{
    console.log("new Promise");//声明的时候是同步的
    rs();
    return new Promise((rs)=>{
        console.log("inner new promise");
        rs();
    }).then(()=>{
        console.log("inner promise then");
    });
}).then(()=>{
    console.log("promise then");
}).then(()=>{
    console.log("promise then then");
});
```
### promise
#### a.理论
```js
//1.写一个异步定时
settimeout(()=>{
    console.log('timeout');
},2000);
//2.异步请求
request.onreadystatechange = ()=>{
    if(request.readyState === 4){
        const _status = request.status;
        if(_status === 200){
            const _res = request.responseText;
            return success(_res);
        }else{
            return fail(_status);
        }
    }
}
//3.延时后在请求
//回调地狱
//5.promise的出现拯救了回调标志的无穷嵌套
new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("ok");
    })
}).then(res=>{
    console.log("then"+res);
}).catch(err=>{
    console.log("catch"+err);
})
// 6.多个异步孙旭执行 => 复合链式调用
// 7.全部执行，专项完成全部promise后，再回调 promise.all
//8. 由执行完成的，立刻操作 promise.race
```
#### b.面试 - Promise/A+
* 1. promise有哪些状态？对应值有哪些？
promise:pending、fullfilled、rejected
executor: new Promise的时候立即执行，接收两个参数resolve
* 2. promise的默认状态是？状态如何流转？
默认初始状态：pending
内部维护成功： undefined、thenable、promise
内部维护失败变量reason

promise状态流转 pending => rejected、 pending =>fullfilled
* 3. promise的返回值？
then方法：接收onFullfilled和onRejected 
如果then时，promise已经成功，执行onFullfilled,参数value
如果then时，promise已经成功，执行onRejected,reason

如果then中有异常传递onRejected
* 4. 手写promise - 基本同步版本
```js
const PENDING = 'PENDING';
const FULLFILLED = 'FULLFILLED';
const REJECTED = 'REJECTED';
class Promise{
    constructor(executor){
        //1.默认状态 - PENDING
        this.status = PENDING;
        //2.维护内部成功失败值
        this.value = undefined;
        this.reason = undefined;
        //成功回调
        let resolve = value =>{
            if(this.status === PENDING){
                this.status = FULLFILLED;
                this.value = value;
            }
        };
        //失败回调
        let reject = reason =>{
            if(this.status === PENDING){
                this.status = REJECTED;
                this.reason = reason;
            }
        }
        try {
            executor(resolve,reject);
        } catch(error){
            reject(error);
        }
    }
    then(onFullfilled,onRejected){
        if(this.status === FULLFILLED){
            onFullfilled(this.value);
        }
        if(this.status === REJECTED){
            onRejected(this.reason);
        }
    }
}
//家庭作业 - 异步方式 => 维护队列
```
### async await & generator
JS模块化
背景：复杂度 工程化 服务化
## JS模块化
### 1. 不得不说的历史
#### 背景
JS本身定位：简单的页面设计 - 页面动画 + 基本的表单提交
并无模块化 or 命名空间的概念

> js的模块化需求日益增长

#### 幼年期：无模块化
1. 开始需要在页面中增加一些不同的JS：动画、表单、格式化工具
2. 多种js文件被分在不同的文件中
3. 不同的文件又被同一个模板所引用
```js
//test.html
<script src="xxx.js"></script>
<script src="xxx.js"></script>
<script src="xxx.js"></script>

```
认可：
文件分离是最基础的模块化，第一步
* 追问：
script标签两个参数 - async & defer
```js
<script src="xxx.js" type="text/javascript" async></script>
```
总结：
普通 - 解析到标签，立刻pending，并且下载执行
defer - 解析到标签开始异步下载，解析完成后开始执行
async - 解析到标签开始异步下载，下载完成后立刻执行并阻塞渲染，执行完成后继续渲染

1. 兼容性>IE9=>其他兼容性问题
2. 问题方向=>浏览器渲染原理，同异步原理，模块化加载原理
问题出现：
* 污染全局作用域 => 不利于大型项目的开发以及多人团队共建
#### 成长期：模块化的雏形 - IIFE (语法侧的优化)
##### 作用域的把控
例子：
```js
//定义一个全局变量
let count = 0;
//代码块1
const increase = ()=>++count;
//代码块2
const reset = ()=>{
    count = 0;
}
increase();
reset();
console.log(count);
```
利用函数块级作用域
```js
(()=>{
    let count  = 0;
    //...
})();
```
定义函数 + 立即执行=>独立的空间
初步实现了一个最简单的模块
尝试去定义一个最简单的模块
```js
const module = (()=>{
    let count  = 0;
    return {
        increase:()=>{++count;},
        reset:()=>{
            count = 0;
        }
    }
})();
module.increase();
module.reset();

```
** 追问：有额外依赖的时候，如何优化IIFE相关代码 **
> 优化1：依赖其他模块的IIFE
```js
const iifeModule =  ((dependencyModule1,dependencyModule2)=>{
    let count  = 0;
    return {
        increase:()=>{++count;},
        reset:()=>{
            count = 0;
        }
    }
})(dependencyModule1,dependencyModule2);
```
** 面试1：了解早期jQuery依赖处理还有模块加载方案？ / 了解传统IIFE是如何解决多方依赖问题 **
答： IIFE + 传参调配

实际上，传统框架应用了一种revealing的写法
揭示模式
```js
const iifeModule =  ((dependencyModule1,dependencyModule2)=>{
    let count  = 0;
    const increase = ()=>++count;
    //代码块2
    const reset = ()=>{
        count = 0;
        //dependencyModule1.xxx
    }
    return {
        increase,
        reset
    }
})(dependencyModule1,dependencyModule2);
//返回的是能力 = 使用方传参 + 本身逻辑能力 + 依赖的能力
```
* 追问：
面试后续引导方向：
1. 深入模块化实现
2. 转向框架：jquery/vue/react的模块化细节，以及框架特征原理 
3. 转向设计模式 - 注重模块化的设计模式

#### 成熟期
##### CJS - CommonJS
> node.js制定
特征：
* 通过module+export去对外暴露接口
* 通过require来调用其它模块

模块组织方式

