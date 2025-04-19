//axios封装
import axios from 'axios'
import {ElMessage} from "element-plus";
import {useUserstore} from "@/stores/user.js";
import {config} from "@/utils/config.js"

const httpInstance = axios.create({

    baseURL: config.http.baseURL, // 使用配置中的 baseURL
    timeout: config.http.timeout  // 使用配置中的 timeout
});

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    // 1. 从pinia获取token数据
    const userStore = useUserstore()
    // 2. 按照后端的要求拼接token
    const token = userStore.userInfo.sessionId
    if (token) {
        config.headers['Session-Id'] = `${token}`
    }
    return config
}, e => Promise.reject(e))

//axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data,e =>{
    //在控制台打印警告
    console.log(e.message,"error")
    return Promise.reject(e)
})

export default httpInstance
