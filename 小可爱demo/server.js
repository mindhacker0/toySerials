const http = require('http');  
const fs = require('fs');  
const path = require('path');  
  
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
});