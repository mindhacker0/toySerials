## Typescript 详解
### 一、TS基础概念
#### 1.什么是TS
a.对比原理
* 他是JavaScript的一个超集，在原有基础上，添加了可选静态类型和基于类的 面向对象编程方式

TS的使用场景
> 面向项目：
TS - 面向解决大型复杂项目，繁杂架构以及代码维护的场景
JS - 脚本化语言，用于面向简单页面场景

> 自主检测：
TS - 编译期间，主动发现并指出错误
JS - 无编译阶段

> 类型检测：
TS - 强类型
JS - 弱类型

> 运行流程：
TS - 依赖编译，依靠编译打包后，翻译成JS
JS - 可直接运行于浏览器中

> 复杂特性：
TS - 模块化、泛型、接口

b. 安装运行
```js
npm install -g typescript
tsc -v
tsc test.ts
//面试点: ts相较于js优势，功能 =>上面四个点
//ts是如何实现这些功能的 => 多了编译时 => ts官方编译器/babel
```
#### 2.TS基础类型与写法
* boolean、string、number、array、Null、undefined
```js
//es 
let isEnable = true;
let class = 'zhaowa';
let classNum = 2;
let u = undefined;
let n = null;
let classArr = ['basic','excute'];

//ts
let isEnable: boolean = true;
let class: string = 'zhaowa';
let classNum: number = 2;
let u: undefined = undefined;
let n: null = null;
//单纯型数组
let classArr: string[] = ['basic','excute'];
let classArr: Array<string> = ['basic','excute'];//泛型
```
* tuple - 元组
```js
let tupleType: [string,boolean];
tupleType = ['zhaowa',true];//%type 复合型数组
```
* enum - 枚举
```js
    //数字类枚举 - 面试点: 1.默认从0开始 2. 依次递增
    enum Score{
        BAD,
        NG,
        GOOD,
        PERFECT
    }
    let sco: Score = Score.BAD;
    //字符串类型枚举 - 有值取值
    enum Score{
        BAD = "BAD",
        NG = "NG",
        GOOD = "GOOD",
        PERFECT = "PERFECT"
    }
    //反向映射 - 正反向双重mapping
    enum Score{
        BAD,
        NG,
        GOOD=4,
        PERFECT
    }
    //异构类型
    enum ENUM{
        A,
        B,
        C="C",
        D="D",
        E=6,
        F,
    }
    //面试题：指出以上异构类型中每种枚举值的具体值
    let Enum;
    (function(Enum){
        //正向
        Enum["A"] = 0;
        Enum["B"] = 1;
        Enum["C"] = "C";
        Enum["D"] = "D";
        Enum["E"] = 6;
        Enum["F"] = 7;
        //逆向
        Eunm[0] = "A";
        Eunm[1] = "B";
        Enum[6] = "E";
        Enum[7] = "F";
    }(Enum||(Enum={})));
```
* any、unknown、void - 拎出来问区别
```js
//any - 绕过所有类型检查 => 类型检测和编译筛查功能全部取消
let anyValue: any = 123;
anyValue = "123";
let value1: boolean = anyValue;//OK

//unknown - 绕过了赋值检查
let unknownValue: unknown;
unknownValue = true;
unknownValue = 123;
unknownValue = "123";
//面试官喜欢问的点
let value1: unknown = unknownValue;//ok
let value2: any = unknownValue;//ok
let value3: boolean = unknownValue;//禁止被传递

//3.void(与any反过来)
function voidFunction(): void {
    //no return
}

//4. never - 永不回头 or 永远error
function error(msg: string): never {
    throw new Error(msg)
}
function longlongLoop(): never {
    while(true){}
}
```
* Object / ObjectConstructor / {}  - 对象
```js
//Object - Object.prototype 上属性
interface Object{
    constructor: Function;
    toString(): String;
    vaueOf(): Object;
} // %接口interface
//ObjectConstructor - 定义了Object本身的属性
interface ObjectConstructor{
    readonly prototype: Object;
    getPrototypeof(o: object): Object;
}
//栗子
interface ObjectConstructor{
    create(o:object|null): any;
}
Object.create(proto);
Object.create(null);
Object.create(undefined);//NOK
//{} - 定义空属性
let obj = {};
obj.prop = "zhaowa";//NOK
obj.toString();//OK
```

### 二、接口 - interface
* 对行为的抽象，具体行为由类实现
```js
//对行为的抽象
interface Class{
    name:string;
    time:number;
    getArr:function(k:number);
}
//具体行为的对象
let zhaowa: Class = {
    name:'typeScript',
    time:2,
}
//只读 & 任意
interface Class{
    readonly name: string;
    time: number;
}
//面试题 - 和es的对比<=> const
let arr: number[] = [1,2,3,4,5,6];
let ro: ReadonlyArray<number> = arr;
ro[0] = 12;//NOK
ro.push(5);//NOK
ro.length = 100;//NOK
arr = ro; //NOK

//任意可添加属性 - 可外部拓展对象
interface Class{
    readonly name: string;
    time: number;
    [propName: string]: any;
}
const c1 = {name:"js"};
const c2 = {name:"js",time:2};
const c3 = {name:"js",level:1};
```
### 三、交叉类型 - type &
```js
//合并
interface A {x: D}
interface B {x: E}
interface C {x: F}

interface D {d: boolean}
interface F {e: string}
interface F {f: number}

type ABC = A & B & C;
let abc: ABC = {
    x:{d:false,e:"class",f:5}
};
//面试点： 合并冲突
interface A{
    c:string;
    d:string;
}
interface B{
    c:number;
    e:boolean;
}
type AB = A & B;
let ab:AB = {
    //c:... 报错never无论什么都是错误
    d:"class",
    e:false,
}
//合并操作的关系是 且 => never
```

