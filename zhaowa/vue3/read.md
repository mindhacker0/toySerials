#vue3新特性&源码解析（1/3）

###对比vue2学习vue3的基本使用和关键的技术点，并且能够使用vue3完成组件开发：

## 大纲
vue2 vue3响应式原理对比
vue3新特性

## vue2 vue3响应式原理对比

vue2 object.defineProperty Vue.$set
vue3 proxy reflect
```js
const initData = {value:1};
const data = {};
Object.keys(initData).forEach(key=>{
    Object.defineProperty(data,key,{
        get(){
            console.log("访问了",key)
        },
        set(v){
            console.log("修改了",key);
            initData[key] = v;
        }
    })
})
data.value = 2;
console.log(initData);
```

