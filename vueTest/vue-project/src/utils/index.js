export const openFile = function(accept,callback){//will not be call if user dont interact with browser.
    let fileInput = document.createElement("input");
    fileInput.setAttribute("display","none");
    fileInput.setAttribute("type","file");
    fileInput.setAttribute("accept",accept);
    fileInput.addEventListener("change",(e)=>{
        callback && callback(e);
        document.body.removeChild(fileInput);
    });
    document.body.appendChild(fileInput);
    fileInput.click();
}