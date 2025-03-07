//axios封装
import axios from 'axios'

const httpInstance = axios.create({
    baseURL: 'https://pcapi-xiaotuxian-front-devtest.itheima.net', //小兔鲜仅供测试使用，待后端小组补充后请修改！
    timeout: 5000,
})

//axios请求式拦截器
httpInstance.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))

//axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data,e =>{
    return Promise.reject(e)
})

export default httpInstance
