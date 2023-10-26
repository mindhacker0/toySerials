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
        // image.width = viewPort.w;
        // image.height = viewPort.h;
        image.onload = (e)=>{
            resolve(image);
            document.body.removeChild(image);
        }
        image.onerror = err=>reject(err);
        document.body.appendChild(image);
    });
};