const express = require('express');
const app = express();

const { proxy, scriptUrl } = require('rtsp-relay')(app);

const handler = proxy({
  url: `rtsp://stream.strba.sk:1935/strba/VYHLAD_JAZERO.stream`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: true,   
  additionalFlags:['-pix_fmt', 'yuv420p',"-probesize","50000000","-analyzeduration","20000000","-c:a","mp2"]
});

// the endpoint our RTSP uses
app.ws('/api/stream', handler);

// this is an example html page to view the stream
app.get('/', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);

app.listen(2000);