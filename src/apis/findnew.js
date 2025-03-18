import httpInstance from "@/utils/http.js";

/**
 * @description: 获取商品
 * @param {*}
 * @return {*}
 */
export const findNewAPI = () => {
    return httpInstance({
        url:'/home/new'//测试用
    })
}