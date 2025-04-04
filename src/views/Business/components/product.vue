<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getproductsList, deleteProducts, reviseProducts, addProducts, uploadImageAPI } from '@/apis/business.js';

const products = ref([]);
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const productId = ref(0);
const productForm = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  image: '' // 存储图片路径
});

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取商品数据
const getproducts = async () => {
  const res = await getproductsList({ page: currentPage.value, pageSize: pageSize.value });
  products.value = res.products;
  total.value = res.total;
};

onMounted(getproducts);

// 编辑商品
const handleEdit = (row) => {
  dialogType.value = 'edit';
  productForm.value = { ...row };
  productId.value = row.productId;
  dialogVisible.value = true;
};

// 删除商品
const handleDelete = (row) => {
  ElMessageBox.confirm('Are you sure you want to delete the item?', 'prompt', {
    confirmButtonText: 'yes',
    cancelButtonText: 'no',
    type: 'warning',
  }).then(async () => {
    await deleteProducts(row.productId);
    ElMessage.success('Deleted successfully');
    await getproducts();
  });
};

// 新增商品
const handleAdd = () => {
  dialogType.value = 'add';
  productForm.value = {
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '' // 置空图片
  };
  dialogVisible.value = true;
};

// **处理图片上传**
const handleImageUpload = async (file, productId) => {
  if (!file) {
    console.error("Error: No file provided!");
    ElMessage.error("No file selected");
    return;
  }
  console.log("Uploading file:", file);
  console.log("Product ID:", productId);

  const formData = new FormData();
  formData.append('image', file); // `file.raw` 可能是多余的，直接用 `file`

  try {
    const res = await uploadImageAPI(productId, formData);
    console.log("Upload response:", res);

    if (res.imagePath) {
      productForm.value.image = res.imagePath; // 假设后端返回 `imagePath`
      ElMessage.success('Image uploaded successfully');
    } else {
      throw new Error("No imagePath in response");
    }
  } catch (error) {
    console.error("Upload failed:", error);
    ElMessage.error('Image upload failed');
  }
};


// 提交表单
const handleSubmit = async () => {
  try {
    if (dialogType.value === 'add') {
      await addProducts(productForm.value);
      ElMessage.success('Added successfully');
    } else {
      await reviseProducts(productForm.value, productId.value);
      ElMessage.success('Updated successfully');
    }
    dialogVisible.value = false;
    await getproducts();
  } catch (error) {
    ElMessage.error('Operation failed');
  }
};
</script>


<template>
  <div class="management-container">
    <div class="header">
      <div class="title-row">
        <h2 class="title">Product Management</h2>
        <el-button @click="handleAdd">Add product</el-button>
      </div>

      <el-table :data="products" style="width: 100%" border class="pink-table">
        <el-table-column prop="productId" label="ID" width="300"></el-table-column>
        <el-table-column prop="name" label="Name" width="200"></el-table-column>
        <el-table-column prop="description" label="Description"></el-table-column>
        <el-table-column prop="price" label="Price" width="120" align="right"></el-table-column>
        <el-table-column prop="stock" label="Stock" width="120" align="center"></el-table-column>
        <el-table-column label="Operations" width="420" align="center">
          <template #default="scope">
            <div class="action-buttons">
              <el-button size="small" @click="handleEdit(scope.row)">Edit</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
              <el-upload
                  class="upload-demo"
                  action=""
                  :show-file-list="false"
                  :http-request="(options) => handleImageUpload(options.file, scope.row.productId)"
                  accept="image/*"
              >
                <el-button size="small">Upload Image</el-button>
              </el-upload>            </div>
            <el-image
                v-if="productForm.image"
                :src="productForm.image"
                class="product-image"
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Add/Edit Product Dialog -->
    <el-dialog
        :title="dialogType === 'add' ? 'Add Product' : 'Edit Product'"
        v-model="dialogVisible"
        width="500px"
    >
      <el-form :model="productForm" label-width="100px">
        <el-form-item label="Name">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="productForm.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <div class="form-row">
          <el-form-item label="Price" class="form-col">
            <el-input-number v-model="productForm.price" :min="0" :precision="2"></el-input-number>
          </el-form-item>
          <el-form-item label="Stock" class="form-col">
            <el-input-number v-model="productForm.stock" :min="0"></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.management-container {
  padding: 24px;
  background-color: #fff5f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 24px;

  .title {
    color: #e23d7d;
    margin: 0;
    font-weight: 600;
    font-size: 24px;
  }
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.pink-table {
  width: 100%;

  :deep(.el-table__header) {
    background-color: #fce4ec;

    th {
      background-color: #fce4ec;
      color: #e23d7d;
      font-weight: 600;
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
    margin: 4px;

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

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.product-image {
  width: 100px;
  height: 100px;
  margin-top: 8px;
  border-radius: 4px;
  object-fit: cover;
}

.form-row {
  display: flex;
  gap: 16px;

  .form-col {
    flex: 1;
    margin-bottom: 0;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>