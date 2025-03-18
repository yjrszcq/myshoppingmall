import httpInstance from "@/utils/http.js";

export function getCategories() {
    return httpInstance({
        url: 'home/category/head'//测试用
    })
}