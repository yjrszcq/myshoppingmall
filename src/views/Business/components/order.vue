<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { viewOrders, manageOrders } from '@/apis/business';
const orders = ref([
  { id: 1, orderNo: 'ORD001', customer: '张三', total: 299, status: '待发货', createTime: '2024-01-20' },
  { id: 2, orderNo: 'ORD002', customer: '李四', total: 599, status: '已发货', createTime: '2024-01-19' },
  { id: 3, orderNo: 'ORD003', customer: '王五', total: 899, status: '已完成', createTime: '2024-01-18' },
]);

//根据接口获取数据
onMounted(async () => {
  getOrders()
})

//获取数据函数
const getOrders = async () => {
  const res = await viewOrders()
  console.log(res,"成功");
  
  orders.value = res.itemList
}

const handleOrderStatus = async (row) => {
  ElMessageBox.confirm(`是否将订单${row.orderId}标记为已完成？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
  }).then(async () => {
    try {
      await manageOrders({
        orderId: row.orderId,
        status: '已完成'
      })
      ElMessage.success('订单状态已更新');
      getOrders(); // 刷新订单列表
    } catch (error) {
      ElMessage.error('更新失败');
    }
  });
};

const handleAcceptOrder = async (row) => {
  ElMessageBox.confirm(`是否接受订单${row.orderId}？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
  }).then(async () => {
    try {
      await manageOrders({
        orderId: row.orderId,
        status: '已接单'
      })
      ElMessage.success('已接受订单');
      getOrders(); // 刷新订单列表
    } catch (error) {
      ElMessage.error('接单失败');
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
</script>

<template>
  <div class="management-container">
    <div class="header">
      <h2 class="title">订单管理</h2>
      <el-table :data="orders" style="width: 100%" border class="pink-table">
        <el-table-column prop="orderId" label="订单号" width="120"></el-table-column>
        <el-table-column prop="productName" label="订单名称" ></el-table-column>
        <el-table-column prop="price" label="订单金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="scope">
            <el-tag :type="'success'">
              {{ '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button 
              size="small" 
              type="success" 
              @click="handleOrderStatus(scope.row)">
              完成订单
            </el-button>
            <el-button 
              size="small" 
              type="info" 
              @click="handleAcceptOrder(scope.row)">
              接受订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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