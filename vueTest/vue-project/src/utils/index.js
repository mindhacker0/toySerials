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