import {onMounted, ref,reactive, watch} from 'vue';
import {openFile,readFile,urlToImage} from '@/utils/index';
export const usePicture = ()=>{
    const screenRef = ref(null);
    let context = null;
    const viewPort = reactive({w:1280,h:720});//视口的大小
    const imageUrl = ref(localStorage.getItem("saveWorkUrl")||'');
    const imageData = ref(null);
    const selectFile = async ()=>{
        const e = await openFile("*");
        if(e.target){
            const readerEvent = await readFile(e.target.files[0]);
            imageUrl.value = readerEvent.target.result;
        }
    }
    let handleSave = null;
    function saveWorkFile(){//保存当前画布内容
        let url = screenRef.value.toDataURL('image/png', 1.0);
        localStorage.setItem("saveWorkUrl",url);
    }
    const vertex = [
        [100,88],
        [33,99],
        [78,120]
    ];
    function render(){
        let borderX = [Infinity,-Infinity],borderY = [Infinity,-Infinity];
        //求三角形的边界
        for(let i=0;i<vertex.length;++i){
            const [x,y] = vertex[i];
            borderX[0] = Math.min(borderX[0],x);
            borderY[0] = Math.min(borderY[0],y);
            borderX[1] = Math.max(borderX[1],x);
            borderY[1] = Math.max(borderY[1],y);
        }
        
    }
    watch(()=>imageUrl.value,async(val)=>{//url改变获取画布图像缓冲数据
        if(val){
            const image = await urlToImage(val);
            context.drawImage(image,0,0);
            imageData.value = context.getImageData(0,0,viewPort.w,viewPort.h);// r g b a
            console.log(imageData.value);
        }
    },{immediate:true});
    onMounted(async()=>{
        context = screenRef.value.getContext('2d');
    });
    return {
        screenRef,
        selectFile,
        saveWorkFile
    }
}