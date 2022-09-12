//枚举子集
function getSubArray(arr){
   let subArr = [];
   let len = arr.length;
   function choice(index,sarr){
        if(index<len){
            sarr.push(arr[index]);
            choice(index+1,sarr);
            sarr.pop();
            choice(index+1,sarr);
        }else{
            console.log(sarr);
            subArr.push(sarr.join(","));
        }
   }
   choice(0,[]);
   return subArr;
}
console.log(getSubArray([1,2,4,5]))