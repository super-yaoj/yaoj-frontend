import { BASE_URL } from "@/config"
import axios from "axios"

// originally callAPI
function fetchAPI(name, method, data, success, failed) {
    if (!name.startsWith('/')) throw new Error('invalid name: ' + name)

    method = method.toUpperCase()
    var requestConfig = {
        withCredentials: true,
        url: BASE_URL + name.substr(1),
        method: method
    }
    if (method == 'GET' || method == "DELETE") {
        requestConfig.params = data
    } else {
        requestConfig.data = data
    }
    axios(requestConfig).then(success, function (message) {
        var response = message.response, flag = response.data == undefined || response.data._error == undefined
        if (response.status == 401) {
            window.location.replace('#/login')
        } else if (response.status == 403) {
            window.location.replace('#/403Forbidden')
        } else if (response.status == 404) {
            window.location.replace('#/404NotFound')
        } else if (response.status != 400 || flag) {
            alert(response.statusText + "\n" + (flag ? "" : "\n" + response.data._error))
        } else failed(message.response)
    })
}

export function call(path, method, option = {}) {
    const data = { ...option.param, ...option.body }
    return new Promise((res, rej) => {
        fetchAPI(path, method, data, res, rej)
    })
}