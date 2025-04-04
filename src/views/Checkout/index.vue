<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cartStore.js'
import { useAddressStore } from '@/stores/addressStore'
import { addAddressAPI } from '@/apis/vip.js'
import { submitOrderAPI } from '@/apis/order'
import { getCartInfoAPI } from '@/apis/cart'


const router = useRouter()
const checkInfo = ref({})  // 订单对象
const curAddress = ref({})  // 地址对象
const payMethod = ref('online') // 支付方式
const toggleFlag = ref(false) // 切换地址弹窗
const addFlag = ref(false) // 添加地址弹窗
const selectedAddress = ref(null)

// 配送时间选择
const deliveryTime = ref('anytime') // 默认选择不限送货时间
const deliveryOptions = [

{ "id": "anytime", "text": "No delivery time limit: Monday to Sunday" },
{ "id": "workday", "text": "Delivery on weekdays: Monday to Friday" },
{ "id": "weekend", "text": "Delivery on weekends and holidays: Saturday to Sunday" }

]

// 计算手续费
const serviceFee = computed(() => {
  return payMethod.value === 'online' ? 0 : 5
})

// 计算应付总额
const totalPayPrice = computed(() => {
  if (!checkInfo.value.summary) return 0
  return checkInfo.value.summary.totalPrice + checkInfo.value.summary.postFee + serviceFee.value
})

// 默认地址
const defaultAddress = ref({})

//从cart中直接获取
const getCartInfo = () => {
  const cartStore = useCartStore();

  // 1. 筛选出被选中的商品（item.selected === true）
  const selectedGoods = cartStore.cartList.filter(item => item.selected);

  // 2. 如果没有选中商品，清空 checkInfo 并提示
  if (selectedGoods.length === 0) {
    checkInfo.value = null; // 或者设为空对象 {}

    ElMessage.warning('Please select the product you want to check');

    return;
  }

  // 3. 计算选中商品的总价、运费和应付总额
  const totalPrice = selectedGoods.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const postFee = 10; // 运费
  const totalPayPrice = totalPrice + postFee;

  // 4. 更新 checkInfo.value（直接赋值）
  checkInfo.value = {
    goods: selectedGoods, // 仅包含选中的商品
    summary: {
      goodsCount: selectedGoods.reduce((sum, item) => sum + item.quantity, 0), // 选中商品总数量
      totalPrice,   // 选中商品总价
      postFee,      // 运费
      totalPayPrice // 应付总额（总价 + 运费）
    }
  };
};



// 切换支付方式
const changePayMethod = (method) => {
  payMethod.value = method
}

// 切换配送时间
const changeDeliveryTime = (timeId) => {
  deliveryTime.value = timeId
}

// 提交订单
const submitOrder = async () => {
  if (!curAddress.value) {
    ElMessage.warning('Please select a shipping address')
    return
  }
  
  try {
    // 获取购物车信息
    const cartResponse = await getCartInfoAPI()
    const cartId = cartResponse.cartId
    console.log(cartResponse,"cart")
    
    if (!cartId) {
      ElMessage.error('获取购物车信息失败')
      return
    }
    
    // 提交订单到后端
    const response = await submitOrderAPI(cartId)
    console.log('订单创建成功，订单ID:', response.orderIds[0])
    
    // 保存购物车信息到localStorage
    const cartInfo = {
      cartId: cartId,
      orderId: response.orderIds[0], // 保存订单ID
      goods: checkInfo.value.goods,
      summary: checkInfo.value.summary,
      address: curAddress.value
    }
    localStorage.setItem('cartInfo', JSON.stringify(cartInfo))
    
    if (payMethod.value === 'online') {
      // 在线支付，跳转到支付页面，并传递orderId
      router.push({
        path: '/payment',
        query: { orderId: response.orderIds[0] }
      })
    } else {
      // 货到付款，跳转到银行卡信息页面
      router.push('/bank-info')
    }
  } catch (error) {
    console.error('订单提交失败:', error)
    ElMessage.error('订单提交失败，请重试')
  }
}


// 地址列表数据
const addressList = ref([])
const addressStore = useAddressStore();
const fetchAddressList = async () => {
  await addressStore.getAddressList();
  addressList.value = addressStore.addressList;

  if (addressList.value.length > 0) {
    // 找到默认地址或使用第一个地址
    const defaultAddr = addressList.value.find(addr => addr.isDefault) || addressList.value[0];
    defaultAddress.value = defaultAddr;
  } else {
    defaultAddress.value = {};
  }
};

