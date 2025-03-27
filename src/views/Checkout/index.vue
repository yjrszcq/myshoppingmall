<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

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
  { id: 'anytime', text: '不限送货时间：周一至周日' },
  { id: 'workday', text: '工作日送货：周一至周五' },
  { id: 'weekend', text: '双休日、假日送货：周六至周日' }
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
const defaultAddress = {
  receiver: '张三',
  contact: '13800138000',
  fullLocation: '北京市 北京市 朝阳区',
  address: '三里屯SOHO 2号楼 2层 2-2-2'
}

// 从本地存储获取购物车商品信息
const getCartInfo = () => {
  const cartInfo = JSON.parse(localStorage.getItem('cartInfo') || '{}')
  if (cartInfo.goods && cartInfo.goods.length > 0) {
    checkInfo.value = {
      goods: cartInfo.goods,
      summary: {
        goodsCount: cartInfo.goods.reduce((sum, item) => sum + item.count, 0),
        totalPrice: cartInfo.goods.reduce((sum, item) => sum + item.price * item.count, 0),
        postFee: 10, // 运费
        totalPayPrice: cartInfo.goods.reduce((sum, item) => sum + item.price * item.count, 0) + 10
      }
    }
  }
}

// 初始化默认地址
onMounted(() => {
  curAddress.value = defaultAddress
  getCartInfo()
})

// 切换支付方式
const changePayMethod = (method) => {
  payMethod.value = method
}

// 切换配送时间
const changeDeliveryTime = (timeId) => {
  deliveryTime.value = timeId
}

// 提交订单
const submitOrder = () => {
  if (!curAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  
  if (payMethod.value === 'online') {
    // 在线支付，跳转到支付页面
    router.push('/payment')
  } else {
    // 货到付款，跳转到银行卡信息页面
    router.push('/bank-info')
  }
}

const address = ref('北京市朝阳区三里屯SOHO 2号楼 2层')
const phone = ref('13800138000')

// 地址列表数据
const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    address: '北京市朝阳区三里屯SOHO 2号楼 2层',
    isDefault: true
  },
  {
    id: 2,
    name: '张三',
    phone: '13800138001',
    address: '上海市浦东新区陆家嘴环路1000号',
    isDefault: false
  }
])

// 新增地址表单数据
const addressForm = ref({
  name: '',
  phone: '',
  address: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

const formRef = ref(null)

// 选择地址
const selectAddress = (addr) => {
  selectedAddress.value = addr
  curAddress.value = {
    receiver: addr.name,
    contact: addr.phone,
    address: addr.address,
    fullLocation: '' // 移除这个字段，因为我们不需要重复显示地址
  }
  toggleFlag.value = false
}

// 添加新地址
const handleAddAddress = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 这里应该调用后端API保存地址
    const newAddress = {
      id: addressList.value.length + 1,
      ...addressForm.value,
      isDefault: false
    }
    addressList.value.push(newAddress)
    addFlag.value = false
    // 重置表单
    addressForm.value = {
      name: '',
      phone: '',
      address: ''
    }
  } catch (error) {
    ElMessage.error('请检查表单信息是否正确')
  }
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址
          <a href="javascript:;" @click="$router.push('/cart')"><i class="iconfont icon-cart" ></i>购物车</a>
        </h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="toggleFlag = true">切换地址</el-button>
              <el-button size="large" @click="addFlag = true">添加地址</el-button>
            </div>
          </div>
        </div>

        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
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
                <td>{{ i.count }}</td>
                <td>&yen;{{ (i.price * i.count).toFixed(2) }}</td>
                <td>&yen;{{ (i.price * i.count).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
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
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn" :class="{ active: payMethod === 'online' }" href="javascript:;" @click="changePayMethod('online')">在线支付</a>
          <a class="my-btn" :class="{ active: payMethod === 'cod' }" href="javascript:;" @click="changePayMethod('cod')">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>

        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>手<i></i>续费：</dt>
              <dd>¥{{ serviceFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥{{ totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>

        <!-- 提交订单 -->
        <div class="submit">
          <el-button size="large" style="background-color: #ff66b3;color: white" @click="submitOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <!-- 添加地址 -->

  <!-- 地址选择弹窗 -->
  <el-dialog
    v-model="toggleFlag"
    title="选择收货地址"
    width="500px"
  >
    <div class="address-list">
      <div
        v-for="addr in addressList"
        :key="addr.id"
        class="address-item"
        :class="{ active: selectedAddress?.id === addr.id }"
        @click="selectAddress(addr)"
      >
        <div class="address-content">
          <div class="address-header">
            <span class="name">{{ addr.name }}</span>
            <span class="phone">{{ addr.phone }}</span>
            <el-tag v-if="addr.isDefault" size="small" type="success">默认</el-tag>
          </div>
          <div class="address-detail">{{ addr.address }}</div>
        </div>
        <div class="radio-wrapper">
          <el-radio :model-value="selectedAddress?.id" :label="addr.id">
            <span class="sr-only">选择地址</span>
          </el-radio>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 新增地址弹窗 -->
  <el-dialog
    v-model="addFlag"
    title="新增收货地址"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="addressForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="收货人" prop="name">
        <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="addressForm.phone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          v-model="addressForm.address"
          type="textarea"
          :rows="3"
          placeholder="请输入详细地址"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addFlag = false">取消</el-button>
        <el-button type="primary" @click="handleAddAddress">确定</el-button>
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

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
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
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
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
    }

    &.active {
      border-color: #ff66b3;
      background-color: #fff5f8;
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