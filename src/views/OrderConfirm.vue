<template>
  <div class="order-confirm">
    <AppTopNav />
    <div class="container">
      <h2>确认订单</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <!-- 收货地址 -->
        <div class="address-section">
          <h3>收货地址</h3>
          <div v-if="addressLoading">加载地址...</div>
          <div v-else-if="addressList.length === 0" class="no-address">
            <p>暂无收货地址，请先添加</p>
            <el-button type="primary" @click="goAddAddress">新增地址</el-button>
          </div>
          <div v-else class="address-list">
            <div v-for="addr in addressList" :key="addr.id" class="address-item"
              :class="{ active: selectedAddressId === addr.id }" @click="selectAddress(addr.id)">
              <div><strong>{{ addr.receiverName }}</strong> {{ addr.phone }}</div>
              <div>{{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}</div>
            </div>
          </div>
        </div>

        <!-- 商品清单 -->
        <div class="goods-section">
          <h3>商品清单</h3>
          <div class="goods-list">
            <div v-for="item in selectedItems" :key="item.productId" class="goods-item">
              <img :src="item.imageUrl || 'https://picsum.photos/80/80'" class="goods-img" />
              <div class="goods-info">
                <div class="name">{{ item.productName }}</div>
                <div class="price">¥{{ item.price }}</div>
                <div class="quantity">数量：{{ item.quantity }}</div>
              </div>
              <div class="subtotal">¥{{ item.price * item.quantity }}</div>
            </div>
          </div>
          <div class="total-amount">总金额：¥{{ totalAmount }}</div>
        </div>

        <!-- 提交订单 -->
        <div class="submit-section">
          <el-button type="primary" size="large" :loading="submitting" @click="submitOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { getAddressList } from '@/api/user'
import { createOrder } from '@/api/order'
import AppTopNav from '@/components/home/AppTopNav.vue'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const addressLoading = ref(false)
const submitting = ref(false)
const addressList = ref([])
const selectedAddressId = ref(null)

// 获取购物车中选中的商品
const selectedItems = computed(() => cartStore.items.filter(item => item.checked))

// 总金额
const totalAmount = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// 获取地址列表
const fetchAddresses = async () => {
  addressLoading.value = true
  try {
    const res = await getAddressList()
    addressList.value = res || []
    if (addressList.value.length > 0) {
      selectedAddressId.value = addressList.value[0].id
    }
  } catch (error) {
    console.error('获取地址失败', error)
    ElMessage.warning('获取地址失败，请稍后重试')
  } finally {
    addressLoading.value = false
  }
}

const selectAddress = (id) => {
  selectedAddressId.value = id
}

const goAddAddress = () => {
  router.push('/address')
}

// 提交订单
const submitOrder = async () => {
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  if (selectedItems.value.length === 0) {
    ElMessage.warning('没有选中任何商品')
    return
  }

  submitting.value = true
  try {
    const orderData = {
      addressId: selectedAddressId.value,
      items: selectedItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }
    const orderNo = await createOrder(orderData)
    ElMessage.success('订单创建成功')
    await cartStore.fetchCart()
    // 跳转到个人中心的待支付标签页
    router.push({ path: '/user/profile', query: { tab: 'unpaid' } })
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '下单失败'
    ElMessage.error(msg)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  await cartStore.fetchCart()
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先选择商品')
    router.push('/cart')
    return
  }
  await fetchAddresses()
  loading.value = false
})
</script>

<style lang="scss" scoped>
.order-confirm {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

h2,
h3 {
  margin-bottom: 16px;
}

.address-section,
.goods-section {
  margin-bottom: 30px;
}

.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.address-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  width: 280px;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    border-color: #ff6a00;
    background: #fff7e8;
  }
}

.goods-list {
  border-top: 1px solid #eee;
}

.goods-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  gap: 16px;
}

.goods-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.goods-info {
  flex: 1;
}

.name {
  font-size: 14px;
  font-weight: 500;
}

.price {
  color: #ff3b3b;
  margin-top: 4px;
}

.quantity {
  font-size: 12px;
  color: #666;
}

.subtotal {
  font-size: 16px;
  font-weight: bold;
  color: #ff3b3b;
}

.total-amount {
  text-align: right;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.submit-section {
  text-align: right;
}

.loading {
  text-align: center;
  padding: 60px;
}
</style>