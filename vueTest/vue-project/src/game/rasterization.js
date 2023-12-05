import {ref,onMounted,reactive,onUnmounted} from 'vue';
import {Matrix,Vector} from '@/game/matrix'; 
import {modelTrans,Camera} from './transform';
import {loadObject} from '@/utils/objLoader';
import { rasterize_triangle,meshTriRaster } from '@/utils/raster';
import { xhr,urlToImage } from '@/utils';
export const useRaster = ()=>{
    const viewRef = ref(null);
    let context = null;
    const viewPort = reactive({w:1280,h:720});//屏幕大小
    const frameBuff = new ImageData(viewPort.w,viewPort.h);//帧缓存
    const deepBuff = new Array(viewPort.w*viewPort.h);//深度缓冲区
    let model;
    const cam = ref(null);
    const texturImage = ref(null);
    let angle = 140;
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
    function render(){//渲染
        for(let i=0;i<frameBuff.data.length;++i){//初始化帧缓冲区，和深度缓冲区
            frameBuff.data[i] = i%4===3?255:0;
            deepBuff[i] = -Infinity;
        }
        //视图变换
        const model_mtx = modelTrans(new Vector([0,1,0]),angle,[0,0,0],[2.5,2.5,2.5]);
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
        function viewTrans(pos){//透视前坐标变换
            let [x,y,z] = pos.vector.vec;
            let [[tx],[ty],[tz],[tw]] = originTrans.muti(new Matrix([[x],[y],[z],[1]])).mtx;
            return new Vector([tx,ty,tz]);
        }
        function normalTrans(pos){//法线坐标变换
            let [x,y,z] = pos.vector.vec;
            let [[tx],[ty],[tz],[tw]] = transVerse.muti(new Matrix([[x],[y],[z],[0]])).mtx;
            return new Vector([tx,ty,tz]);
        }
        for(let i=0;i<model.length;++i){//遍历多边形（三角形）
            let {vertex,normal,texture} = model[i];
            meshTriRaster({
                vertex:vertex.map(vertexTrans),
                normal:normal.map(normalTrans),
                texture:texture.map(v=>v.vector),
                origin:vertex.map(viewTrans)
            },{
                viewPort,
                deepBuff,
                frameBuff,
                texturImage:texturImage.value
            });
        }
        // console.log(frameBuff);
        context.putImageData(frameBuff,0,0);//放置图像缓冲
    }
    function initScreen(){//画布初始化
        context = viewRef.value.getContext('2d');
    }
    async function getTextureResource(url){//图片blob转imageData
        const res = await xhr(url,{resType:'blob'});
        if(res && res instanceof Blob){
            const objUrl = URL.createObjectURL(res);
            const image = await urlToImage(objUrl);
            const {width,height} = image;
            const elem = document.createElement('canvas');
            elem.width = width;
            elem.height = height;
            // document.body.appendChild(elem);
            const ctx = elem.getContext('2d');
            ctx.drawImage(image,0,0);
            return ctx.getImageData(0,0,width,height);
        }
    }
    const handlePlay = ref(null);
    const play = ()=>{
        handlePlay.value = requestAnimationFrame(function(){
            angle++;
            render();
            play();
        });
    };
    onMounted(async ()=>{
        initScreen();
        const result = await loadObject('src/models/spot/spot_triangulated_good.obj');//加载模型文件
        texturImage.value = await getTextureResource('src/models/spot/spot_texture.png');//加载贴图文件
        model = result.face;
        render();
        // play();
    });
    onUnmounted(()=>{
        cancelAnimationFrame(handlePlay.value);
    });
    return {
        viewRef
    }
}