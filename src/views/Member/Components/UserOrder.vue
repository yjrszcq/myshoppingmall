<script setup>
import { onMounted, computed } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { InfoFilled, ShoppingCart } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import {useCartStore} from "@/stores/cartStore.js";

const router = useRouter();
const orderStore = useOrderStore();

// tab列表，状态与后端匹配
const tabTypes = [
  { name: "all", label: "All", color: "" },
  { name: "pending", label: "Pending", color: "#FFA500" },
  { name: "paid", label: "Paid", color: "#4169E1" },
  { name: "shipping", label: "Shipping", color: "#32CD32" },
  { name: "finished", label: "Finished", color: "#4CAF50" },
  { name: "canceled", label: "Canceled", color: "#F44336" },
];

// 获取订单列表
const getOrderList = () => {
  orderStore.getOrderList();
};

// 计算属性：根据 selectedStatus 过滤订单
const filteredOrders = computed(() => orderStore.filteredOrders);

// 计算订单总价
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * 1), 0).toFixed(2);
};

// 处理 tab 切换
const tabClick = (tabName) => {
  orderStore.setSelectedStatus(tabName);
};

// 取消订单函数
const handleCancelOrder = async (orderId) => {
  await orderStore.cancelOrder(orderId);
};

// 处理支付按钮点击
const handlePayNow = (order) => {
  const cartStore = useCartStore()

  // 获取用户选中的商品
  const selectedGoods = cartStore.cartList.filter(item => item.selected)

  if (selectedGoods.length === 0) {
    ElMessage.warning('Please select at least one product to purchase')
    return
  }

  // 计算订单信息
  const totalPrice = selectedGoods.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const postFee = 10 // 假设运费固定
  const totalPayPrice = totalPrice + postFee

  const orderInfo = {
    goods: selectedGoods,
    summary: {
      goodsCount: selectedGoods.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice,
      postFee,
      totalPayPrice
    }
  }

  // 存储订单信息到 localStorage
  localStorage.setItem('cartInfo', JSON.stringify(orderInfo))

  // 跳转到结算页面
  router.push('/checkout')
}

onMounted(() => getOrderList());
</script>


<template>
  <div class="order-container">
    <h2 class="page-title">My Orders</h2>

    <el-tabs v-model="selectedStatus" @tab-change="tabClick" class="order-tabs">
      <el-tab-pane
          v-for="item in tabTypes"
          :key="item.name"
          :label="item.label"
          :name="item.name"
      >
        <template #label>
          <span :style="{ color: item.color }">{{ item.label }}</span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <div class="main-container">
      <el-skeleton :rows="5" animated v-if="isLoading"/>

      <div class="empty-state" v-else-if="filteredOrders.length === 0">
        <el-empty description="No orders found">
          <template #image>
            <el-icon :size="100" color="#ccc">
              <ShoppingCart />
            </el-icon>
          </template>
          <p class="empty-text">You haven't placed any orders yet</p>
          <el-button type="primary" class="empty-button">Start Shopping</el-button>
        </el-empty>
      </div>

      <div v-else class="orders-list">
        <div class="order-item" v-for="order in filteredOrders" :key="order.orderId">
          <el-collapse>
            <el-collapse-item :name="order.orderId">
              <template #title>
                <div class="order-header">
                  <div class="order-meta">
                    <span class="order-id">Order #{{ order.orderId }}</span>
                  </div>

                  <div class="order-info-right">
                    <el-tag
                        :color="tabTypes.find(t => t.name === order.status)?.color"
                        effect="dark"
                        class="status-tag fixed-width-tag"
                    >
                      {{ order.status.toUpperCase() }}
                    </el-tag>
                    <span class="order-total fixed-width-total">${{ calculateTotal(order.items.items) }}</span>
                  </div>
                </div>
              </template>

              <div class="order-details">
                <div class="items-list">
                  <div v-for="item in order.items.items" :key="item.productId" class="item-row">
                    <div class="item-info">
                      <span class="item-name">{{ item.productName }}</span>
                      <span class="item-quantity">Qty: {{ item.quantity }}</span>
                    </div>
                    <span class="item-price">￥{{ (item.price / item.quantity).toFixed(2) }}</span>
                  </div>
                </div>

