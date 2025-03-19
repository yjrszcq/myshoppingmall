//管理用户数据相关
import {ref} from 'vue';
import {defineStore} from "pinia";
import {loginapi} from "@/apis/login.js";

export const useUserstore =  defineStore('user',()=>{
    const userInfo = ref({})
    const getUserInfo = async ({account,password}) =>{
    const res = await loginapi({account,password})
        userInfo.value = res
    }
    return {
        userInfo,
        getUserInfo
    }
})