// 导入nodejs-websocket模块
const io = require('nodejs-websocket')
// 执行websocket处理连接方法
let connectionList = [];//有多个用户连接，要保存之前的连接
let messageList = [];
io.createServer(connection=>{
	console.log('new connection...');
	//处理客户端发送过来的消息
    connectionList.push(connection);
	connection.on("text",function(data){
		console.log("接收到的客户端消息:",data);
        messageList.push(JSON.parse(data));
        connectionList.forEach((connection)=>{//每个连接都推送消息
            connection.send(JSON.stringify(messageList));
        });
        //监听关闭
        connection.on("close", function (code, reason) {
            console.log("Connection closed")
        })
        //监听异常
        connection.on("error",() => {
            console.log('服务异常关闭...')
        })	
	})
}).listen(8888,()=>{
    console.log("开始监听客户端")
})