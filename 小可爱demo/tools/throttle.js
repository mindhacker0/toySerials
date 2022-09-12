//节流，函数会在特定间隔执行
function throttle(fn,time){
    let key = true;
    return ()=>{
        if(!key) return;
        setTimeout(()=>{
            fn.apply(this,arguments);
            key = true;
        },time);
    }
}