#### 四.断言 - 类型声明/转换（和编译器的告知交流）
* 编译时作用
```ts
//尖括号的形式声明 - 阶段性声明
let anyValue: any = 'zhaowa';
let anyLength: number = (<string>anyValue).length;

//as声明
let anyValue: any = 'zhaowa';
let anyLength: number = (anyValue as string).length;
//非空判断 - 只确定不是空
type ClassTime = ()=> number;
const start = (classTime: classTime|undefined) =>{
    let num = classTime!();//非空保证2.具体类型待定
}
```

### 五、类型守卫 - 保障在语法规定范围内，额外的类型确认 / 细分逻辑
* 多态 - 多种状态(多种类型)
```ts
interface Teacher{
    name:String;
    courses:string[];
}
interface Student{
    name:String;
    startTime:Date;
}
type Class = Teacher | Student;
function startCourse(cls:Class){
    if("courses" in cls){
        //Teacher
    }
    if("startTime" in cls){
        //Student
    }
}

//自定义类型
const isTeacher = function(cls:Teacher | Student):cls is Teacher {return "Teacher};
const getName = (cls:Teacher|Student){
    if(isTeacher(cls)){
        return cls.courses;
    }
}
```
### 六、TS进阶
#### 1.函数重载
```ts
class Class{
    start(name:number,score:number):number;
    start(name:Combinable,score:Combinable){
        if(type name === "string" || score === "string"){
            return "student";
        }
    };
}
```
#### 2.泛型 - 重用
* 让模块支持多种类型的数据 - 让类型和值一样，可以被赋值、变量、传递
```ts
//空栗子
function startClass<T,U>(name:T,score:U):T{
    return name + score;
}
//1.传参类型多态
function startClass<T,U>(name:T,score:U):String{
    return `${name} + ${score}`;
}
//2.传参类型多态 + 过程中断言

```
#### 3.装饰器 - decorator
```ts
{
    "experimentalDecorator":true
}
//类装饰器
function Zhaowa(target:Function):void{
    target.prototype.startClass = function():void{
        //...
    }
}
@Zhaowa
class Class{
    constructor(){}
}
function nameWrapper(target)
```

## 一、项目需要使用typescript

### 1.引入和使用

#### webpack打包配置
=> vue-cli - vue init / create ${myproject} ${template} / => 配置webpack
a. entry - 入口 main.ts
b. extensions加上.ts文件area - 用于处理尝试的数据尾缀列表
c. loaders - ts-loader 增加对于ts的处理
=> 工程化的处理
=> webpack编译时

#### TS配置
tsconfig.json

### 2.vue / vuex + typescript
```ts
<template>
    <div>
        <vueComponent />
    </div>
</template>
<script lang="ts">
//组件定义
//1.定义组件的方式： 形式上 - extends
const Component = {
    vueComponent //TS无法断定内部为vue组件，需要我们去做额外申明处理 - Vue
    //prototype.xxx
}
import Vue from 'vue';
const Component = Vue.extend({//Vue.extend Vue.component
   //组件+类型判断
})
//2.官方vue-class-component - 全面拥抱面向对象
import Component from "vue-class-component"
@Component({
    template:"<vueComponent />"
})
export default class myComponent extends Vue{
    message:string = "hello zhaowa"
    onClick():void {
        //点击事件
    }
}
//3.申明 - 利用ts的额外补充模块declare => 实现独立模块的申明，使之可以被独立引用
declare module '*.vue' {
    import Vue from 'vue'
    export default Vue;
}
//补充模块 - .d.ts模块申明描述
declare module '/typings/vuePlugins.d.ts' {
    interface Vue{
        myProps:string
    }
}
//实例中使用
let vm = new Vue();
console.log(vm.myProps);
//4.props - 提供propType原地申明复合变量
import {proptype} from 'vue';
interface customPayload{
    str:string,
    number:number,
    name:string,
}
const Component = Vue.extend({
    props:{
        name:String,
        success:{type:String},
        payload:{
            type: Object as proptype<customPayload>
        }
    }
})
//5. computed 以及method中包含this且有return的方法 - 需要申明返回类型
computed:{
    getMsg(): string {
        return this.click()+"!"
    }
}
methods:{
    click(): string {
        return this.message + 'zhaowa';
    }
}
//6. vuex接入ts - 申明使用
//vuex.d.ts 声明模块 - ComponentCustomProperties
import {ComponentCustomProperties} from "vue"
declare module '@vue/runtime-core'{
    interface State {
        count:number
    }
    interface ComponentCustomProperties {
        $store:Store<state>
    }
}
//7.api形式编码 - 官方推荐
//store.ts
import {InjectionKey} from "vue"
import {createStore,Store} from "vuex"
export interface State{
    count:number
}
export const key:InjectionKey<Store<State>> = Symbol()
export const store = createStore<State>({
    state: {
        count: 0
    }
})
//main.ts
import {createApp} from "vue"
import {store,key} from "./store"
const app = createApp({});
//利用provide & inject
app.use(store,key);// =传入了injection key => vue.use 使用plugin
app.module("#app")
</script>
```