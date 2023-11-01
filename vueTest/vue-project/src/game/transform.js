import { Matrix,IdentityMatrix,Vector } from "./matrix";
// const cos = k.dotMuti(v)/(k.vlen()*v.vlen());
// const sin = Math.sqrt(1 - cos*cos);
//罗德里格旋转
//向量表示,k是旋转轴的向量(需要是单位向量)，V是被旋转的向量
export const RodriguesVector = (k,v,angle)=>{
  let rad = Math.PI*Number(angle)/180;
  let m1 = v;
  m1 = m1.numMuti(Math.cos(rad));
  let m2 = k;
  m2 = m2.numMuti(v.dotMuti(k));
  m2 = m2.numMuti(1-Math.cos(rad));
  let m3 = k;
  m3 = m3.crossMuti(v);
  m3 = m3.numMuti(Math.sin(rad));
  return m1.add(m2).add(m3);
}
//矩阵表示 4x4
export const RodriguesMatrix = (k,angle)=>{
  let rad = Math.PI*Number(angle)/180;
  let m1 = new IdentityMatrix(null,3);
  m1 = m1.numMuti(Math.cos(rad));
  let m2 = k.tensorMuti(k);
  m2 = m2.numMuti(1-Math.cos(rad));
  const [[kx],[ky],[kz]] = k.mtx;
  let m3 = new Matrix([
    [0,-kz,ky],
    [kz,0,-kx],
    [-ky,kx,0]
  ]);
  m3 = m3.numMuti(Math.sin(rad));
  return new IdentityMatrix(m1.add(m2).add(m3).mtx,4);
}
//模型变换 模型变换是指在计算机图形中，对于一个三维模型进行平移、旋转、缩放等变换操作，以便将其在三维空间中的位置、大小、方向等进行调整，
export const modelTrans =  function(k,angle,translate = [0,0,0],scale = [1,1,1]){
  const m1 = RodriguesMatrix(k,angle);
  const m2 = new Matrix([
    [scale[0],0,0,translate[0]],
    [0,scale[1],0,translate[1]],
    [0,0,scale[2],translate[2]],
    [0,0,0,1]
  ]);
  return m2.muti(m1);
}
//视口变换
export const viewTrans = function(k,angle,translate = [0,0,0]){
  const m1 = RodriguesMatrix(k,angle);
  const m2 = new Matrix([
    [1,0,0,translate[0]],
    [0,1,0,translate[1]],
    [0,0,1,translate[2]],
    [0,0,0,1]
  ]);
  return m2.muti(m1);
}
function rotateTransform(angle){//物体的旋转变换矩阵
  let anglex = Math.PI*Number(angle.x)/180;
  let angley = Math.PI*Number(angle.y)/180;
  let anglez = Math.PI*Number(angle.z)/180;
  //仿射变换
  let rotateXMtx = new Matrix([//x轴旋转矩阵
      [1,0,0,0],
      [0,Math.cos(anglex),Math.sin(anglex),0],
      [0,-Math.sin(anglex),Math.cos(anglex),0],
      [0,0,0,1]
  ]);
  let rotateYMtx = new Matrix([//y轴旋转公式
      [Math.cos(angley),0,Math.sin(angley),0],
      [0,1,0,0],
      [-Math.sin(angley),0,Math.cos(angley),0],
      [0,0,0,1]
  ]);
  let rotateZMtx = new Matrix([//z轴旋转公式
      [Math.cos(anglez),-Math.sin(anglez),0,0],
      [Math.sin(anglez),Math.cos(anglez),0,0],
      [0,0,1,0],
      [0,0,0,1]
  ]);
  let rotateMtx = rotateYMtx.muti(rotateXMtx);
  rotateMtx = rotateZMtx.muti(rotateMtx);
  return rotateMtx;
}