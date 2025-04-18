<template>
  <div class="collection-container">
    <el-card class="collection-card">
      <template #header>
        <div class="card-header">
          <span class="title">My Favorites</span>
        </div>
      </template>

      <el-table
          :data="collectionStore.collections"
          style="width: 100%"
          v-loading="collectionStore.loading"
      >
        <el-table-column prop="name" label="Product Name">
          <template #default="scope">
            <router-link
                :to="`/detail/${scope.row.productId}`"
                class="product-link"
            >
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="currentPrice" label="Price">
          <template #default="scope">
            <span class="price">¥{{ scope.row.currentPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productId" label="Product ID">
          <template #default="scope">
            <router-link
                :to="`/detail/${scope.row.productId}`"
                class="product-link"
            >
              {{ scope.row.productId }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button
                type="danger"
                size="small"
                @click.stop="removeCollection(scope.row)"
                :loading="collectionStore.loading"
                class="remove-btn"
            >
              Remove
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
            class="pink-pagination"
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

// Pagination
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// Fetch collection list
const fetchCollectionList = async () => {
  try {
    const data = await collectionStore.fetchCollections(currentPage.value, pageSize.value)
    total.value = data.length
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    ElMessage.error('Failed to load favorites')
  }
}

// Handle page size change
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchCollectionList()
}

// Handle page change
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchCollectionList()
}

// Remove from collection
const removeCollection = async (item) => {
  try {
    await collectionStore.removeFromCollection(item.productId)
    ElMessage.success('Removed from favorites')
  } catch (error) {
    console.error('Failed to remove:', error)
    ElMessage.error('Failed to remove item')
  }
}

// Fetch data on mount
onMounted(() => {
  fetchCollectionList()
})
</script>

<style scoped lang="scss">
.collection-container {
  padding: 20px;
  background-color: #fff5f7; // Light pink background
}

.collection-card {
  margin-bottom: 20px;
  border: 1px solid #ffc0cb; // Pink border
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 182, 193, 0.2); // Soft pink shadow

  :deep(.el-card__header) {
    background-color: #ffebee; // Light pink header
    border-bottom: 1px solid #ffc0cb;
    border-radius: 12px 12px 0 0;
    padding: 15px 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #d23669; // Deep pink text
}

.price {
  color: #e84393; // Pink price color
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.product-link {
  color: #555;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 500;

  &:hover {
    color: #e84393; // Pink on hover
    text-decoration: underline;
  }
}

.remove-btn {
  background-color: #ff6b81; // Coral pink
  border-color: #ff6b81;
  color: white;

  &:hover {
    background-color: #ff4757; // Darker pink
    border-color: #ff4757;
  }

  &:active {
    background-color: #e84393;
    border-color: #e84393;
  }
}

/* Pink theme for table */
:deep(.el-table) {
  --el-table-border-color: #ffc0cb;
  --el-table-header-bg-color: #ffebee;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffebee !important; // Light pink on hover
  }
}

:deep(.el-table__row .el-table__cell:last-child) {
  cursor: default;

  &:hover {
    background-color: inherit !important;
  }
}

/* Pink pagination styles */
.pink-pagination {
  :deep(.btn-prev),
  :deep(.btn-next),
  :deep(.number) {
    &:hover {
      color: #e84393;
    }
  }

  :deep(.number.active) {
    background-color: #e84393;
    border-color: #e84393;
    color: white;
  }

  :deep(.el-pagination__jump) {
    color: #555;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .collection-container {
    padding: 10px;
  }

  .title {
    font-size: 18px;
  }
}
</style>