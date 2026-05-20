<template>
  <div class="product-card" @click="toDetail">
    <img :src="displayImage" class="product-img"  />
    <div class="product-info">
      <div class="name">
        <span class="brand-name">{{ product.brandName }}</span>
        <span class="product-name">{{ product.name }}</span>
      </div>
      <div class="desc">{{ product.description || '暂无描述' }}</div>
      <div class="price">¥{{ product.price }}</div>
      <button class="buy-btn" @click.stop="handleAddToCart">购买</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { addToCart } from '@/api/cart';
import { useCartStore } from '@/stores/cart';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const cartStore = useCartStore();

// 本地默认占位图路径（需在 public/images/ 下放置 placeholder.webp）
const defaultImage = '/images/placeholder.webp';

// 直接使用前端本地图片，不请求任何外部 http 链接
const displayImage = computed(() => {
  if (props.product.images) {
    let images = props.product.images;
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (e) {
        // 解析失败，直接当作路径使用
        return images || defaultImage;
      }
    }
    if (Array.isArray(images) && images.length > 0) {
      // 返回第一个图片路径（应为本地路径，如 /images/洗衣机.webp）
      return images[0];
    }
  }
  return defaultImage;
});

const toDetail = () => {
  router.push(`/product/${props.product.id}`);
};

const handleAddToCart = async () => {
  try {
    await addToCart(props.product.id, 1);
    ElMessage.success('已加入购物车');
    cartStore.fetchCart();
  } catch (error) {
    ElMessage.error('加入购物车失败');
  }
};
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .product-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .product-info {
    padding: 12px;
  }
  .name {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .brand-name {
    color: #ffd700;
    font-weight: 500;
    margin-right: 6px;
  }
  .product-name {
    color: #333;
    font-weight: 500;
  }
  .desc {
    font-size: 12px;
    color: #999;
    line-height: 1.3;
    height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 8px;
  }
  .price {
    color: #ff3b3b;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .buy-btn {
    background: #ff6a00;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 6px 12px;
    width: 100%;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #ff8c2c;
    }
  }
}
</style>