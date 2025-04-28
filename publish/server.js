const http = require('http');
const { Server } = require("socket.io");
const { spawn } = require('child_process');
const rtspUrl = "rtsp://stream.strba.sk:1935/strba/VYHLAD_JAZERO.stream";
const localUrl = "rtsp://admin:rhkj1987@192.168.0.113:554/Streaming/Channels/1";

const clients = new Map();

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Socket.IO Server</h1>');
});

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for development purposes)
    methods: ["GET", "POST"]
  }
});

function WebMStream(){
    const stream = spawn(
        'ffmpeg',
        [
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
        clients.forEach((client) => {
            client.emit('video-stream', data); // Send the video stream to all connected clients
        });
    });
    return stream;
}

WebMStream();

io.on('connection', (socket) => {
  console.log('A user connected',socket.id);
  clients.set(socket.id, socket);
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    clients.delete(socket.id);
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 6200;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});