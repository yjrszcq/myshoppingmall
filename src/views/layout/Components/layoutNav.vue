<script setup>
import { useRouter} from 'vue-router';
import {useUserstore} from "@/stores/user.js";
import { logoutapi } from "@/apis/login.js";

const Userstore = useUserstore();
const router = useRouter();

const goToBusiness = () => {
  Userstore.clearUserInfo()
  router.push({ path: '/loginbusiness' });
};

const goToUser = () => {
  router.push({ path: '/member'});
}

// 退出登录
const confirm = async () =>{
  await logoutapi()
  Userstore.clearUserInfo();
  router.push({ path: '/login'});
}

// 跳转促销页面
const goToPromotion = () =>{
  router.push({ path: '/promotion'});
}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
<!--        多模板渲染，区分登录和未登录-->
        <template v-if="Userstore.userInfo.sessionId">
          <li><a  @click="goToUser"><i class="iconfont icon-user"></i>{{ Userstore.userInfo.userAccount }}</a></li>
          <li>

            <el-popconfirm @confirm="confirm" title="Are you sure?" confirm-button-text="yes" cancel-button-text="no">
              <template #reference>
                <a >Sign out</a>
              </template>
            </el-popconfirm>
          </li>
          <li><a  @click="goToUser">Member Center</a></li>
          <li><a  @click="$router.push('/cart')"><i class="iconfont icon-cart" ></i>Shopping cart</a></li>
          <li><a href="https://space.bilibili.com/1265680561">About us</a></li>
        </template>
        <template v-else>
          <li><a  @click="$router.push('/login')">log in</a></li>
          <li><a  @click="$router.push('/login')"><i class="iconfont icon-cart" ></i>Shopping cart</a></li>
          <li><a >Help Center</a></li>
          <li><a href="https://space.bilibili.com/1265680561">About us</a></li>
          <li><a  @click="goToBusiness">Merchant Edition</a></li>

        </template>
      </ul>
    </div>
  </nav>
</template>


<style scoped lang="scss">
.app-topnav {
  background: #faf0e6;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
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

      ~li {
        a {
          border-left: 2px solid #FFe4b5;
        }
      }
    }
  }
}
</style>