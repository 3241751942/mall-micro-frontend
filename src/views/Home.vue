<template>
  <AppTopNav />
  <div class="home">
    <HomeHeader />
    <div class="container main-content">
      <HomeCategory />
      <HomeCarousel />
    </div>
    <div class="container">
      <ProductGrid />
    </div>
  </div>
</template>

<script setup>
import HomeHeader from '@/components/home/HomeHeader.vue';
import HomeCategory from '@/components/home/HomeCategory.vue';
import HomeCarousel from '@/components/home/HomeCarousel.vue';
import ProductGrid from '@/components/home/ProductGrid.vue';
import AppTopNav from '@/components/home/AppTopNav.vue'
</script>

<style lang="scss" scoped>
.home {
  background-color: #f5f5f5;
  padding-bottom: 30px;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.main-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>