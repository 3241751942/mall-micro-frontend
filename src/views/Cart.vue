<template>
    <div class="cart-page">
        <AppTopNav />
        <h2>购物车</h2>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="cartItems.length === 0" class="empty-cart">
            <p>购物车空空如也~</p>
            <router-link to="/" class="btn-shop">去购物</router-link>
        </div>
        <div v-else>
            <div class="cart-header">
                <el-checkbox v-model="allChecked" @change="handleAllCheckedChange">全选</el-checkbox>
                <span>商品信息</span>
                <span>单价</span>
                <span>数量</span>
                <span>小计</span>
                <span>操作</span>
            </div>
            <div v-for="item in cartItems" :key="item.productId" class="cart-item">
                <el-checkbox v-model="item.checked" @change="updateChecked(item.productId, item.checked)" />
                <div class="item-info">
                    <img :src="item.imageUrl || 'https://picsum.photos/80/80?random=1'" class="item-img" />
                    <div class="item-name">{{ item.productName }}</div>
                </div>
                <div class="item-price">¥{{ item.price }}</div>
                <div class="item-quantity">
                    <el-input-number v-model="item.quantity" :min="1"
                        @change="updateQuantity(item.productId, item.quantity)" size="small" />
                </div>
                <div class="item-subtotal">¥{{ item.price * item.quantity }}</div>
                <div class="item-actions">
                    <el-button type="danger" link @click="removeItem(item.productId)">删除</el-button>
                </div>
            </div>
            <div class="cart-footer">
                <div class="total">总计：¥{{ totalPrice }}</div>
                <el-button type="primary" @click="checkout">去结算</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import AppTopNav from '@/components/home/AppTopNav.vue'

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(false)

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const allChecked = computed({
    get: () => cartStore.items.length > 0 && cartStore.items.every(item => item.checked),
    set: (val) => { }
})

const fetchCart = async () => {
    loading.value = true
    await cartStore.fetchCart()
    loading.value = false
}

const handleAllCheckedChange = async (val) => {
    await cartStore.updateAllChecked(val)
}

const updateChecked = async (productId, checked) => {
    await cartStore.updateChecked(productId, checked)
}

const updateQuantity = async (productId, quantity) => {
    await cartStore.updateItem(productId, quantity)
}

const removeItem = async (productId) => {
    await cartStore.removeItem(productId)
    ElMessage.success('已删除')
}

const checkout = () => {
    const selected = cartStore.items.filter(item => item.checked)
    if (selected.length === 0) {
        ElMessage.warning('请选择商品')
        return
    }
    router.push('/order/confirm')
}

onMounted(() => {
    fetchCart()
})
</script>

<style lang="scss" scoped>
/* 样式保持不变，参考之前提供的完整样式 */
.cart-page {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
}

.cart-header,
.cart-item {
    display: grid;
    grid-template-columns: 80px 3fr 100px 120px 100px 100px;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
}

.cart-header {
    font-weight: bold;
    background: #f9f9f9;
    padding: 12px 0;
}

.item-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.item-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
}

.item-name {
    font-size: 14px;
}

.cart-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.total {
    font-size: 18px;
    font-weight: bold;
    color: #ff3b3b;
}

.empty-cart {
    text-align: center;
    padding: 60px;
}

.btn-shop {
    display: inline-block;
    margin-top: 20px;
    background: #ff6a00;
    color: white;
    padding: 8px 24px;
    border-radius: 20px;
    text-decoration: none;
}

.loading {
    text-align: center;
    padding: 60px;
}
</style>