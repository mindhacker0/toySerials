//数据库初始化
const createTable = Symbol.for("CREATE_TABLE");
const initTable = Symbol.for("INIT_TABLE");
const _request = (request, success) => {
  return new Promise((resolve, reject) => {
    request.onsuccess = (e) => {
      !success ? resolve(e.target.result) : success(e.target.result, resolve)
    }
    request.onerror = (e) => {
      console.error(e.target.error);
      reject(e.target.error, e.target.result)
    }
  })
}
const DBCOLLECT = new Map;
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
    const {
      version = 1, DBName, tableList
    } = configs;
    this.version = version;
    this.db = null;
    this.DBName = DBName;
    this.tableList = tableList || [];
    this.tableMap = new Map();
  }
  openDB() { //打开数据库，如果没有将会新建
      let vm = this;
      return new Promise((resolve, reject) => {
        window.indexedDB.databases().then((res) => { //获取浏览器旧的数据库,需谷歌7.1以上
          resolve(res);
        });
      }).then((data) => {
        return new Promise((resolve, reject) => {
          let innerBase = data.filter(v => (v.name === vm.DBName));
          let oldBase = DBCOLLECT.get(vm.DBName);
          if (oldBase) { //如果缓存有此数据库
            if (vm.tableList.length !== 0) { //有新的表加入，将会升级数据库
              vm.version = oldBase.version + 1;
            } else {
              vm.db = oldBase.DB;
              vm.version = oldBase.version;
              resolve(vm); //如果不需要升级将直接赋值返回
            }
          } else {
            if (innerBase.length) { //浏览器有旧的数据库
              vm.version = innerBase[0].version + 1;
            }
          }
          // 打开数据库    open有两个参数：name：数据库名  version：版本
          let IDBRequest = window.indexedDB.open(vm.DBName, vm.version);
          IDBRequest.onerror = function (event) {
            console.error('open dataBase failed!', event);
            reject();
          };
          IDBRequest.onsuccess = function (event) {
            vm.db = IDBRequest.result;
            resolve(vm);
          };
          IDBRequest.onupgradeneeded = function (event) {
            vm.db = event.target.result;
            vm[initTable]();
            DBCOLLECT.set(vm.DBName, {
              version: vm.version,
              DB: event.target.result
            });
            console.log("onupgradeneeded", vm);
          };
          IDBRequest.onblocked = function (event) { //如果上次没有关闭，将导致打开失败
            console.error('previous idb link did not close');
            reject(event.target.result);
          }
        });
      })
    }
    [initTable]() { //初始化表
      if (this.tableList.length === 0) return;
      for (var table of this.tableList) {
        const {
          tableName,
          PrimeKey,
          indexKey
        } = table;
        this[createTable](tableName, PrimeKey,indexKey);
      }
    }
    [createTable](tableName, PrimeKey,indexKey) { //创建数据表
      let table = null;
      if (!this.db) throw new ReferenceError("database is not create or it is not ready yet");
      if (!this.db.objectStoreNames.contains(tableName)) { //数据库没有这张表，就创建
        console.log("not exits")
        table = this.db.createObjectStore(tableName, PrimeKey ? {
          keyPath: PrimeKey
        } : {
          autoIncrement: true
        });
        table.createIndex(indexKey, indexKey, {
          unique: false
        });
        this.tableMap.set(tableName, table);
      } else {

      }
      return table;
    }
  createIndex(tableName, indexName, indexKey, unique) { //创建索引
    let table = this.tableMap.get(tableName);
    if (!table) return;
    table.createIndex(indexName, indexKey, {
      unique: unique
    });
  }
  add(tableName, data) { //添加数据
    let transaction = this.db.transaction([tableName], "readwrite");
    let store = transaction.objectStore(tableName);
    let arr = data instanceof Array ? data : [data];
    return Promise.all(arr.map(item => _request(store.add(item))));
  }
  async read(tableName, key) { //根据主键或下标获取记录，若key不传，读取所有
    let transaction = this.db.transaction([tableName], "readonly");
    let store = transaction.objectStore(tableName);
    console.log("total", await _request(store.count()));
    let res;
    if (key) { //获取数据
      res = await _request(store.get(key));
    } else { //根据游标便历数据
      res = await _request(store.getAll());
    }
    return res;
  }
  clearTable(tableName) { //删除表中的所有数据
    let transaction = this.db.transaction([tableName], "readwrite");
    let store = transaction.objectStore(tableName);
    return _request(store.clear());
  }
}
export default IDB;