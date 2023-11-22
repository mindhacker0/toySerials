import { Vector } from "./matrix";

//获取点在三角形内部重心坐标
export const computeBarycentric2D = (vertex1,vertex2,vertex3,point)=>{
    const [x,y] = point;
    const [ax,ay] = vertex1;
    const [bx,by] = vertex2;
    const [cx,cy] = vertex3;
    const alpha = (x*(by - cy) + (cx - bx)*y + bx*cy - cx*by) / (ax*(by - cy) + (cx - bx)*ay + bx*cy - cx*by);
    const beta = (x*(cy - ay) + (ax - cx)*y + cx*ay - ax*cy) / (bx*(cy - ay) + (ax - cx)*by + cx*ay - ax*cy);
    const gamma = (x*(ay - by) + (bx - ax)*y + ax*by - bx*ay) / (cx*(ay - by) + (bx - ax)*cy + ax*by - bx*ay);
    return [alpha,beta,gamma];
}
//透视矫正插值
//https://zhuanlan.zhihu.com/p/448575965
export const correctInterpolateZ = (vec1,vec2,vec3,point)=>{
    const [x,y] = point;
    const [ax,ay,az] = vec1.vec;
    const [bx,by,bz] = vec2.vec;
    const [cx,cy,cz] = vec3.vec;
    const [alpha,beta,gamma] = computeBarycentric2D([ax,ay],[bx,by],[cx,cy],[x,y]);
    const z = 1/(alpha/az + beta/bz + gamma/cz);//点深度插值
    const interpolateFn = function(av,bv,cv){//属性插值
        return z*(alpha*av/az+beta*bv/bz+gamma*cv/cz);
    };
    const interpolateVec = function(avec,bvec,cvec){//向量插值
        const iva = avec.numMuti(z*alpha/az);
        const ivb = bvec.numMuti(z*beta/bz);
        const ivc = cvec.numMuti(z*gamma/cz);
        return iva.cwiseAdd(ivb).cwiseAdd(ivc);
    }
    return {z,interpolateFn,interpolateVec,coordinate:[alpha,beta,gamma]};
}
export const insideTriangle = (vec1,vec2,vec3,point)=>{
    const [x,y] = point;
    const [ax,ay,az] = vec1.vec;
    const [bx,by,bz] = vec2.vec;
    const [cx,cy,cz] = vec3.vec;
    const p = new Vector([x,y,1]);
    const A = new Vector([ax,ay,1]);
    const B = new Vector([bx,by,1]);
    const C = new Vector([cx,cy,1]);
    const f0 = B.cross(A);
    const f1 = C.cross(B);
    const f2 = A.cross(C);
    return p.dot(f0)*f0.dot(C)>0 && p.dot(f1)*f1.dot(A)>0 && p.dot(f2)*f2.dot(B)>0;
}