浏览器原理
URL->[http]->HTML->[parse]->DOM->[css computed]->DOM with CSS->[layout]->DOM with position->[render]->bitmap
有限状态机
每一个状态都是一个机器
  在每一个机器里，我们可以计算、存储、输出。。。
  所有的这些机器接受的输入是一致的
  状态机的每一个机器本身没有状态，如果用函数表示，他应该是纯函数
每一个机器知道下一个状态
  每个机器都有确定的下一个状态 moore
  每个机器根据输入决定下一个状态 mealy
JS中的有限状态机(mealy)
//每个函数是一个状态
```javascript
function state(input)//函数参数就是输入
{
    //在函数中，可以自由地编写代码，处理每个状态的逻辑
    return next;//返回值作为下一个状态
}
//调用
while(input){
    //获取输入
    state = state(input);//把状态机的返回值作为下一个状态
}
```
使用有限状态机处理字符串
正则表达式是使用有限状态机实现的。
```javascript
function start(c){
    if(c === "a") return foundA;
    else return start;
}
function foundA(c){
    if(c === "b") return foundB;
    else return start(c);
}
function foundB(c){
    if(c === "c") return foundC;
    else return start(c);
}
function foundC(c){
    if(c === "d") return end;
    else return start(c);
}
function end(c){
   return end;
}
function match(string){
    let state = start;
    for(let c of string){
        state = state(c);
    }
    return state === end;
}
console.log(match("ababcd"));
```
七层网络模型
物理层         
数据链路层   
网络层      require("net")
传输层
会话        require("http")
表示
应用层

libnet/libpcap

