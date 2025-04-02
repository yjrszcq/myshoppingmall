// stores/orderStore.js
import { defineStore } from 'pinia';
import { submitOrderAPI, cancelOrderAPI } from '@/apis/order.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCartStore } from './cartStore';
import { useAddressStore } from './addressStore';
import { viewsOrders } from '@/apis/vip.js';

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [], // 存储订单列表
        currentOrder: null, // 当前操作的订单
        isLoading: false,
        error: null,
        selectedStatus: 'all',
        paymentCartItems: null, // 存储待支付的购物车商品
    }),

    actions: {
        async submitOrder(payload) {
            this.isLoading = true;
            this.error = null;

            try {
                const cartStore = useCartStore();
                const addressStore = useAddressStore();

                if (!addressStore.selectedAddress) {
                    throw new Error('Please select a shipping address');
                }

                const response = await submitOrderAPI(
                    payload.cartId || cartStore.cartId,
                    payload.orderCreateVO || {
                        addressId: addressStore.selectedAddress.addressId,
                    }
                );

                if (response.orderIds && response.orderIds.length > 0) {
                    this.currentOrder = {
                        orderId: response.orderIds[0],
                        status: 'pending',
                    };

                    cartStore.clearSelectedItems();
                    ElMessage.success('Order submitted successfully');
                    return this.currentOrder;
                }

                throw new Error('Failed to get order ID from response');
            } catch (error) {
                this.error = error.message || 'Failed to submit order';
                ElMessage.error(this.error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async cancelOrder(orderId) {
            try {
                await ElMessageBox.confirm(
                    'Are you sure you want to cancel this order?',
                    'Confirm Cancellation',
                    {
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                    }
                );

                this.isLoading = true;
                await cancelOrderAPI(orderId);

                const order = this.orders.find(o => o.orderId === orderId);
                if (order) {
                    order.status = 'canceled';
                }

                ElMessage.success('Order cancelled successfully');
                return true;
            } catch (error) {
                if (error !== 'cancel') {
                    this.error = error.message || 'Failed to cancel order';
                    ElMessage.error(this.error);
                    throw error;
                }
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async getOrderList() {
            try {
                this.isLoading = true;
                const res = await viewsOrders();
                this.orders = res.orders || [];
                console.log(this.orders, 'list');
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                this.isLoading = false;
            }
        },

        setCurrentOrder(order) {
            this.currentOrder = order;
        },

        updateOrders(orders) {
            this.orders = orders;
        },

        setSelectedStatus(status) {
            this.selectedStatus = status;
        },
    },

    getters: {
        pendingOrders: (state) => state.orders.filter(o => o.status === 'pending'),
        completedOrders: (state) => state.orders.filter(o => o.status === 'finished'),
        canceledOrders: (state) => state.orders.filter(o => o.status === 'canceled'),
        getOrdersByStatus: (state) => (status) => {
            if (status === 'all') return state.orders;
            return state.orders.filter(o => o.status === status);
        },
        filteredOrders: (state) => {
            if (state.selectedStatus === 'all') {
                return state.orders;
            }
            return state.orders.filter(order => order.status === state.selectedStatus);
        },
    },
});
