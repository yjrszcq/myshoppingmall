<script setup>
const bannerList = [
  new URL('@/assets/images/banner1.jpg', import.meta.url).href,
  new URL('@/assets/images/banner2.jpg', import.meta.url).href,
  new URL('@/assets/images/banner3.jpg', import.meta.url).href,
  new URL('@/assets/images/banner4.jpg', import.meta.url).href,
]

</script>



<template>
  <div class="home-banner">
    <el-carousel height="500px" trigger="click" indicator-position="outside">
      <el-carousel-item v-for="(img, index) in bannerList" :key="index">
        <a href="https://space.bilibili.com/1265680561" target="_blank">
          <img :src="img" alt="banner"/>
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>





<style scoped lang='scss'>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  border-radius: 16px; // 圆角矩形
  box-sizing: border-box; // 让宽高包含 padding，避免撑开

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; // 保证图片铺满不变形
  }
}

</style>