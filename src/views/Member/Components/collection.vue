<template>
  <div class="collection-container">
    <el-card class="collection-card">
      <template #header>
        <div class="card-header">
          <span class="title">我的收藏</span>
          <!-- <el-button type="primary" @click="showAddDialog">添加收藏</el-button> -->
        </div>
      </template>
      
      <el-table :data="collectionList" style="width: 100%">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="currentPrice" label="价格">
          <template #default="scope">
            <span class="price">¥{{ scope.row.currentPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productId" label="商品id" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" size="small" @click="removeCollection(scope.row)">
              移出收藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加收藏对话框 -->
    <el-dialog v-model="dialogVisible" title="添加收藏" width="30%">
      <el-form :model="newCollection" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="newCollection.title" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="newCollection.price" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addCollection">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,onMounted  } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyCollect,removeCollect } from '@/apis/vip.js'
// 收藏列表数据
const collectionList = ref([
  {
    id: 1,
    title: '示例商品1',
    price: 199,
    date: '2025-04-18'
  },
  {
    id: 2,
    title: '示例商品2',
    price: 299,
    date: '2025-04-18'
  }
])
onMounted(() => {
  fetchCollectionList()
})
let pages = 1
let pageSize = 10
// 获取收藏列表数据
const fetchCollectionList = async () => {
  try {
    const response = await getMyCollect(pages, pageSize)
    console.log(response.favorites," 获取收藏列表数据");
    
    collectionList.value = response.favorites || []
  } catch (error) {
    ElMessage.error('获取收藏列表失败')
  }
}

// 控制添加收藏对话框显示
const dialogVisible = ref(false)

// 新收藏商品数据
const newCollection = ref({
  title: '',
  price: 0
})

// 显示添加对话框
const showAddDialog = () => {
  dialogVisible.value = true
  newCollection.value = {
    title: '',
    price: 0
  }
}

// 添加收藏
const addCollection = () => {
  if (!newCollection.value.title) {
    ElMessage.warning('请输入商品名称')
    return
  }
  
  const collection = {
    id: collectionList.value.length + 1,
    title: newCollection.value.title,
    price: newCollection.value.price,
    date: new Date().toISOString().split('T')[0]
  }
  
  collectionList.value.push(collection)
  dialogVisible.value = false
  ElMessage.success('添加收藏成功')
}

// 移出收藏
const removeCollection = (item) => {
    //id转为字符串
    item.productId = String(item.productId)
  //调取移出收藏接口
    removeCollect(item.productId).then((res) => {
        if (res.code === 200) {
        ElMessage.success('移出收藏成功')
        collectionList.value = collectionList.value.filter(i => i.id !== item.id)
        } else {
        ElMessage.error('移出收藏失败')
        }
    }).catch((error) => {
        console.error(error)
        ElMessage.error('移出收藏失败')
    })
}

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

.dialog-footer {
  margin-top: 20px;
}
</style>