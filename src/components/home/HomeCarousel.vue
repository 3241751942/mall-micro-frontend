<template>
  <div class="carousel-wrapper">
    <el-carousel :interval="4000" arrow="always" height="340px">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <img :src="item.image" class="carousel-img" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 可替换为真实后端接口
const banners = ref([
  { id: 1, image: 'https://picsum.photos/1200/340?random=101' },
  { id: 2, image: 'https://picsum.photos/1200/340?random=102' },
  { id: 3, image: 'https://picsum.photos/1200/340?random=103' }
]);
</script>

<style lang="scss" scoped>
.carousel-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
  .carousel-img {
    width: 100%;
    height: 340px;
    object-fit: cover;
  }
}
</style>