<!--                <div class="order-actions">-->
<!--                  <el-button-->
<!--                      type="primary"-->
<!--                      size="small"-->
<!--                      v-if="order.status === 'pending'"-->
<!--                      @click="handlePayNow(order.orderId)"-->
<!--                  >-->
<!--                    Pay Now-->
<!--                  </el-button>-->
<!--                此处逻辑待讨论，反正我现在不想写-->
                  <el-button
                      size="small"
                      v-if="order.status === 'pending'"
                      @click="handleCancelOrder(order.orderId)"
                  >
                    Cancel Order</el-button>
<!--                  <el-button type="success" size="small" v-if="order.status === 'shipping'">Track Package</el-button>-->
<!--                  等待后端给接口-->
<!--                  <el-button type="info" size="small" v-if="order.status === 'finished'">Leave Review</el-button>-->
<!--                  等待后端给接口-->
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .page-title {
    font-size: 28px;
    font-weight: 600;
    color: hotpink;
    margin-bottom: 20px;
    text-align: center;
    font-family: "Droid Serif";
  }

  .order-tabs {
    margin-bottom: 30px;

    :deep(.el-tabs__nav-wrap) {
      &::after {
        height: 1px;
        background-color: #e4e7ed;
      }
    }

    :deep(.el-tabs__item) {
      font-weight: 500;
      padding: 0 20px;

      &:hover {
        color: pink;
      }
    }

    :deep(.el-tabs__active-bar) {
      height: 3px;
      background-color: pink;
    }
  }

  .main-container {
    min-height: 500px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    padding: 20px;

    .empty-state {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .empty-image {
        width: 200px;
        height: 200px;
        margin-bottom: 20px;
      }

      .empty-text {
        color: #909399;
        margin-bottom: 20px;
      }
    }
  }

  .orders-list {
    .order-item {
      margin-bottom: 20px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      :deep(.el-collapse-item__header) {
        background-color: #ffecec;
        padding: 15px 20px;
        border-bottom: none;
        font-size: 16px;
        height: auto;

        &.is-active {
          background-color: #FFC0CB;
        }
      }

      :deep(.el-collapse-item__content) {
        padding-bottom: 0;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .order-meta {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0; /* 防止内容溢出 */

          .order-id {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

        }

        .order-info-right {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-left: 20px;
          flex-shrink: 0; /* 防止被压缩 */

          .fixed-width-tag {
            width: 100px; /* 固定宽度 */
            text-align: center;
            justify-content: center;
            border-color: #FFC0CB;
          }

          .fixed-width-total {
            width: 100px; /* 固定宽度 */
            text-align: right;
            font-weight: 600;
            color: #333;
          }
        }
      }

      .order-details {
        padding: 20px;
        background-color: #fafafa;

        .items-list {
          margin-bottom: 20px;

          .item-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;

            &:last-child {
              border-bottom: none;
            }

            .item-info {
              display: flex;
              flex-direction: column;

              .item-name {
                font-weight: 500;
                margin-bottom: 5px;
              }

              .item-quantity {
                font-size: 13px;
                color: #909399;
              }
            }

            .item-price {
              font-weight: 600;
            }
          }
        }

        .order-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px dashed #ddd;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .order-container {
    padding: 10px;

    .order-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .order-info-right {
        width: 100%;
        justify-content: space-between;
        margin-left: 0;
        margin-top: 8px;

        .fixed-width-tag,
        .fixed-width-total {
          width: auto;
          min-width: 80px;
        }
      }
    }

    .order-tabs {
      :deep(.el-tabs__item) {
        padding: 0 10px !important;
        font-size: 14px;
      }
    }

    .order-details {
      padding: 15px !important;
    }

    .order-actions {
      flex-wrap: wrap;

      .el-button {
        flex: 1;
        min-width: 120px;
      }
    }
  }
}
</style>