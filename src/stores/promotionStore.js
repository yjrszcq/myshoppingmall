// stores/promotionStore.js
import { defineStore } from 'pinia'
import { getActivePromotions } from '@/apis/promotion.js'

export const usePromotionStore = defineStore('promotion', {
  state: () => ({
    promotions: [],
    total: 0,
    searchKeyword: '',
  }),
  actions: {
    async fetchPromotions() {
      try {
        const res = await getActivePromotions()
        this.promotions = res.promotions
        this.total = res.total
      } catch (error) {
        console.error('Failed to fetch promotions:', error)
      }
    },
    filterPromotions() {
      if (!this.searchKeyword.trim()) return this.promotions
      return this.promotions.filter((item) =>
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      )
    },
    setKeyword(keyword) {
      this.searchKeyword = keyword
    },
  },
})
