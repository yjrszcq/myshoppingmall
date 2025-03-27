<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getproductsList, deleteProducts, reviseProducts, addProducts } from '../../../apis/business';
const products = ref([
  { id: 1, name: '商品A', price: 100, stock: 50 },
  { id: 2, name: '商品B', price: 200, stock: 30 },
  { id: 3, name: '商品C', price: 300, stock: 20 },
]);
//根据接口获取数据
onMounted(async () => {
  getproducts()
})

//获取数据函数
const getproducts = async () => {
  const res = await getproductsList({
    page: currentPage.value,
    pageSize: pageSize.value
  })
  products.value = res.products
  total.value = res.total
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  productForm.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    console.log(row.productId);
    
    deleteProducts(row.productId).then(() => {
      getproducts()
      ElMessage.success('商品已删除');
    })
    
  });
};

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const handleCurrentChange = (val) => {
  currentPage.value = val
  getproducts()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  getproducts()
}

const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const productForm = ref({
  name: '',
  description: '',
  price: '',
  stock: ''
})

// 打开新增商品对话框
const handleAdd = () => {
  dialogType.value = 'add'
  productForm.value = {
    name: '',
    description: '',
    price: '',
    stock: ''
  }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (dialogType.value === 'add') {
      await addProducts(productForm.value)
      ElMessage.success('商品添加成功')
    } else {
      await reviseProducts(productForm.value)
      ElMessage.success('商品更新成功')
    }
    dialogVisible.value = false
    getproducts()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<template>
  <div class="management-container">
    <div class="header">
      <div class="title-row">
        <h2 class="title">商品管理</h2>
        <el-button @click="handleAdd">新增商品</el-button>
      </div>
      
      <el-table :data="products" style="width: 100%" border class="pink-table">
        <el-table-column prop="productId" label="ID" width="50"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
        <el-table-column prop="description" label="商品介绍"></el-table-column>
        <el-table-column prop="price" label="价格" width="100"></el-table-column>
        <el-table-column prop="stock" label="库存" width="100"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑商品对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="productForm" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-input v-model="productForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="productForm.price" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="productForm.stock" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

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
    
    &.el-button--danger {
      background-color: #ff4081;
      border-color: #ff4081;
      
      &:hover {
        background-color: #f50057;
        border-color: #f50057;
      }
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  height: 50px;
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

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>