// api/user.js
import request from '@/utils/http.js'

// 注册用户接口
export const registerUser = (data) => {
    return request({
        url: '/api/auth/register',
        method: 'POST',
        data
    })
}

export const loginapi = ({account,password}) => {
    return request({
        url: '/api/auth/login',  //记得改
        method: 'POST',
        data: {
            account,
            password
        }
    })
}
