<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getproductsList, deleteProducts, reviseProducts, addProducts } from '../../../apis/business';
const products = ref([
  { id: 1, name: 'goods A', price: 100, stock: 50 },
  { id: 2, name: 'goods B', price: 200, stock: 30 },
  { id: 3, name: 'goods C', price: 300, stock: 20 },
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
  ElMessageBox.confirm('Are you sure you want to delete the item?', 'prompt', {
    confirmButtonText: 'yes',
    cancelButtonText: 'no',
    type: 'warning',
  }).then(() => {
    console.log(row.productId);
    
    deleteProducts(row.productId).then(() => {
      getproducts()
      ElMessage.success('success');
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
      ElMessage.success('added successfully')
    } else {
      await reviseProducts(productForm.value)
      ElMessage.success('updated successfully')
    }
    dialogVisible.value = false
    getproducts()
  } catch (error) {
    ElMessage.error('failed')
  }
}
</script>

<template>
  <div class="management-container">
    <div class="header">
      <div class="title-row">
        <h2 class="title">Product Management</h2>
        <el-button @click="handleAdd">Add product</el-button>
      </div>
      
      <el-table :data="products" style="width: 100%" border class="pink-table">
        <el-table-column prop="productId" label="ID" width="50"></el-table-column>
        <el-table-column prop="name" label="name" width="200"></el-table-column>
        <el-table-column prop="description" label="description"></el-table-column>
        <el-table-column prop="price" label="price" width="100"></el-table-column>
        <el-table-column prop="stock" label="stock" width="100"></el-table-column>
        <el-table-column label="operation"owidth="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑商品对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? 'add product' : 'edit product'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="productForm" label-width="100px">
        <el-form-item label="name">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <el-form-item label="description">
          <el-input v-model="productForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="price">
          <el-input-number v-model="productForm.price" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="stock">
          <el-input-number v-model="productForm.stock" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">cancel</el-button>
          <el-button type="primary" @click="handleSubmit">ok</el-button>
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