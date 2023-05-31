<script setup>//setup语法糖
import { ref,provide,reactive } from "vue";
import HelloWorldVue from "./components/HelloWorld.vue";
import {RouterLink,RouterView} from "vue-router";
let pid = ref("999");//简单类型双向绑定
let obj = reactive({
  name:"xiaoming",
  age:18
});//复合类型双向绑定
const changeName = ()=>{
  obj.name = "小红";
  pid.value--;//函数内部对于简单类型要用value访问
};//定义事件
console.log(pid)
provide("otherid",pid);//提供变量注入
</script>

<template>
  <div>
    <HelloWorldVue :id="pid" :info="obj"/>
    <button @click="++pid">add</button>
    <button @click="changeName">other</button>
    <div>{{obj.name}}</div>
    <div>
      <div><span>路由区域</span></div>
      <div>
       <RouterLink to="/one">第一页</RouterLink>
       <RouterLink to="/two">第二页</RouterLink>
      </div>
      <div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
