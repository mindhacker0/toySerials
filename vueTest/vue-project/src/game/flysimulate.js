import {ref,onMounted, reactive, watch, onUnmounted} from 'vue';
import {Matrix,Vector} from '@/game/matrix'; 
import { modelTrans,Camera } from './transform';
export const useProjection = ()=>{//透视投影
    const viewRef = ref(null);
    let context = null;
    const viewPort = reactive({w:1280,h:720});//视口的大小
    const angle = reactive({x:0,y:0,z:0});//正方体旋转角度
    const cameraAngle = reactive({x:0,y:0,z:0});//相机的旋转角度
    const world = new Matrix([
        [1,0,0,0],
        [0,1,0,0],
        [0,0,-1,0],
        [0,0,0,1]
    ]);//世界坐标，z轴向外
    const cam = ref(null);
    const drawCoordinate = new Matrix([//相机坐标系到canvas坐标系
       [1,0,0,0],
       [0,-1,0,viewPort.h],
       [0,0,1,0],
       [0,0,0,1]
    ]);
    // canonical cube到屏幕坐标
    const matrix_vp = new Matrix([
        [viewPort.w/2,0,0,(viewPort.w-1)/2],
        [0,viewPort.h/2,0,(viewPort.h-1)/2],
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
    function worldAuxiliary(fnTransVec){//绘制世界坐标辅助线
        let  rx = [[-500,0,0],[500,0,0]],ry = [[0,-400,0],[0,400,0]],rz = [[0,0,-500],[0,0,500]];
        const fn = (point)=>fnTransVec(point).mtx[0].slice(0,2);
        const color = {[rx]:'red',[ry]:'green',[rz]:'blue'}
        for(let point of [rx,ry,rz]){
            const [start,end] = point;
            context.save();
            context.beginPath();
            context.strokeStyle = color[point];
            context.moveTo(...fn(start));
            context.lineTo(...fn(end));
            context.stroke();
            context.fillText('+',...fn(end));//正方向标记
            context.closePath();
            context.restore();
        }
    }
    //绘制立方体
    function drawCube(fnTransVec){
        let tranVecs = [];
        for(let i=0;i<rect.length;++i){
            tranVecs.push(fnTransVec(rect[i]).mtx[0]);
        }
        context.beginPath();
        //绘制图形，连线
        for(let i=0;i<=4;++i){//上平面
            const [dx,dy,dz] = tranVecs[i%4];
            if(i===0) context.moveTo(dx,dy);
            else context.lineTo(dx,dy);
        }
        context.stroke();
        context.beginPath();
        for(let i=4;i<=8;++i){//下平面
            const [dx,dy,dz] = tranVecs[4+i%4];
            if(i===0) context.moveTo(dx,dy);
            else context.lineTo(dx,dy);
        }
        context.stroke();
        for(let i=0;i<4;++i){//侧面
            const [dx,dy,dz] = tranVecs[i];
            const [dx1,dy1,dz1] = tranVecs[i+4];
            context.beginPath();
            context.moveTo(dx,dy);
            context.lineTo(dx1,dy1);
            context.stroke();
        }
    }
    function pixelTrans(point,coordinateMtx){//物体坐标变换
        let colVec = new Vector([[point[0]],[point[1]],[point[2]],[1]]);
        //模型变换，改变的是物体在世界坐标系中的姿态
        let x = Math.sqrt(45*45 +45*45);
        let model = modelTrans(new Vector([[45/x],[45/x],[0]]),0,[0,0,0]);
        // colVec = model.muti(colVec);
        //坐标系变换
        colVec = coordinateMtx.muti(colVec);
        return colVec; 
    }
    const render = ()=>{//主绘制函数
        context.clearRect(0, 0, viewPort.w, viewPort.h);
        cam.value = new Camera([100,100,100],[0,0,0],[0,300,0]);
        const m1 = cam.value.getViewTrans();
        // const m2 = cam.value.getOrthographicTrans(viewPort.w, viewPort.h,0,400);
        // const m3 = matrix_vp.muti(m2).muti(m1);
        const m4 = drawCoordinate.muti(m1);//相机坐标转为canvas绘图坐标
        const testPoint = new Vector([[0],[100],[0],[1]]);
        const transPoint = m4.muti(testPoint).reverse();
        const [[x,y]] = transPoint.mtx;
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.stroke();
        console.log(transPoint)
        // console.log(m1,m2,m3,m4, m4.muti(new Vector([[100],[100],[100],[1]])))
        const pointMtx = (point)=>pixelTrans(point,m4).reverse();//组合转换矩阵
        const worldCnMtx = (point)=>m4.muti(new Vector([[point[0]],[point[1]],[point[2]],[1]])).reverse();
        worldAuxiliary(worldCnMtx);//绘制坐标轴
        drawCube(pointMtx);//绘制立方体
    };
    const operateModel = ref(false);
    const mousePos = reactive({x:0,y:0});
    const disRate = 20;//移动的灵敏度,n个单位移动1个角度
    const handleMouseDown = (e)=>{
        operateModel.value = true;
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    };
    const handleMouseMove = (e)=>{
        if(operateModel.value){
            const {offsetX,offsetY} = e;
            cameraAngle.y+= (offsetX-mousePos.x)/disRate;//鼠标左右是绕y旋转
            cameraAngle.y=(cameraAngle.y)%360;
            cameraAngle.x+= (offsetY-mousePos.y)/disRate;//鼠标上下是绕x旋转
            cameraAngle.x=(cameraAngle.x)%360;
            console.log('move',cameraAngle);
        }
    };
    const handleMouseUp = (e)=>{
        if(operateModel.value){
            operateModel.value = false;
        }
    };
    const handleMouseLeave = (e)=>{
        if(operateModel.value){
            operateModel.value = false;
        }
    };
    const handlePlay = ref(null);
    const play = ()=>{
        handlePlay.value = requestAnimationFrame(function(){angle.y++;play();})
    };
    function initScreen(){//画布初始化
        context = viewRef.value.getContext('2d');
        viewRef.value.addEventListener('mousedown',handleMouseDown);
        viewRef.value.addEventListener('mousemove',handleMouseMove);
        viewRef.value.addEventListener('mouseup',handleMouseUp);
        viewRef.value.addEventListener('mouseleave',handleMouseLeave);
    }
    watch(()=>angle,()=>{render();},{deep:true});
    watch(()=>cameraAngle,()=>{render();},{deep:true})
    onMounted(()=>{
        initScreen();
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