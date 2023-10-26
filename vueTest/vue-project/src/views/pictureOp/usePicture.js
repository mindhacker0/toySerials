import {onMounted, ref,reactive} from 'vue';
import {openFile,readFile,urlToImage} from '@/utils/index';
export const usePicture = ()=>{
    const screenRef = ref(null);
    let context = null;
    const viewPort = reactive({w:1280,h:720});//视口的大小
    const imageUrl = ref(localStorage.getItem("saveWorkUrl")||'');
    const selectFile = async ()=>{
        const e = await openFile("*");
        if(e.target){
            const readerEvent = await readFile(e.target.files[0]);
            const image = await urlToImage(readerEvent.target.result);
            context.drawImage(image,0,0);
        }
    }
    let handleSave = null;
    function saveWorkFile(){
        let url = screenRef.value.toDataURL('image/png', 1.0);
        localStorage.setItem("saveWorkUrl",url);
    }
    onMounted(async()=>{
        context = screenRef.value.getContext('2d');
        if(imageUrl.value){
            const image = await urlToImage(imageUrl.value);
            context.drawImage(image,0,0);
        }
    });
    return {
        screenRef,
        selectFile,
        saveWorkFile
    }
}