
import request from '@/utils/http.js'

// 查看商品
export const getproductsList = () => {
    return request({
        url: '/api/seller/products',
        method: 'get'
    })
}
//修改商品信息
export const reviseProducts = (productId) => {
    return request({
        url: `/api/seller/products/${productId}`,
        method: 'put',
        
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
export const putawayProducts = () => {
    return request({
        url: `/api/seller/products`,
        method: 'post',
    })
}

//查看订单
export const viewOrders = () => {
    return request({
        url: `/api/seller/orders`,
        method: 'get',
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
export const addProducts = () => {
    return request({
        url: `/api/seller/products`,
        method: 'post',
    })
}