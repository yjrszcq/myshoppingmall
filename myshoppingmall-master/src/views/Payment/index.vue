<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cartStore.js'

const router = useRouter()
const payMethod = ref('alipay') // 默认支付宝支付

// 生成支付标识字符串
const generatePaymentId = () => {
  // 获取当前日期
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // 年份后两位
  const month = (now.getMonth() + 1).toString().padStart(2, '0') // 月份，补零
  const day = now.getDate().toString().padStart(2, '0') // 日期，补零
  const hour = now.getHours().toString().padStart(2, '0') // 小时，补零
  const minute = now.getMinutes().toString().padStart(2, '0') // 分钟，补零
  
  // 生成4位随机字母（不包含容易混淆的字母）
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // 排除了容易混淆的I和O
  let randomLetters = ''
  for (let i = 0; i < 4; i++) {
    randomLetters += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  
  // 组合支付标识：PAY + 年月日时分 + 4位随机字母
  return `PAY${year}${month}${day}${hour}${minute}${randomLetters}`
}

// 支付标识字符串
const paymentId = ref(generatePaymentId())

// 从本地存储获取支付金额
const totalAmount = ref(0)
onMounted(() => {
  const cartInfo = JSON.parse(localStorage.getItem('cartInfo') || '{}')
  if (cartInfo.summary) {
    totalAmount.value = cartInfo.summary.totalPayPrice
  }
})

// 支付方式列表
const payMethods = [
  { 
    id: 'alipay', 
    name: 'Alipay payment', 
    icon: '/src/assets/images/alipay.svg',
    qrcode: '/src/assets/images/alipay_qrcode.jpg'
  },
  { 
    id: 'wechat', 
    name: 'WeChat Pay', 
    icon: '/src/assets/images/wechat.svg',
    qrcode: '/src/assets/images/wechat_qrcode.jpg'
  },
  { 
    id: 'card', 
    name: 'Pay by card', 
    icon: '/src/assets/images/card.svg'
  }
]

// 银行卡表单数据
const cardForm = ref({
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: ''
})

// 表单验证规则
const rules = {
  cardNumber: [
    { required: true, message: 'Please enter your bank card number', trigger: 'blur' },
    { pattern: /^\d{16,19}$/, message: 'Please enter the correct card number', trigger: 'blur' }
  ],
  cardHolder: [
    { required: true, message: 'Please enter the cardholder\'s name', trigger: 'blur' }
  ],
  expiryDate: [
    { required: true, message: 'Please enter an expiration date', trigger: 'blur' },
    { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'Please enter the correct expiration format(MM/YY)', trigger: 'blur' }
  ],
  cvv: [
    { required: true, message: 'Please enter the CVV code', trigger: 'blur' },
    { pattern: /^\d{3,4}$/, message: 'Please enter the correct CVV code', trigger: 'blur' }
  ]
}

const formRef = ref(null)

// 选择支付方式
const selectPayMethod = (method) => {
  payMethod.value = method
  // 切换支付方式时重新生成标识字符串
  paymentId.value = generatePaymentId()
}

// 确认支付
const confirmPay = async () => {
  const cartStore = useCartStore()

  if (payMethod.value === 'card') {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      // 支付成功后的逻辑
      await handleSuccessfulPayment(cartStore)

      ElMessage.success('success')
      router.push('/member/order')
    } catch (error) {
      ElMessage.error('Please check that your card details are correct')
    }
  } else {
    // 非银行卡支付的成功逻辑
    await handleSuccessfulPayment(cartStore)

    ElMessage.success('success')
    router.push('/member/order')
  }
}

// 支付成功后的处理函数
const handleSuccessfulPayment = async (cartStore) => {
  try {
    // 1. 获取选中的商品（准备移除）
    const selectedItems = cartStore.cartList.filter(item => item.selected)

    // 2. 如果没有选中商品，理论上不应该发生，因为结算前应该检查
    if (selectedItems.length === 0) {
      console.warn('The payment was successful, but the item that needs to be removed is not selected')
      return
    }

    // 3. 根据登录状态处理购物车
    if (cartStore.isLogin) {
      // 已登录用户：调用API批量删除
      const deletePromises = selectedItems.map(item =>
          cartStore.delCart(item.productId)
      )
      await Promise.all(deletePromises)
    } else {
      // 未登录用户：本地移除选中的商品
      selectedItems.forEach(item => {
        cartStore.delCart(item.productId)
      })
    }

    // 4. 可以在这里添加订单创建逻辑（如果需要）
    // await createOrderAPI(selectedItems)

  } catch (error) {
    console.error('The payment was successful but the cart update failed:', error)
    // 这里可以选择不提示用户，因为支付已经成功了
    // 或者记录错误日志以便后续处理
  }
}
</script>

