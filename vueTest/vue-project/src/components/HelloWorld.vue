<script setup>
import {onMounted, toRef,watch,inject,useSlots,ref} from "vue";
const props = defineProps({
  id:[String,Number],
  info:{
    type:Object,
    default:()=>{}
  }
});//props定义
const sid = toRef(props,"id");
const oid = inject("otherid");//获取注入的变量
const slots = useSlots();
console.log(props,slots);
//监听单个变量 变量可以是 
// 一个函数，返回一个值
// 一个 ref
// 一个响应式对象
// ...或是由以上类型的值组成的数组
watch(oid,(val)=>console.log('oid',val));
const cav = ref(null);
const range = ref(0);
const vector = [[3,0,-3],[3,100,-3]];
onMounted(()=>{
  console.log(cav.value);
  draw();
});
watch(()=>range.value,(val)=>{
  draw()
},{immediate:false});
function vlen(vec){
  let [x,y,z] = vec;
  return Math.sqrt(x*x+y*y+z*z);
}
function vMuti(vec,muti){
  let [x,y,z] = vec;
  return [x*muti,y*muti,z*muti];
}
function draw(){
  let ctx = cav.value.getContext('2d');
  ctx.clearRect(0, 0, 200, 200)
  ctx.beginPath();
  transVector(vector);
  console.log(vector)
  for(let i=0;i<vector.length;++i){
    let [x,y,z] = vector[i];
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }
  ctx.stroke();
  ctx.closePath();
}
function mtxMuti(arr,arr1){
  let x = arr.length,y = arr[0].length;
  let x1 = arr1.length,y1 = arr1[0].length;
  if(y!==x1) throw new Error('can`t muti');
  let result = [];
  for(let i=0;i<x;++i){
    result[i] = [];
    for(let j=0;j<y1;++j){
      let sum = 0;
      for(let k=0;k<y;++k){
        sum+=arr[i][k]*arr1[k][j];
      }
      result[i].push(sum);
    }
  }
  return result;
}
console.log(mtxMuti([[1,2]],[[2],[1]]))
function transVector(vector){
  let angle = 3.6*range.value;
  let rotateMtx = [
    [Math.cos(angle),Math.sin(angle),0,0],
    [-Math.sin(angle),Math.cos(angle),0,0],
    [0,0,1,0],
    [0,0,0,1]
  ];
  for(let i=0;i<vector.length;++i){
    let [x,y,z] = vector[i];
    let len = vlen(vector[i]);
    const [[dx],[dy],[dz]] = mtxMuti(rotateMtx,[[x/len],[y/len],[z/len],[1]])
    vector[i] = vMuti([dx,dy,dz],len);
  }
  console.log(vector);
}
</script>

<template>
  <div class="greetings">
      {{sid}}
      <canvas ref='cav' width="200" height="200"></canvas>
      <input type='range' v-model="range" />
  </div>
</template>

<style scoped>

</style>
