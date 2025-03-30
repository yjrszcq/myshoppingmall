// stores/productSearch.js
import { defineStore } from 'pinia'
import { searchProducts } from '@/apis/searchProducts.js' // 你的API文件路径

export const useProductSearchStore = defineStore('productSearch', {
    state: () => ({
        mobileProducts: [], // 手机类商品
        foodProducts: [],   // 美食类商品
        clothingProducts: [], // 衣服类商品
        loading: false,
        error: null
    }),

    actions: {
        /**
         * 搜索并返回所有关键词为"手机"的商品
         * @param {Object} options - 搜索选项
         * @param {number} options.page - 页码
         * @param {number} options.limit - 每页数量
         * @param {string} options.sort - 排序方式
         * @returns {Promise} - 包含手机类商品的Promise
         */
// 修改store中的searchMobileProducts方法
        async searchMobileProducts(options = {}) {
            try {
                this.loading = true
                const params = {
                    keyword: 'cell phone',
                    page: options.page || 1,
                    limit: options.limit || 10,
                    sort: options.sort || ''
                }
                const response = await searchProducts(params)
                // 假设API返回{results, total}结构
                this.mobileProducts = response.data
                return response // 返回完整响应以便获取total
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * 搜索并返回所有关键词为"美食"的商品
         * @param {Object} options - 搜索选项
         * @param {number} options.page - 页码
         * @param {number} options.limit - 每页数量
         * @param {string} options.sort - 排序方式
         * @returns {Promise} - 包含美食类商品的Promise
         */
        async searchFoodProducts(options = {}) {
            try {
                this.loading = true
                const params = {
                    keyword: 'delicacies',
                    page: options.page || 1,
                    limit: options.limit || 10,
                    sort: options.sort || ''
                }
                const response = await searchProducts(params)
                this.foodProducts = response.data
                return response.data
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * 搜索并返回所有关键词为"衣服"的商品
         * @param {Object} options - 搜索选项
         * @param {number} options.page - 页码
         * @param {number} options.limit - 每页数量
         * @param {string} options.sort - 排序方式
         * @returns {Promise} - 包含衣服类商品的Promise
         */
        async searchClothingProducts(options = {}) {
            try {
                this.loading = true
                const params = {
                    keyword: 'clothes',
                    page: options.page || 1,
                    limit: options.limit || 10,
                    sort: options.sort || ''
                }
                const response = await searchProducts(params)
                this.clothingProducts = response.data
                return response.data
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * 清除所有搜索结果
         */
        clearSearchResults() {
            this.mobileProducts = []
            this.foodProducts = []
            this.clothingProducts = []
            this.error = null
        }
    },

    getters: {
        /**
         * 获取所有手机类商品
         * @returns {Array} - 手机类商品数组
         */
        getAllMobileProducts: (state) => state.mobileProducts,

        /**
         * 获取所有美食类商品
         * @returns {Array} - 美食类商品数组
         */
        getAllFoodProducts: (state) => state.foodProducts,

        /**
         * 获取所有衣服类商品
         * @returns {Array} - 衣服类商品数组
         */
        getAllClothingProducts: (state) => state.clothingProducts,

        /**
         * 检查是否正在加载
         * @returns {boolean} - 是否正在加载
         */
        isLoading: (state) => state.loading,

        /**
         * 获取错误信息
         * @returns {Error|null} - 错误对象或null
         */
        getError: (state) => state.error
    }
})