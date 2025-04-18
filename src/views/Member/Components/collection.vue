<template>
  <div class="collection-container">
    <el-card class="collection-card">
      <template #header>
        <div class="card-header">
          <span class="title">我的收藏</span>
        </div>
      </template>

      <el-table
          :data="collectionStore.collections"
          style="width: 100%"
          v-loading="collectionStore.loading"
      >
        <el-table-column prop="name" label="商品名称">
          <template #default="scope">
            <router-link
                :to="`/detail/${scope.row.productId}`"
                class="product-link"
            >
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="currentPrice" label="价格">
          <template #default="scope">
            <span class="price">¥{{ scope.row.currentPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productId" label="商品ID">
          <template #default="scope">
            <router-link
                :to="`/detail/${scope.row.productId}`"
                class="product-link"
            >
              {{ scope.row.productId }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
                type="danger"
                size="small"
                @click.stop="removeCollection(scope.row)"
                :loading="collectionStore.loading"
            >
              移出收藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useCollectionStore } from '@/stores/collectionStore'

const collectionStore = useCollectionStore()

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// 获取收藏列表数据
const fetchCollectionList = async () => {
  try {
    const data = await collectionStore.fetchCollections(currentPage.value, pageSize.value)
    total.value = data.length // 根据实际API返回的总数调整
  } catch (error) {
    console.error('获取收藏列表失败:', error)
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchCollectionList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchCollectionList()
}

// 移出收藏
const removeCollection = async (item) => {
  try {
    await collectionStore.removeFromCollection(item.productId)
    // 不需要手动更新列表，store中已经处理
  } catch (error) {
    console.error('移出收藏失败:', error)
  }
}

// 页面加载时发请求
onMounted(() => {
  fetchCollectionList()
})
</script>

<style scoped>
.collection-container {
  padding: 20px;
}

.collection-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.price {
  color: #ff6b6b;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.product-link {
  color: #606266;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #409eff;
    text-decoration: underline;
  }
}

/* 使整个行可点击 */
:deep(.el-table__row) {
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }
}

/* 防止操作列的按钮点击触发行点击 */
:deep(.el-table__row .el-table__cell:last-child) {
  cursor: default;

  &:hover {
    background-color: inherit;
  }
}
</style>