<template>
  <div class="product-section">
    <div class="product-grid">
      <ProductCard v-for="item in productList" :key="item.id" :product="item" />
    </div>
    <div class="load-more-container" v-if="hasMore">
      <!-- 移除 type="primary"，使用默认按钮样式 -->
      <el-button :loading="loading" @click="loadMore">加载更多</el-button>
    </div>
    <div v-else-if="productList.length > 0" class="no-more">没有更多商品了</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getProductList } from '@/api/product';
import ProductCard from './ProductCard.vue';

const productList = ref([]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);
const hasMore = ref(true);

const loadProducts = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await getProductList({ pageNum: pageNum.value, pageSize: pageSize.value });
    const newItems = res.records || [];
    productList.value = newItems;
    total.value = res.total || 0;
    hasMore.value = productList.value.length < total.value;
    if (hasMore.value) pageNum.value++;
  } catch (error) {
    ElMessage.error('加载商品失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const res = await getProductList({ pageNum: pageNum.value, pageSize: pageSize.value });
    const newItems = res.records || [];
    productList.value.push(...newItems);
    total.value = res.total || 0;
    hasMore.value = productList.value.length < total.value;
    if (hasMore.value) pageNum.value++;
  } catch (error) {
    ElMessage.error('加载更多失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});
</script>

<style lang="scss" scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 20px;
}
.load-more-container {
  text-align: center;
  margin: 30px 0 20px;
}
.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>