import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import router from './Router.js'
import App from './App.vue'
import { callRPC } from './utils.js'
import { Tooltip } from "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './css/yaoj.css'

import messages from "./i18n"

const i18n = createI18n({
    locale: 'zh',
    fallbackLocale: 'en',
    messages: messages,
})
const app = createApp(App)

// custom tooltip directive
// usage: v-tooltip:bottom/top/left/right
app.directive('tooltip', {
    mounted(el, binding) {
        // console.log(binding)
        el.setAttribute("data-bs-toggle", "tooltip")
        el.setAttribute("data-bs-placement", binding.arg || "bottom")
        el.__tooltip = new Tooltip(el, { customClass: "limitation-icon" })
        // console.log(el, tooltip)
    },
    beforeUnmount(el) {
        el.__tooltip.dispose()
    },
})

app.mixin({
    watch: {
        '$route': function (nv, ov) {
            if (this == undefined) return
            if (this.fetchdata != undefined && nv.name == this.$options.name) {
                console.log("refetch", nv.fullPath, ov.fullPath)
                this.fetchdata(nv);
            }
        }
    },
    created() {
        if (this.fetchdata != undefined) {
            console.log("on created fetch", this.$options.name)
            this.fetchdata(this.$route);
        }
    }
})

callRPC("Init", {}, function (response) {
    app.config.globalProperties.$user = response.data
    app.config.globalProperties.$time = response.data.server_time
    app.config.globalProperties.$temp_store = {}
    app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("ion")
    app.config.compilerOptions.jsx = "preserve"
    app.use(router)
    app.use(i18n)
    app.mount("#app")
}, function (response) {
    alert(response.statusMessage + "\n" + response.data._error.message)
})