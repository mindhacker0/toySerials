<script setup>
import {ref,watch,onMounted} from 'vue'
const cav = ref(null);
const rangex = ref(0);
const rangey = ref(0);
const rangez = ref(0);
const vector = [[10,10,-100],[10,100,-60],[100,10,-20],[10,10,-100]];
onMounted(()=>{
  draw();
});
watch(()=>[rangex.value,rangey.value,rangez.value],(val)=>{
  draw()
},{immediate:false});
function vlen(vec){//向量的长度
  let ans = 0;
  for(let i=0;i<vec.length;++i) ans+=vec[i]*vec[i];
  return Math.sqrt(ans);
}
function toIdentityVec(vec){//转为单位向量
    let len = vlen(vec),ans = [];
    for(let i=0;i<vec.length;++i){
        ans.push(len===0?0:(vec[i]/len));
    } 
    ans.push(len);
    return ans;
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
  let rate = 4;//旋转0-90*
  //反方向旋转
  let anglex = -2*Math.PI*Number(rangex.value)/(rate*100);
  let angley = -2*Math.PI*Number(rangey.value)/(rate*100);
  let anglez = -2*Math.PI*Number(rangez.value)/(rate*100);
  let rotateXMtx = [//x轴旋转矩阵
    [1,0,0,0],
    [0,Math.cos(anglex),Math.sin(anglex),0],
    [0,-Math.sin(anglex),Math.cos(anglex),0],
    [0,0,0,1]
  ];
  let rotateYMtx = [//y轴旋转公式
    [Math.cos(angley),0,Math.sin(angley),0],
    [0,1,0,0],
    [-Math.sin(angley),0,Math.cos(angley),0],
    [0,0,0,1]
  ];
  let rotateZMtx = [//z轴旋转公式
    [Math.cos(anglez),-Math.sin(anglez),0,0],
    [Math.sin(anglez),Math.cos(anglez),0,0],
    [0,0,1,0],
    [0,0,0,1]
  ];
  let result = [];
  for(let i=0;i<vector.length;++i){
    const [x,y,z,len] = toIdentityVec(vector[i]);
    console.log([x,y,z,len])
    let colVec = [[x],[y],[z],[1]];
    colVec = mtxMuti(rotateXMtx,colVec);
    colVec = mtxMuti(rotateYMtx,colVec);
    colVec = mtxMuti(rotateZMtx,colVec);
    const [[dx],[dy],[dz]] = colVec;
    result[i] = vMuti([dx,dy,dz],len);
  }
  console.log(result);
  return result;
}
</script>
<template>
    <div>
        <div>
            <canvas ref='cav' width="200" height="200" style="border: 1px solid #888;"></canvas>
        </div>
        <div>
            <div>
                <span>rotateX</span>
                <input type='range' v-model="rangex" />
            </div>
            <div>
                <span>rotateY</span>
                <input type='range' v-model="rangey" />
            </div>
            <div>
                <span>rotateZ</span>
                <input type='range' v-model="rangez" />
            </div>
        </div>
    </div>
</template>