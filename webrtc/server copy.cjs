const express = require('express');
const path = require('path');
const fs = require('fs');  
const cors = require('cors');
const process = require('process');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const rtspUrl = "rtsp://stream.strba.sk:1935/strba/VYHLAD_JAZERO.stream";
const localUrl = "rtsp://admin:rhkj1987@192.168.0.113:554/Streaming/Channels/1";
const { RTCPeerConnection } = require('wrtc');
const peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});
const port = 3003; // 你可以选择任何未被占用的端口
function generatePeerId() {
    return Math.random().toString(36).substr(2, 9);
}
async function handleOffer(ws, data) {//
    const offer = data.offer;
    console.log('Received offer:', offer);
    await peer.setRemoteDescription({
        type: 'offer',
        sdp:offer.sdp
    });
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    ws.send(JSON.stringify({
        type: 'answer',
        answer: answer.sdp,
    }));
    peer.onicecandidate = (event) => {
        console.log('ICE candidate:', event.candidate);
        if(event.candidate){
            ws.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate
            }));
        }
    };
}
function handleCandidate(ws, data) {
    const candidate = data.candidate;
    console.log('Received ICE candidate:');
    peer.addIceCandidate(candidate);
}
peer.ondatachannel = (event) => {
    const channel = event.channel;
    channel.onopen = (event) => {
        console.log("channel open:",event);
        stream = WebMStream(channel);
    };
    channel.onmessage = (event) => {
      console.log("receive:",event.data);
    };
    channel.onerror = (error) => {
        console.error("WebRTC error:", error);  
    }
    channel.onclose = (e) => {
        console.log("channel closed!",e);
    };
};
peer.onconnectionstatechange = () => {
    if (peer.connectionState === "connected") {
        console.log("WebRTC 连接成功！");
    }
}

function RgbaStream(ch){
    const stream = spawn(
        'ffmpeg',
        [
        '-rtsp_transport','tcp',
        '-i',localUrl,
        '-vf','format=rgba,scale=640:360',
        '-pix_fmt','rgba',
        '-f','rawvideo',
        '-',
        ],
        { detached: false, windowsHide:true },
    );//转为webm流
    stream.stderr.on('data', (e) => {console.log('log data:', e.toString())});
    stream.stderr.on('error', (e) => console.log('err:error', e));
    stream.stdout.on('error', (e) => console.log('out:error', e));
    stream.on('error', (err) => {
        console.warn(`ffmpeg exec Error: ${err.message}`);
    });
    stream.stdout.on('data', (data) => {
        console.log('stream data:', data,ch.readyState);
       if(ch.readyState === "open") ch.send(data);
    });
    return stream;
}

function WebMStream(channel){
    const stream = spawn(
        'ffmpeg',
        [
            '-hwaccel','cuda',
            '-i',localUrl,
            '-c:v', 'libvpx', 
            '-quality', 'realtime', 
            '-cpu-used', '4', 
            '-b:v', '1M', 
            '-deadline', 'realtime',
            // '-c:a', 'libopus', 
            // '-b:a', '64k',
            '-an',
            '-f', 'webm',
            '-cluster_size_limit', '2M', 
            '-cluster_time_limit', '5000',
            '-'
        ],
        { detached: false, windowsHide:true },
    );
    stream.stderr.on('data', (e) => {console.log('log data:', e.toString())});
    stream.stderr.on('error', (e) => console.log('log error:', e));
    stream.stdout.on('error', (e) => console.log('data error:', e));
    stream.on('error', (err) => {
        console.warn(`ffmpeg exec Error: ${err.message}`);
    });
    stream.stdout.on('data', function(data){
        console.log('stream data:', data);
        if(channel && channel.readyState === 'open'){
            channel.send(data);
        }
    });
    return stream;
}
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // 绑定到同一个 server

// WebSocket
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.peerId = generatePeerId();
    // 接收客户端消息
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        const data = JSON.parse(message);
        switch(data.type) {
        case 'offer':
            handleOffer(ws, data);
            break;
        case 'candidate':
            handleCandidate(ws, data);
            break;
        }
    });
    ws.send(JSON.stringify({call:"SERVER_LIVE"}));
});
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cors());

// 中间件，用于解析 JSON 请求体
app.use(express.json());

app.get('/api/file', (req, res) => {
    const filePath = getFilePath();
    console.log("get filePath: ", filePath);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: ' + err.message);
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/zip'});
        res.end(content);
    });
});

app.post('/api/file', (req, res) => {

    const filePath = getFilePath();
    const fileStream = fs.createWriteStream(filePath);
    
    // 确保处理二进制数据
    req.on('data', (chunk) => {
        fileStream.write(chunk);
    });

    req.on('end', () => {
        fileStream.end();
        console.log('文件上传成功！');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        // 广播给所有浏览器客户端更新工程
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
               client.send(JSON.stringify({call:"UPDATE_FILE"}));
            }
        });
    });

    req.on('error', (err) => {
        console.error('文件上传失败:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
    });
});

// 处理所有其他请求，返回 index.html
app.get('*', (req, res) => {
    console.log('Serving index.html from:', path.join(__dirname, 'dist', 'index.html'));
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const getFilePath = ()=>{
    return path.join(process.cwd(), "hmi_project.hmi");
}

// 启动服务器
server.listen(port, "0.0.0.0", () => {
  console.log(`服务器正在 http://localhost:${port} 上运行`);
});