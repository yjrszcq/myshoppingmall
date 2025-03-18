<script setup>
// 图片列表
import {getDetails} from "@/apis/detail.js";
import {ref,onMounted} from 'vue'
import {useRoute} from "vue-router";


const goods = ref([])
const route = useRoute()
const imageList = ref([])
const getGoodes = async () => {
  const res = await getDetails(route.params.id)
  goods.value = res.result  //这里是为了测试，后面记得改！！
  console.log(goods)
  imageList.value = goods.value.mainPictures
}
onMounted(() => {getGoodes()})
</script>


<template>
  <div class="home-banner">
    <el-carousel height="500px" trigger="click" indicator-position="outside">
      <el-carousel-item v-for="img in imageList" :src="img" :key="img">
        <img :src="img" alt="banner" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped lang="scss">
.home-banner {
  width: 500px;
  height: 500px;
  position: relative;
  border-radius: 16px; // 圆角矩形
  box-sizing: border-box; // 让宽高包含 padding，避免撑开

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; // 保证图片铺满不变形
  }
}
</style>