//获取点在三角形内部重心坐标
export const computeBarycentric2D = (vertex1,vertex2,vertex3,point)=>{
    const [x,y] = point;
    const [ax,ay] = vertex1;
    const [bx,by] = vertex2;
    const [cx,cy] = vertex3;
    const gamma = ((ay-by)*x+(bx-ax)*y+ax*by-bx*ay)/((ay-by)*cx+(bx-ax)*cy+ax*by-bx*ay);
    const beta = ((ay-cy)*x+(cx-ax)*y+ax*cy-cx*ay)/((ay-cy)*bx+(cx-ax)*by+ax*cy-cx*ay);
    const alpha = 1 - beta - gamma;
    return [alpha,beta,gamma];
}
//透视矫正插值
//https://zhuanlan.zhihu.com/p/448575965
export const correctInterpolateZ = (vec1,vec2,vec3,point)=>{
    const [x,y] = point;
    const [ax,ay,az] = vec1.mtx;
    const [bx,by,bz] = vec2.mtx;
    const [cx,cy,cz] = vec3.mtx;
    const [alpha,beta,gamma] = computeBarycentric2D([ax,ay],[bx,by],[cx,cy],[x,y]);
    const z = 1/(alpha/az + beta/bz + gamma/cz);//点深度插值
    const interpolateFn = function(av,bv,cv){//属性插值
        return z*(alpha*av/az+beta*bv/bz+gamma*cv/cz);
    };
    return {z,interpolateFn,coordinate:[alpha,beta,gamma]};
}