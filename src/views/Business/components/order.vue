<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { viewOrders, manageOrders } from '@/apis/business';
const orders = ref([]);



//获取数据函数
const getOrders = async () => {
  const res = await viewOrders()
  console.log(res,"success");
  orders.value = res.items
  console.log(orders,"orders")
}

const handleOrderStatus = async (row) => {

  ElMessageBox.confirm(`Do you mark the order ${row.orderId} as completed?`, 'prompt', {
    confirmButtonText: 'yes',
    cancelButtonText: 'no',

    type: 'success',
  }).then(async () => {
    try {
      await manageOrders({
        orderId: row.orderId,

        status: 'done'
      })
      ElMessage.success('The order status has been updated');
      getOrders(); // 刷新订单列表
    } catch (error) {
      ElMessage.error('error');

    }
  });
};

const handleAcceptOrder = async (row) => {

  ElMessageBox.confirm(`Do you accept orders ${row.orderId}?`, 'prompt', {
    confirmButtonText: 'yes',
    cancelButtonText: 'no',

    type: 'success',
  }).then(async () => {
    try {
      await manageOrders({
        orderId: row.orderId,

        status: 'done'
      })
      ElMessage.success('The order has been accepted');
      getOrders(); // 刷新订单列表
    } catch (error) {
      ElMessage.error('error');

    }
  });
};

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(150)

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 这里可以添加获取对应页数据的逻辑
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // 这里可以添加获取对应条数数据的逻辑
}

//根据接口获取数据
onMounted(async () => {
  getOrders()
})
</script>

<template>
  <div class="management-container">
    <div class="header">

      <h2 class="title">Order management</h2>
      <el-table :data="orders" style="width: 100%" border class="pink-table">
        <el-table-column prop="orderId" label="orderId" width="300"></el-table-column>
        <el-table-column prop="productName" label="productName" ></el-table-column>
        <el-table-column prop="price" label="price" width="120">


          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="status" width="120">
          <template #default="scope">
            <el-tag :type="'success'">
              {{ 'success' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="createTime" width="180"></el-table-column>
        <el-table-column label="operate" width="240">

          <template #default="scope">
            <el-button 
              size="small" 
              type="success" 
              @click="handleOrderStatus(scope.row)">

              Complete the order

            </el-button>
            <el-button 
              size="small" 
              type="info" 
              @click="handleAcceptOrder(scope.row)">

              Accept orders

            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    <div class="pagination-container">-->
<!--      <el-pagination-->
<!--        v-model:current-page="currentPage"-->
<!--        v-model:page-size="pageSize"-->
<!--        :page-sizes="[10, 20, 30, 50]"-->
<!--        background-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="total"-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--      />-->
<!--    </div>-->
  </div>
</template>

<style scoped lang="scss">
.management-container {
box-sizing: border-box;
  padding: 20px;
  background-color: #fff5f7;
  height: 100%;
  display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.header {
  margin-bottom: 20px;
  flex: 1;
  .title {
    color: #e23d7d;
    margin-bottom: 20px;
    font-weight: 600;
  }
}

.pink-table {
  :deep(.el-table__header) {
    background-color: #fce4ec;
    th {
      background-color: #fce4ec;
      color: #e23d7d;
    }
  }
  
  :deep(.el-table__row) {
    &:hover {
      background-color: #fff0f4 !important;
    }
  }
  
  :deep(.el-button) {
    background-color: #f784a7;
    border-color: #f784a7;
    color: white;
    
    &:hover {
      background-color: #e23d7d;
      border-color: #e23d7d;
    }
  }
}

.pagination-container {
    height: 50px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  
  :deep(.el-pagination.is-background) {
    .el-pager li:not(.is-disabled) {
      background-color: #fce4ec;
      &:hover {
        color: #e23d7d;
      }
      &.is-active {
        background-color: #e23d7d;
      }
    }
    .btn-prev, .btn-next {
      background-color: #fce4ec;
      &:hover {
        color: #e23d7d;
      }
    }
  }
}
</style>