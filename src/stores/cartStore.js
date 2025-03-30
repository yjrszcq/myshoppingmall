//封装购物车模块

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserstore } from './user'
import { addItemToCartAPI, getCartContentsAPI, deleteCartItemAPI, updateCartItemQuantityAPI } from '@/apis/cart'
import { ElMessage } from 'element-plus'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserstore()
  const isLogin = computed(() => userStore.userInfo.token)

  //定义cartlist 
  const cartList = ref([])


  const getCart = async () => {
    const res = await getCartContentsAPI();
    cartList.value = res.items
  };


  //定义添加
  const addCart = async (goods) => {
    const { productId, quantity } = goods
    // if (isLogin.value) {
    // 已登录后的逻辑
    await addItemToCartAPI({ productId, quantity })
    const res = await getCartContentsAPI()
    cartList.value = res.items
    // }
    // else {
    //   // 添加购物车操作
    //   const item = cartList.value.find((item) => goods.productId === item.productId)
    //   if (item) {
    //     item.quantity += goods.quantity
    //   }
    //   else {
    //     cartList.value.push(goods)
    //   }
    // }

    ElMessage({
      message: 'Added successfully.',
      type: 'success',
    })
  }

  // 删除购物车
  const delCart = async (productId) => {
    console.log('删除购物车', productId);

    // if (isLogin.value) {
    //调用接口
    await deleteCartItemAPI(productId)
    const res = await getCartContentsAPI()
    cartList.value = res.items

    // }
    // else {
    //   const idx = cartList.value.findIndex((item) => productId === item.productId)
    //   cartList.value.splice(idx, 1)
    //   isAll.value = false;
    // }

    ElMessage({
      message: 'Delete successfully.',
      type: 'success',
    })
  }

  //更新商品数量
  const updateQuantity = async (itemId, quantity) => {
    // if (isLogin.value) {
    // 已登录后的逻辑
    await updateCartItemQuantityAPI(itemId, quantity)
    const res = await getCartContentsAPI()
    // console.log(res);
    cartList.value = res.items
    // } else {
    //   // 未登录的逻辑
    //   const item = cartList.value.find((item) => itemId === item.itemId)
    //   if (item) {
    //     item.quantity = quantity
    //   }
    // }
  }



  //单选功能
  const singleCheck = (productId, selected) => {
    const item = cartList.value.find((item) => item.productId === productId)
    item.selected = selected
  }


  //  总的数量 所有项的count之和
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.quantity, 0))

  //是否全选
  const isAll = computed(() => {
    if (cartList.value.length === 0) {
      return false; // 如果购物车为空，返回 false
    }
    return cartList.value.every((item) => item.selected);
  });

  //全选功能
  const allCheck = (selected) => {
    cartList.value.forEach(item => item.selected = selected)
  }

  //已选择数量
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.quantity, 0))
  //已选择合计
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.quantity * c.price, 0))

  return {
    cartList,
    addCart,
    isAll,
    allCheck,
    singleCheck,
    delCart,
    updateQuantity,
    selectedCount,
    selectedPrice,
    allCount,
    getCart
  }
}, {
  persist: true,
})