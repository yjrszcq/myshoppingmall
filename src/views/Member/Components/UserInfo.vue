<script setup>
import { onMounted, ref } from "vue";
import GoodsItem from '@/views/Home/components/Goodsitem.vue';
const userStore = {}
// 猜你喜欢列表，暂无接口，模拟数据
const likeList = ref([
  {
    "productId": "3995454",

    "name": "Black technology patented 100% waterproof and warm knitted beanie",
    "desc": "Black technology patent, to achieve real warmth and waterproof",

    "price": "135.00",
    "thumbnail": "https://yanxuan-item.nosdn.127.net/3683d874b9623434a10b4ab0c2e6be9f.png",
    "orderNum": 3989
  },
  {
    "productId": "4027998",

    "name": "Bright disc all-in-one washing block 495g",
    "desc": "Dishwasher only, strong decontamination",

    "price": "69.90",
    "thumbnail": "https://yanxuan-item.nosdn.127.net/e07c2b63765cf9f4a46d489c6e09c1c1.jpg",
    "orderNum": 7798
  },
  {
    "productId": "4026809",

    "name": "Asian Head Circumference Urban Sports Commuter Electric Vehicle Helmet",
    "desc": "Asian Head Design 3C Certified City Commuting",

    "price": "158.00",
    "thumbnail": "https://yanxuan-item.nosdn.127.net/ae521f6d97560598f3e6b3ddaed477c0.png",
    "orderNum": 12705
  },
  {
    "productId": "4023839",

    "name": "Japanese ice cube ice puck ice mold",
    "desc": "Gently pat for easy ice",

    "price": "29.80",
    "thumbnail": "https://yanxuan-item.nosdn.127.net/2be38fc160992fe41f7d4a45bd0f90e5.png",
    "orderNum": 9800
  }
]);

</script>

<template>
  <div class="home-overview">
    <!-- 用户信息 -->
    <div class="user-meta">
      <div class="avatar">
        <img :src="userStore.userInfo?.avatar" />
      </div>
      <h4>{{ userStore.userInfo?.account }}</h4>
    </div>
    <div class="item">
<!--      后续版本可以扩展的地方-->
<!--      <a href="javascript:;">-->
<!--        <span class="iconfont icon-hy"></span>-->
<!--        <p>会员中心</p>-->
<!--      </a>-->
<!--      <a href="javascript:;">-->
<!--        <span class="iconfont icon-aq"></span>-->
<!--        <p>安全设置</p>-->
<!--      </a>-->
      <RouterLink to="/member/address">
        <a href="javascript:;">
          <span class="iconfont icon-dw"></span>

          <p>Address management</p>

        </a>
      </RouterLink>
    </div>
  </div>
  <div class="like-container">
    <div class="home-panel">
      <div class="header">

        <h4 data-v-bcb266e0="">You may also like it </h4>

      </div>
      <div class="goods-list">
        <GoodsItem v-for="good in likeList" :key="good.id" :goods="good" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-overview {
  height: 132px;
  background: url(@/assets/images/center-bg.png) no-repeat center / cover;
  display: flex;

  .user-meta {
    flex: 1;
    display: flex;
    align-items: center;

    .avatar {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 60px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    h4 {
      padding-left: 26px;
      font-size: 18px;
      font-weight: normal;
      color: white;
    }
  }

  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;

    &:first-child {
      border-right: 1px solid #f4f4f4;
    }

    a {
      color: white;
      font-size: 16px;
      text-align: center;

      .iconfont {
        font-size: 32px;
      }

      p {
        line-height: 32px;
      }
    }
  }
}

.like-container {
  margin-top: 20px;
  border-radius: 4px;
  background-color: #fff;
}

.home-panel {
  background-color: #fff;
  padding: 0 20px;
  margin-top: 20px;
  height: 400px;

  .header {
    height: 66px;
    border-bottom: 1px solid #f5f5f5;
    padding: 18px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    h4 {
      font-size: 22px;
      font-weight: 400;
    }

  }

  .goods-list {
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 20px 0;
  }
}
</style>