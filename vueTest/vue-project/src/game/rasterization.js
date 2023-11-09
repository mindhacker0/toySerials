import {ref,onMounted} from 'vue'
export const useRaster = ()=>{
    const viewRef = ref(null);
    let context = null;
    const pos = [
        [2, 0, -2],
        [0, 2, -2],
        [-2, 0, -2],
        [3.5, -1, -5],
        [2.5, 1.5, -5],
        [-1, 0.5, -5]
    ];
    const order = [
        [0,1,2],
        [3,4,5],
    ]
    function render(){
        
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