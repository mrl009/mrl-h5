let db
export const Indexeddb = function() {
    return {
        // 连接数据库
        openDB: function(fn) {
            let req = indexedDB.open('lotteryDB', 1)
            req.onsuccess = function(prgdip) {
                db = prgdip.target.result
                // 数据库连接成功后渲染表格
                console.log('IndexDB连接成功')
                fn && fn()
            }
            req.onerror = function() {
                console.log('连接数据库失败')
            }
            req.onupgradeneeded = function(wjc) {
                // _this.db = wjc.target.result
                db = wjc.target.result

                // 如果不存在Users对象仓库则创建
                if(!db.objectStoreNames.contains('Lottery')) {
                    let store = db.createObjectStore('Lottery', {keyPath: 'key', autoIncrement: false})
                    console.log(store)
                }
            }
        },
        /**
         * 保存数据
         * @param {Object} data 要保存到数据库的数据对象
         */
        saveData: function(data, func) {
            let tx = db.transaction('Lottery', 'readwrite')
            let store = tx.objectStore('Lottery')
            let req = store.put(data)
            req.onsuccess = function(result) {
                if(func) {
                    func()
                }
                console.log('成功保存id为' + result + '的数据')
            }
        },
        /**
         * 查找数据
         * @param {int} id 要获取的数据主键
         */
        getItem: function(key) {
            return new Promise((resolve, reject) => {
                if(!db) {
                    this.openDB(() => {
                        this.getItem(key)
                    })
                    return
                }
                let tx = db.transaction('Lottery', 'readwrite')
                let store = tx.objectStore('Lottery')
                let req = store.get(key)
                req.onsuccess = function() {
                    if(req.result) {
                        resolve(JSON.parse(req.result.data))
                    }else{
                        resolve(null)
                    }
                }
                req.onerror = function() {
                    reject(null)
                }
            })
        },
        getData: function(key, fun) {
            if(!db) {
                this.openDB(() => {
                    this.getData(key, fun)
                })
                return
            }
            let tx = db.transaction('Lottery', 'readwrite')
            let store = tx.objectStore('Lottery')
            let req = store.get(key)
            req.onsuccess = function() {
                if(req.result) {
                    fun(req.result.data)
                }else{
                    fun(null)
                }
            }
            req.onerror=function() {
                fun(null)
            }
        },
        /**
         * 删除单条数据
         * @param {int} id 要删除的数据主键
         */
        deleteOneData: function(id, func) {
            var tx = db.transaction('Lottery', 'readwrite')
            var store = tx.objectStore('Lottery')
            var req = store.delete(id)
            req.onsuccess = function() {
                // 删除数据成功之后重新渲染表格
                if(func) {
                    func()
                }
            }
        }
    }
}

// export const
