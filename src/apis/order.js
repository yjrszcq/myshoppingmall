// 订单相关接口
import request from '@/utils/http'

/**
 * 提交订单
 * @param {string} cartId - 购物车ID
 * @returns {Promise<Object>} - 返回包含orderId的对象
 */
export const submitOrderAPI = (cartId) => {
    return request({
        url: `/api/orders/${cartId}`,
        method: 'POST'
    });
}; 