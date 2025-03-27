<template>
  <div class="address-container">
    <el-card class="address-card">
      <div class="header">
        <h3>收货地址管理</h3>
        <el-button type="primary" @click="handleAdd" :icon="Plus">添加新地址</el-button>
      </div>
      
      <div class="address-list">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(address, index) in addressList" :key="index">
            <el-card class="address-item" shadow="hover">
              <div class="info">
                <p><span class="label">收货人： </span>{{ address.name }}</p>
                <p><span class="label">联系电话：</span>{{ address.phone }}</p>
                <p><span class="label">收货地址：</span>{{ address.address }}</p>
              </div>
              <div class="actions">
                <el-button type="primary" text @click="handleEdit(address)">编辑</el-button>
                <el-button type="danger" text @click="handleDelete(index)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑地址' : '新增地址'"
      width="50%"
    >
      <el-form :model="addressForm" ref="addressFormRef" :rules="rules" label-width="100px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input type="textarea" v-model="addressForm.address" placeholder="请输入详细地址"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)

const addressList = ref([
  {
    name: '张三',
    phone: '13800138000',
    address: '北京市朝阳区xxx街道xxx号'
  }
])

const addressForm = reactive({
  name: '',
  phone: '',
  address: ''
})

const rules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const handleAdd = () => {
  isEdit.value = false
  dialogVisible.value = true
  Object.keys(addressForm).forEach(key => addressForm[key] = '')
}

const handleEdit = (address) => {
  isEdit.value = true
  dialogVisible.value = true
  editIndex.value = addressList.value.indexOf(address)
  Object.assign(addressForm, address)
}

const handleDelete = (index) => {
  ElMessageBox.confirm('确定要删除该地址吗？', '提示', {
    type: 'warning'
  }).then(() => {
    addressList.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

const submitForm = async () => {
  if (isEdit.value) {
    Object.assign(addressList.value[editIndex.value], addressForm)
    ElMessage.success('修改成功')
  } else {
    addressList.value.push({ ...addressForm })
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.address-container {
  padding: 20px;
}

.address-card {
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h3 {
  color: #ff9999;
  margin: 0;
}

.address-list {
  margin-top: 20px;
}

.address-item {
  margin-bottom: 20px;
  border: 1px solid #ffecec;
  transition: all 0.3s;
}

.address-item:hover {
  border-color: #ff9999;
}

.info {
  padding: 10px 0;
}

.label {
  color: #ff9999;
  font-weight: bold;
}

.actions {
  border-top: 1px solid #ffecec;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-button--primary) {
  --el-button-bg-color: #ff9999;
  --el-button-border-color: #ff9999;
  --el-button-hover-bg-color: #ffb3b3;
  --el-button-hover-border-color: #ffb3b3;
}

:deep(.el-button--primary.is-text) {
  color: #ff9999;
}

:deep(.el-button--danger.is-text) {
  color: #ff6666;
}
</style>