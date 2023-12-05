import {correctInterpolateZ,insideTriangle} from '@/game/math';
import { normal_fragment_shader,phong_fragment_shader,getColorByUV } from '@/utils/shader';
export const rasterize_triangle = function(trangle,context){//三角形光栅化渲染
    const {vertex,normal,texture,origin} = trangle;//多边形
    const {deepBuff,frameBuff,texturImage,viewPort} = context;//上下文
    let boundX = [Infinity,-Infinity];
    let boundY = [Infinity,-Infinity];
    for(let i=0;i<vertex.length;++i){//计算包围盒的范围
        const [x,y] = vertex[i].vec;
        boundX[0] = Math.min(boundX[0],Math.floor(x));
        boundX[1] = Math.max(boundX[1],Math.ceil(x));
        boundY[0] = Math.min(boundY[0],Math.floor(y));
        boundY[1] = Math.max(boundY[1],Math.ceil(y));
    }
    //console.log(vertex,normal,texture,boundX,boundY);
    for(let i=boundY[0];i<=boundY[1];++i){
        for(let j=boundX[0];j<=boundX[1];++j){//遍历包围盒每一个像素点
            if(insideTriangle(vertex[0],vertex[1],vertex[2],[j,i])){//点是否在三角形内
                const {z,interpolateFn,interpolateVec,coordinate} = correctInterpolateZ(vertex[0],vertex[1],vertex[2],[j+0.5,i+0.5]);//计算点在三角形内的插值
                const baseIndex = Math.floor(i*viewPort.w+j);
                const normal_intp = interpolateVec(normal[0],normal[1],normal[2]);
                const origin_intp = interpolateVec(origin[0],origin[1],origin[2]);
                const texture_intp = interpolateVec(texture[0],texture[1],texture[2]);//贴图坐标插值
                if(deepBuff[baseIndex]<z){
                    deepBuff[baseIndex] = z;
                    const color = phong_fragment_shader({
                        normal:normal_intp,
                        origin:origin_intp,//透视前相机坐标系中，三角形的插值
                        texture:texture_intp,
                        texturImage
                    });                
                    for(let k =0;k<4;++k){//r g b a
                        frameBuff.data[baseIndex*4+k] = color[k];//  interpolateFn(colors[0][k],colors[1][k],colors[2][k]);
                    }
                    //console.log(i*viewPort.w+j)
                }
            }    
        }
    }
}
export const meshTriRaster = function(trangle,context){//三角形网格渲染
    const {vertex,normal,texture,origin} = trangle;//多边形
    const {deepBuff,frameBuff,texturImage,viewPort} = context;//上下文
    let boundX = [Infinity,-Infinity];
    let boundY = [Infinity,-Infinity];
    const color = [0,255,0,255];//网格颜色
    const bgColor = [0,0,0,255];//背景色
    const subDir = [[0,0],[0,1],[1,0],[1,1]];
    for(let i=0;i<vertex.length;++i){//计算包围盒的范围
        const [x,y] = vertex[i].vec;
        boundX[0] = Math.min(boundX[0],Math.floor(x));
        boundX[1] = Math.max(boundX[1],Math.ceil(x));
        boundY[0] = Math.min(boundY[0],Math.floor(y));
        boundY[1] = Math.max(boundY[1],Math.ceil(y));
    }
    for(let i=boundY[0];i<=boundY[1];++i){
        for(let j=boundX[0];j<=boundX[1];++j){//遍历包围盒每一个像素点
            let inside = 0;
            for(let k=0;k<subDir.length;++k){
                const dx = j+subDir[k][0];
                const dy = i+subDir[k][1];
                if(insideTriangle(vertex[0],vertex[1],vertex[2],[dx,dy])) inside++;
            }
            if(inside!==0){//点在三角形内
                const {z,interpolateFn,interpolateVec,coordinate} = correctInterpolateZ(vertex[0],vertex[1],vertex[2],[j+0.5,i+0.5]);//计算点在三角形内的插值
                const baseIndex = Math.floor(i*viewPort.w+j);
                if(deepBuff[baseIndex]<z){
                    deepBuff[baseIndex] = z;             
                    for(let k =0;k<4;++k){//r g b a
                        frameBuff.data[baseIndex*4+k] = inside===4?bgColor[k]:color[k];
                    }
                }
            }    
        }
    }
}