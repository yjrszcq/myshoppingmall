
import request from '@/utils/http.js'

// 查看商品
export const getproductsList = (data) => {
    return request({
        url: '/api/seller/products',
        method: 'get',
        data
    })
}
//修改商品信息
export const reviseProducts = (data,productId) => {
    return request({
        url: `/api/seller/products/${productId}`,
        method: 'put',
        data
    })
}

//删除商品
export const deleteProducts = (productId) => {
    return request({
        url: `/api/seller/products/${productId}`,
        method: 'delete',
        
    })
}

//上架商品
export const putawayProducts = (data) => {
    return request({
        url: `/api/seller/products`,
        method: 'post',
        data
    })
}

//查看订单
export const viewOrders = (data) => {
    return request({
        url: `/api/seller/orders`,
        method: 'get',
        data
    })
}

//管理订单
export const manageOrders = (orderId) => {
    return request({
        url: `/api/seller/orders/${orderId}`,
        method: 'put',
    })
}

//添加商品
export const addProducts = (data) => {
    return request({
        url: `/api/seller/products`,
        method: 'post',
        data
    })
}