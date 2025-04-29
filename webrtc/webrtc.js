let clientId = null;
const videoElem = document.getElementById('videoElem');
const stream = new MediaStream();
const connection = new RTCPeerConnection();
const ws = new WebSocket(`ws://${window.location.hostname}:3004`);
ws.onopen = ()=>{
    ws.send(JSON.stringify({type:'ping'}));
    connection.onnegotiationneeded = async () => {
        //will be called during the initial setup of the connection
        //or any time a change to the communication environment requires reconfiguring the connection.
        console.log('negotiation needed');
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        ws.send(JSON.stringify({
            type: 'offer',
            clientId: clientId,
            offer: offer
        }));
    };
    connection.ontrack = (event) => {
        stream.addTrack(event.track);
        if (videoElem instanceof HTMLVideoElement) videoElem.srcObject = stream;
        else  console.log('element is not a video element:', elementName);
        videoElem.onloadeddata = async () => console.log('resolution:', videoElem.videoWidth, videoElem.videoHeight);
        console.log('received track:', event.track, event.track.getSettings());
    };
    connection.oniceconnectionstatechange = () => console.log('connection', connection.iceConnectionState);
    // 设置ICE候选处理
    connection.onicecandidate = (event) => {
        if(event.candidate){
            ws.send(JSON.stringify({
                type: 'candidate',
                clientId: clientId,
                candidate: event.candidate
            }));
        }
    };
}
ws.onmessage = async (e)=>{
    const data = JSON.parse(e.data);
    console.log('ws received:', data);
    if(data.type === 'regist'){
        clientId = data.clientId;
    }
    if(data.type ==='offer'){
        await connection.setRemoteDescription(data.offer);
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        console.log('send answer',answer);
        ws.send(JSON.stringify({
            type: 'answer',
            clientId: clientId,
            answer: answer.sdp,
        }));
    }
    if(data.type === "answer"){
        await connection.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: data.answer,
        }));
    }
    if(data.type === "candidate"){
        await connection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
}


async function connect(){
    const localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
    });
    localStream.getTracks().forEach(track => {
        connection.addTrack(track, localStream);
    });
    connection.addTransceiver("video", { direction: 'sendrecv' });
}

//rtsp://stream.strba.sk:1935/strba/VYHLAD_JAZERO.stream