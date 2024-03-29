import { reactive } from 'vue'

type Store = Record<string | symbol, any>

const initStore: Store = {
    // test: 'hello',
    user: {
        is_admin: false,
        server_time: "2022-08-01T23:58:35.037268399+08:00",
        user_group: 1,
        user_id: 0,
        user_name: ""
    }
}

// 全局 store 
const store = new Proxy({
    debug: false,
    state: reactive(initStore),
}, {
    get(target, prop) {
        if (target.debug) {
            console.log('get store', prop)
        }
        return target.state[prop]
    },
    set(target, prop, newVal) {
        if (target.debug) {
            console.log('update store', prop, newVal)
        }
        target.state[prop] = newVal
        return true
    }
}) as any as Store

export default store;