// 添加 watch 监听 defaultAddress
watch(defaultAddress, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    curAddress.value = {
      postalCode: newVal.postalCode,
      city: newVal.city,
      address: newVal.address,
      // 根据你的实际需求添加其他字段
    }
  } else {
    curAddress.value = {}
  }
}, { immediate: true })

// 新增地址表单数据
const addressForm = ref({
  postalCode: '',
  city: '',
  address: ''
})

// 表单验证规则
const rules = {
  postalCode: [

    { required: true, message: 'Please enter the postal code', trigger: 'blur' }
  ],
  city: [
    { required: true, message: 'Please enter the city', trigger: 'blur' },
  ],
  address: [
    { required: true, message: 'Please enter the detailed address', trigger: 'blur' }

  ]
}

const formRef = ref(null)

// 选择地址
const selectedAddressId = ref(null) // 添加 selectedAddressId 变量，初始值为空
const selectAddress = (addr) => {
  selectedAddress.value = addr
  console.log(addr,"addr")
  selectedAddressId.value = addr.addressId
  curAddress.value = {
    addressId: addr.addressId,
    postalCode: addr.postalCode,
    city: addr.city,
    address: addr.address,
    fullLocation: '' // 移除这个字段，因为我们不需要重复显示地址
  }
  toggleFlag.value = false
}

// 添加新地址
const handleAddAddress = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate(); // 先校验表单

    // 调用后端 API 保存地址
    const response = await addAddressAPI(addressForm.value);

    // 如果添加成功，重新获取地址列表
    await fetchAddressList()

    // 关闭弹窗
    addFlag.value = false;

    // 重置表单
    addressForm.value = {
      postalCode: '',
      city: '',
      address: ''
    };


    ElMessage.success('The address is added successfully');
  } catch (error) {
    ElMessage.error('Failed to add address, please check the form information');
    console.error('Failed to add address:', error);

  }
};

// 初始化默认地址
onMounted(() => {
  getCartInfo()
  fetchAddressList()
})

