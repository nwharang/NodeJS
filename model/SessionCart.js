const Dirpath = require('../util/path')
const path = require('path')
const fs = require('fs')

const createOrUpdateData = (store, id, input) => {
    let cartArray = store.find(cart => cart.id === id)
    let item = null;
    if (cartArray)
        item = cartArray.cart.find(item => item.id == input)
    // item exist in cart
    if (item && cartArray) {
        item.qty++
    }

    // item not exist in cart yet
    if (!item && cartArray) {
        cartArray.cart.push({ id: input, qty: 1 })
    }
    return store
}

const updateData = (store, id, input, method) => {
    let cartArray = store.find(cart => cart.id === id)
    let item = null;
    if (cartArray) item = cartArray.cart.find(item => item.id == input)
    if (item)
        switch (method) {
            case "add":
                item.qty++
                break;
            case "reduce":
                item.qty--
                cartArray.cart = cartArray.cart.filter(item => item.qty > 0)
                break;
        }
    return store
}

exports.SessionCart = class SessionCart {
    cart = []
    constructor(id, maxAgeTimer) {
        this.id = id
        this.expire = maxAgeTimer + Date.now()
    }


    save() {
        let p = path.join(Dirpath, 'data', 'session.json')
        fs.readFile(p, (err, data) => {
            let store = []
            if (!err) {
                store = JSON.parse(data)
            }
            store.push(this)
            fs.writeFile(p, JSON.stringify(store, null, 2), (err) => { if (err) console.log(err) })
        })
    }

    static fetchBySessionId(id, cb) {
        let p = path.join(Dirpath, 'data', 'session.json')
        fs.readFile(p, (err, data) => {
            if (err) {
                return cb([]);
            }
            return cb(JSON.parse(data).find(e => e.id === id))
        })
    }

    static addToCart(input = null, id, cb) {
        let p = path.join(Dirpath, 'data', 'session.json')
        fs.readFile(p, (err, data) => {
            let store = []
            if (!err) {
                store = createOrUpdateData(JSON.parse(data), id, input)
            }
            fs.writeFile(p, JSON.stringify(store, null, 2), (err) => { if (err) console.log(err) })
            return cb({
                error: false,
                message: "success"
            })
        })
    }

    static updateCart(input = null, method = "add", id, cb) {
        let p = path.join(Dirpath, 'data', 'session.json')
        fs.readFile(p, (err, data) => {
            let store = []
            if (!err) {
                store = updateData(JSON.parse(data), id, input, method)
            }
            fs.writeFile(p, JSON.stringify(store, null, 2), (err) => { if (err) console.log(err) })
            return cb(store.find(e => e.id === id))
        })
    }

    static sessionCleanup() {
        let p = path.join(Dirpath, 'data', 'session.json')
        fs.readFile(p, (err, data) => {
            let store = []
            if (!err) {
                store = JSON.parse(data)
            }
            store = store.filter(cart => cart.expire > Date.now())
            fs.writeFile(p, JSON.stringify(store, null, 2), (err) => { if (err) console.log(err) })
        })
    }
}