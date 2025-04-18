<template>
  <div class="cute-comment-component">
    <!-- Comment trigger button -->
    <el-button type="primary" size="small" @click="openCommentDialog" class="pink-button">
      <slot name="trigger">
        <span class="button-content">
          <el-icon><Edit /></el-icon>
          Write Review
        </span>
      </slot>
    </el-button>

    <!-- Comment dialog -->
    <el-dialog
        v-model="dialogVisible"
        title="Write Your Review"
        width="600px"
        :before-close="handleClose"
        class="pink-dialog"
    >
      <!-- Rating section -->
      <div class="rating-section">
        <span class="rating-label">Rating:</span>
        <el-rate
            v-model="ratingValue"
            :colors="colors"
            show-score
            :score-template="scoreTemplate"
            class="pink-rating"
        />
      </div>

      <!-- Comment content -->
      <el-input
          v-model="commentContent"
          type="textarea"
          :rows="5"
          placeholder="Please share your thoughts (max 300 characters)"
          maxlength="300"
          show-word-limit
          class="pink-textarea"
      />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelComment" class="pink-cancel-btn">Cancel</el-button>
          <el-button type="primary" @click="submitComment" class="pink-submit-btn">Submit</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { submitEvaluate } from '@/apis/detail' // 导入提交评论的API

const props = defineProps({
  // 对话框标题
  title: {
    type: String,
    default: 'Please Comment'
  },
  // 输入框占位符
  placeholder: {
    type: String,
    default: 'Please input your comment'
  },
  // 确认关闭提示
  confirmCloseMessage: {
    type: String,
    default: 'Really?All the content will be lost'
  },
  // 评分颜色
  colors: {
    type: Array,
    default: () => ['#99A9BF', '#F7BA2A', '#FF9900']
  },
  // 评分显示模板
  scoreTemplate: {
    type: String,
    default: '{value} point'
  },
  // 商品ID - 新增
  productId: {
    type: String,
    required: true
  },
  // 订单ID - 新增
  orderId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit-success']) // 修改发射事件名称

// 对话框显示状态
const dialogVisible = ref(false)
// 评分值
const ratingValue = ref(0)
// 评论内容
const commentContent = ref('')

// 打开评论对话框
const openCommentDialog = () => {
  dialogVisible.value = true
}

// 关闭对话框前的确认
const handleClose = (done: () => void) => {
  if (commentContent.value || ratingValue.value > 0) {
    ElMessageBox.confirm(props.confirmCloseMessage, '提示')
        .then(() => {
          resetForm()
          done()
        })
        .catch(() => {
          // 取消关闭
        })
  } else {
    done()
  }
}

// 取消评论
const cancelComment = () => {
  if (commentContent.value || ratingValue.value > 0) {
    ElMessageBox.confirm(props.confirmCloseMessage, '提示')
        .then(() => {
          resetForm()
          dialogVisible.value = false
        })
        .catch(() => {
          // 取消关闭
        })
  } else {
    dialogVisible.value = false
  }
}

// 提交评论 - 修改后的方法
const submitComment = async () => {
  if (ratingValue.value === 0) {
    ElMessage.warning('Please Comment first')
    return
  }

  if (!commentContent.value.trim()) {
    ElMessage.warning('Please input your comment')
    return
  }

  try {
    // 调用提交评论接口
    await submitEvaluate({
      productId: props.productId,
      orderId: props.orderId,
      rating: ratingValue.value,
      comment: commentContent.value.trim()
    })

    ElMessage.success('commit success')
    emit('submit-success') // 通知父组件评论成功
    resetForm()
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('fail')
    console.error('fail', error)
  }
}

// 重置表单
const resetForm = () => {
  ratingValue.value = 0
  commentContent.value = ''
}
</script>

<style scoped>
.cute-comment-component {
  display: inline-block;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Pink theme button */
.pink-button {
  background-color: #FF69B4;
  border-color: #FF69B4;
  color: white;
  border-radius: 18px;
  padding: 8px 16px;
  transition: all 0.3s;
}

.pink-button:hover {
  background-color: #FF1493;
  border-color: #FF1493;
  transform: scale(1.05);
}

.pink-button:active {
  background-color: #DB7093;
  border-color: #DB7093;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Pink dialog styles */
.pink-dialog :deep(.el-dialog) {
  border-radius: 12px;
  background-color: #FFF0F5;
}

.pink-dialog :deep(.el-dialog__header) {
  background-color: #FFB6C1;
  border-radius: 12px 12px 0 0;
  padding: 15px 20px;
  margin: 0;
}

.pink-dialog :deep(.el-dialog__title) {
  color: #C71585;
  font-weight: 600;
}

.pink-dialog :deep(.el-dialog__body) {
  padding: 20px;
  background-color: #FFF0F5;
}

/* Rating section */
.rating-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.rating-label {
  margin-right: 10px;
  font-size: 14px;
  color: #DB7093;
  font-weight: 500;
}

.pink-rating :deep(.el-rate__icon) {
  font-size: 28px;
  margin-right: 5px;
  color: #FF69B4;
}

/* Textarea styling */
.pink-textarea :deep(.el-textarea__inner) {
  border-radius: 10px;
  border: 1px solid #FFB6C1;
  background-color: #FFF9FA;
  padding: 15px;
  font-size: 14px;
  transition: all 0.3s;
}

.pink-textarea :deep(.el-textarea__inner):focus {
  border-color: #FF69B4;
  box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
}

/* Footer buttons */
.dialog-footer {
  text-align: right;
}

.pink-cancel-btn {
  background-color: #FFF0F5;
  color: #FF69B4;
  border: 1px solid #FFB6C1;
  border-radius: 8px;
  padding: 8px 16px;
}

.pink-cancel-btn:hover {
  color: #FF1493;
  border-color: #FF69B4;
}

.pink-submit-btn {
  background-color: #FF69B4;
  border-color: #FF69B4;
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
}

.pink-submit-btn:hover {
  background-color: #FF1493;
  border-color: #FF1493;
}
</style>

<style>
/* Global pink theme styles for dialog messages */
.pink-dialog :deep(.el-message-box) {
  border: 2px solid #FFB6C1;
  border-radius: 12px;
}

.pink-dialog :deep(.el-message-box__header) {
  background-color: #FFF0F5;
  border-radius: 12px 12px 0 0;
}

.pink-dialog :deep(.el-message-box__title) {
  color: #FF69B4;
  font-weight: 600;
}
</style>