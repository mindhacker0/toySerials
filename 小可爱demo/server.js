const http = require('http');  
const fs = require('fs');  
const path = require('path');
const PORT = 8087;
const cors = (req,res)=>{//跨域
    const method = req.method && req.method.toUpperCase && req.method.toUpperCase();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials',"true");
    if (method === 'OPTIONS') {
        // preflight
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers',"*");
        res.statusCode = 200;
        res.setHeader('Content-Length', '0');
        res.end();
        return true;
    }
    return false;
}
const parseFormHead = (str)=>{//hyperText - 表单头部解析
    const res = {};
    let key = "",value = "",quota = false;
    const start = ()=>{
        return attrName;
    };
    const attrName = (str)=>{
        if(str === ":") return ()=>vcontent;
        if(str === "=") return ()=>{  quota = true; return vcontent;}  
        key+=str;
        return attrName;
    }

    const vcontent = (str)=>{
        if(quota && str === "\""){quota = false; return vcontent; }
        if(str === ";") return ()=>pair;
        if(str === "\r") return vcontent;
        if(str === "\n") return pair;
        value+=str;
        return vcontent;
    }
    const pair = (str)=>{
        res[key] = value;
        key = "";
        value = "";
        return attrName(str);
    }
    let state = start();
    for(let i = 0;i<str.length;++i){
        state = state(str[i]);
    }
    if(key!=="") res[key] = value;
    return res;
}
const server = http.createServer((req, res) => {  
    // 假设我们的静态文件都放在 public 目录下  
    const filePath = './' + req.url;  
    const extname = path.extname(filePath);  
    let contentType = 'text/html';  
    switch (extname) {  
        case '.js':  
            contentType = 'text/javascript';  
            break;  
        case '.css':  
            contentType = 'text/css';  
            break;  
        case '.json':  
            contentType = 'application/json';  
            break;  
        case '.png':  
            contentType = 'image/png';  
            break;  
        case '.jpg':  
            contentType = 'image/jpeg';  
            break;
        case '.wasm':  
            contentType = 'application/wasm';  
            break;
        // 你可以继续添加其他文件类型的处理  
    }  
    // 检查文件是否存在  
    fs.access(filePath, fs.constants.F_OK, (err) => {  
        console.log(filePath,err)
        if (err) {  
            // 文件不存在，返回404  
            res.writeHead(404);  
            res.end('File not found');  
            return;  
        }  
  
        // 文件存在，读取并发送  
        fs.readFile(filePath, (err, content) => {  
            if (err) {  
                res.writeHead(500);  
                res.end('Sorry, check with the site admin for error: ' + err.message);  
                return;  
            }  
  
            res.writeHead(200, {'Content-Type': contentType});  
            res.end(content, 'utf-8');  
        });  
    });  
});  
  
server.listen(8087, () => {  
    console.log('Server running at http://localhost:8087/');
     // 自动打开浏览器
     const openCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
     exec(`${openCommand} http://localhost:${PORT}/index.html`);
});