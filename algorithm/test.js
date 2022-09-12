let str = "aabeercc";
let arr = str.split("");
let index = 0;
let aCount = [];
for(let i=0;i<arr.length;i++){
    if(arr[i]==="a"){
        aCount.push(i);
    }
    if(arr[i] === "c"&&aCount.length){
        arr[aCount.pop()] = "";
        arr[i] = "";
    }
    if(i>0 && arr[i]===arr[i-1] && arr[i] === "e"){
        arr[i-1] = "";
    }
}
console.log(arr.join(""))