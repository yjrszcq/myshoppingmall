<template>
  <div class="comment-section">
    <!-- 评论列表 -->
    <div class="comment-list" v-loading="loading">
      <div v-if="comments.length === 0" class="no-comments">
        暂无评论
      </div>

      <div v-else>
        <div
            class="comment-item"
            v-for="comment in comments"
            :key="comment.reviewId"
            @click="openDrawer(comment)"
        >
          <div class="comment-header">
            <span class="comment-rating">
              <el-rate
                  v-model="comment.rating"
                  disabled
                  show-score
                  text-color="#ff6b81"
                  score-template="{value}分"
              />
            </span>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-content-preview">{{ previewContent(comment.comment) }}</div>
        </div>

        <el-pagination
            v-if="total > limit"
            small
            layout="prev, pager, next"
            :total="total"
            :page-size="limit"
            :current-page="page"
            @current-change="handlePageChange"
            class="comment-pagination"
        />
      </div>
    </div>

    <!-- 覆盖式评论详情抽屉 -->
    <el-drawer
        v-model="drawerVisible"
        :title="`评论详情 (评分: ${currentComment?.rating}分)`"
        direction="btt"
        size="85%"
        class="overlay-drawer"
        :modal="true"
        :show-close="true"
    >
      <div class="comment-detail-overlay" v-if="currentComment">
        <div class="overlay-header">
          <div class="overlay-meta">
            <span class="overlay-date">{{ formatDate(currentComment.createdAt) }}</span>
            <el-rate v-model="currentComment.rating" disabled class="overlay-rating" />
          </div>
          <el-button
              type="danger"
              plain
              circle
              class="close-btn"
              @click="drawerVisible = false"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <div class="overlay-content">
          {{ currentComment.comment }}
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { getEvaluate } from '@/apis/detail'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  productId: {
    type: String,
    required: true
  }
})

// 抽屉相关
const drawerVisible = ref(false)
const currentComment = ref(null)

// 分页相关
const page = ref(1)
const limit = ref(10)
const total = ref(0)

// 评论数据
const comments = ref([])
const loading = ref(false)

// 获取评论列表
const fetchComments = async () => {
  try {
    loading.value = true
    const res = await getEvaluate({
      productId: props.productId,
      page: page.value,
      limit: limit.value
    })
    comments.value = res.reviews
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取评论失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 预览内容
const previewContent = (content: string) => {
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

// 打开抽屉显示评论详情
const openDrawer = (comment) => {
  currentComment.value = comment
  drawerVisible.value = true
}

// 分页变化
const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchComments()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 监听productId变化
watch(() => props.productId, (newVal) => {
  if (newVal) {
    fetchComments()
  }
}, { immediate: true })

// 监听页码变化
watch(page, () => {
  fetchComments()
})

// 初始化加载
onMounted(() => {
  if (props.productId) {
    fetchComments()
  }
})
</script>

<style scoped>
.comment-section {
  margin-top: 30px;
  padding: 25px;
  background-color: #fff9fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(255, 107, 129, 0.1);
}

.comment-list {
  margin-top: 15px;
}

.comment-item {
  padding: 20px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 107, 129, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid #ff6b81;
}

.comment-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255, 107, 129, 0.15);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-date {
  color: #888;
  font-size: 13px;
}

.comment-content-preview {
  line-height: 1.7;
  color: #555;
  white-space: pre-wrap;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-comments {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 16px;
}

.comment-pagination {
  margin-top: 30px;
  justify-content: center;
}

.comment-pagination :deep(.el-pager li.active) {
  background-color: #ff6b81 !important;
  color: white !important;
}

.comment-pagination :deep(.el-pager li:hover) {
  color: #ff6b81 !important;
}

/* 覆盖式抽屉样式 */
.overlay-drawer :deep(.el-drawer) {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
}

.overlay-drawer :deep(.el-drawer__header) {
  display: none;
}

.comment-detail-overlay {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ffecef;
}

.overlay-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.overlay-date {
  color: #888;
  font-size: 14px;
}

.overlay-rating :deep(.el-rate__icon) {
  font-size: 24px;
}

.close-btn {
  border: none;
  background-color: #fff5f6;
  color: #ff6b81;
}

.close-btn:hover {
  background-color: #ff6b81;
  color: white;
}

.overlay-content {
  flex: 1;
  padding: 15px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  overflow-y: auto;
  background-color: #fff5f6;
  border-radius: 8px;
  font-size: 16px;
}
</style>