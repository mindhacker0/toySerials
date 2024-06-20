export const openFile = function(accept){//文件选择
    return new Promise((reslove,reject)=>{
        let fileInput = document.querySelector('input#pictureSelect');
        if(!fileInput){
            fileInput = document.createElement("input");
            fileInput.style.display = "none";
            fileInput.setAttribute("type","file");
            fileInput.setAttribute("id","pictureSelect");
            fileInput.setAttribute("accept",accept);
            fileInput.addEventListener("change",(e)=>{
                reslove(e);
                document.body.removeChild(fileInput);
            });
            document.body.appendChild(fileInput);
        }
        fileInput.click();
    });
};
export const readFile = function(file){//读取文件转为url
    return new Promise((resolve,reject)=>{
        const reader = new FileReader()
        reader.onload = (e) => resolve(e);
        reader.onerror = (err)=>reject(err);
        reader.readAsDataURL(file);
    });
};
export const urlToImage = function (url){//url转为image标签
    return new Promise((resolve,reject)=>{
        const image = new Image();
        image.src = url;
        image.onload = (e)=>{
            resolve(image);
            document.body.removeChild(image);
        }
        image.onerror = err=>reject(err);
        document.body.appendChild(image);
    });
};
const defaultConfig = {method:'GET',resType:'json'};
export const xhr = function (url,config={}){//xhr请求
    config = Object.assign(defaultConfig,config);
    return new Promise((resolve,reject)=>{
        var xhr = new XMLHttpRequest();
        xhr.open(config.method,url,true);
        xhr.responseType = config.resType;
        if(config.headers){
            for(let key in config.headers) xhr.setRequestHeader(key,config.headers[key]);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200){
                resolve(xhr.response);
            }
        }
        xhr.onerror = (err)=>reject(err);
        xhr.send(config.body);
    });
};
export function calcFPS(vector) {
    // 提取容器中的前 20 个元素来计算平均值；
    const AVERAGE_RECORDS_COUNT = 20;
    if (vector.length > AVERAGE_RECORDS_COUNT) {
        vector.shift(-1);  // 维护容器大小；
    } else {
        return 'NaN';
    }
    // 计算平均每帧在绘制过程中所消耗的时间；
    let averageTime = (vector.reduce((pre, item) => {
        return pre + item;
    }, 0) / Math.abs(AVERAGE_RECORDS_COUNT));
    // 估算出 1s 内能够绘制的帧数；
    return (1000 / averageTime).toFixed(2);
}
export const rotateImageData90 = function (imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    console.log(data);
    const newData = new Uint8ClampedArray(width*height*4);
    const trace = new Array(width*height*4);
    // 遍历原imageData中的每个像素
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // 计算新位置
        const newX = height - 1 - y;
        const newY = x;
        // 计算新位置在newData中的索引
        const newIndex = (newY * height + newX) * 4;
        // 复制像素数据到新位置
        newData[newIndex] = data[(y * width + x) * 4]; // R
        newData[newIndex + 1] = data[(y * width + x) * 4 + 1]; // G
        newData[newIndex + 2] = data[(y * width + x) * 4 + 2]; // B
        newData[newIndex + 3] = data[(y * width + x) * 4 + 3]; // A
        trace[newIndex] = true;
        trace[newIndex + 1] = true;
        trace[newIndex + 2] = true;
        trace[newIndex + 3] = true;
      }
    }
    // for(let i=0;i<trace.length;++i){
    //     if(trace[i]!==true) console.log(i);
    // }
    // console.log(trace)
    // 创建一个新的ImageData对象，并设置其data属性为翻转后的数据
    const newImageData = new ImageData(newData, height, width);
    return newImageData;
};