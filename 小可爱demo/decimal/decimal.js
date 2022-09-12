function fill(vector,len,left = true){//用0填充位,left为true左填充，其它的右填充
    if(len<vector.length) return left?vector.slice(-len):vector.slice(0,len);
    while(vector.length<len){
        left?vector.unshift(0):vector.push(0);
    }
    return vector;
}
// 逻辑门
function xor(v,r){
    return Boolean(v^r);
}
function and(v,r){
    return Boolean(v&r);
}
function or(v,r){
    return Boolean(v|r);
}
function unsignedIntToVector(num,bitLen = 16){//正整数转二进制向量
    let arr = [];
    while(num!==0){
        arr.unshift(num%2);
        num = ~~(num/2);
    };
    while(bitLen && (arr.length<bitLen)){arr.unshift(0);}
    return arr.join("");
}
function intToVector(num,bitLen = 16){//带符号整数转二进制向量,补码表示
    let sign = num>0?0:1;
    let arr = [];
    if(num<0){
        num = -num-1;
    }
    while(num!==0){
        sign?arr.unshift((num&1)^1):arr.unshift(num&1);
        num=~~(num/2);
    }
    while(bitLen && (arr.length<bitLen-1)){arr.unshift(0^sign);}
    arr.unshift(sign);
    return arr.join("");
}
function decimalToVector(decimal,bitLen=23){//将小数部分化为向量
    if(decimal<0||decimal>=1){console.error("参数为小于1的正浮点数",decimal);return;}
    let arr = [];
    while(arr.length<bitLen){
        let int = ~~(decimal*2);
        arr.push(int);
        decimal = decimal*2 - int;
        if(decimal === 0){break;}
    }
    return arr.join("");
}

function floatToVector(float,bitLen = 32){//浮点类型转为二进制,double一般是32位的
    let sign = float>0?0:1;
    float = Math.abs(float);
    let arr = [];
    let integer = ~~ float;//截取整数部分
    let decimal = float - integer;//截取小数部分
    if(integer>0){//整数部分不为0
        let vInteger = unsignedIntToVector(integer,null);//整数部分向量
        let exponent = vInteger.length-1;//指数幂
        let vDecimal = decimalToVector(decimal);//小数部分向量
        arr = arr.concat(unsignedIntToVector(exponent+127,8).split(""));
        let fraction = (vInteger + vDecimal).slice(1,24).split("");
        fill(fraction,23,false);
        arr = arr.concat(fraction);
    }else{//整数部分为0
        let vDecimal = decimalToVector(decimal,127).split("");//小数部分向量
        let exponent = 0;
        let fraction = [];//小数部分
        for(var i=0;i<vDecimal.length;i++){
            if(vDecimal[i] === "1"){
                exponent--;
                break;
            }else{
                exponent--;
            }
        }
        fraction = vDecimal.slice((~exponent)+1,(~exponent)+24);
        fill(fraction,23,false);
        arr = arr.concat(unsignedIntToVector(exponent+127,8).split(""));
        arr = arr.concat(fraction);
    }
    arr.unshift(sign);
    return arr.join("");
}
function vectorToUnsignedInt(arr){//二进制向量转无符号整数
    let sum = 0;
    let exp = 0;
    let len = arr.length;
    for(let i=len-1;i>=0;i--){
        sum+=arr[i]*2**exp;
        exp++;
    }
    return sum;
}
function vectorToInt(arr){//二进制向量转带符号的整数
    let sign = arr[0];//最高位符号位1表示负数0表示正数
    let exp = 0;
    let sum = 0;
    let len = arr.length;
    for(let i=len-1;i>0;i--){
        sum+=(sign?!arr[i]:arr[i])*2**exp;//正数补码不变,负数取反
        exp++;
    }
    if(arr[0]) sum+=1;//负数补码取反加一
    return (sign?-1:1)*sum;
}
function vectorToDecimal(arr){//向量转小数
    let sum = 0;
    let exp = -1;
    let len = arr.length;
    for(let i=0;i<len;i++){
        sum+=arr[i]*(2**exp);
        exp--;
    }
    return sum;
}
function vectorToFloat(arr){//内存表示32位浮点数
    if(arr.length!==32){console.error("bit length must be 32!",arr);return;}
    let result = 0;
    let sign = arr[0]==1;//第一位是符号位
    let exponent = 0;
    let muti = 0;
    for(let i=8;i>0;i--){//8位指数位(-127 ~ 128)
        exponent+=arr[i]*2**muti;
        muti++;
    }
    exponent-=127;//指数偏移
    //console.log("exponent",exponent);
    let fraction = [1];
    for(let i=9;i<32;i++){
       fraction.push(arr[i]);
    }
    if(exponent>=0){//指数大于0
        let integer = vectorToUnsignedInt(fill(fraction,exponent+1,false));
        result+=integer;
        if(exponent<23){
           let decimal = vectorToDecimal(fraction.slice(exponent+1));
           result+=decimal;
        }
    }else{
        result = vectorToDecimal(fill(fraction,-exponent+23));
    }
    return (sign?-1:1)*result;
}
let number = 0.1;
number = vectorToFloat(floatToVector(number))
console.log(number);
let number1 = 0.2;
number1 = vectorToFloat(floatToVector(number1));
console.log(number1);
console.log(number+number1);
console.log(0.1+0.2);



