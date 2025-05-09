import { io } from "socket.io-client";
export const loadStream = function(){
var video = document.querySelector('video');
const socket = io('http://localhost:3000');
var assetURL = 'frag_bunny.mp4';
// Need to be specific for Blink regarding codecs
// ./mp4info frag_bunny.mp4 | grep Codec
var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
var totalSegments = 5;
var segmentLength = 0;
var segmentDuration = 0;
var bytesFetched = 0;
var requestedSegments = [];

for (var i = 0; i < totalSegments; ++i) requestedSegments[i] = false;

var mediaSource = null;
if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
  mediaSource = new MediaSource;
  //console.log(mediaSource.readyState); // closed
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen);
} else {
  console.error('Unsupported MIME type or codec: ', mimeCodec);
}

var sourceBuffer = null;
function sourceOpen (_) {
  sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  getFileLength(assetURL, function (fileLength) {
    console.log((fileLength / 1024 / 1024).toFixed(2), 'MB');
    //totalLength = fileLength;
    segmentLength = Math.round(fileLength / totalSegments);
    //console.log(totalLength, segmentLength);
    //fetchRange(assetURL, 0, segmentLength, appendSegment);
    socket.on('message', appendSegment)
    requestedSegments[0] = true;
    video.addEventListener('timeupdate', checkBuffer);
    video.addEventListener('canplay', function () {
      segmentDuration = video.duration / totalSegments;
      video.play();
    });
    video.addEventListener('seeking', seek);
  });
};

function getFileLength (url, cb) {
  var xhr = new XMLHttpRequest;
  xhr.open('head', url);
  xhr.onload = function () {
      cb(xhr.getResponseHeader('content-length'));
    };
  xhr.send();
};

function fetchRange (url, start, end, cb) {
  var xhr = new XMLHttpRequest;
  xhr.open('get', url);
  xhr.responseType = 'arraybuffer';
  xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);
  xhr.onload = function () {
    console.log('fetched bytes: ', start, end);
    bytesFetched += end - start + 1;
    cb(xhr.response);
  };
  xhr.send();
};

function appendSegment (chunk) {
  sourceBuffer.appendBuffer(chunk);
};

function checkBuffer (_) {
  var currentSegment = getCurrentSegment();
  if (currentSegment === totalSegments && haveAllSegments()) {
    console.log('last segment', mediaSource.readyState);
    mediaSource.endOfStream();
    video.removeEventListener('timeupdate', checkBuffer);
  } else if (shouldFetchNextSegment(currentSegment)) {
    requestedSegments[currentSegment] = true;
    console.log('time to fetch next chunk', video.currentTime);
    fetchRange(assetURL, bytesFetched, bytesFetched + segmentLength, appendSegment);
  }
  //console.log(video.currentTime, currentSegment, segmentDuration);
};

function seek (e) {
  console.log(e);
  if (mediaSource.readyState === 'open') {
    sourceBuffer.abort();
    console.log(mediaSource.readyState);
  } else {
    console.log('seek but not open?');
    console.log(mediaSource.readyState);
  }
};

function getCurrentSegment () {
  return ((video.currentTime / segmentDuration) | 0) + 1;
};

function haveAllSegments () {
  return requestedSegments.every(function (val) { return !!val; });
};

function shouldFetchNextSegment (currentSegment) {
  return video.currentTime > segmentDuration * currentSegment * 0.8 &&
    !requestedSegments[currentSegment];
};
}