</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->

        <h3 class="box-title">Delivery address
          <a href="javascript:;" @click="$router.push('/cart')"><i class="iconfont icon-cart" ></i>Shopping cart</a>

        </h3>
        <div class="box-body">
          <div class="address">
            <div class="text">

              <div class="none" v-if="!curAddress">You will need to add a shipping address before you can submit your order.</div>
              <ul v-else>
                <li><span>Postal Code:</span>{{ curAddress.postalCode }}</li>
                <li><span>City:</span>{{ curAddress.city }}</li>
                <li><span>Address:</span>{{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="toggleFlag = true">Switch addresses</el-button>
              <el-button size="large" @click="addFlag = true">Add address</el-button>

            </div>
          </div>
        </div>

        <!-- 商品信息 -->

        <h3 class="box-title">Product information</h3>

        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>

              <th width="400">Product information</th>
              <th width="220">unit price</th>
              <th width="180">quantity</th>
              <th width="180">total</th>
              <th width="140">operation</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.quantity }}</td>
                <td>&yen;{{ (i.price * i.quantity).toFixed(2) }}</td>
                <td>&yen;{{ (i.price * i.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 配送时间 -->

        <h3 class="box-title">Delivery time</h3>

        <div class="box-body">
          <a 
            v-for="option in deliveryOptions" 
            :key="option.id"
            class="my-btn" 
            :class="{ active: deliveryTime === option.id }" 
            href="javascript:;"
            @click="changeDeliveryTime(option.id)"
          >
            {{ option.text }}
          </a>
        </div>

        <!-- 支付方式 -->

        <h3 class="box-title">Payment Methods</h3>
        <div class="box-body">
          <a class="my-btn" :class="{ active: payMethod === 'online' }" href="javascript:;" @click="changePayMethod('online')">Online Payment</a>
          <a class="my-btn" :class="{ active: payMethod === 'cod' }" href="javascript:;" @click="changePayMethod('cod')">Cash on Delivery</a>
          <span style="color:#999">Cash on Delivery requires a 5 yuan handling fee</span>
        </div>

        <!-- 金额明细 -->
        <h3 class="box-title">Amount breakdown</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>Items Number:</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>Item total price：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>Fare<i></i>:</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>Hand<i></i> Renewal:</dt>
              <dd>¥{{ serviceFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>Total amount payable:</dt>

              <dd class="price">¥{{ totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>

        <!-- 提交订单 -->
        <div class="submit">

          <el-button size="large" style="background-color: #ff66b3;color: white" @click="submitOrder">Submit your order</el-button>

        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <!-- 添加地址 -->

  <!-- 地址选择弹窗 -->
  <el-dialog
      v-model="toggleFlag"

      title="Select the shipping address"

      width="500px"
  >
    <div class="address-list" >
      <div
          v-for="addr in addressList"
          :key="addr.id"
          class="address-item"
          :class="{ active: selectedAddress?.id === addr.id }"
          @click="selectAddress(addr)"
      >
        <div class="address-content" >
          <div class="address-header">
            <span class="name">{{ addr.postalCode }}</span>
            <span class="phone">{{ addr.city }}</span>

            <el-tag v-if="addr.isDefault" size="small" type="success">default</el-tag>

          </div>
          <div class="address-detail">{{ addr.address }}</div>
        </div>
        <div class="radio-wrapper">
          <el-radio
              v-model="selectedAddressId"
              :label="addr.id"
              @change="selectAddress(addr)"
          >

            <span class="sr-only">Select an address</span>

          </el-radio>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 新增地址弹窗 -->
  <el-dialog
    v-model="addFlag"

    title="New address for additional shipments"

    width="500px"
  >
    <el-form
      ref="formRef"
      :model="addressForm"
      :rules="rules"
      label-width="80px"
    >

    <el-form-item label="Postal Code" prop="postalCode">
      <el-input v-model="addressForm.postalCode" placeholder="Please enter the postal code" />
    </el-form-item>
    <el-form-item label="City" prop="city">
      <el-input v-model="addressForm.city" placeholder="Please enter the city" />
    </el-form-item>
    <el-form-item label="Address" prop="address">
      <el-input
        v-model="addressForm.address"
        type="textarea"
        :rows="3"
        placeholder="Please enter the detailed address"
      />
    </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addFlag = false">cancel</el-button>
        <el-button type="primary" @click="handleAddAddress">ok</el-button>

      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;

      display: flex;           // 让标题和按钮横向排列
      justify-content: space-between; // 左右分散
      align-items: center;     // 垂直居中

      .back-button {
        margin-right: 10px;  // 距离边缘留点间距
      }
      a {
        padding: 0 15px;
        color: #d86f6f;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: $xtxColor;
        }
      }
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;
    align-items: center;
    height: 70px;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
      object-fit: cover;
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;

      p {
        line-height: 24px;
        margin: 0;

        &:first-child {
          font-size: 16px;
          margin-bottom: 4px;
        }

        &:last-child {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
      height: 50px;
      font-size: 16px;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      vertical-align: middle;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }

    td:first-child {
      padding: 10px 20px;
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  transition: all 0.3s; // 添加过渡效果

  &.active,
  &:hover {
    border-color: #ff66b3;
    color: #ff66b3; // 添加文字颜色变化
  }

  &.active {
    background-color: #fff5f8; // 添加选中状态的背景色
  }
}

.total {
  padding: 20px 30px;

  dl {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px; // 增加行间距
    font-size: 16px; // 增加字体大小

    &:last-child {
      margin-bottom: 0;
    }

    dt {
      width: 140px; // 统一宽度，保证对齐
      text-align: right;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      i {
        display: inline-block;
        width: 1em;
        height: 1em;
      }
    }

    dd {
      width: 140px; // 统一宽度
      text-align: right;
      padding-right: 50px;

      &.price {
        font-size: 20px;
        color: #ff66b3;
      }
    }
  }
}

.submit {
  text-align: center;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: scale($xtxColor, 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}

.address-list {
  .address-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #ff66b3;
      background: white;
    }

    &.active {
      border-color: #ff66b3;
      background-color: white;
    }

    .address-content {
      flex: 1;
      margin-right: 15px;

      .address-header {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        .name {
          font-size: 16px;
          font-weight: bold;
        }

        .phone {
          color: #666;
        }
      }

      .address-detail {
        color: #666;
        line-height: 1.5;
        font-size: 14px;
      }
    }

    .radio-wrapper {
      padding-left: 10px;
    }
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>