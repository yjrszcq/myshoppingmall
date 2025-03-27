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
    ElMessage.success('银行卡信息提交成功')
    router.push('/member/user')
  } catch (error) {
    ElMessage.error('请检查银行卡信息是否正确，并重新输入')
  }
}
</script>

<template>
  <div class="bank-info-page">
    <div class="container">
      <div class="wrapper">
        <h3 class="box-title">银行卡信息</h3>
        <div class="box-body">
          <!-- 添加担保金额提示 -->
          <div class="amount-notice">
            <el-alert
              title="担保金额"
              type="info"
              :closable="false"
              show-icon
            >
              <template #default>
                <p>您需要担保的金额为：<span class="amount">¥{{ totalAmount.toFixed(2) }}</span></p>
                <p class="notice">此金额包含商品总价、运费以及货到付款手续费(5元)</p>
                <p class="notice">请确保您的银行卡余额充足，以便完成支付。</p>
              </template>
            </el-alert>
          </div>

          <!-- 担保提示信息 -->
          <div class="notice-box">
            <i class="el-icon-warning"></i>
            <span>温馨提示：</span>
            <p>为了确保您的订单安全，我们需要您提供银行卡信息作为信用担保。您的银行卡信息仅用于担保，不会产生任何实际扣款。</p>
          </div>

          <el-form
            ref="formRef"
            :model="bankForm"
            :rules="rules"
            label-width="120px"
            class="bank-form"
          >
            <el-form-item label="银行卡号" prop="cardNumber">
              <el-input v-model="bankForm.cardNumber" placeholder="请输入银行卡号" />
              <div class="form-tip">请输入16-19位数字的银行卡号</div>
            </el-form-item>
            <el-form-item label="持卡人姓名" prop="cardHolder">
              <el-input v-model="bankForm.cardHolder" placeholder="请输入持卡人姓名" />
              <div class="form-tip">请输入与银行卡一致的持卡人姓名</div>
            </el-form-item>
            <el-form-item label="有效期" prop="expiryDate">
              <el-input v-model="bankForm.expiryDate" placeholder="请输入有效期(MM/YY)" />
              <div class="form-tip">请输入卡片正面的有效期，格式为MM/YY（如：12/25）</div>
            </el-form-item>
            <el-form-item label="CVV码" prop="cvv">
              <el-input v-model="bankForm.cvv" placeholder="请输入CVV码" />
              <div class="form-tip">请输入卡片背面的3位数字安全码</div>
            </el-form-item>
          </el-form>
        </div>
        <div class="submit">
          <el-button size="large" style="background-color: #ff66b3;color: white" @click="submitBankInfo">提交信息</el-button>
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