<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/dist/index.css";
import { getEvaluate, submitEvaluate } from "@/apis/detail";
import { useRoute } from "vue-router";

const route = useRoute();

interface Comment {
  id: number;
  username: string;
  content: string;
  date: string;
  avatar: string;
}

// 模拟更多的评论数据
const allComments = ref<Comment[]>([]);

const form = ref({
  comment: "",
  rating: 0,
});


// 分页相关
const currentPage = ref(1);
const pageSize = ref(3);
const total = ref(0);

// 当前页的评论
const currentComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allComments.value.slice(start, end);
});

// 处理页码改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getEvaluates();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 获取评价
const getEvaluates = async () => {
  const res = await getEvaluate({
    productId: route.params.id,
    page: currentPage.value,
    limit: pageSize.value,
  });
  console.log(res.reviews[0]);
  total.value = res.total;
  allComments.value = res.reviews;
};
getEvaluates();
</script>

<template>
  <div class="comment-section">
    <h2 class="comment-title">COMMENTS</h2>

    <!-- 评论列表 -->
    <div class="comments-list">
      <el-card
        v-for="comment in currentComments"
        :key="comment.id"
        class="comment-card"
      >
        <div class="comment-header">
          <!-- <el-avatar :src="comment.avatar" :size="40" /> -->
          <div class="comment-info">
            <div class="username">{{ comment.username }}</div>
            <div class="date">{{ comment.createdAt }}</div>
          </div>
        </div>
        <div class="comment-content">
          {{ comment.comment }}
        </div>
        <el-rate disabled />
      </el-card>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        background
      />
    </div>

  </div>
</template>

<style scoped>
.comment-section {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.comment-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.comments-list {
  margin-bottom: 30px;
}

.comment-card {
  margin-bottom: 16px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}


.username {
  font-weight: bold;
  color: #333;
}

.date {
  font-size: 12px;
  color: #999;
}

.comment-content {
  color: #666;
  line-height: 1.6;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 20px 0 40px;
}

.comment-input {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.submit-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
