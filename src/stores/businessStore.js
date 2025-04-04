// stores/businessStore.js
import { defineStore } from 'pinia';
import {
    viewOrders,
    manageOrderAPI
} from '@/apis/business.js';
import { ElMessage, ElMessageBox } from 'element-plus';

export const useBusinessStore = defineStore('business', {
    state: () => ({
        sellerOrders: [], // 卖家订单列表
        currentOrder: null, // 当前操作的订单
        isLoading: false,
        error: null,
        selectedStatus: 'all', // 当前选中的订单状态
        statusOptions: [ // 订单状态选项
            { value: 'all', label: '全部订单' },
            { value: 'pending', label: '待处理' },
            { value: 'paid', label: '已支付' },
            { value: 'shipped', label: '已发货' },
            { value: 'completed', label: '已完成' },
            { value: 'canceled', label: '已取消' }
        ]
    }),

    actions: {
        /**
         * 获取卖家订单列表
         */
        async fetchSellerOrders() {
            try {
                this.isLoading = true;
                const res = await viewOrders();
                // Access the orders property of the response
                this.sellerOrders = Array.isArray(res?.orders) ? res.orders : [];
                console.log(this.sellerOrders,"res")
                return this.sellerOrders;
            } catch (error) {
                this.error = error.message || '获取订单列表失败';
                ElMessage.error(this.error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * 发货操作
         * @param {string} orderId 订单ID
         * @param {string} trackingNumber 物流单号
         */
        async shipOrder(orderId, trackingNumber) {
            try {
                this.isLoading = true;
                await manageOrderAPI(orderId, 'ship', trackingNumber);

                // Update local order status
                const order = this.sellerOrders.find(o => o.orderId === orderId);  // Note: using orderId
                if (order) {
                    order.status = 'shipped';
                    order.trackingNumber = trackingNumber;
                }

                return true;
            } catch (error) {
                ElMessage.error(error.message || '发货失败');
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * 取消订单
         * @param {string} orderId 订单ID
         */
        async cancelOrder(orderId) {
            try {

                this.isLoading = true;
                await manageOrderAPI(orderId, 'cancel');

                // 更新本地订单状态
                const order = this.sellerOrders.find(o => o.id === orderId);
                if (order) {
                    order.status = 'canceled';
                }

                return true;
            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage.error(this.error);
                    throw error;
                }
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * 设置当前订单
         * @param {Object} order 订单对象
         */
        setCurrentOrder(order) {
            this.currentOrder = order;
        },

        /**
         * 设置筛选状态
         * @param {string} status 状态值
         */
        setSelectedStatus(status) {
            this.selectedStatus = status;
        }
    },

    getters: {
        /**
         * 根据状态筛选订单
         */
        filteredOrders: (state) => {
            if (!Array.isArray(state.sellerOrders)) return [];
            if (state.selectedStatus === 'all') {
                return state.sellerOrders;
            }
            return state.sellerOrders.filter(order => order.status === state.selectedStatus);
        },

        /**
         * 待处理订单
         */
        pendingOrders: (state) => state.sellerOrders.filter(o => o.status === 'pending'),

        /**
         * 已支付订单
         */
        paidOrders: (state) => state.sellerOrders.filter(o => o.status === 'paid'),

        /**
         * 已发货订单
         */
        shippedOrders: (state) => state.sellerOrders.filter(o => o.status === 'shipped'),

        /**
         * 已完成订单
         */
        completedOrders: (state) => state.sellerOrders.filter(o => o.status === 'completed'),

        /**
         * 已取消订单
         */
        canceledOrders: (state) => state.sellerOrders.filter(o => o.status === 'canceled')
    }
});