<script setup>
import { onMounted, ref } from "vue";
import { viewsOrders } from "../../../apis/vip.js";
// tab列表
const tabTypes = [

  { name: "all", label: "all" },

  //   此处后端没有给接口，可以作为后面的扩展内容
  // { name: "unpay", label: "待付款" },
  // { name: "deliver", label: "待发货" },
  // { name: "receive", label: "待收货" },
  // { name: "comment", label: "待评价" },
  // { name: "complete", label: "已完成" },
  // { name: "cancel", label: "已取消" }
]
// 定义订单列表
const orderList = ref([])
//定义参数
const params = ref({
  orderState: 0,
  page: 1,
  pageSize: 8,
});
// 订单总数初始值
const total = ref(0);
//获取订单列表使用async+await 语法,解决异步问题，将异步变成同步
const getOrderList = async () => {
  const res = await viewsOrders(params.value);


  orderList.value = res.orderItem;
  console.log(orderList.value);
  total.value = orderList.length; //后端接口缺少订单总数，暂时用订单列表长度代替
};
onMounted(() => getOrderList());

// 点击tab切换分类调取订单列表
const tabClick = (type) => {
  // console.log(type);
  params.value.orderState = type;
  getOrderList();
};

// page切换回调
const pageChange = (page) => {
  // console.log(page)
  params.value.page = page;
  getOrderList();
};

// 通过不同数值展示订单不同的状态
const formatPayState = (payState) => {
  const stateMap = {

    1: "Pending payment",
    2: "To be shipped",
    3: "To be received",
    4: "To be evaluated",
    5: "Done",
    6: "Canceled",

  };
  return stateMap[payState];
};
</script>

<template>
  <div class="order-container">
    <el-tabs @tab-change="tabClick">
      <!-- tab切换 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" />

      <div class="main-container">
        <div class="holder-container" v-if="orderList.length == 0">

          <el-empty description="No order data yet" />

        </div>
        <div >
          <!-- 订单列表 -->
          <div class="order-item" v-for="order in orderList" :key="order.productId">
            <div class="head">

              <span>Product Name:{{  order.productName }}</span>
              <span>Price:{{ order.price }}yuan</span>
              <span>Order Number:{{ order.productId }}</span>
              <!-- 未付款，倒计时时间还有 -->
              <span class="down-time">
                <b>The number of units: {{order.quantity}}</b>

              </span>
            </div>
          </div>
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination background layout="prev, pager, next" />
          </div>
        </div>
      </div>

    </el-tabs>
  </div>

</template>

<style scoped lang="scss">
.order-container {
  padding: 10px 20px;

  .pagination-container {
    display: flex;
    justify-content: center;
  }

  .main-container {
    min-height: 500px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;

  .head {
    height: 50px;
    line-height: 50px;
    background: rgb(255, 153, 204);
    padding: 0 20px;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 10px;
    color: #fff;

    span {
      margin-right: 20px;

      &.down-time {
        margin-right: 0;
        float: right;

        i {
          vertical-align: middle;
          margin-right: 3px;
        }

        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }

    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }

  .body {
    display: flex;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;

      >p {
        padding-top: 10px;
      }

      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;

        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;

            &:last-child {
              border-bottom: none;
            }

            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }

            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;

              p {
                margin-bottom: 5px;

                &.name {
                  height: 38px;
                }

                &.attr {
                  color: #999;
                  font-size: 12px;

                  span {
                    margin-right: 5px;
                  }
                }
              }
            }

            .price {
              width: 100px;
            }

            .count {
              width: 80px;
            }
          }
        }
      }

      &.state {
        width: 120px;

        .green {
          color: $xtxColor;
        }
      }

      &.amount {
        width: 200px;

        .red {
          color: $priceColor;
        }
      }

      &.action {
        width: 140px;

        a {
          display: block;

          &:hover {
            color: $xtxColor;
          }
        }
      }
    }
  }


}
</style>