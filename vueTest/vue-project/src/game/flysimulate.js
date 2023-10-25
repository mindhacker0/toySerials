import {ref,onMounted, reactive, watch, onUnmounted} from 'vue';
import {Matrix,toIdentityVec,vMuti} from '@/game/matrix'; 
export const useProjection = ()=>{//透视投影
    const viewRef = ref(null);
    let context = null;
    const viewPort = reactive({w:1280,h:720});//视口的大小
    const angle = reactive({x:0,y:0,z:0});//旋转角度
    const world = new Matrix([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,-1,0],
        [0,0,0,1]
    ]);//世界坐标，z轴向外
    const camera = new Matrix([//相机坐标系
        [1,0,0,0],
        [0,1,0,0],
        [0,0,-1,0],
        [0,0,0,1]
    ]);
    const drawCoordinate = new Matrix([//canvas坐标系
       [1,0,0,0],
       [0,-1,0,0],
       [0,0,1,0],
       [0,0,0,1]
    ]);
    let rect = [
        [-100,100,-100],        
        [100,100,-100],        
        [100,100,100],        
        [-100,100,100],        
        [-100,-100,-100],        
        [100,-100,-100],        
        [100,-100,100],        
        [-100,-100,100]
    ];//定义一个矩形的顶点
    const transw_c = camera.muti(world.inverse());//世界坐标转为相机坐标
    transw_c.mtx[0][3] = viewPort.w/2;
    transw_c.mtx[1][3] = viewPort.h/2;
    const transc_v = drawCoordinate.muti(camera.inverse());//相机坐标转为canvas绘图坐标
    transc_v.mtx[1][3] = viewPort.h;
    // console.log(transc_v.muti(new Matrix([[1],[1],[-1],[1]])));//测试变换矩阵
    function pixelTrans(point){//坐标变换
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
        const [x,y,z,len] = toIdentityVec(point);
        let colVec = new Matrix([[x],[y],[z],[1]]);
        colVec = rotateXMtx.muti(colVec);
        colVec = rotateYMtx.muti(colVec);
        colVec = rotateZMtx.muti(colVec);
        colVec.numMuti(len);
        colVec.mtx[3][0] = 1;
        // for(let i=0;i<3;++i) point[i] = colVec.mtx[i][0];
        //坐标系变换
        colVec = transw_c.muti(colVec);
        colVec = transc_v.muti(colVec);
        return colVec.mtx; 
    }
    const render = ()=>{
        context.clearRect(0, 0, viewPort.w, viewPort.h);
        context.beginPath();
        //顶点变换
        //绘制图形，连线
        let tranVecs = [];
        for(let i=0;i<rect.length;++i){
            tranVecs.push(pixelTrans(rect[i]));
        }
        for(let i=0;i<=4;++i){//上平面
            const [[dx],[dy],[dz]] = tranVecs[i%4];
            if(i===0) context.moveTo(dx,dy);
            else context.lineTo(dx,dy);
        }
        context.stroke();
        context.beginPath();
        for(let i=4;i<=8;++i){//下平面
            const [[dx],[dy],[dz]] = tranVecs[4+i%4];
            if(i===0) context.moveTo(dx,dy);
            else context.lineTo(dx,dy);
        }
        context.stroke();
        for(let i=0;i<4;++i){//侧面
            const [[dx],[dy],[dz]] = tranVecs[i];
            const [[dx1],[dy1],[dz1]] = tranVecs[i+4];
            context.beginPath();
            context.moveTo(dx,dy);
            context.lineTo(dx1,dy1);
            context.stroke();
        }
    };
    const operateModel = ref(false);
    const mousePos = reactive({x:0,y:0});
    const disRate = 20;//移动的灵敏度,n个单位移动1个角度
    const handleMouseDown = (e)=>{
        console.log('down',e)
        operateModel.value = true;
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    };
    const handleMouseMove = (e)=>{
        if(operateModel.value){
            const {offsetX,offsetY} = e;
            angle.y+= (offsetX-mousePos.x)/disRate;//鼠标左右是绕y旋转
            angle.y=(angle.y)%360;
            angle.x+= (offsetY-mousePos.y)/disRate;//鼠标上下是绕x旋转
            angle.x=(angle.x)%360;
            console.log('move',angle)
        }
    };
    const handleMouseUp = (e)=>{
        if(operateModel.value){
            console.log('up',e)
            operateModel.value = false;
        }
    };
    const handleMouseLeave = (e)=>{
        if(operateModel.value){
            console.log('leave',e)
            operateModel.value = false;
        }
    };
    const handlePlay = ref(null);
    const play = ()=>{
        console.log('play')
        handlePlay.value = requestAnimationFrame(function(){angle.z++;console.log(angle);play()})
    };
    function initScreen(){//画布初始化
        context = viewRef.value.getContext('2d');
        viewRef.value.addEventListener('mousedown',handleMouseDown);
        viewRef.value.addEventListener('mousemove',handleMouseMove);
        viewRef.value.addEventListener('mouseup',handleMouseUp);
        viewRef.value.addEventListener('mouseleave',handleMouseLeave);
    }
    watch(()=>angle,()=>{render();},{deep:true})
    onMounted(()=>{
        initScreen();
        render();
        play();
    });
    onUnmounted(()=>{
        cancelAnimationFrame(handlePlay.value);
    });
    return {
        viewRef
    }
}