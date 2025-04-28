const video = document.getElementById('videoElem');
localStorage.setItem("webrtc-internal-exporter:debug", "true")
let ws;
const stream = new MediaStream();
const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
video.addEventListener('error', () => {
    console.error('Video error:', video.error);
});
const mediaSource = new MediaSource();
video.src = URL.createObjectURL(mediaSource);
let sourceBuffer = null;
mediaSource.onsourceopen = () => {  
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
}
const appendBuffer = [];
let state = 0;
function consumeBuffer(){
    if(state === 1) return;
    state = 1;
    while(appendBuffer.length > 0 && sourceBuffer && !sourceBuffer.updating){
        const data = appendBuffer.shift();
        console.log('appendBuffer:', data, sourceBuffer.updating);
        sourceBuffer.appendBuffer(data);
    }
    state = 0;
}
async function startStream() {
  // 初始化WebSocket连接
  ws = new WebSocket(`ws://${window.location.hostname}:3003`);
  ws.onopen = () => {
    const connection = new RTCPeerConnection(configuration);
    connection.oniceconnectionstatechange = () => console.log('connection', connection.iceConnectionState);
    connection.onnegotiationneeded = async () => {
        console.log('negotiation needed');
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        ws.send(JSON.stringify({
            type: 'offer',
            offer: offer
        }));
    };
    connection.ontrack = (event) => {
        console.log('received track:', event.track, event.track.getSettings());
    }
    connection.addTransceiver("video", { direction: 'sendrecv' });
    // 设置ICE候选处理
    connection.onicecandidate = (event) => {
        console.log('ICE candidate:', event);
        if(event.candidate){
            ws.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate
            }));
        }
    };
    const channel = connection.createDataChannel("chat",{ordered: true});
    channel.onmessage = (e) =>{
        console.log('channel message:', e.data);
        e.data = null;
        if(sourceBuffer && !sourceBuffer.updating) sourceBuffer.appendBuffer(e.data);
        // appendBuffer.push(e.data);
        // consumeBuffer();
    } 
    channel.onerror = (e) => console.log('channel error:', channel.label, 'payload', e);
    channel.onclose = () => console.log('channel close');
    channel.onopen = () => {
        console.log('channel open');
        channel.send("Hi you!");
        // setInterval(() => channel.send('ping'), 1000); // send ping becouse PION doesn't handle RTCSessionDescription.close()
    };
    // 处理WebSocket消息
    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        switch(data.type) {
            case 'answer':
                await connection.setRemoteDescription(new RTCSessionDescription({
                    type: 'answer',
                    sdp: data.answer,
                }));
            break;
            case 'candidate':
                await connection.addIceCandidate(new RTCIceCandidate(data.candidate));
            break;
        }
    };
  }
}
startStream();