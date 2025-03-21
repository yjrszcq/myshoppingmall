//封装购物车模块

import { defineStore } from 'pinia'
import { computed,ref} from 'vue'
import { useUserstore } from './user'

export const useCartStore = defineStore('cart', () => {
    const userStore = useUserstore()

    //定义cartlist 
    const cartList = ref([])
   
 
    //定义添加
    const addCart =  (goods)=>{
      const { name, count } = goods
        // 添加购物车操作
        const item = cartList.value.find((item) => goods.name === item.name)
      if(item){
        item.count+=goods.count
      }
      else{
        cartList.value.push(goods)
      }
  }

    // 删除购物车
     const delCart = (name) => {
       const idx = cartList.value.findIndex((item) => name === item.name)
      cartList.value.splice(idx, 1)
      cartList.value = []; // 清空购物车
      isAll.value = false;
    }

    //单选功能
    const singleCheck = (name,selected) => {
      const item = cartList.value.find((item) => item.name===name)
      item.selected = selected
    }


    //  总的数量 所有项的count之和
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))

    //是否全选
    const isAll = computed(() => {
      if (cartList.value.length === 0) {
        return false; // 如果购物车为空，返回 false
      }
      return cartList.value.every((item) => item.selected);
    });

    //全选功能
    const allCheck = (selected) =>{
      cartList.value.forEach(item => item.selected = selected)
    }

    //已选择数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
    //已选择合计
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

    return{
        cartList,
        addCart,
        isAll,
        allCheck,
        singleCheck,
        delCart,
        selectedCount,
        selectedPrice,
        allCount
    }
},{
    persist: true,
})
