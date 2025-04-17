<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePromotionStore } from '@/stores/promotionStore'
import dayjs from 'dayjs'

const store = usePromotionStore()
const router = useRouter()

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const handleRowClick = (row) => {
  router.push(`/detail/${row.productId}`)
}

onMounted(() => {
  store.fetchPromotions()
})
</script>


<template>
  <div class="promotion-section">
    <h2 class="title">🔥 Today's Special 🔥</h2>

    <el-table
      :data="store.filterPromotions()"
      stripe
      class="promotion-table"
      header-cell-class-name="table-header"
      cell-class-name="table-cell"
      @row-click="handleRowClick"
    >
      <el-table-column prop="name" label="Product Name" align="center" />
      
      <el-table-column prop="discountRate" label="Discount Rate" align="center">
        <template #default="{ row }">
          <span class="discount-tag">{{ row.discountRate * 100 }}%</span>
        </template>
      </el-table-column>

      <el-table-column prop="currentPrice" label="Current Price" align="center">
        <template #default="{ row }">
          <span class="price">¥{{ row.currentPrice.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="validUntil" label="Valid Until" align="center">
        <template #default="{ row }">
          <span class="valid-until">{{ formatDate(row.validUntil) }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<style scoped>
.promotion-section {
  padding: 24px;
  background: linear-gradient(to bottom, #fff, #f9f9f9);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 24px;
}

.promotion-table {
  width: 100%;
}

.table-header {
  background-color: #f5f7fa;
  font-weight: bold;
  font-size: 15px;
  color: #333;
}

.table-cell {
  padding: 12px 0;
  font-size: 14px;
}

.discount-tag {
  color: #e74c3c;
  font-weight: bold;
}

.price {
  color: #2ecc71;
  font-weight: bold;
}

.valid-until {
  color: #888;
  font-size: 13px;
}
</style>
