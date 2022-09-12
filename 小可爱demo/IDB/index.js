//数据库初始化
const createTable = Symbol.for("CREATE_TABLE");
const initTable = Symbol.for("INIT_TABLE");
const _request = (request, success) => {
    return new Promise((resolve, reject) => {
        request.onsuccess = (e) => {
            console.log(e);
            !success ? resolve(e.target.result) : success(e.target.result, resolve)
        }
        request.onerror = (e) => {
            console.error(e.target.error);
            reject(e.target.error, e.target.result)
        }
    })
}
// 构造函数配置参数
// version:数据库版本，通常不用传
// DBName:数据库名字
// tableList:数据库表数组 {tableName,PrimeKey} => {数据库表名，主键名} 主键名不传将以下标为主键
// var idb = new IDB({
//     DBName:"test",
//     version:1,
//     tableList:[{
//         tableName:"person"，
//     }]
// });
class IDB {
    constructor(configs) {
        if (!window.indexedDB) throw new ReferenceError("indexedDB is not exist");
        const { version = 1, DBName, tableList } = configs;
        this.version = version;
        this.db = null;
        this.DBName = DBName;
        this.tableList = tableList || [];
        this.tableMap = new Map();
    }
    static DBCOLLECT = new Map();
    static DROPALLDB() {//清除所有的数据库

    }
    openDB() {//打开数据库，如果没有将会新建
        let vm = this;
        return new Promise((resolve, reject) => {
            window.indexedDB.databases().then((res) => {//获取浏览器旧的数据库
                resolve(res);
            });
        }).then((data) => {
            return new Promise((resolve, reject) => {
                let innerBase = data.filter(v => (v.name === vm.DBName));
                let oldBase = IDB.DBCOLLECT.get(vm.DBName);
                if (oldBase) {//如果缓存有此数据库
                    if (vm.tableList.length !== 0) {//有新的表加入，将会升级数据库
                        vm.version = oldBase.version + 1;
                    } else {
                        vm.db = oldBase.DB;
                        vm.version = oldBase.version;
                        resolve(vm);//如果不需要升级将直接赋值返回
                    }
                } else {
                    if (innerBase.length) {//浏览器有旧的数据库
                        vm.version = innerBase[0].version + 1;
                    }
                }
                let IDBRequest = window.indexedDB.open(vm.DBName,vm.version);
                IDBRequest.onerror = function (event) {
                    console.error('open dataBase failed!', event);
                    reject();
                };
                IDBRequest.onsuccess = function (event) {
                    console.log('indexedDB create success', event);
                    vm.db = IDBRequest.result;
                    resolve(vm);
                };
                IDBRequest.onupgradeneeded = function (event) {
                    console.log('upgrade,indexedDB create success');
                    vm.db = event.target.result;
                    vm[initTable]();
                    IDB.DBCOLLECT.set(vm.DBName, {
                        version: vm.version,
                        DB: event.target.result
                    });
                };
            });
        })
    }
    [initTable]() {//初始化表
        if (this.tableList.length === 0) return;
        for (var table of this.tableList) {
            const { tableName, PrimeKey } = table;
            this[createTable](tableName, PrimeKey);
        }
    }
    [createTable](tableName, PrimeKey) {//创建数据表
        let table = null;
        if (!this.db) throw new ReferenceError("database is not create or it is not ready yet");
        if (!this.db.objectStoreNames.contains('person')) {//数据库没有这张表，就创建
            table = this.db.createObjectStore(tableName, PrimeKey ? { keyPath: PrimeKey } : { autoIncrement: true });
            this.tableMap.set(tableName, table);
            return table;
        }
        return this.tableMap.get(tableName);
    }
    createIndex(tableName, indexName, indexKey, unique) {//创建索引
        let table = this.tableMap.get(tableName);
        if (!table) throw new ReferenceError(`table ${tableName} is not create.`);
        table.createIndex(indexName, indexKey, { unique: unique });
    }
    add(tableName, data) {//添加数据
        let transaction = this.db.transaction([tableName],"readwrite");
        let store = transaction.objectStore(tableName);
        let arr = data instanceof Array ? data : [data];
        arr.forEach(item => _request(store.add(item)));
    }
    async read(tableName,key){//根据主键或下标获取记录，若不传，读取所有
        let transaction = this.db.transaction([tableName],"readonly");
        let store = transaction.objectStore(tableName);
        let res;
        if(key){//获取数据
            res = await _request(store.get(key));
        }else{//根据游标便历数据
            res = await _request(store.getAll());
        }
        return res;
    }
    dropTable(tableName){//删除表中的所有数据
        let transaction = this.db.transaction([tableName],"readwrite");
        let store = transaction.objectStore(tableName);
        return _request(store.clear());
    }

}
export default IDB;