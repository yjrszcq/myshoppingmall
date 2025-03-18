import httpInstance from "@/utils/http.js";

export function getBannerApi(){
    return httpInstance({
        url: '/home/banner',//测试用
    })
}