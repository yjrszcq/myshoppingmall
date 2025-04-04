import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserstore } from './user'
import { addItemToCartAPI, getCartContentsAPI, deleteCartItemAPI, updateCartItemQuantityAPI } from '@/apis/cart'
import { ElMessage } from 'element-plus'

export const useCartStore = defineStore('cart', () => {

  // 初始化 cartList 确保默认值为 []
  const cartList = ref([]);
  const cartId = ref();

  // 获取购物车数据
  const getCart = async () => {
    try {
      const res = await getCartContentsAPI();
      cartList.value = Array.isArray(res.items) ? res.items : [];
      cartId.value = res.cartId;
      console.log(res, "cartitem");
      console.log(cartList,"cartlistinstore");
    } catch (error) {
      console.error("Failed to load cart:", error);
      cartList.value = [];
    }
  };

  // 添加商品到购物车
  const addCart = async (goods) => {
    try {
      const { productId, quantity } = goods;

      // 检查购物车中是否已存在该商品
      const existingItem = cartList.value.find(item => item.productId === productId);

      if (existingItem) {
        // 如果存在，更新数量
        console.log("enter if")
        const newQuantity = existingItem.quantity + quantity;
        console.log(existingItem.itemId,newQuantity,"usage")
        await updateCartItemQuantityAPI({ itemId: existingItem.itemId, quantity: newQuantity });
        ElMessage.success('Quantity updated successfully.');
      } else {
        // 如果不存在，添加新商品
        console.log("else")
        await addItemToCartAPI({ productId, quantity });
        ElMessage.success('Added successfully.');
      }

      await getCart();
    } catch (error) {
      console.error("Add to cart failed:", error);
      ElMessage.error('Failed to add item.');
    }
  }

  // 删除购物车商品
  const delCart = async (itemId) => {
    try {
      await deleteCartItemAPI(itemId);
      await getCart();
      ElMessage.success('Delete successfully.');
    } catch (error) {
      console.error("Delete failed:", error);
      ElMessage.error('Failed to delete item.');
    }
  }

  // 更新商品数量
  const updateQuantity = async (itemId, quantity) => {
    try {
      console.log("useupdate",itemId)
      await updateCartItemQuantityAPI({ itemId, quantity });
      await getCart();
    } catch (error) {
      console.error("Update quantity failed:", error);
    }
  }

  // 单选功能
  const singleCheck = (productId, selected) => {
    const item = cartList.value.find(item => item.productId === productId);
    if (item) item.selected = selected;
  }

  // 计算属性
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.quantity, 0))
  const isAll = computed(() => cartList.value.length > 0 && cartList.value.every(item => item.selected))
  const allCheck = (selected) => cartList.value.forEach(item => item.selected = selected)
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.quantity, 0))
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.quantity * c.price, 0))

  return {
    cartList,
    cartId,
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
  persist: true
})