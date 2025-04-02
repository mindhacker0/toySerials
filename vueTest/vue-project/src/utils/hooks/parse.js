export async function getBytes(stream, onChunk) {
    const reader = stream.getReader();
    let result;
    while (!(result = await reader.read()).done) {
        onChunk(result.value);
    }
}
export function getLines(onLine) {
    let buffer;
    let position;
    let fieldLength;
    let discardTrailingNewline = false;
    return function onChunk(arr) {
        if (buffer === undefined) {
            buffer = arr;
            position = 0;
            fieldLength = -1;
        }
        else {
            buffer = concat(buffer, arr);
        }
        const bufLength = buffer.length;
        let lineStart = 0;
        console.log('fieldlen',position)
        while (position < bufLength) {
            if (discardTrailingNewline) {
                if (buffer[position] === 10) {
                    lineStart = ++position;
                }
                discardTrailingNewline = false;
            }
            let lineEnd = -1;
            for (; position < bufLength && lineEnd === -1; ++position) {
                switch (buffer[position]) {
                    case 58:
                        if (fieldLength === -1) {
                            fieldLength = position - lineStart;
                        }
                        break;
                    case 13:
                        discardTrailingNewline = true;
                    case 10:
                        lineEnd = position;
                        break;
                }
            }
            if (lineEnd === -1) {
                break;
            }
            onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
            lineStart = position;
            fieldLength = -1;
        }
        if (lineStart === bufLength) {
            buffer = undefined;
        }
        else if (lineStart !== 0) {
            buffer = buffer.subarray(lineStart);
            position -= lineStart;
        }
    };
}
export function getMessages(onId, onRetry, onMessage) {
    let message = newMessage();
    const decoder = new TextDecoder();
    return function onLine(line, fieldLength) {
        if (line.length === 0) {
            onMessage === null || onMessage === void 0 ? void 0 : onMessage(message);
            message = newMessage();
        }
        else if (fieldLength > 0) {
            const field = decoder.decode(line.subarray(0, fieldLength));
            const valueOffset = fieldLength + (line[fieldLength + 1] === 32 ? 2 : 1);
            const value = decoder.decode(line.subarray(valueOffset));
            switch (field) {
                case 'data':
                    message.data = message.data
                        ? message.data + '\n' + value
                        : value;
                    break;
                case 'event':
                    message.event = value;
                    break;
                case 'id':
                    onId(message.id = value);
                    break;
                case 'retry':
                    const retry = parseInt(value, 10);
                    if (!isNaN(retry)) {
                        onRetry(message.retry = retry);
                    }
                    break;
            }
        }
    };
}
export function concat(a, b) {
    const res = new Uint8Array(a.length + b.length);
    res.set(a);
    res.set(b, a.length);
    return res;
}
function newMessage() {
    return {
        data: '',
        event: '',
        id: '',
        retry: undefined,
    };
}
//# sourceMappingURL=parse.js.map
function arrayBufferToString(buffer){
    return Array.prototype.slice.call(new Uint8Array(buffer)).
    map(i=>"00000000".substring(i.toString(2).length)+i.toString(2))
}
function lastIndex(arr,reg){//正则匹配
    for(let i=arr.length-1;i>0;i--){
        if(reg.test(arr[i])){
            return i;
        }
    }
    return -1;
 }
// const myParse = (U8Arr)=>{
//     let binaryArr= arrayBufferToString(U8Arr);
//     if(binaryArr[0].slice(0,2)==='10'&&that.start-6>=0){//如果前面不是标准开头
//         reader.readAsArrayBuffer(that.files[0].slice(that.start-6,that.start));//最长的编码为6个字节
//         reader.onload=function(){
//            let exBinaryArr=that.arrayBufferToString(reader.result);
//            preindex=that.lastIndex(exBinaryArr,/^(?!10).*/);//查找标准开头
//            preindex!==-1 && (that.start=that.start-(6-preindex));//找到了正确的起始位置
//            //console.log(exBinaryArr,preindex,that.start);
//            tail();
//         }
//     }else{
//         tail();   
//     }
//     function tail(){
//         //尾部多余部分处理
//         let tailindex=that.lastIndex(binaryArr,/^(?!10).*/);
//         //尾部可能是正常结束
//         let str=/^(1*)0.*/g.exec(binaryArr[tailindex])[1];
//         if(str.length+tailindex===binaryArr.length)
//         {tailindex=that.MaxPage;}
//         that.pageSize=preindex>0?tailindex+(6-preindex):tailindex;
//         console.log(binaryArr,binaryArr[tailindex],str.length);
//     } 
// }
