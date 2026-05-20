<template>
<AppTopNav />
  <div class="favorites-page">
    <h2>我的收藏</h2>
    <div v-if="favoritesList.length === 0" class="empty-fav">
      <p>暂无收藏商品</p>
      <router-link to="/" class="btn-shop">去逛逛</router-link>
    </div>
    <div v-else class="fav-grid">
      <div v-for="item in favoritesList" :key="item.id" class="fav-card">
        <img :src="item.imageUrl || 'https://picsum.photos/200/200?random=1'" class="fav-img" />
        <div class="fav-info">
          <div class="name">{{ item.name }}</div>
          <div class="price">¥{{ item.price }}</div>
          <div class="actions">
            <el-button type="primary" size="small" @click="addToCart(item.id)">加入购物车</el-button>
            <el-button type="danger" size="small" @click="removeFavorite(item.id)">取消收藏</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { addToCart } from '@/api/cart'
import { useCartStore } from '@/stores/cart'
import AppTopNav from '@/components/home/AppTopNav.vue'

const cartStore = useCartStore()
const favoritesList = ref([])

// 从 localStorage 读取收藏列表
const loadFavorites = () => {
  const favs = localStorage.getItem('favorites')
  if (favs) {
    favoritesList.value = JSON.parse(favs)
  } else {
    favoritesList.value = []
  }
}

// 保存收藏列表到 localStorage
const saveFavorites = () => {
  localStorage.setItem('favorites', JSON.stringify(favoritesList.value))
}

// 取消收藏
const removeFavorite = (id) => {
  favoritesList.value = favoritesList.value.filter(item => item.id !== id)
  saveFavorites()
  ElMessage.success('已取消收藏')
}

// 加入购物车
const addToCartHandler = async (id) => {
  try {
    await addToCart(id, 1)
    ElMessage.success('已加入购物车')
    cartStore.fetchCart()
  } catch (error) {
    ElMessage.error('加入购物车失败')
  }
}

// 模拟添加演示数据（如果为空，可以添加几条示例）
const addDemoData = () => {
  if (favoritesList.value.length === 0) {
    favoritesList.value = [
      { id: 1, name: '演示商品1', price: 199, imageUrl: 'https://picsum.photos/200/200?random=101' },
      { id: 2, name: '演示商品2', price: 299, imageUrl: 'https://picsum.photos/200/200?random=102' }
    ]
    saveFavorites()
  }
}

onMounted(() => {
  loadFavorites()
  // 如果没有任何收藏，添加演示数据（便于展示）
  addDemoData()
})
</script>

<style lang="scss" scoped>
.favorites-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}
.fav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}
.fav-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
  .fav-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .fav-info {
    padding: 12px;
    .name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .price {
      color: #ff3b3b;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
  }
}
.empty-fav {
  text-align: center;
  padding: 60px;
  .btn-shop {
    display: inline-block;
    margin-top: 20px;
    background: #ff6a00;
    color: white;
    padding: 8px 24px;
    border-radius: 20px;
    text-decoration: none;
  }
}
</style>