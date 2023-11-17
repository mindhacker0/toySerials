import {ref,onMounted,reactive} from 'vue';
import {Matrix,Vector} from '@/game/matrix'; 
import {correctInterpolateZ} from '@/game/math';
import {Camera} from './transform';
import {loadObject} from '@/utils/objLoader';
export const useRaster = ()=>{
    const viewRef = ref(null);
    let context = null;
    const viewPort = reactive({w:1280,h:720});//
    const frameBuff = new ImageData(viewPort.w,viewPort.h);//帧缓存
    const deepBuff = new Array(viewPort.w*viewPort.h);//深度缓冲区
    const pos = [// 顶点位置
        [300, 0, -200],
        [0, 300, -200],
        [-300, 0, -200],
        [100, 0, -201],
        [0, 100, -201],
        [-100, 0, -201],
    ];
    const color = [ // 顶点颜色
        [255,0,0,255],
        [255,0,0,255],
        [255,0,0,255],
        [0,255,0,255],
        [0,255,0,255],
        [0,255,0,255],
    ];
    const order = [//光栅三角型渲染顺序
        [0,1,2],
        [3,4,5],
    ];
    const cam = ref(null);
    cam.value = new Camera([0,360,300],[0,360,0],[0,720,300]);
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
    function rasterize_triangle(vertexs,colors,frameBuff){//三角形处理
        let boundX = [Infinity,-Infinity];
        let boundY = [Infinity,-Infinity];
        for(let i=0;i<vertexs.length;++i){
            const [x,y] = vertexs[i].mtx;
            boundX[0] = Math.min(boundX[0],Math.floor(x));
            boundX[1] = Math.max(boundX[1],Math.ceil(x));
            boundY[0] = Math.min(boundY[0],Math.floor(y));
            boundY[1] = Math.max(boundY[1],Math.ceil(y));
        }
        console.log(vertexs,boundX,boundY);
        for(let i=boundY[0];i<=boundY[1];++i){
            for(let j=boundX[0];j<=boundX[1];++j){//每一个像素点
                const {z,interpolateFn,coordinate} = correctInterpolateZ(vertexs[0],vertexs[1],vertexs[2],[j,i]);
                const [alpha,beta,gamma] = coordinate;
                if(alpha>=0 && beta>=0 && gamma>=0){//点在三角形内
                    const baseIndex = Math.floor(i*viewPort.w+j);
                    if(deepBuff[baseIndex]<z){
                        deepBuff[baseIndex] = z;
                        for(let k =0;k<4;++k){//r g b a
                            frameBuff.data[baseIndex*4+k] = interpolateFn(colors[0][k],colors[1][k],colors[2][k]);
                        }
                    }
                    //console.log(i*viewPort.w+j)
                }    
            }
        }
    }
    function render(){//渲染
        for(let i=0;i<frameBuff.data.length;++i){//初始化帧缓冲区，和深度缓冲区
            frameBuff.data[i] = 0;
            deepBuff[i] = -Infinity;
            //if(i%4===1) frameBuff.data[i] = 255.0;
            //if(i%4===3) frameBuff.data[i] = 255.0;
        }
        //视图变换
        const m1 = cam.value.getViewTrans();
        const m2 = cam.value.getPerspectiveTrans(viewPort.w, viewPort.h,200,600);
        const m3 = matrix_vp.muti(m2).muti(m1);
        const m4 = drawCoordinate.muti(m3);
        const vtxArr = [];
        for(let i=0;i<pos.length;++i){//顶点坐标变换
            let [x,y,z] = pos[i];
            let [[tx],[ty],[tz],[tw]] = m4.muti(new Vector([[x],[y],[z],[1]])).mtx;
            vtxArr.push(new Vector([[tx/tw],[ty/tw],[tz/tw],[1]]));
        }
        //绘制
        for(let i=0;i<order.length;++i){//遍历三角形
            const triVert = [];
            const triColor = [];
            for(let ind=0;ind<order[i].length;++ind){
                triVert.push(vtxArr[order[i][ind]]);
                triColor.push(color[order[i][ind]]);
            }
            //console.log(triVert,triColor);
            rasterize_triangle(triVert,triColor,frameBuff);
        }
        console.log(frameBuff);
        context.putImageData(frameBuff,0,0);//放置图像缓冲
    }
    function initScreen(){//画布初始化
        context = viewRef.value.getContext('2d');
    }
    onMounted(()=>{
        initScreen();
        render();
    });
    return {
        viewRef
    }
}