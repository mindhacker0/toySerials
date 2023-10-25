import {onMounted, ref} from 'vue';
import {openFile} from '@/utils/index';
export const usePicture = ()=>{
    const screenRef = ref(null);
    let context = null;
    const selectFile = ()=>{
        openFile("*",(e)=>{
            if(e.target){
                const reader = new FileReader()
                console.log();
                reader.onload = (e) => {
                    const image = new Image();
                    image.src = e.target.result;
                    image.onload = (e)=>{
                        context.drawImage(image,0,0);
                        document.body.removeChild(image);
                    }
                    document.body.appendChild(image);
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
    onMounted(()=>{
        context = screenRef.value.getContext('2d');
    })
    return {
        screenRef,
        selectFile
    }
}