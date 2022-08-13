import axios from 'axios'
import { BASE_URL } from "@/config"
import { call } from './call'

export function upload(name: string, method: string, formdata: FormData, success, failed) {
    axios({
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        url: BASE_URL + name,
        method: method,
        data: formdata,
    }).then(success, failed)
}

export function callAPI(name: string, method: string, data, success, failed = (...args) => { }) {
    // data["_token"] = token
    method = method.toUpperCase()
    var requestConfig: any = {
        withCredentials: true,
        url: BASE_URL + name,
        method: method
    }
    if (method == 'GET' || method == "DELETE") {
        requestConfig.params = data
    } else {
        requestConfig.data = data // qs.stringify(data)
    }
    console.log(requestConfig)
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

export function callRPC(name: string, data, success, failed = (...args) => { }) {
    // data["_token"] = token
    axios({
        withCredentials: true,
        url: BASE_URL + name,
        method: "POST",
        data: data //qs.stringify(data)
    }).then(success, function (message) {
        var response = message.response, flag = response.data == undefined || response.data._error == undefined
        if (!flag && response.data._error.code == -32600) {
            if (response.status == 401) {
                window.location.replace('#/login')
            } else if (response.status == 403) {
                window.location.replace('#/403Forbidden')
            } else if (response.status == 404) {
                window.location.replace('#/404NotFound')
            } else if (response.status != 400) {
                alert(response.statusMessage + "\n" + response.data._error.message)
            } else failed(response)
        } else {
            alert(response.statusText + (flag ? "" : "\n" + response.data._error.message))
        }
    })
}