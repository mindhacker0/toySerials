const videoElement = document.getElementById('videoElem');
function webRtcInit(){
    const suuid = "reowhite";
    const stream = new MediaStream();
    const connection = new RTCPeerConnection();
    connection.oniceconnectionstatechange = () => console.log('connection', connection.iceConnectionState);
    connection.onnegotiationneeded = async () => {
        //will be called during the initial setup of the connection
        //or any time a change to the communication environment requires reconfiguring the connection.
        console.log('negotiation needed');
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        const res = await fetch(`http://localhost:8002/stream/receiver/${suuid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: new URLSearchParams({
                suuid: `${suuid}`,
                data: `${btoa(connection.localDescription?.sdp || '')}`,
            }),
        });
        const data = (res && res.ok) ? await res.text() : '';
        connection.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: atob(data),
        }));
    };
    connection.ontrack = (event) => {
        stream.addTrack(event.track);
        if (videoElem instanceof HTMLVideoElement) videoElem.srcObject = stream;
        else  console.log('element is not a video element:', elementName);
        videoElem.onloadeddata = async () => console.log('resolution:', videoElem.videoWidth, videoElem.videoHeight);
        console.log('received track:', event.track, event.track.getSettings());
    };
    connection.addTransceiver("video", { direction: 'sendrecv' });  
    const channel = connection.createDataChannel(suuid, { maxRetransmits: 10 });
    channel.onmessage = (e) => console.log('channel message:', channel.label, 'payload', e.data);
    channel.onerror = (e) => console.log('channel error:', channel.label, 'payload', e);
    channel.onclose = () => console.log('channel close');
    channel.onopen = () => {
        console.log('channel open');
      setInterval(() => channel.send('ping'), 1000); // send ping becouse PION doesn't handle RTCSessionDescription.close()
    };
}
