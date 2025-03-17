import httpInstance from "@/utils/http.js";

export function getProducts () {
    return httpInstance({
        url: "/home/category/head" //仅为测试使用，用完记得改，改了请在后面加上已改字样!!!
    })
}