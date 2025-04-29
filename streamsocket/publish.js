let http = require("http");
let fs = require("fs");
let file = fs.createReadStream("./package.json");
file.on("data",(chunk)=>{
    console.log(chunk.toString());
});
file.on("end",(chunk)=>{
   console.log("read finished");
});
let request = http.request({
    hostname:"127.0.0.1",
    port:8082,
},(response)=>{
    //console.log("res",response);
});
//request.end();