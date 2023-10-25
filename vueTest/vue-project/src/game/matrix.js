import {calcDeterminant,cofactorArr} from '@/game/determinmant';

function swapArr(arr,x,y){
    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
}
function gcd(a,b){//辗转相除法(欧几里得)
    if(b>a) return gcd(b,a);
    while(b!==0){
        let temp = a%b;
        a = b;
        b = temp;
    }
    return a;
}
function lcm(a,b){//最小公倍数
    const g = gcd(a,b);
    return a*b/g;
}
class Matrix{//矩阵
    constructor(arr){//默认初始化为单位矩阵
        this.mtx = [];
        this.h = 0;
        this.w = 0;
        if(arr) this.init(arr);
    }
    init(arr){//初始化 深拷贝
        let isSynmmetry = true;//是否为对称矩阵
        this.h = arr.length,this.w = arr[0].length;
        for(let i=0;i<arr.length;++i){
            this.mtx[i] = [];
            for(let j=0;j<arr[0].length;++j){
                this.mtx[i][j] = arr[i][j];
                if(arr[j] && arr[i][j] !== arr[j][i]) isSynmmetry = false;
            }
        }
        return {isSynmmetry};
    }
    numMuti(n){
        for(let i=0;i<this.h;++i){
            for(let j=0;j<this.w;++j){
                this.mtx[i][j] = n*this.mtx[i][j];
            }
        }
    }
    muti(cmtx){//矩阵乘法
        if(!cmtx instanceof Matrix||this.w!==cmtx.h) return null;
        let result = [];//结果必然是高this.h x 宽cmtx.w的矩阵
        for(let i=0;i<this.h;++i){
            result[i] = [];
            for(let j=0;j<cmtx.w;++j){
                let sum = 0;
                for(let k=0;k<this.w;++k){
                    sum+=this.mtx[i][k]*cmtx.mtx[k][j];
                }
                result[i][j] = sum; 
            }
        }
        return new Matrix(result);
    }
    reverse(){//矩阵转置
        let result = [];
        for(let i=0;i<this.h;++i){
            for(let j=0;j<this.w;++j){
                if(typeof result[j] === "undefined") result[j] = [];
                result[j][i] = this.mtx[i][j];
            }
        }
        let temp = this.h;
        this.h = this.w;
        this.w = temp;
        this.mtx = result;
        return this;
    }
    //初等变换
    swapRow(x,y){//交换行
        if(x>=this.h||y>=this.h) return null;
        let temp = this.mtx[x];
        this.mtx[x] = this.mtx[y];
        this.mtx[y] = temp;
        return this;
    }
    swapCol(x,y){//交换列
        if(x>=this.w||y>=this.w) return null;
        for(let i=0;i<this.h;++i){
            swapArr(this.mtx[i],x,y);
        }
        return this;
    }
    mutiRow(muti,...rows){//行倍增
        if(isNaN(muti)||muti===0) return null;
        for(let i=0;i<rows.length;++i){
            let row = this.mtx[rows[i]];
            for(let j=0;j<this.w;++j){
                row[j]*=muti;
            }
        }
        return this;
    }
    mutiCol(muti,...cols){//列倍增
        if(isNaN(muti)||muti===0) return null;
        for(let i=0;i<this.h;++i){
            for(let j=0;j<cols.length;++j){
                this.mtx[i][cols[j]]*=muti;
            }
        }
        return this;
    }
    addMutiRow(augend,addend,muti){// 行加倍数行
        if(isNaN(muti)||muti===0) return null;
        for(let j=0;j<this.w;++j){
            this.mtx[augend][j]+=this.mtx[addend][j]*muti;
        }
        return this;
    }
    addMutiCol(augend,addend,muti){// 列加倍数列
        if(isNaN(muti)||muti===0) return null;
        for(let j=0;j<this.h;++j){
            this.mtx[j][augend]+=this.mtx[j][addend]*muti;
        }
        return this;
    }
    rankA(){//高斯消元求秩 初等行变换 倒三角阶梯型
        let rank = 0,cyMtx =  new Matrix(this.mtx);
        let mtx = cyMtx.mtx,detValue = 1;
        for(let i=0;i<cyMtx.w;++i){
            let ref = mtx[i][i];
            for(let j=i+1;j<cyMtx.h;++j){
                if(ref === 0){ ref = mtx[i][j];continue;}
                if(mtx[j][i] === 0) continue;
                let k = lcm(ref,mtx[j][i]);
                cyMtx.mutiRow(k/mtx[j][i],j);
                cyMtx.addMutiRow(j,i,-(k/ref));
            }
            console.log(mtx)
            if(mtx[i][i]!==0) rank++;
            detValue*=mtx[i][i];
        }
        printMatrix(mtx);
        return {rank,detValue};
    }
    getStandard(){//获取标准型 初等行变换将矩阵化为标准型
        let cyMtx =  new Matrix(this.mtx);
        let step = new UnitMatrix(this.h);
        cyMtx.init(this.mtx);
        let mtx = cyMtx.mtx;
        for(let i=0;i<cyMtx.w;++i){
            let ref = mtx[i][i];
            for(let j=i+1;j<cyMtx.h;++j){
                if(ref === 0){ ref = mtx[i][j];continue;}
                if(mtx[j][i] === 0) continue;
                let k = lcm(ref,mtx[j][i]);
                let muti1 = k/mtx[j][i],muti2 = -(k/ref);
                cyMtx.mutiRow(muti1,j);
                step.mutiRow(muti1,j);
                cyMtx.addMutiRow(j,i,muti2);
                step.addMutiRow(j,i,muti2);
            }
        }
        console.log(mtx)
        for(let i=cyMtx.h-1;i>=0;--i){
            let ref = mtx[i][i];
            for(let j=i-1;j>=0;--j){
                if(ref === 0){ ref = mtx[i][j];continue;}
                if(mtx[j][i] === 0) continue;
                let k = lcm(ref,mtx[j][i]);
                let muti1 = k/mtx[j][i],muti2 = -(k/ref);
                cyMtx.mutiRow(muti1,j);
                step.mutiRow(muti1,j);
                cyMtx.addMutiRow(j,i,muti2);
                step.addMutiRow(j,i,muti2);
            }
            if(mtx[i][i]){
                const muti3 = 1/mtx[i][i];
                cyMtx.mutiRow(muti3,i);
                step.mutiRow(muti3,i);
            }
        }
        printMatrix(mtx);
        printMatrix(step.mtx);
        return {cyMtx,step};//step即为逆矩阵
    }
    coperateMtx(calc=(val)=>val){//伴随矩阵
        let result = [];
        for(let i=0;i<this.h;++i){
            result[i] = []
            for(let j=0;j<this.w;++j){
                result[i][j] = calc(cofactorArr(this.mtx,j,i).valueOf());
            }
        }
        return new Matrix(result);
    }
    inverse(){//矩阵的逆（克拉默法则）
        let detMtVal = calcDeterminant(this.mtx);
        if(detMtVal === 0) return null;//行列式的值为零，矩阵不可逆
        let cpMtx = this.coperateMtx((x)=>x/detMtVal);
        return cpMtx;
    }
    rankB(){//奇异值分解（SVD）
       
    }
    symbolVector(){//特征值和特征向量

    }
}
class UnitMatrix extends Matrix{
    constructor(n){
        super()
        this.w = n;
        this.h = n;
        this.init();
    }
    init(){
        for(let i=0;i<this.h;++i){
            this.mtx[i] = [];
            for(let j=0;j<this.w;++j){
               this.mtx[i][j] = i===j?1:0;
            }
        }
    }
}
function vlen(vec){//向量的长度
    let ans = 0;
    for(let i=0;i<vec.length;++i) ans+=vec[i]*vec[i];
    return Math.sqrt(ans);
}
function toIdentityVec(vec){//转为单位向量
    let len = vlen(vec),ans = [];
    for(let i=0;i<vec.length;++i){
        ans.push(len===0?0:(vec[i]/len));
    } 
    ans.push(len);
    return ans;
}
function vMuti(vec,muti){
let [x,y,z] = vec;
return [x*muti,y*muti,z*muti];
}
export {Matrix,toIdentityVec,vMuti};