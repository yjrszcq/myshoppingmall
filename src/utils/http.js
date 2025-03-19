//axios封装
import axios from 'axios'
import {ElMessage} from "element-plus";

const httpInstance = axios.create({
    baseURL: 'https://m1.apifoxmock.com/m1/6033373-5723167-default', //小兔鲜仅供测试使用，待后端小组补充后请修改！
    timeout: 5000,
})

//axios请求式拦截器
httpInstance.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))

//axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data,e =>{
    //统一警告
    ElMessage({
        type:'warning',
        message:e.response.message,
    })
    return Promise.reject(e)
})

export default httpInstance
