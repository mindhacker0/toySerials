//去除抖动，多次触发只执行最后一次
function debounce(fn,time){
    let handle;
    let vm = this;
    return function(){
        if(handle){
            clearTimeout(handle);
        }
        handle = setTimeout(()=>{
            fn.apply(vm,arguments);
            clearTimeout(handle);
        },time);
    }
}
let test = debounce((a)=>{console.log(a)},10)
for(let i=0;i<10;i++){
    test(i);
}