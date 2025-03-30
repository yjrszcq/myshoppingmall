// 封装购物车相关接口
import request from '@/utils/http'

// 加入购物车
export const addItemToCartAPI = ({ productId, quantity }) => {
  return request({
    url: '/api/cart/items',
    method: 'POST',
    data: {
    productId,
    quantity
    }
  })
}

// 获取购物车列表
export const getCartContentsAPI = () => {
  return request({
    url: '/api/cart',
    method: 'GET',
  })
}

// 删除购物车
export const deleteCartItemAPI = (itemId) => {
  return request({
    url: '/api/cart/items/{itemId}',
    method: 'DELETE',
    data: {
      itemId
      }
  })
}

//修改购物车商品数量
export const updateCartItemQuantityAPI = ({ itemId,quantity }) => {
  return request({
    url: '/api/cart/items/{itemId}',
    method: 'PUT',
    data: {
      quantity,
      itemId
    }
  })
}