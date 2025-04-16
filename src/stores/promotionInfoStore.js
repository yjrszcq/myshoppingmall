// stores/promotionInfoStore.js
import { defineStore } from 'pinia';
import { getPromotionByProductId } from '@/apis/promotionInfo.js';

export const usePromotionInfoStore = defineStore('promotionInfo', {
  state: () => ({
    promotionInfo: null, // 存储特定商品的促销信息
  }),
  actions: {
    async fetchPromotionInfo(productId) {
      try {
        const res = await getPromotionByProductId(productId);
        this.promotionInfo = res.data;
      } catch (error) {
        console.error('Failed to fetch promotion info:', error);
      }
    },
    setPromotionInfo(info) {
      this.promotionInfo = info;
    },
  }
});