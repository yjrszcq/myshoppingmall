<template>
  <div class="common-layout">
    <el-container class="main-layout">
      <el-aside width="220px" class="mainmenu">
        <h2 class="mb-2"></h2>
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @select="handleMenuSelect"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span >我的商品</span>
            </template>
              <el-menu-item index="/product">商品管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><location /></el-icon>
              <span >我的订单</span>
            </template>
            <el-menu-item index="/order">订单管理</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/login/business">
            <el-icon><setting /></el-icon>
            <span>登录管理</span>
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
import { Location, Menu as IconMenu, Document, Setting } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleMenuSelect = (index) => {
  router.push(index); // 跳转到对应的路由
};

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
    background: url('@/assets/images/logo2.png') no-repeat center 0px / contain;
  }
}
</style>