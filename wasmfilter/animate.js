const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnRcd = document.getElementById("btnRcd");
let raf;

const ball = {
  x: 100,
  y: 100,
  vx: 5,
  vy: 2,
  radius: 25,
  color: "blue",
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
    ball.vy = -ball.vy;
  }
  if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
    ball.vx = -ball.vx;
  }

  raf = window.requestAnimationFrame(draw);
}

// canvas.addEventListener("mouseover", (e) => {
//   raf = window.requestAnimationFrame(draw);
// });

// canvas.addEventListener("mouseout", (e) => {
//   window.cancelAnimationFrame(raf);
// });
const chunks = [];
const worker = new Worker("./worker.js");
const mediaStream = canvas.captureStream(60);
const record = new MediaRecorder(mediaStream,{
    mimeType:"video/webm;codecs=vp9"
});
record.ondataavailable = (e)=>{
    chunks.push(e.data);
    worker.postMessage({name:"chunk",payload:e.data});
};
record.onstop = function(e) {
    console.log("data available after MediaRecorder.stop() called.",e.data); 
}
btnRcd.addEventListener("click",(e)=>{
    if(record.state !== "recording"){
        record.start(16);
    }else{
        console.log(e);
        record.stop();
        worker.postMessage({name:"done"});
        var link = document.createElement('a');
        link.style.display = 'none';
        var fullBlob = new Blob(chunks);
        console.log("out",fullBlob);
        var downloadUrl = window.URL.createObjectURL(fullBlob);
        link.href = downloadUrl;
        link.download = 'canvas-video.mp4';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
});
ball.draw();
raf = window.requestAnimationFrame(draw);
