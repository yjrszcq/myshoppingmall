//暂时不用它了
<template>
  <div class="promotion-detail">
    <div v-if="promotionInfo" class="promotion-info">
      <div class="discount-rate">
        <span>🔥 discount-rate:</span>
        <span>{{ promotionInfo.discountRate }}%</span>
      </div>
      <div class="valid-until">
        <span>🔥 validUntil:</span>
        <span>{{ formatDate(promotionInfo.validUntil) }}</span>
      </div>
    </div>
    <div v-else class="no-promotion">
      暂无优惠pu
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { usePromotionInfoStore } from '@/stores/promotionInfoStore';
  import { getPromotionByProductId } from '@/apis/promotionInfo.js';
  import dayjs from 'dayjs';
  
  const promotionInfoStore = usePromotionInfoStore();
  const productId = ref(null);
  const formatDate = (date) => dayjs(date).format('YYYY-MM-DD HH:mm');
  
  const fetchPromotionInfo = async () => {
  try {
    const res = await getPromotionByProductId(productId.value);
    promotionInfoStore.setPromotionInfo(res.data);
  } catch (error) {
    console.error('Failed to fetch promotion info:', error);
  }
};

  onMounted(() => {
    // 假设从路由参数中获取 productId
    productId.value = $route.params.productId;
    promotionInfoStore.fetchPromotionInfo(productId.value);
  });
  </script>
  
  <style scoped>
  .promotion-detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .promotion-info {
    margin-right: 20px;
  }
  
  .discount-rate, .valid-until {
    font-size: 14px;
    color: #333;
  }
  .no-promotion {
  color: #999;
  font-size: 14px;
  text-align: center;
  }
  </style>