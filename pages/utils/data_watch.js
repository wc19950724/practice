// 订阅、发布模式
let Dep = {
    clientList: [], // 存储订阅器函数
    listen: function (key, cb) { // 订阅器
        (this.clientList[key] || (this.clientList[key] = [])).push(cb)
    },
    trigger: function () { // 发布器
        const key = Array.prototype.shift.call(arguments)
        const fns = this.clientList[key]
        if (!fns || !fns.length) return false
        for (let i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments)
        }
    }
}
const data_watch_v2 = function ({ obj, key, tag, selector }) {
    let [value, el] = ['', document.querySelector(selector)]
    if (!el.innerText) el.innerText = obj[key] || 0
    Object.defineProperty(obj, key, {
        get: function () {
            console.log('---取值 v2---')
            return value
        },
        set: function (val) {
            console.log('设置值')
            value = val
            Dep.trigger(tag, value)
        }
    })
    Dep.listen(tag, text => {
        el.innerText = text
    })
}

const data_watch_v3 = function ({ obj, tag, selector }) {
    let el = document.querySelector(selector)
    Dep.listen(tag, text => {
        el.innerText = text
    })
    return new Proxy(obj, {
        get: function (target, property, receiver) {
            console.log('---取值 v3---')
            return target[property]
        },
        set: function (target, property, value, receiver) {
            console.log('---设置值 v3---')
            Dep.trigger(tag, value)
            return Reflect.set(target, property, value, receiver)
        }
    })
}