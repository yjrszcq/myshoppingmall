<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {registerUser} from '@/apis/login.js'  // 刚才写的接口
import {useRouter} from "vue-router";
import {useUserstore} from '@/stores/user.js'

const userStore = useUserstore()

// 控制当前显示登录还是注册
const isRegister = ref(false)

// 登录表单数据（后面记得改一下）
const loginForm = ref({

  username: '',

  password: '',
})

const router = useRouter()

const loginrules = {

  username: [
    {required:true,message:'The username cannot be empty!',trigger:'blur'},
  ],
  password:[
    {
      required: true,message:'The password cannot be empty！',trigger:'blur'

      //后面还可以添加其他规则
    }
  ]
}


const reginsterrules = {
  username: [

    {required:true,message:'The username cannot be empty!',trigger:'blur'},
  ],
  password:[
    {
      required: true,message:'The password cannot be empty!',trigger:'blur',
      //后面还可以添加其他规则
    }
  ],
  email:[
    {
      required: true,message:'The email cannot be empty!',trigger:'blur',
      //后面还可以添加其他规则
    }
  ],
  phone:[
    {
      required: true,message:'The telephone cannot be empty!',trigger:'blur',

      //后面还可以添加其他规则
    }
  ]
}

// 注册表单数据
const registerForm = ref({
  username: '',
  password: '',
  email: '',
  phone: ''
})


// 点击「注册」按钮，切换到注册表单
const toggleForm = () => {
  isRegister.value = !isRegister.value
}

const loginformRef = ref(null)

const dologin = () => {

  const {username, password} = loginForm.value

  // 调用实例方法
  loginformRef.value.validate(async (valid) => {
    // valid: 所有表单都通过校验  才为true
    console.log(valid)
    // 以valid做为判断条件 如果通过校验才执行登录逻辑
    if (valid) {

      await userStore.getUserInfo({username, password})
      console.log(loginForm,"form")
      // 1. 提示用户
      ElMessage({type: 'success', message: 'success'})
      // 2. 跳转首页
      router.replace({path: '/'})
    } else {
      ElMessage({type: 'error', message: 'error！'})

    }
  })
}

const registerformRef = ref(null)

const doregister = () => {
  registerformRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await registerUser(registerForm.value)  // 直接传递整个表单数据


        ElMessage({type: 'success', message: 'success'})
        isRegister.value = false  // 注册成功后，自动切换回登录界面
      } catch (error) {
        ElMessage({type: 'error', message: error.response?.data?.message || 'error！'})
      }
    } else {
      ElMessage({type: 'error', message: 'Registration failed! Please check the inputs'})

    }
  })
}


</script>


<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">TafeiMall</RouterLink>
        </h1>
        <RouterLink class="entry" to="/">

          Go to the homepage

          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>

    <section class="login-section">
      <div class="wrapper">
        <nav>

          <a @click="isRegister = false" :style="{ color: !isRegister ? '#ff66b3' : '#333' }">Login</a>
          <a @click="isRegister = true" :style="{ color: isRegister ? '#ff66b3' : '#333' }">Register</a>

        </nav>

        <!-- 登录表单 -->
        <div class="account-box" v-if="!isRegister">
          <div class="form">
            <el-form ref="loginformRef" :model="loginForm" :rules="loginrules" label-position="right" label-width="60px"
                     status-icon>

              <el-form-item prop="username" label="account">
                <el-input v-model="loginForm.username"/>
              </el-form-item>
              <el-form-item prop="password" label="password">

                <el-input v-model="loginForm.password"/>
              </el-form-item>
              <!--              后端没有提供相应的接口，可以考虑在后面的版本添加上去-->
              <!--              <el-form-item label-width="22px">-->
              <!--                <el-checkbox size="large">-->
              <!--                  我已同意隐私条款和服务条款-->
              <!--                </el-checkbox>-->
              <!--              </el-form-item>-->
              <el-form-item>
                <div class="btn-group">

                  <el-button class="subBtn" @click="dologin">login</el-button>
                  <el-button class="subBtn" @click="toggleForm">enroll</el-button>


                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 注册表单 -->
        <div class="account-box" v-if="isRegister">
          <div class="form">
            <el-form ref="registerformRef" :model="registerForm" :rules="reginsterrules" label-position="right"
                     label-width="70px" status-icon>

              <el-form-item prop="username" label="username">
                <el-input v-model="registerForm.username"/>
              </el-form-item>
              <el-form-item prop="password" label="password">
                <el-input v-model="registerForm.password" type="password"/>
              </el-form-item>
              <el-form-item prop="email" label="email">
                <el-input v-model="registerForm.email"/>
              </el-form-item>
              <el-form-item prop="phone" label="phone">

                <el-input v-model="registerForm.phone"/>
              </el-form-item>
              <el-form-item label-width="22px">
                <!--                <el-checkbox size="large">-->
                <!--                  我已同意隐私条款和服务条款-->
                <!--                </el-checkbox>-->
              </el-form-item>
              <el-form-item>
                <div class="btn-group">

                  <el-button class="subBtn" @click="doregister">enroll</el-button>
                  <el-button class="subBtn" @click="toggleForm">sign in</el-button>

                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <!--        <p>-->
        <!--          <a href="javascript:;">关于我们</a>-->
        <!--          <a href="javascript:;">帮助中心</a>-->
        <!--          <a href="javascript:;">售后服务</a>-->
        <!--          <a href="javascript:;">配送与验收</a>-->
        <!--          <a href="javascript:;">商务合作</a>-->
        <!--          <a href="javascript:;">搜索推荐</a>-->
        <!--          <a href="javascript:;">友情链接</a>-->
        <!--        </p>-->
        <p>CopyRight &copy; TafeiMall</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang='scss'>
.login-header {
  background: #fff;
  border-bottom: 1px solid #e4e4e4;

  .container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url("@/assets/images/logo.png") no-repeat center 18px / contain;
    }
  }

  .sub {
    flex: 1;
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 38px;
    margin-left: 20px;
    color: #666;
  }

  .entry {
    width: 120px;
    margin-bottom: 38px;
    font-size: 16px;

    i {
      font-size: 14px;
      color: $xtxColor;
      letter-spacing: -5px;
    }
  }
}

.login-section {
  background: url('@/assets/images/login-bg.png') no-repeat center / cover;
  height: 488px;
  position: relative;

  .wrapper {
    width: 380px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    nav {
      font-size: 14px;
      height: 55px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        text-align: center;
      }
    }
  }
}

.login-footer {
  padding: 30px 0 50px;
  background: #fff;

  p {
    text-align: center;
    color: #999;
    padding-top: 20px;

    a {
      line-height: 1;
      padding: 0 10px;
      color: #999;
      display: inline-block;

      ~ a {
        border-left: 1px solid #ccc;
      }
    }
  }
}

.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: $xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 20px 20px 20px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: $priceColor;
          }

          &.active,
          &:focus {
            border-color: $xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: $priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: $xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}

.subBtn {
  background: $xtxColor;
  min-width: 100px; /* 按钮宽度 */
  color: #fff;
  text-align: center;
}

.btn-group {
  display: flex;
  justify-content: center; /* 水平居中 */
  gap: 40px; /* 按钮之间的间距，自己调整 */
}

</style>