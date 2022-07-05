import { createApp } from 'vue'
import router from './Router.js'
import App from './App.vue'
import { callRPC } from './utils.js'

callRPC("Init", {}, function(response) {
    const app = createApp(App)
    app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
    app.config.globalProperties.$user = response.data
    app.config.globalProperties.$time = response.data.server_time
    app.config.globalProperties.$temp_store = {}
    app.use(router)
    app.mount("#app")
}, function(response) {
    alert(response.statusMessage + "\n" + response.data._error.message)
})