<template>
  <div class="common-layout">
    <el-container class="main-layout">
      <el-aside width="220px" class="mainmenu">
        <h2 class="mb-2"></h2>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
          router
        >
          <el-menu-item index="Dashboard" :route="{ name: 'Dashboard' }">
            <el-icon><PieChart /></el-icon>
            <span>Sales Report</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>

              <span>My Products</span>
            </template>
            <el-menu-item index="/product">Product Management</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><location /></el-icon>

              <span>My Orders</span>
            </template>
            <el-menu-item index="/order">Order Management</el-menu-item>
          </el-sub-menu>
          <el-menu-item>
            <el-icon><setting /></el-icon>
            <el-popconfirm
              @confirm="confirm"
              title="Confirm Logout?"
              confirm-button-text="Confirm"
              cancel-button-text="Cancel"
            >
              <template #reference>
                <a style="width: 1000px">Logout</a>
              </template>
            </el-popconfirm>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>

import { Location, Setting, PieChart } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useUserstore } from "@/stores/user.js";

import { logoutapi } from '@/apis/login.js';



const router = useRouter();
const Userstore = useUserstore();
const handleMenuSelect = (index) => {
  router.push(index); // 跳转到对应的路由
};

// 退出登录


const confirm = async () =>{
  await logoutapi()
  Userstore.clearUserInfo()
  router.push({ path: '/loginbusiness'});
}

</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.main-layout {
  height: 100%;
}

.mainmenu {
  background-color: white;
  height: 100%;

  .el-menu-vertical-demo {
    background-color: white;
    margin-top: 10px;
  }

  .mb-2 {
    margin-top: 16px;
    display: block;
    height: 80px;
    width: 100%;
    text-indent: -9999px;
    background: url("@/assets/images/logo2.png") no-repeat center 0px / contain;
  }
}
</style>
