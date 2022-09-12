//组合
function select(arr,num){//从arr中取出num个进行组合
    let ans = [];
    function dfs(rs,index){
        if(index === arr.length){
            if(rs.length === num) ans.push(rs.join(","));
            return;
        }
        dfs(rs,index+1);
        rs.push(arr[index]);
        dfs(rs,index+1);
        rs.pop();
    }
    dfs([],0);
    return ans;
}
function arange(str){//返回他的全排列
    let pick = str.split("");
    let ans = [];
    function dfs(arr,map,index){
        if(index === pick.length){
            //console.log(arr);
            ans.push(arr.join(""));
            return;
        }
        for(let i=0;i<pick.length;i++){
            if(!map.get(pick[i])){
                arr.push(pick[i]);
                map.set(pick[i],true);
                dfs(arr,map,index+1);
                map.set(pick[i],false);
                arr.pop();
            }
        }
    }
    dfs([],new Map,0);
    return ans;
}
//console.log(select([3,6,2,1,7],3));
console.log(arange('123'));