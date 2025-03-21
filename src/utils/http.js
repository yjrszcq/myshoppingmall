//axios封装
import axios from 'axios'
import {ElMessage} from "element-plus";
import {useUserstore} from "@/stores/user.js";

const httpInstance = axios.create({
    baseURL: 'https://m1.apifoxmock.com/m1/6033373-5723167-default', //仅供测试使用，待后端小组补充后请修改！
    timeout: 5000,
})

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    // 1. 从pinia获取token数据
    const userStore = useUserstore()
    // 2. 按照后端的要求拼接token数据
    const token = userStore.userInfo.sessionId
    if (token) {
        config.headers['Session_ID'] = `${token}`
    }
    return config
}, e => Promise.reject(e))

//axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data,e =>{
    //统一警告
    ElMessage({
        type:'warning',
        message:e.message,
    })
    return Promise.reject(e)
})

export default httpInstance
