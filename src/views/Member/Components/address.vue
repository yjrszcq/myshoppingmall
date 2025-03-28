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
                <p><span class="label">邮政编码： </span>{{ address.postalCode }}</p>
                <p><span class="label">收获城市：</span>{{ address.city }}</p>
                <p><span class="label">详细地址：</span>{{ address.address }}</p>
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
        <el-form-item label="邮政编码" prop="postalCode">
          <el-input v-model="addressForm.postalCode" placeholder="请输入收货人姓名"/>
        </el-form-item>
        <el-form-item label="收货城市" prop="city">
          <el-input v-model="addressForm.city" placeholder="请输入联系电话"/>
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
import { ref, reactive,onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {useAddressStore} from "@/stores/addressStore.js";

const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)


// 地址列表数据
const addressList = ref([])
// 下一版优化
// const defalutAddressList = ref([]);
const addressStore = useAddressStore();
const fetchAddressList = async () => {
  await addressStore.getAddressList();
  addressList.value = addressStore.addressList;

  if (addressList.value.length > 0) {
    // 找到默认地址或使用第一个地址
    const defaultAddr = addressList.value.find(addr => addr.isDefault) || addressList.value[0];
    // defaultAddress.value = defaultAddr;
  } else {
    // defaultAddress.value = {};
  }
};

const addressForm = reactive({
  postalCode: '',
  city: '',
  address: ''
})

const rules = {
  postalCode: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  city: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

// 添加新地址
const handleAdd = () => {
  isEdit.value = false;
  dialogVisible.value = true;
  Object.keys(addressForm).forEach(key => addressForm[key] = '');
};

// 编辑地址
const handleEdit = (address) => {
  isEdit.value = true;
  dialogVisible.value = true;
  editIndex.value = addressList.value.indexOf(address);
  Object.assign(addressForm, address);
};

// 删除地址
const handleDelete = async (addressId) => {
  try {
    await addressStore.deleteAddress(addressId);
    ElMessage.success('删除成功');
    await fetchAddressList(); // 重新获取列表
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

// 提交表单（添加或编辑地址）
const submitForm = async () => {
  try {
    if (isEdit.value) {
      addressStore.updateAddress(addressList.value[editIndex.value].addressId, addressForm);
      ElMessage.success('修改成功');
    } else {
      addressStore.addAddress(addressForm);
      ElMessage.success('添加成功');
    }
    dialogVisible.value = false;
    await fetchAddressList(); // 重新获取列表
  } catch (error) {
    console.log(error);
    ElMessage.error('操作失败');
  }
};

// 初始化默认地址
onMounted(() => {
  fetchAddressList()
})
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