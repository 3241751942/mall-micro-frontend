<template>
  <div class="search-page">
    <AppTopNav />
    <div class="container">
      <div class="search-header">
        <h2>搜索结果</h2>
        <div class="keyword">关键词：{{ keyword }}</div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="productList.length === 0" class="empty">没有找到相关商品</div>
      <div v-else>
        <div class="product-grid">
          <ProductCard v-for="item in productList" :key="item.id" :product="item" />
        </div>
        <div class="load-more-container" v-if="hasMore">
          <el-button :loading="loadMoreLoading" @click="loadMore">加载更多</el-button>
        </div>
        <div v-else-if="productList.length > 0" class="no-more">没有更多商品了</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductList } from '@/api/product' // 假设商品列表接口支持 keyword 参数
import AppTopNav from '@/components/home/AppTopNav.vue'
import ProductCard from '@/components/home/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const keyword = ref(route.query.q || '')
const productList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const loadMoreLoading = ref(false)
const hasMore = ref(true)

// 加载商品列表（支持分页和关键词）
const loadProducts = async (isLoadMore = false) => {
  if (isLoadMore && loadMoreLoading.value) return
  if (!isLoadMore && loading.value) return
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    router.push('/')
    return
  }

  if (!isLoadMore) {
    loading.value = true
    pageNum.value = 1
    productList.value = []
  } else {
    loadMoreLoading.value = true
  }

  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      keyword: keyword.value  // 假设后端支持 keyword 参数
    }
    const res = await getProductList(params)
    const newItems = res.records || []
    if (isLoadMore) {
      productList.value.push(...newItems)
    } else {
      productList.value = newItems
    }
    total.value = res.total || 0
    hasMore.value = productList.value.length < total.value
    if (hasMore.value) pageNum.value++
  } catch (error) {
    ElMessage.error('加载搜索结果失败')
    console.error(error)
  } finally {
    loading.value = false
    loadMoreLoading.value = false
  }
}

const loadMore = () => {
  if (!hasMore.value || loadMoreLoading.value) return
  loadProducts(true)
}

onMounted(() => {
  if (!keyword.value) {
    router.push('/')
    return
  }
  loadProducts()
})
</script>

<style lang="scss" scoped>
.search-page {
  background: #f5f5f5;
  min-height: 100vh;
}
.container {
  max-width: 1200px;
  margin: 20px auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}
.search-header {
  margin-bottom: 20px;
  h2 {
    font-size: 20px;
    margin-bottom: 8px;
  }
  .keyword {
    color: #ff6a00;
    font-weight: bold;
  }
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 20px;
}
.load-more-container {
  text-align: center;
  margin: 30px 0 20px;
  .el-button {
    background-color: #fff;
    color: #333;
    border: 1px solid #dcdfe6;
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
.loading, .empty {
  text-align: center;
  padding: 60px;
  color: #999;
}
.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>