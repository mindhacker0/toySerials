//手写实现call函数
Function.prototype.mycall = function(obj,...args){
    if (typeof this !== 'function') {
        return;
    }
    obj.fn = this;
    obj.fn(...args);
    delete obj.fn;
}
//手写实现apply函数
Function.prototype.myapply = function(obj,args){
    if (typeof this !== 'function') {
        return;
    }
    obj.fn = this;
    obj.fn(...args);
    delete obj.fn;
}
//手写实现bind函数
Function.prototype.mybind = function(obj,...args){
    if (typeof this !== 'function') {
        return;
    }
    let self = this;
    function f(...param){
        obj.fn = self;
        obj.fn(...args,...param);
        delete obj.fn;
    }
    return f;
}
// Function.prototype.mybind = function(thisArg) {
//     if (typeof this !== 'function') {throwTypeError("Bind must be called on a function");    }// 拿到参数，为了传给调用者
//     const args = Array.prototype.slice.call(arguments, 1),// 保存 this      
//     self = this,// 构建一个干净的函数，用于保存原函数的原型      
//     nop = function() {},// 绑定的函数      
//     bound = function() {// this instanceof nop, 判断是否使用 new 来调用 bound// 如果是 new 来调用的话，this的指向就是其实例，// 如果不是 new 调用的话，就改变 this 指向到指定的对象 o
//         return self.apply(this instanceof nop ? this : thisArg,
//             args.concat(Array.prototype.slice.call(arguments)));     
//     };// 箭头函数没有 prototype，箭头函数this永远指向它所在的作用域
//     if (this.prototype) {      nop.prototype = this.prototype;    }// 修改绑定函数的原型指向    
//          bound.prototype = new nop();return bound;  
// }
let s = 18;
let n = {s:16};
let fn = function(w,y){
    console.log(this.s,w,y);
}
// fn.mycall(n,99,88);
// fn.myapply(n,[99,88]);
let nfn = fn.mybind(n,99);
console.log(n);
nfn(88);
