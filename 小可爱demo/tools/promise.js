function PromiseA(fn){
    let callback = null;
    this.then = function(thenFn){
        callback = thenFn;
    }
    fn(function(ans){
        callback(ans);
    });
}
new PromiseA((resolve,reject)=>{
    setTimeout(()=>{
        resolve(100);
        console.log("999");
    },500);
}).then(res=>{
    console.log(res);
});