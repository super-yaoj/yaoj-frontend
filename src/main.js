import { createApp } from 'vue'
import router from './Router.js'
import App from './App.vue'
import { callRPC } from './utils.js'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './css/yaoj.css'

const app = createApp(App)
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
app.config.globalProperties.$user = { user_id: -1, user_name: "", user_group: 2 }
app.config.globalProperties.$time = 0
app.config.globalProperties.$temp_store = {}
app.config.globalProperties.$monaco = null
app.use(router)
app.mount("#app")

callRPC("Init", {}, function(response) {
    app.config.globalProperties.$user = response.data
    app.config.globalProperties.$time = response.data.server_time
}, function(response) {
    alert(response.statusMessage + "\n" + response.data._error.message)
})
