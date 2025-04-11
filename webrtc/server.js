const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
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
const rtspUrl = "rtsp://stream.strba.sk:1935/strba/VYHLAD_JAZERO.stream";
const localUrl = "rtsp://admin:rhkj1987@192.168.0.113:554/Streaming/Channels/1";
const handleRequest = (req,res)=>{  
    console.log(req.url)
    if(req.url === "/stream/receiver/demo"){
        const stream = spawn(
            'ffmpeg',
            [
            '-rtsp_transport','tcp',
            '-i',localUrl,
            '-c:v','libvpx',
            '-quality','realtime',
            '-cpu-used','4',
            '-deadline','1',
            '-b:v','2M',
            '-c:a','libopus',
            '-ar','48000',
            '-ac','2',
            '-f','webm',
            '-flush_packets','0',
            '-fflags','+nobuffer',
            'pipe:1',
            ],
            { detached: false, windowsHide:true },
        );//转为webm流
        stream.stderr.on('data', () => {});
        stream.stderr.on('error', (e) => console.log('err:error', e));
        stream.stdout.on('error', (e) => console.log('out:error', e));
        stream.on('error', (err) => {
            console.warn(`ffmpeg exec Error: ${err.message}`);
        });
        stream.stdout.on('data', (data) => {
            console.log('stream data:', data);
        });
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
    console.log(`Server is running on http://localhost:${PORT}`);
});

