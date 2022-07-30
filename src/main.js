import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import router from './Router.js'
import App from './App.vue'
import { callRPC } from './utils.js'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './css/yaoj.css'

import messages from "./i18n"

const i18n = createI18n({
    locale: 'zh',
    fallbackLocale: 'en',
    messages: messages,
})

callRPC("Init", {}, function(response) {
    const app = createApp(App)
    app.config.globalProperties.$user = response.data
    app.config.globalProperties.$time = response.data.server_time
    app.config.globalProperties.$temp_store = {}
    app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("ion")
    app.config.compilerOptions.jsx = "preserve"
    app.use(router)
    app.use(i18n)
    app.mount("#app")
}, function(response) {
    alert(response.statusMessage + "\n" + response.data._error.message)
})