<script setup>
import LayoutNav from './Components/layoutNav.vue'
import LayoutHeader from './Components/layoutHeader.vue'
import LayoutFooter from './Components/layoutFooter.vue'
</script>

<template>
  <div>这是主页</div>
  <LayoutNav />
  <LayoutHeader />
  <LayoutFooter />
  <RouterView/>
</template>