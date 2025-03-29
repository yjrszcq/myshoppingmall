<template>
  <div class="background-container">
    <slot></slot> <!-- 这里可以放你的组件内容 -->
  </div>
</template>

<style scoped>
.background-container {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/businesshome.png"); /* 图片路径 */
  background-size: cover; /* 让图片填满容器，不变形 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat; /* 不重复 */
}
</style>
