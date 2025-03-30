<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const bankForm = ref({
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: ''
})

// 表单验证规则
const rules = {
  cardNumber: [
    { required: true, message: '请输入银行卡号', trigger: 'blur' },
    { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号', trigger: 'blur' }
  ],
  cardHolder: [
    { required: true, message: '请输入持卡人姓名', trigger: 'blur' }
  ],
  expiryDate: [
    { required: true, message: '请输入有效期', trigger: 'blur' },
    { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: '请输入正确的有效期格式(MM/YY)', trigger: 'blur' }
  ],
  cvv: [
    { required: true, message: '请输入CVV码', trigger: 'blur' },
    { pattern: /^\d{3,4}$/, message: '请输入正确的CVV码', trigger: 'blur' }
  ]
}

const formRef = ref(null)

// 从本地存储获取担保金额
const totalAmount = ref(0)
onMounted(() => {
  const cartInfo = JSON.parse(localStorage.getItem('cartInfo') || '{}')
  if (cartInfo.summary) {
    // 商品总价 + 运费 + 货到付款手续费(5元)
    totalAmount.value = cartInfo.summary.totalPrice + cartInfo.summary.postFee + 5
  }
})

// 提交银行卡信息
const submitBankInfo = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()

    ElMessage.success('The bank card information has been submitted successfully')
    router.push('/member/user')
  } catch (error) {
    ElMessage.error('Please check that your card details are correct and re-enter them')


  }
}
</script>

<template>
  <div class="bank-info-page">
    <div class="container">
      <div class="wrapper">

        <h3 class="box-title">Bank Card Information</h3>

        <div class="box-body">
          <!-- 添加担保金额提示 -->
          <div class="amount-notice">
            <el-alert

              title="Deposit Amount"

              type="info"
              :closable="false"
              show-icon
            >
              <template #default>

                <p>You need to deposit an amount of: <span class="amount">¥{{ totalAmount.toFixed(2) }}</span></p>
                <p class="notice">This amount includes the total price of the product, shipping fees, and COD handling fee (5 yuan)</p>
                <p class="notice">Please ensure that your bank card balance is sufficient to complete the payment.</p>

              </template>
            </el-alert>
          </div>

          <!-- 担保提示信息 -->
          <div class="notice-box">
            <i class="el-icon-warning"></i>

            <span>Warm Reminder:</span>
            <p>In order to ensure the security of your order, we need you to provide bank card information as a credit guarantee. Your bank card information is only used for guarantee and will not result in any actual deduction.</p>

          </div>

          <el-form
            ref="formRef"
            :model="bankForm"
            :rules="rules"
            label-width="120px"
            class="bank-form"
          >

            <el-form-item label="Bank Card Number" prop="cardNumber">
              <el-input v-model="bankForm.cardNumber" placeholder="Please enter your bank card number" />
              <div class="form-tip">Please enter a 16-19 digit bank card number</div>
            </el-form-item>
            <el-form-item label="Cardholder Name" prop="cardHolder">
              <el-input v-model="bankForm.cardNumber" placeholder="Please enter your bank card number" />
              <div class="form-tip">Please enter a 16-19 digit bank card number</div>
            </el-form-item>
            
            <el-form-item label="Cardholder Name" prop="cardHolder">
              <el-input v-model="bankForm.cardHolder" placeholder="Please enter the cardholder's name" />
              <div class="form-tip">Please enter the cardholder's name consistent with the bank card</div>
            </el-form-item>
            <el-form-item label="Expiry Date" prop="expiryDate">
              <el-input v-model="bankForm.expiryDate" placeholder="Please enter the expiry date (MM/YY)" />
              <div class="form-tip">Please enter the expiry date on the front of the card, in the format MM/YY (e.g., 12/25)</div>

            </el-form-item>
          </el-form>
        </div>
        <div class="submit">

          <el-button size="large" style="background-color: #ff66b3;color: white" @click="submitBankInfo">Submit Information</el-button>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bank-info-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 20px;

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

    .amount-notice {
      margin-bottom: 20px;

      .amount {
        color: #ff66b3;
        font-size: 20px;
        font-weight: bold;
        margin: 0 5px;
      }

      .notice {
        margin-top: 10px;
        color: #666;
        font-size: 14px;
      }
    }

    .notice-box {
      background-color: #fff5f8;
      border: 1px solid #ff66b3;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 30px;
      display: flex;
      align-items: flex-start;

      i {
        color: #ff66b3;
        margin-right: 10px;
        font-size: 20px;
      }

      span {
        color: #ff66b3;
        font-weight: bold;
        margin-right: 10px;
      }

      p {
        color: #666;
        margin: 0;
        line-height: 1.5;
      }
    }

    .bank-form {
      max-width: 500px;
      margin: 0 auto;

      .form-tip {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
      }
    }

    .submit {
      text-align: right;
      padding: 20px 0;
      border-top: 1px solid #f5f5f5;
    }
  }
}
</style> 