<script setup>
import {onMounted, toRef,watch,inject} from "vue";
const props = defineProps({
  id:[String,Number],
  info:{
    type:Object,
    default:()=>{}
  }
});//props定义
const sid = toRef(props,"id");
const oid = inject("otherid");//获取注入的变量
console.log(props);
//监听单个变量 变量可以是 
// 一个函数，返回一个值
// 一个 ref
// 一个响应式对象
// ...或是由以上类型的值组成的数组
watch(oid,(val)=>console.log('oid',val));
watch(()=>props.info,(val)=>console.log('name',val),{immediate:true,deep:true});
</script>

<template>
  <div class="greetings">
      {{sid}}
  </div>
</template>

<style scoped>

</style>
