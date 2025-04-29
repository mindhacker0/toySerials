const http = require('http');
const WebSocket = require('ws');
const port = 3004; // 你可以选择任何未被占用的端口
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
const connections = new Map();
const handleRequest = (req,res)=>{  };
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
const wss = new WebSocket.Server({ server }); // 绑定到同一个 server
function generatePeerId() {
    return Math.random().toString(36).substr(2, 9);
}
function handleOffer(data) {//
    const offer = data.offer;
    console.log('Received offer:');
    connections.forEach((ws)=>{
        if(ws.peerId !== data.clientId){
            ws.send(JSON.stringify({type:"offer",offer}));
        }
    });
}
function handleAnswer(data) {
    const answer = data.answer;
    console.log('Received answer:');
    connections.forEach((ws)=>{
        if(ws.peerId !== data.clientId){
            ws.send(JSON.stringify({type:"answer",answer}));
        }
    });
}
function handleCandidate(data) {
    const candidate = data.candidate;
    connections.forEach((ws)=>{
        if(ws.peerId !== data.clientId){
            ws.send(JSON.stringify({type:"candidate",candidate}));        
        }
    });
}
// WebSocket
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.peerId = generatePeerId();
    connections.set(ws.peerId, ws);
    // 接收客户端消息
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        const data = JSON.parse(message);
        switch(data.type) {
            case 'ping':
                ws.send(JSON.stringify({type:"regist",clientId:ws.peerId}));
                break;
            case 'offer':
                handleOffer(data);
                break;
            case 'answer':
                handleAnswer(data);
                break;
            case 'candidate':
                handleCandidate(data);
                break;
        }
    });
    ws.onclose = () => {
        console.log('WebSocket connection closed');
        connections.delete(ws.peerId);
    };
});
// 启动服务器
server.listen(port, "0.0.0.0", () => {
    console.log(`服务器正在 http://localhost:${port} 上运行`);
});