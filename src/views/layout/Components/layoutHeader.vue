<script setup>
import {useCategoryStore} from "@/stores/category.js";
import {Search} from "@element-plus/icons-vue";

const categoryStore = useCategoryStore();
</script>

<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">Tafei Mall</RouterLink>
      </h1>
      <ul class="app-header-nav">
<!--        <li class="home" v-for="item in categoryStore.categoryList" :key="item.id">-->
<!--          <RouterLink to="/">{{item.name}}</RouterLink>-->
<!--        </li> -->
<!--        没给种类，就不分类了-->
<!--        <li> <RouterLink to="/">工具</RouterLink> </li>-->
      </ul>
      <div class="search">
<!--        <i class="iconfont icon-search"></i>-->
        <el-input
            v-model="input"
            placeholder="请输入您想要的商品喵"
            class="input"
            size="large"
        >
          <template #append>
            <el-button :icon="Search" style="background-color: #ff99cc; padding: 0; width: 50px; height: 50px; color: white" size="large" />
          </template>
        </el-input>
      </div>
      <!-- 头部购物车 -->

    </div>
  </header>
</template>


<style scoped lang='scss'>
.app-header {
  background: #fff;

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between; // 让两端对齐
  }

  .logo {
    width: 300px;
    flex-shrink: 0; // 不允许被压缩

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url('@/assets/images/logo.png') no-repeat center 18px / contain;
    }
  }

  .app-header-nav {
    flex-grow: 1; // 填充中间剩余空间
    display: flex;
    padding-left: 40px;

    li {
      margin-right: 40px;
      width: 38px;
      text-align: center;

      a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;

        &:hover {
          color: $xtxColor;
          border-bottom: 1px solid $xtxColor;
        }
      }

      .active {
        color: $xtxColor;
        border-bottom: 1px solid $xtxColor;
      }
    }
  }

  .search {
    flex-shrink: 0;
    width: 80%;
    height: 0;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 40px;

    :deep(.el-input__wrapper) {
      height: 50px;
      border-radius: 25px;
      box-shadow: 0 0 8px rgba(255, 192, 203, 0.6);
      border: 1px solid #FFC0CB;
      padding: 0 20px;
    }

    :deep(.el-input-group__append) {
      padding: 0;
    }

    :deep(.el-button) {
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    :deep(.el-icon) {
      font-size: 24px;
    }
  }

  .cart {
    width: 50px;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: $helpColor;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>