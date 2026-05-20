<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="orders.length === 0">暂无历史订单</div>
    <div v-else>
      <div v-for="order in orders" :key="order.orderNo" class="order-card">
        <div class="order-header">
          <div class="order-left-info">
            <span class="order-date">{{ formatDate(order.createTime) }}</span>
            <span class="order-id">订单号：{{ order.orderNo }}</span>
          </div>
          <div class="order-status">{{ getStatusText(order.status) }}</div>
        </div>

        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img 
              :src="getImageUrl(item.images)" 
              class="product-image" 
              @error="handleImageError"
            />
            <div class="product-info">
              <div class="product-name">{{ item.productName }}</div>
              <div class="product-brand" v-if="item.brand">品牌：{{ item.brand }}</div>
              <div class="product-desc" v-if="item.description">{{ item.description }}</div>
              <div class="product-brand-desc" v-if="!item.brand && !item.description">加载商品信息中...</div>
            </div>
            <div class="product-price-row">
              <span class="unit-price">¥{{ item.productPrice }}</span>
              <span class="quantity">x{{ item.quantity }}</span>
              <span class="subtotal">小计：¥{{ (item.productPrice * item.quantity).toFixed(2) }}</span>
              <el-button type="info" size="small" @click="$emit('addToCart', item.productId, item.productName)">加入购物车</el-button>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="total-payment">实付款：¥{{ order.totalAmount }}</div>
          <div class="order-buttons">
            <el-button type="success" size="small" @click="$emit('reorder', order)">再来一单</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

defineEmits(['reorder', 'addToCart'])

// 本地默认占位图路径（需放在 public/images/ 下）
const defaultImage = '/images/placeholder.webp'

// 智能获取图片URL：支持字符串、JSON数组字符串、数组，返回本地路径
const getImageUrl = (images) => {
  if (!images) return defaultImage
  let url = images
  if (typeof images === 'string') {
    const trimmed = images.trim()
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed) && parsed.length > 0) {
          url = parsed[0]
        } else {
          url = defaultImage
        }
      } catch (e) {
        url = trimmed
      }
    } else {
      url = trimmed
    }
  } else if (Array.isArray(images) && images.length > 0) {
    url = images[0]
  }
  return url && typeof url === 'string' ? url : defaultImage
}

// 图片加载失败时替换为默认占位图
const handleImageError = (e) => {
  e.target.src = defaultImage
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const getStatusText = (status) => {
  const map = { 0: '待支付', 1: '已支付', 2: '已取消', 3: '已发货', 4: '已完成' }
  return map[status] || '未知'
}
</script>

<style scoped>
.order-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}
.order-left-info {
  display: flex;
  gap: 24px;
  align-items: baseline;
}
.order-date, .order-id {
  font-size: 14px;
  color: #666;
}
.order-status {
  font-size: 16px;
  color: #ff5000;
  font-weight: bold;
}
.order-items {
  padding: 0 16px;
}
.order-item {
  display: flex;
  padding: 16px 0;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.order-item:last-child {
  border-bottom: none;
}
.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: #f5f5f5; /* 加载背景色，减少闪烁感 */
}
.product-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.product-brand {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}
.product-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}
.product-brand-desc {
  font-size: 12px;
  color: #999;
}
.product-price-row {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}
.unit-price {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.quantity {
  font-size: 14px;
  color: #666;
}
.subtotal {
  font-size: 14px;
  color: #ff5000;
  font-weight: 500;
}
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fafafa;
  border-top: 1px solid #eee;
}
.total-payment {
  font-size: 16px;
  font-weight: bold;
  color: #ff5000;
}
.order-buttons {
  display: flex;
  gap: 10px;
}
@media (max-width: 768px) {
  .order-item {
    flex-direction: column;
  }
  .product-price-row {
    justify-content: flex-start;
    padding-left: 0;
  }
  .order-footer {
    flex-direction: column;
    gap: 12px;
  }
}
</style>