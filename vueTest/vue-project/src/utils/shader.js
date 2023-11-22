import { Vector } from "../game/matrix";

//简单的法向量着色器
export const normal_fragment_shader = function({normal}){
  const [r,g,b] = normal.vec.map(v=> Math.round((v+1)*255/2));
  return [r,g,b,255];
}
let once = 0;
//布林-冯着色模型
export const phong_fragment_shader = function({normal,origin,color = new Vector([148,121.0,92.0])}){
  normal = normal.norm();
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
    result=result.cwiseAdd(ka.cwiseProduct(amb_light_intensity));
    result=result.cwiseAdd(kd.cwiseProduct(intens.numMuti(1/(r*r))).numMuti(Math.max(0,normal.dot(ray_nm))));
    result=result.cwiseAdd(ks.cwiseProduct(intens.numMuti(1/(r*r))).numMuti(Math.pow(Math.max(0,normal.dot(h)),p)));
    if(once==0){ console.log(normal.dot(ray_nm),normal.vlen()); once++;}
  }
  // console.log(result.vec);
  const [r,g,b] = result.vec;
  return [r*255,g*255,b*255,255];
}