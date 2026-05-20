<template>
    <div class="bottom-nav">
        <div class="nav-item" :class="{ active: $route.path === '/' }" @click="goTo('/')">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
        </div>
        <div class="nav-item" :class="{ active: $route.path === '/cart' }" @click="goTo('/cart')">
            <i class="el-icon-shopping-cart-2"></i>
            <span>购物车</span>
        </div>
        <div class="nav-item" :class="{ active: $route.path === '/user' }" @click="goTo('/user/info')">
            <i class="el-icon-user"></i>
            <span>我的</span>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goTo = (path) => {
    router.push(path)
}
</script>

<style scoped>
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 54px;
    background: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #eee;
    box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
    z-index: 20;
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: #999;
}

.nav-item.active {
    color: #ff3b3b;
}

.nav-item i {
    font-size: 22px;
}

.nav-item span {
    font-size: 11px;
}
</style>