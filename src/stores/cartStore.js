//封装购物车模块

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
    //定义cartlist 
    const cartList = ref([])
    //定义添加
    const addCart = (goods)=>{
        //操作
      const item = cartList.value.find((item) => goods.name === item.name)
      if(item){
        item.count+=goods.count
      }
      else{
        cartList.value.push(goods)
      }
    }
    return{
        cartList,
        addCart
    }
},{
    persist: true,
})
