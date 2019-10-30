/* 封装通用的请求axios */

// 引入库
import qs from "qs"
import axios from "axios"
import { Message } from "element-ui"
import local from "@/utils/local"
// 设置默认请求地址
axios.defaults.baseURL = "http://127.0.0.1:5000"

// 请求拦截器
axios.interceptors.request.use(config => {
    // 在请求发送出去之前 带上一些东西 config是请求的配置对象， 如果直接返回 就等于什么都不带
    
     // 所有的axios请求，在请求发送出去之前 带上token
     let token = local.get('token')
     config.headers.Authorization = 'Bearer ' + token
 
    return config;
}, error => {
    return Promise.reject(error); // 请求错误处理
})

// 响应拦截器
axios.interceptors.response.use(response => {
    // response就是后端响应回来的东西 如果你想做什么统一的处理 可以在这里写
    let { code, msg } = response.data;
    // 操作成功的提示
    if (code === 0) {
        Message({
            type: "success",
            message: msg,
            duration: 1000
        })
        // 操作失败的提示
    } else if (code === 1) {
        Message.error(msg);
        duration: 1000
    }
    return response;
}, error => {
    return Promise.reject(error); // 响应错误处理
});

// 导出两个方法
export default {
    get(url, params = {}) {

        return new Promise((resolve, reject) => {

            axios.get(url, { params })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)

                })
        })
    },
    
    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}