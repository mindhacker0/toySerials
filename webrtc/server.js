const http = require('http');
const path = require('path');
const fs = require('fs');
const PORT = 8888;
const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.wasm': 'application/wasm',
    '.m3u8': 'application/x-mpegURL',
    '.ts': 'video/MP2T',
    '.mpd': 'application/dash+xml',
};
const handleRequest = (req,res)=>{  
   console.log(req.url)
   if(req.url === "/stream/receiver/demo"){

   }
};
const server = http.createServer((req, res) => {
    const pathname = req.url.split("?").shift();
    if(pathname.match(/^\/stream/)){//处理接口请求
        handleRequest(req,res);
        return;
    }
    const filePath = '.' + req.url;  
    const extname = path.extname(filePath);  
    const contentType = mime[extname] || 'text/html; charset=utf-8';
    fs.access(filePath, fs.constants.F_OK, (err) => {  
        console.log(req.url,err)
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

server.listen(PORT, () => { 
    console.log('Server is running on http://localhost:3000');
});

