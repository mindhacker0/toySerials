class FenwickTree{
    constructor(len){
        this.root = new Array(len+1).fill(0);
        this.len = len+1;
    }
    update(index,val){
        for(;index<this.len;index+=index&-index) this.root[index]+=val;
    }
    query(index){
        let ans = 0;
        for(;index>0;index-=index&-index) ans+=this.root[index];
        return ans;
    }
}
function reverse(arr){//逆序数
    let order = [...arr];
    order.sort((a,b)=>a-b);
    let orderMap = new Map;
    order.forEach((element,index) => {
        orderMap.set(element,index);
    });
    let fwtree = new FenwickTree(arr.length),revse = 0;
    for(let i=arr.length-1;i>=0;--i){
        revse+=fwtree.query(orderMap.get(arr[i])+1);
        fwtree.update(orderMap.get(arr[i])+1,1);
    }
    return revse;
}
function calcDeterminant(arr,fnMuti = (a,b)=>a*b){//定义法行列式求值
    let n = arr.length,ans = 0;
    function recur(sr,cache){
        if(sr.length === n){
            let re = reverse(sr),muti = 1;
            for(let i=0;i<n;++i){
               muti=fnMuti(muti,arr[i][sr[i]]);
            }
            ans+=(re%2?-1:1)*muti;
            return;
        }
        for(let i=0;i<n;++i){
            if(cache.has(i)) continue;
            sr.push(i);
            cache.add(i);
            recur(sr,cache);
            cache.delete(i);
            sr.pop();
        }
    }
    recur([],new Set);
    return ans;
}
function cofactorArr(arr,m,n){//行列式arr中a[m][n]的余子式
    let nArr = [],len = arr.length;
    for(let i=0;i<len;++i){
        if(i===m) continue;
        let row = [];
        for(let j=0;j<len;++j){
            if(j===n) continue;
            row.push(arr[i][j]);
        }
        nArr.push(row);
    }
    return {
        origion:[m,n],
        arr:nArr,
        valueOf(){//代数余子式的值
            return ((m+n)%2?-1:1)*calcDeterminant(nArr);
        }
    }
}
export {
    calcDeterminant,
    cofactorArr
};


