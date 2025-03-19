<script setup>
import {useScroll} from '@vueuse/core'


const {y} = useScroll(window)
import {Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import router from "@/router/index.js";
const input = ref(''); // 绑定到 el-input

const handleSearch = () => {
  if (!input.value) return; // 简单校验
  router.push({
    path: '/search',
    query: { keyword: input.value }
  });
};


</script>

<template>
  <div class="app-header-sticky" :class="{show : y>78}">
    <div class="container">
      <RouterLink class="logo" to="/" />
      <!-- 导航区域 -->
      <div class="search">
        <!--        <i class="iconfont icon-search"></i>-->
        <el-input
            v-model="input"
            placeholder="请输入您想要的商品喵"
            class="input"
            size="large"
            @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" style="background-color: #ff99cc; padding: 0; width: 50px; height: 50px; color: white" size="large" @click="handleSearch"/>
          </template>
        </el-input>
      </div>

    </div>
  </div>
</template>


<style scoped lang='scss'>
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  // 此处为关键样式!!!
  // 状态一：往上平移自身高度 + 完全透明
  transform: translateY(-100%);
  opacity: 0;

  // 状态二：移除平移 + 完全不透明
  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;
    height: 80px;
    background: url("@/assets/images/logo2.png") no-repeat center 10px;
    background-size: 160px auto;
  }

  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid $xtxColor;

    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;

      &:hover {
        color: $xtxColor;
      }
    }
  }
  .search {
    flex-shrink: 0;
    width: 1000px;
    height: 0;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;

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
}

.app-header-nav {
  width: 820px;
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;

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
</style>