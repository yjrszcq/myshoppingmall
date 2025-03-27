// 会员中心所用接口
import request from '@/utils/http'

//查询我的订单
export const viewsOrders = (params) => {
    return request({
        url: '/api/orders',
        params
    })
}