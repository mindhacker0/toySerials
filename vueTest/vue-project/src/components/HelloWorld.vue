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
const vector = [[10,10,-100],[10,100,-100]];
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
// 画布坐标系
// 相机坐标 z轴朝外，y向上，x向右
// 画布坐标系，z轴向里，y向下,x向右
const coordinate = [// 所得坐标系转换矩阵
[ 1, 0, 0,0],
[ 0,-1, 0,200],
[ 0, 0,-1,0],
[ 0, 0, 0,1]
];
function draw(){//绘制前要转化为画布的坐标
  let ctx = cav.value.getContext('2d');
  ctx.clearRect(0, 0, 200, 200)
  ctx.beginPath();
  let transVect =  transVector(vector);
  for(let i=0;i<transVect.length;++i){
    let [x,y,z] = transVect[i];
    let [[dx],[dy],[dz]] = mtxMuti(coordinate,[[x],[y],[z],[1]]);
    if(i===0) ctx.moveTo(dx,dy);
    else ctx.lineTo(dx,dy);
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
function transVector(vector){
  let angle = -2*Math.PI*Number(range.value)/400;//反方向旋转
  let rotateXMtx = [//x轴旋转矩阵
    [1,0,0,0],
    [0,Math.cos(angle),Math.sin(angle),0],
    [0,-Math.sin(angle),Math.cos(angle),0],
    [0,0,0,1]
  ];
  let rotateYMtx = [//y轴旋转公式
    [Math.cos(angle),0,Math.sin(angle),0],
    [0,1,0,0],
    [-Math.sin(angle),0,Math.cos(angle),0],
    [0,0,0,1]
  ];
  let rotateZMtx = [//z轴旋转公式
    [Math.cos(angle),-Math.sin(angle),0,0],
    [Math.sin(angle),Math.cos(angle),0,0],
    [0,0,1,0],
    [0,0,0,1]
  ];
  let result = [];
  for(let i=0;i<vector.length;++i){
    let [x,y,z] = vector[i];
    let len = vlen(vector[i]);
    const [[dx],[dy],[dz]] = mtxMuti(rotateXMtx,[[len==0?0:x/len],[len==0?0:y/len],[len==0?0:z/len],[1]])
    result[i] = vMuti([dx,dy,dz],len);
  }
  console.log(result);
  return result;
}
</script>

<template>
  <div class="greetings">
      {{sid}}
      <canvas ref='cav' width="200" height="200" style="border: 1px solid #888;"></canvas>
      <input type='range' v-model="range" />
  </div>
</template>

<style scoped>

</style>
