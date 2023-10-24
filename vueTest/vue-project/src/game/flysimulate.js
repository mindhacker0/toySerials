import {ref,onMounted, reactive} from 'vue';
export const useProjection = ()=>{//透视投影
    const viewRef = ref(null);
    const context = ref(null);
    const viewPort = reactive({w:1280,h:720});
    function initScreen(){
        context.value = viewRef.value.getContext('2d');

    }
    onMounted(()=>{
        initScreen();
    })
    return {
        viewRef
    }
}