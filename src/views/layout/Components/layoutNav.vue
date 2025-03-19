<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMyOrder = () => {
  router.push('/myorder');
};

const goToBusiness = () => {
  router.push({ path: '/loginbusiness' });
};

const goToUser = () => {
  router.push({ path: '/user/123', query: { name: 'John' } }); //登录模块记得改！
}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
<!--        多模板渲染，区分登录和未登录-->
        <template v-if="false">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>永雏塔菲</a></li>
          <li>
            <el-popconfirm title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>
          <li><a href="javascript:;" @click="goToMyOrder">我的订单</a></li>
          <li><a href="javascript:;" @click="goToUser">会员中心</a></li>
          <li><a href="javascript:;" @click="goToBusiness">商家版</a></li>
        </template>
        <template v-else>
          <li><a href="javascript:;" @click="$router.push('/login')">请先登录</a></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">关于我们</a></li>
          <li><a href="javascript:;" @click="goToBusiness">商家版</a></li>
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