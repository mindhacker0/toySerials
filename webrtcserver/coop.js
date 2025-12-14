const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const port = 7777; // 你可以选择任何未被占用的端口
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
const server = http.createServer((req, res) => {
    const pathname = req.url.split("?").shift();
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
const wss = new WebSocket.Server({ server }); // 绑定到同一个 server

// WebSocket
wss.on('connection', (ws) => {
    console.log('New WebSocket connection',ws);
    // 接收客户端消息
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
    });
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
});
// 启动服务器
server.listen(port, "::1", () => {
    console.log(`服务器正在 http://localhost:${port} 上运行`);
});

server.on("upgrade", (req, socket, head) => {   
    console.log("upgrade")
});