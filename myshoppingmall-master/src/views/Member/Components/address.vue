<template>
  <div class="address-container">
    <el-card class="address-card">
      <div class="header">
        <h3>Shipping address management</h3>
        <el-button type="primary" @click="handleAdd" :icon="Plus">Add a new address</el-button>
      </div>
      
      <div class="address-list">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(address, index) in addressList" :key="index">
            <el-card class="address-item" shadow="hover">
              <div class="info">
                <p><span class="label">Zip code: </span>{{ address.postalCode }}</p>
                <p><span class="label">Harvest the city：</span>{{ address.city }}</p>
                <p><span class="label">Full address：</span>{{ address.address }}</p>
              </div>
              <div class="actions">
                <el-button type="primary" text @click="handleEdit(address)">edit</el-button>
                <el-button type="danger" text @click="handleDelete(index)">delete</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Edit the address' : 'Add an address'"
      width="50%"
    >
      <el-form :model="addressForm" ref="addressFormRef" :rules="rules" label-width="100px">
        <el-form-item label="Zip code" prop="postalCode">
          <el-input v-model="addressForm.postalCode" placeholder="Please enter the name of the consignee"/>
        </el-form-item>
        <el-form-item label="Receiving city" prop="city">
          <el-input v-model="addressForm.city" placeholder="Please enter your contact number"/>
        </el-form-item>
        <el-form-item label="Full address" prop="address">
          <el-input type="textarea" v-model="addressForm.address" placeholder="Please enter your address details"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitForm">ok</el-button>
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
  postalCode: [{ required: true, message: 'Please enter the name of the consignee', trigger: 'blur' }],
  city: [
    { required: true, message: 'Please enter your contact number', trigger: 'blur' },
  ],
  address: [{ required: true, message: 'Please enter your address details', trigger: 'blur' }]
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
    ElMessage.success('The deletion is successful');
    await fetchAddressList(); // 重新获取列表
  } catch (error) {
    ElMessage.error('Deletion failed');
  }
};

// 提交表单（添加或编辑地址）
const submitForm = async () => {
  try {
    if (isEdit.value) {
      addressStore.updateAddress(addressList.value[editIndex.value].addressId, addressForm);
      ElMessage.success('The modification was successful');
    } else {
      addressStore.addAddress(addressForm);
      ElMessage.success('The addition was successful');
    }
    dialogVisible.value = false;
    await fetchAddressList(); // 重新获取列表
  } catch (error) {
    console.log(error);
    ElMessage.error('The operation failed');
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