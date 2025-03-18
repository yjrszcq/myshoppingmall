<script setup>
import HomePanel from '@/views/Home/components/HomePanel.vue'
import { searchProducts } from '@/apis/searchProducts.js'
import { ref,onMounted } from 'vue'
import Goodsitem from "@/views/Home/components/Goodsitem.vue";

const newList = ref([])
const total = ref(0)

const getProductList = async () => {

    const res = await searchProducts({
      keyword: '手机',
      page: 1,
      limit: 20,
      sort: 'price_asc'  //返回所有关键词为手机的产品
    })
    newList.value = res.results
    total.value = res.total
}

// 以下是测试使用的接口
import {findNewAPI} from "@/apis/findnew.js";
const testlist = ref([])
const testProductList = async () => {
  const res = await findNewAPI()
  testlist.value = res.result
}
//测试代码结束
testProductList() //测试函数
onMounted(() => {
  // getProductList() 真正的函数 确认后取消注释

})
</script>

<template>
  <HomePanel title="数码产品" sub-title="科技前沿 领航新世界">
    <template #main>
      <ul class="goods-list">
        <li v-for="item in testlist" :key="item.id">
          <RouterLink :to="`/detail/${item.id}`">
            <Goodsitem :goods="item"/>
          </RouterLink>
        </li>
      </ul>
    </template>
  </HomePanel>
  <!-- 下面是插槽主体内容模版
  <ul class="goods-list">
    <li v-for="item in newList" :key="item.id">
      <RouterLink to="/">
        <img :src="item.picture" alt="" />
        <p class="name">{{ item.name }}</p>
        <p class="price">&yen;{{ item.price }}</p>
      </RouterLink>
    </li>
  </ul>
  -->
</template>


<style scoped lang='scss'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  flex-wrap: wrap;
  column-gap: 0px; // 横向间距调小
  row-gap: 20px;   // 纵向保持

  li {
    width: 250px;
    height: 406px;

    background: #fff;
    display: flex; /* 添加 flex 布局 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .price {
      color: $priceColor;
    }
  }
}
</style>