const http = require("http");
http.createServer((request,response)=>{
    let body  = [];
    request.on("error",(err)=>{
        console.error(err);
    }).on("data",(chunk)=>{
        body.push(chunk);
    }).on("end",()=>{
        body = Buffer.concat(body).toString();
        console.log("recive params:\n",body);
        response.writeHead(200,{"Content-Type":"text/html"});
        response.end(`<!DOCTYPE html><html lang="zh-CN"><head><title>主页</title><meta charset="UTF-8"></head><body><div id="app">mindhacker is niupi!</div></body></html>`);
    });
}).listen(8088);
console.log("server started");