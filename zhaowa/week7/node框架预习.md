# Node 框架介绍

## express / koa

### 什么是洋葱模型
```js
const Koa = require('koa');
const app = new Koa();

// 中间件1
app.use((ctx, next) => {
    console.log(1);
    next();
    console.log(2);
});

// 中间件 2 
app.use((ctx, next) => {
    console.log(3);
    next();
    console.log(4);
});

app.listen(8000, '0.0.0.0', () => {
    console.log(`Server is starting`);
});

```

### koa 框架原理解析

```js
// ⼊⼝⽅法
listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
}
callback() {
		// 处理中间件，等一下看compose和this.middleware
    const fn = compose(this.middleware);
		// 错误处理，listenerCount是EventEmitter类的函数
    if (!this.listenerCount('error')) this.on('error', this.onerror);
		// 传递给createServer的就是下面这个函数
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
}

handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    // 这里等到response再看
    const handleResponse = () => respond(ctx);
    // 给请求结束增加一个回调，这个onerror是ctx的onerror，不是app的onerror
    onFinished(res, onerror);
    // 等一下看这个
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
}

// 添加中间件⽅法
use(fn) {
    ...
    this.middleware.push(fn);
    return this;
}

createContext(req, res) {
	// 每次请求，ctx都是一个新的对象
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    // 原生的req和res
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    // koa生成的request和response
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
}

```



### koa 常用中间件
- koa2-cors
- koa-static
- koa-bodyparser

## BFF 

什么是 BFF ？

BFF 一般的作用有哪些 ？

## Sequelize

Sequelize 是一个基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。

### 安装 Sequelize
```shell
npm i sequelize
# 使用 npm
npm i pg pg-hstore # PostgreSQL
npm i mysql2 # MySQL
npm i mariadb # MariaDB
npm i sqlite3 # SQLite
npm i tedious # Microsoft SQL Server
npm i ibm_db # DB2
```

### 一些常用命令
根据项目下的 .sequelizerc 文件，执行

#### 执行 sequelize init 响应操作
-  `npx sequelize init:config`
生成 config.json 的文件；

- `npx sequelize init:migrations`
生成 migrations 文件夹；

#### 执行 sequlize migration 
- `npx sequelize migration:generate --name=init-users`
初始化数据表；

#### 对数据操作
- `npx sequelize db:migrate`
升级数据库，将表推送到数据库中；

- `npx sequelize db:migrate:undo:all`
回退到初始状态；





