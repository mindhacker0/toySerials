import { Vector } from "../game/matrix";
let once = 0,maxU = -1;
//通过UV获取贴图像素值
export const getColorByUV = function(imageData,texture){
  const {width,height,data} = imageData;
  let [U,V] = texture.vec;
  maxU=Math.max(maxU,V);
  U = U>1?1:U<0?0:U;
  V = V>1?1:V<0?0:V;
  const x = Math.floor(U*width);
  const y = Math.floor((1-V)*height);
  const baseIndex = (y*width+x)*4;
  if(once==20000){ console.log(baseIndex);} once++;
  return new Vector([data[baseIndex],data[baseIndex+1],data[baseIndex+2]]);
}
//简单的法向量着色器
export const normal_fragment_shader = function({normal}){
  const [r,g,b] = normal.vec.map(v=> Math.round((v+1)*255/2));
  return [r,g,b,255];
}
//布林-冯着色模型
export const phong_fragment_shader = function({normal,origin,texture,texturImage}){
  normal = normal.norm();
  let color = new Vector([148,121.0,92.0]);
  if(texturImage){
    color = getColorByUV(texturImage,texture);
  }
  const ka = new Vector([0.005,0.005,0.005]);//环境光系数
  const kd = new Vector(color.vec.map(v=>v/255));//漫反射系数 兰伯特余弦定理
  const ks = new Vector([0.7937,0.7937,0.7937]);//镜面反射系数 
  const amb_light_intensity = new Vector([10,10,10]);//环境光强度
  const eye_pos = new Vector([0,0,80]);//相机位置
  const l1 = [new Vector([20,20,20]),new Vector([500,500,500])];//光照位置,强度
  const l2 = [new Vector([-20,20,0]),new Vector([500,500,500])];
  const lights = [l1,l2];
  const p = 150;//镜面反射的敏感度
  const look_nm = eye_pos.cwiseAdd(origin.numMuti(-1)).norm();//看向物体的向量
  let result = new Vector([0,0,0]);
  for(let i=0;i<lights.length;++i){
    const [pos,intens] = lights[i];
    const ray = pos.cwiseAdd(origin.numMuti(-1));
    const ray_nm = ray.norm();
    const r = ray.vlen();
    const h = look_nm.cwiseAdd(ray_nm).norm();
    result=result.cwiseAdd(ka.cwiseProduct(amb_light_intensity));//添加环境光
    result=result.cwiseAdd(kd.cwiseProduct(intens.numMuti(1/(r*r))).numMuti(Math.max(0,normal.dot(ray_nm))));//添加漫反射光
    result=result.cwiseAdd(ks.cwiseProduct(intens.numMuti(1/(r*r))).numMuti(Math.pow(Math.max(0,normal.dot(h)),p)));//添加镜面反射光
  }
  const [r,g,b] = result.vec;
  return [r*255,g*255,b*255,255];
}