import {ref,onMounted,reactive} from 'vue';
import {Matrix,Vector} from '@/game/matrix'; 
import {correctInterpolateZ,insideTriangle} from '@/game/math';
import {modelTrans,Camera} from './transform';
import {loadObject} from '@/utils/objLoader';
import { normal_fragment_shader,phong_fragment_shader } from '@/utils/shader';
export const useRaster = ()=>{
    const viewRef = ref(null);
    let context = null;
    const viewPort = reactive({w:1280,h:720});//屏幕大小
    const frameBuff = new ImageData(viewPort.w,viewPort.h);//帧缓存
    const deepBuff = new Array(viewPort.w*viewPort.h);//深度缓冲区
    let model;
    const cam = ref(null);
    cam.value = new Camera([0,360,-300],[0,360,0],[0,720,-300]);
    const drawCoordinate = new Matrix([//相机坐标系(相机坐标系为屏幕中心点)到canvas坐标系
       [1,0,0,viewPort.w/2],
       [0,-1,0,viewPort.h/2],
       [0,0,-1,0],
       [0,0,0,1]
    ]);
    // canonical cube到屏幕坐标
    const matrix_vp = new Matrix([
        [viewPort.w/2,0,0,0],
        [0,viewPort.h/2,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ]);
    let once = 0;
    function rasterize_triangle(trangle,frameBuff){//三角形处理
        const {vertex,normal,texture,origin} = trangle;
        let boundX = [Infinity,-Infinity];
        let boundY = [Infinity,-Infinity];
        for(let i=0;i<vertex.length;++i){
            const [x,y] = vertex[i].vec;
            boundX[0] = Math.min(boundX[0],Math.floor(x));
            boundX[1] = Math.max(boundX[1],Math.ceil(x));
            boundY[0] = Math.min(boundY[0],Math.floor(y));
            boundY[1] = Math.max(boundY[1],Math.ceil(y));
        }
        //console.log(vertex,normal,texture,boundX,boundY);
        for(let i=boundY[0];i<=boundY[1];++i){
            for(let j=boundX[0];j<=boundX[1];++j){//每一个像素点
                if(insideTriangle(vertex[0],vertex[1],vertex[2],[j,i])){//点在三角形内
                    const {z,interpolateFn,interpolateVec,coordinate} = correctInterpolateZ(vertex[0],vertex[1],vertex[2],[j+0.5,i+0.5]);
                    const baseIndex = Math.floor(i*viewPort.w+j);
                    const normal_intp = interpolateVec(normal[0],normal[1],normal[2]);
                    const origin_intp = interpolateVec(origin[0],origin[1],origin[2]);
                    const texture_intp = interpolateVec(texture[0],texture[1],texture[2]);
                    if(deepBuff[baseIndex]<z){
                        deepBuff[baseIndex] = z;
                        const color = phong_fragment_shader({
                            normal:normal_intp,
                            origin:origin_intp,//透视前相机坐标系中，三角形的插值
                            texture:texture_intp
                        });
                        if(once == 0) {
                            console.log( '插值后',normal_intp,origin_intp,texture);
                            once =1;
                        }                
                        for(let k =0;k<4;++k){//r g b a
                            frameBuff.data[baseIndex*4+k] = color[k];//  interpolateFn(colors[0][k],colors[1][k],colors[2][k]);
                        }
                        //console.log(i*viewPort.w+j)
                    }
                }    
            }
        }
    }
    function render(){//渲染
        for(let i=0;i<frameBuff.data.length;++i){//初始化帧缓冲区，和深度缓冲区
            frameBuff.data[i] = 0;
            deepBuff[i] = -Infinity;
        }
        //视图变换
        const model_mtx = modelTrans(new Vector([0,1,0]),140,[0,0,0],[2.5,2.5,2.5]);
        const camera_mtx = new Matrix([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,-10],
            [0,0,0,1]
        ]);
        // cam.value.getViewTrans();
        const perspective = cam.value.getPerspectiveTransV2(45.0, viewPort.w/viewPort.h, 0.1, 50);
        const m3 = matrix_vp.muti(perspective).muti(camera_mtx).muti(model_mtx);
        const m4 = drawCoordinate.muti(m3);
        const originTrans = camera_mtx.muti(model_mtx);
        const transVerse = camera_mtx.muti(model_mtx).inverse().reverse();
        function vertexTrans(pos){//顶点坐标变换
            let [x,y,z] = pos.vector.vec;
            let [[tx],[ty],[tz],[tw]] = m4.muti(new Matrix([[x],[y],[z],[1]])).mtx;
            return new Vector([tx/tw,ty/tw,tz/tw]);
        }
        function viewTrans(pos){//顶点坐标变换
            let [x,y,z] = pos.vector.vec;
            let [[tx],[ty],[tz],[tw]] = originTrans.muti(new Matrix([[x],[y],[z],[1]])).mtx;
            return new Vector([tx,ty,tz]);
        }
        function normalTrans(pos){//顶点坐标变换
            let [x,y,z] = pos.vector.vec;
            let [[tx],[ty],[tz],[tw]] = transVerse.muti(new Matrix([[x],[y],[z],[0]])).mtx;
            return new Vector([tx,ty,tz]);
        }
        for(let i=0;i<model.length;++i){//遍历多边形（三角形）
            let {vertex,normal,texture} = model[i];
            rasterize_triangle({
                vertex:vertex.map(vertexTrans),
                normal:normal.map(normalTrans),
                texture:texture.map(v=>v.vector),
                origin:vertex.map(viewTrans)
            },frameBuff);
        }
        console.log(frameBuff);
        context.putImageData(frameBuff,0,0);//放置图像缓冲
    }
    function initScreen(){//画布初始化
        context = viewRef.value.getContext('2d');
    }
    onMounted(async ()=>{
        initScreen();
        const result = await loadObject('src/models/spot/spot_triangulated_good.obj');
        model = result.face;
        render();
    });
    return {
        viewRef
    }
}