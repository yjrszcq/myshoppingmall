<script setup>
import HomeCategory from './components/HomeCategory.vue'
import HomeBanner from './components/HomeBanner.vue'
import HomeNew from './components/HomeNew.vue'
import HomeHot from './components/HomeClothes.vue'
import homeProduct from './components/HomeFood.vue'
import promotionList from '@/views/Promotion/promotionList.vue'
</script>

<template>
  <div class="container">
    <HomeCategory />
    <promotionList/>
    <HomeBanner />
  </div>
  <HomeNew />
  <HomeHot />
  <homeProduct />
</template>