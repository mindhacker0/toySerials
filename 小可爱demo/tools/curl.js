let curl = function(fn,length){
    return (...arg)=>{
        return length - arg.length <=0?fn.apply(this,arg):curl(fn.bind(this,...arg),length - arg.length)
    }
}
let add = curl(function(...arg){  
    let sum =0;
    for(let i=0;i<arg.length;i++){
        sum+=arg[i];
    }
    return sum;
},3);
console.log(add(1)(2)(3));
console.log(add(1,2)(3));
console.log(add(1,2,3));
function revert(arr,start,end){
    if(start<=end){
        arr[start]^=arr[end];
        arr[end]^=arr[start];
        arr[start]^=arr[end];
        return revert(arr,start+1,end-1);
    }else{
        return arr;
    }
}
let arr = [1,2,3,4];
console.log(revert(arr,0,3));