import { Matrix,IdentityMatrix,Vector } from "./matrix";
//罗德里格旋转向量表示,k是旋转轴的向量(需要是单位向量)，V是被旋转的向量
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
//罗德里格旋转矩阵表示 4x4
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
//视口变换 放置相机
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
//定义相机
class Camera{
  constructor(pos,look,up){//位置 看的点 上方的点
    const [px,py,pz] = pos;
    const [lx,ly,lz] = look;
    const [ux,uy,uz] = up;
    this.pos = new Vector([[px],[py],[pz],[1]]);
    this.lookAt = new Vector([[lx-px],[ly-py],[lz-pz]]).toIdentityVec().vec;//向前的向量
    this.up = new Vector([[ux-px],[uy-py],[uz-pz]]).toIdentityVec().vec;//向上的向量
  }
  getViewTrans(){//获取视图变换的矩阵 把世界坐标表示的点转为相机坐标表示的点
    const [[px],[py],[pz]] = this.pos.mtx;
    const [[lx],[ly],[lz]] = this.lookAt.mtx;
    const [[ux],[uy],[uz]] = this.up.mtx;
    const Vx = this.lookAt.crossMuti(this.up);//叉乘得到垂直的向量,即对应的X轴的向量，在lookAt为法向量的平面
    const [[vx],[vy],[vz]] = Vx.mtx;
    const m1 = new Matrix([
      [1,0,0,-px],
      [0,1,0,-py],
      [0,0,1,-pz],
      [0,0,0,1]
    ]);
    const m2 = new Matrix([
      [vx,ux,-lx,0],
      [vy,uy,-ly,0],
      [vz,uz,-lz,0],
      [0,0,0,1]
    ]).inverse();//逆矩阵
    return m2.muti(m1);
  }
  //正交投影 从视口矩形变为规范矩形 
  getOrthographicTrans(Vw,Vh,zNear,zFar){
    const m1 = new Matrix([
      [1,0,0,0],
      [0,1,0,0],
      [0,0,1,(zNear+zFar)/2],
      [0,0,0,1]
    ]);
    const m2 = new Matrix([
      [2/Vw,0,0,0],
      [0,2/Vh,0,0],
      [0,0,2/(zNear-zFar),0],
      [0,0,0,1]
    ]);
    const m3 = m2.muti(m1);
    // console.log(m3.muti(new Vector([[640],[360],[-400],[1]])));
    return m3;
  }
  //透视投影
  getPerspectiveTrans(eye_fov,aspectRatio,zNear,zFar){
    
  }
}
const ca = new Camera([100,100,100],[0,0,0],[0,300,0]);
ca.getOrthographicTrans(1280,720,0,400);
console.log();
export {
  Camera
}
// const perspectMtx= new Matrix([
//     [n/f,0,0,0],
//     [0,n/f,0,0],
//     [0,0,(n+f)/f,-n],
//     [0,0,0,1]
// ]);