<template>
  <div class="payment-page">
    <div class="container">
      <div class="wrapper">
        <div class="payment-amount">
          <span class="amount-label">Payment Amount:</span>
          <span class="amount-value">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <h3 class="box-title">Select a payment method</h3>
        <div class="box-body">
          <div class="pay-methods">
            <div 
              v-for="method in payMethods" 
              :key="method.id"
              class="pay-method-item"
              :class="{ active: payMethod === method.id }"
              @click="selectPayMethod(method.id)"
            >
              <img :src="method.icon" :alt="method.name" class="pay-icon">
              <span>{{ method.name }}</span>
            </div>
          </div>

          <!-- 支付二维码区域 -->
          <div class="qrcode-container" v-if="payMethod === 'alipay' || payMethod === 'wechat'">
            <div class="qrcode-box">
              <img 
                :src="payMethods.find(m => m.id === payMethod)?.qrcode" 
                :alt="payMethods.find(m => m.id === payMethod)?.name"
                class="qrcode-img"
              >
              <p class="qrcode-tip">Please use{{ payMethod === 'alipay' ? 'Alipay' : 'WeChat' }}Scan the QR code to pay</p>
              
              <!-- 支付标识字符串 -->
              <div class="payment-id-box">
                <p class="payment-id-label">Payment Identifier:</p>
                <p class="payment-id">{{ paymentId }}</p>
                <p class="payment-id-tip">Please note this payment identifier when making a transfer</p>
                <p class="payment-id-tip">（The logo contains: payment date and time + 4 letters）</p>
              </div>
            </div>
          </div>

          <!-- 银行卡信息输入区域 -->
          <div class="card-form-container" v-if="payMethod === 'card'">
            <el-form
              ref="formRef"
              :model="cardForm"
              :rules="rules"
              label-width="120px"
              class="card-form"
            >
              <el-form-item label="cardNumber" prop="cardNumber">
                <el-input v-model="cardForm.cardNumber" placeholder="Please enter your bank card number" />
              </el-form-item>
              <el-form-item label="cardHolder" prop="cardHolder">
                <el-input v-model="cardForm.cardHolder" placeholder="Please enter the cardholder's name" />
              </el-form-item>
              <el-form-item label="expiryDate" prop="expiryDate">
                <el-input v-model="cardForm.expiryDate" placeholder="Please enter an expiration date(MM/YY)" />
              </el-form-item>
              <el-form-item label="CVV" prop="cvv">
                <el-input v-model="cardForm.cvv" placeholder="Please enter the CVV code" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="submit">
          <el-button size="large" style="background-color: #ff66b3;color: white" @click="confirmPay">Confirm the payment</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.payment-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 20px;

    .payment-amount {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #f5f5f5;
      margin-bottom: 20px;

      .amount-label {
        font-size: 16px;
        color: #666;
        margin-right: 10px;
      }

      .amount-value {
        font-size: 24px;
        color: #ff66b3;
        font-weight: bold;
      }
    }

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }

    .pay-methods {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;

      .pay-method-item {
        flex: 1;
        height: 100px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #ff66b3;
        }

        &.active {
          border-color: #ff66b3;
          background-color: #fff5f8;
        }

        .pay-icon {
          width: 40px;
          height: 40px;
          margin-bottom: 10px;
        }

        span {
          font-size: 14px;
        }
      }
    }

    .qrcode-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      .qrcode-box {
        text-align: center;
        padding: 20px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;

        .qrcode-img {
          width: 200px;
          height: 200px;
          margin-bottom: 15px;
        }

        .qrcode-tip {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .payment-id-box {
          background-color: #f8f8f8;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;

          .payment-id-label {
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
          }

          .payment-id {
            color: #ff66b3;
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            font-family: monospace;
          }

          .payment-id-tip {
            color: #999;
            font-size: 12px;
            margin: 0;
          }
        }
      }
    }

    .card-form-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      .card-form {
        width: 500px;
        padding: 20px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
      }
    }

    .submit {
      text-align: right;
      padding: 20px 0;
      border-top: 1px solid #f5f5f5;
    }
  }
}

.payment-id {
  margin-top: 15px;
  text-align: center;

  .label {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }

  .value {
    font-size: 18px;
    color: #ff66b3;
    font-weight: bold;
    font-family: monospace; // 使用等宽字体，便于阅读
    margin-bottom: 10px;
  }

  .tip {
    font-size: 12px;
    color: #999;
    margin: 5px 0;
  }
}
</style> 