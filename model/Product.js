const Dirpath = require('../util/path')
const path = require('path')
const fs = require('fs')


exports.Products = class Products {
    constructor(obj) {
        this.id = obj.id;
        this.brand = obj.brand;
        this.description = obj.description;
        this.price = obj.price
        this.type = obj.type
    }

    save() {
        let p = path.join(Dirpath, 'data', 'products.json')
        fs.readFile(p, (err, data) => {
            let store = []
            if (!err) {
                store = JSON.parse(data)
            }
            store.push(this)
            fs.writeFile(p, JSON.stringify(store), (err) => { if (err) console.log(err) })
        })
    }
    static fetchById(id, cb) {
        let p = path.join(Dirpath, 'data', 'products.json')
        fs.readFile(p, (err, data) => {
            if (err) {
                cb([])
            }
            cb(JSON.parse(data).find(e => e.id === id))
        })
    }
    static fetchAll(cb) {
        let p = path.join(Dirpath, 'data', 'products.json')
        fs.readFile(p, (err, data) => {
            if (err) {
                cb([])
            }
            cb(JSON.parse(data))
        })
    }

    static fetchByCategory(type, cb) {
        let p = path.join(Dirpath, 'data', 'products.json')
        fs.readFile(p, (err, data) => {
            if (err) {
                cb([])
            }
            cb(JSON.parse(data).filter(product => product.type === type || product.brand === type))
        })
    }

    static fetchBulk(array, cb) {
        let p = path.join(Dirpath, 'data', 'products.json')
        fs.readFile(p, (err, data) => {
            if (err) {
                cb([])
            }
            cb(array.map(item => {
                return {
                    qty: item.qty,
                    ...JSON.parse(data).find(product => product.id === item.id)
                }
            }))
        })
    }

    static updateProduct(obj) {
        let p = path.join(Dirpath, 'data', 'products.json')
        fs.readFile(p, (err, data) => {
            let store = []
            if (!err) {
                store = JSON.parse(data)
            }
            let findData = store.find((product) => product.id == obj.id)
            findData.brand = obj.brand;
            findData.description = obj.description;
            findData.price = obj.price
            findData.type = obj.type
            fs.writeFile(p, JSON.stringify(store, null, 2), (err) => { if (err) console.log(err) })
        })
    }

    static deleteProduct(id) {
        let p = path.join(Dirpath, 'data', 'products.json')
        fs.readFile(p, (err, data) => {
            let store = []
            if (!err) {
                store = JSON.parse(data)
            }
            let findData = store.filter((product) => product.id != id)

            fs.writeFile(p, JSON.stringify(findData, null, 2), (err) => { if (err) console.log(err) })
        })
    }
}