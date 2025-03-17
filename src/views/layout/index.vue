<script setup>
import LayoutNav from './Components/layoutNav.vue'
import LayoutHeader from './Components/layoutHeader.vue'
import LayoutFooter from './Components/layoutFooter.vue'
import LayoutFix from "@/views/layout/Components/layoutFix.vue";
</script>

<template>
  <LayoutFix />
  <LayoutNav />
  <LayoutHeader />
  <RouterView/>
  <LayoutFooter />
</template>