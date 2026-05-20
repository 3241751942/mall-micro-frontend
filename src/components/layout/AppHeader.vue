<template>
  <div class="app-header">
    <div class="header-left">
      <router-link to="/" class="logo">商城</router-link>
    </div>
    <div class="header-search">
      <input type="text" placeholder="搜索商品" v-model="keyword" @keyup.enter="search" />
      <button @click="search"><i class="el-icon-search"></i></button>
    </div>
    <div class="header-right">
      <router-link to="/cart">
        <i class="el-icon-shopping-cart-2"></i>
        <span v-if="cartCount" class="badge">{{ cartCount }}</span>
      </router-link>
      <div v-if="userStore.token" class="user-menu">
        <span>{{ userStore.userInfo?.username || '用户' }}</span>
        <button @click="logout">退出</button>
      </div>
      <router-link v-else to="/login">登录/注册</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const keyword = ref('')

const cartCount = computed(() => cartStore.totalCount)

const search = () => {
  if (keyword.value.trim()) {
    router.push({ path: '/search', query: { q: keyword.value } })
  }
}

const logout = () => {
  userStore.clearToken()
  router.push('/login')
}
</script>

<style scoped>
.app-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; background: #fff; border-bottom: 1px solid #eee; }
.logo { font-size: 24px; font-weight: bold; color: #ff3b3b; }
.header-search { display: flex; width: 300px; }
.header-search input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px 0 0 4px; }
.header-search button { padding: 0 16px; background: #ff3b3b; color: white; border: none; border-radius: 0 4px 4px 0; cursor: pointer; }
.header-right { display: flex; align-items: center; gap: 20px; position: relative; }
.badge { position: absolute; top: -8px; right: -12px; background: #ff3b3b; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px; }
</style>