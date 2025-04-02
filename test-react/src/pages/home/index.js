import { useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { loadStream } from './paly';
const Home = function(){
    const screenRef = useRef(null);
    useEffect(()=>{
      let cache = new Uint8Array,offset = 0;
      const video = screenRef.current;
      const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
      const socket = io('http://localhost:3000');
      socket.on('connect', () => {
        console.log('Connected with ID:', socket.id);
      });
      if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        const ms = new MediaSource();
        video.src = URL.createObjectURL(ms);
        ms.addEventListener('sourceopen',function(){
          const sourceBuffer = ms.addSourceBuffer(mimeCodec);
          // sourceBuffer.addEventListener('updateend', function() {
          //     if (!sourceBuffer.updating && ms.readyState === "open") {
          //       ms.endOfStream();
          //     }
          // });
          socket.on('message', (data) => {
            cache.set(data, offset);
            offset += data.length;
            if (this.readyState !== 'open' || sourceBuffer.updating) return;
            sourceBuffer.appendBuffer(cache);
            cache = new Uint8Array;
            offset = 0;
          });
        });
      }
    },[]);
    useEffect(()=>{
      //loadStream()

    },[]);
    return (<div><video ref={screenRef} controls/></div>)
};
export default Home;