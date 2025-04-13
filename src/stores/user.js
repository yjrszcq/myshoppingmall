// 管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginapi } from '@/apis/login.js'

export const useUserstore = defineStore('user', () => {
    // 1. 定义管理用户数据的state
    const userInfo = ref({})
    // 2. 定义获取接口数据的action函数

    const getUserInfo = async ({ username, password }) => {
        const res = await loginapi({ username, password })
        console.log('mock返回数据', res)
        userInfo.value = res
       
    }
    // 3. 以对象的格式把state和action return

    //退出登录
    const clearUserInfo = () => {
        userInfo.value = {}
    }

    return {
        getUserInfo,
        userInfo,
        clearUserInfo,
    }
}, {
    persist: true,
})