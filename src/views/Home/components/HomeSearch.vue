<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { searchProducts } from '@/apis/searchProducts.js';
import Goodsitem from "@/views/Home/components/Goodsitem.vue";
import HomePanel from "@/views/Home/components/HomePanel.vue"; // 引入你的封装接口

// 获取当前路由
const route = useRoute();

// 响应式数据
const keyword = ref(route.query.keyword || '');
const products = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const sort = ref(''); // 看你需求，比如 price_asc、rating_desc

// 请求搜索商品数据
const fetchProducts = async () => {
  if (!keyword.value) return;
  try {
    const res = await searchProducts({
      keyword: keyword.value,
      page: page.value,
      limit: limit.value,
      sort: sort.value
    });
    products.value = res.results;
    total.value = res.total;
  } catch (error) {
    console.error('error:', error);
  }
};

// 初始加载
onMounted(fetchProducts);

// 监听路由变化（关键词变化重新搜索）
watch(() => route.query.keyword, (newKeyword) => {
  keyword.value = newKeyword;
  page.value = 1; // 新搜索重置到第一页
  fetchProducts();
});


</script>

<template>
  <div class="search-page">
    <h2 style="color: palevioletred">result: "{{ keyword }}"</h2>

    <!-- 搜索无结果 -->
    <div v-if="products.length === 0">
      <HomePanel title="404 NotFind" sub-title="QWQ">

      </HomePanel>
    </div>

    <!-- 搜索结果展示 -->
    <div v-if="products.length !== 0">
      <HomePanel title="Found for you:" sub-title="Please say thank you" >
        <template #main>
          <ul class="product-list">
            <li v-for="item in products" :key="item.id">
              <Goodsitem :goods="item"/>
            </li>
          </ul>
        </template>
      </HomePanel>
    </div>


    <!-- 分页器（可选） -->
    <!-- <el-pagination
      v-if="total > limit"
      layout="prev, pager, next"
      :total="total"
      :page-size="limit"
      :current-page="page"
      @current-change="handlePageChange"
    /> -->
  </div>
</template>

<style scoped>
.search-page {
  padding: 20px;
}


.product-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  flex-wrap: wrap;
}

.product-list li {
  width: 250px;
  height: 406px;

  background: #fff;
  display: flex; /* 添加 flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

</style>
