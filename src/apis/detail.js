import request from '@/utils/http.js'

export const getDetails = (id)=>{
    return request({
        url: "/goods", //测试用，用完记得改url和参数（这个是真的用到了，一定要改）
        params: {
            id
        }
    })
}