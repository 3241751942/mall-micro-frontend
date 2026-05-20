<template>
  <div class="product-detail-page">
    <AppTopNav />
    <div class="detail-container" v-loading="loading">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.categoryName || '商品分类' }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-main" v-if="product.id">
        <!-- 左侧图片区 -->
        <div class="gallery">
          <div class="main-image">
            <el-image
              :src="currentImage"
              fit="contain"
              :preview-src-list="productImages"
              :initial-index="currentImageIndex"
            />
          </div>
          <div class="thumb-list" v-if="productImages.length > 1">
            <div
              v-for="(img, idx) in productImages"
              :key="idx"
              class="thumb-item"
              :class="{ active: currentImage === img }"
              @click="switchImage(idx)"
            >
              <el-image :src="img" fit="cover" />
            </div>
          </div>
        </div>

        <!-- 右侧商品信息 -->
        <div class="info">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="brand-info" v-if="product.brandName">
            <span class="brand-label">品牌：</span>
            <span class="brand-name">{{ product.brandName }}</span>
          </div>

          <!-- 价格与销量 -->
          <div class="price-section">
            <div class="current-price">¥{{ displayPrice }}</div>
            <div class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</div>
            <div class="sales-info">累计评价 {{ reviewTotal }} 条</div>
            <div class="sales-info">月销 {{ product.sales || product.salesCount || 3280 }}+件</div>
          </div>

          <!-- 规格选择（模拟多规格） -->
          <div class="sku-section" v-if="specs.length">
            <div v-for="spec in specs" :key="spec.specId" class="spec-group">
              <div class="spec-name">{{ spec.specName }}：</div>
              <div class="spec-values">
                <span
                  v-for="val in spec.specValues"
                  :key="val"
                  class="spec-value"
                  :class="{
                    active: isSpecSelected(spec.specId, val),
                    disabled: isSpecDisabled(spec.specId, val)
                  }"
                  @click="selectSpecValue(spec.specId, val)"
                >
                  {{ val }}
                </span>
              </div>
            </div>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-section">
            <span class="label">数量：</span>
            <el-input-number
              v-model="quantity"
              :min="1"
              :max="currentSkuStock"
              size="small"
              controls-position="right"
            />
            <span class="stock-info" v-if="currentSkuStock < 9999">库存 {{ currentSkuStock }} 件</span>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="addToCart" :loading="cartLoading">
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-button type="danger" size="large" @click="buyNow" :loading="buyLoading">
              立即购买
            </el-button>
          </div>

          <!-- 服务承诺 -->
          <div class="service-promise">
            <span>✔ 正品保障</span>
            <span>✔ 七天无理由退换</span>
            <span>✔ 极速退款</span>
            <span>✔ 全国联保</span>
          </div>
        </div>
      </div>

      <!-- 商品详情、参数、评论 Tab 切换 -->
      <div class="detail-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="desc">
            <div class="detail-description" v-if="product.description">
              <div class="content" v-html="product.description"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="规格参数" name="params">
            <el-table :data="productParams" border style="width: 100%">
              <el-table-column prop="param" label="参数" width="200" />
              <el-table-column prop="value" label="值" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="商品评价" name="reviews">
            <div class="review-header">
              <div class="rate">好评率 {{ favorableRate }}%</div>
              <div class="total">共 {{ reviewTotal }} 条评价</div>
            </div>
            <div class="review-list">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="user-avatar">
                  <el-avatar :size="40" :src="review.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                </div>
                <div class="review-content">
                  <div class="user-name">{{ review.userName }}</div>
                  <div class="rate-star">
                    <el-rate v-model="review.rate" disabled show-score text-color="#ff9900" score-template="分" />
                  </div>
                  <div class="sku-info">购买规格：{{ review.skuText }}</div>
                  <div class="content">{{ review.content }}</div>
                  <div class="images" v-if="review.images && review.images.length">
                    <el-image v-for="(img, idx) in review.images" :key="idx" :src="img" style="width: 80px; height: 80px; margin-right: 8px;" />
                  </div>
                  <div class="time">{{ review.createTime }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'
import { getProductDetail } from '@/api/product'
import { addToCart as addToCartApi } from '@/api/cart'
import AppTopNav from '@/components/home/AppTopNav.vue'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const product = ref({})
const productImages = ref([])
const currentImageIndex = ref(0)
const currentImage = computed(() => productImages.value[currentImageIndex.value] || '')

// 规格相关（模拟丰富的规格数据）
const specs = ref([])
const skus = ref([])
const selectedSpecs = ref({})
const currentSku = ref(null)

const quantity = ref(1)
const cartLoading = ref(false)
const buyLoading = ref(false)

// 显示价格（优先SKU价格）
const displayPrice = computed(() => {
  if (currentSku.value && currentSku.value.price) {
    return currentSku.value.price.toFixed(2)
  }
  return product.value.price ? product.value.price.toFixed(2) : '0.00'
})

// 当前SKU库存
const currentSkuStock = computed(() => {
  if (currentSku.value && currentSku.value.stock !== undefined) {
    return currentSku.value.stock
  }
  if (Object.keys(selectedSpecs.value).length < specs.value.length) {
    return 9999
  }
  return product.value.stock || 9999
})

// ---------- 评论相关 mock 数据 ----------
const activeTab = ref('desc')
const reviewTotal = ref(128)
const favorableRate = ref(98)
const reviews = ref([
  {
    id: 1,
    userName: '小***花',
    avatar: '',
    rate: 5,
    skuText: '颜色：金色，尺寸：M',
    content: '非常满意，洗衣机洗得很干净，噪音也小，安装师傅很专业。',
    images: [],
    createTime: '2025-03-15'
  },
  {
    id: 2,
    userName: '夜***星',
    avatar: '',
    rate: 4,
    skuText: '颜色：白色，尺寸：L',
    content: '挺好的，就是价格有点小贵，不过一分钱一分货。',
    images: [],
    createTime: '2025-03-10'
  },
  {
    id: 3,
    userName: '阳***光',
    avatar: '',
    rate: 5,
    skuText: '颜色：黑色，尺寸：XL',
    content: '送货很快，包装完好，已经用上了，好评！',
    images: [],
    createTime: '2025-03-05'
  }
])

// 商品参数 mock 数据
const productParams = ref([
  { param: '品牌', value: '美的' },
  { param: '型号', value: 'MD100-1451WDY' },
  { param: '类别', value: '滚筒洗衣机' },
  { param: '洗涤容量', value: '10公斤' },
  { param: '烘干容量', value: '7公斤' },
  { param: '能效等级', value: '一级能效' },
  { param: '电机类型', value: '变频电机' },
  { param: '颜色', value: '多种颜色可选' },
  { param: '产地', value: '中国大陆' }
])

// ---------- 规格生成函数（丰富颜色和尺寸）----------
const generateMockSpecsAndSkus = (productData) => {
  // 颜色：多种彩色
  const colors = ['曜石黑', '冰川白', '香槟金', '星空银', '珊瑚红', '深海蓝']
  // 尺寸：除了S/M/L，增加更多
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL']
  // 版本（可选，增加多样性）
  const editions = ['标准版', 'Pro版', '旗舰版']
  
  // 此处我们选择两种规格组合：颜色+尺寸（为了不让SKU爆炸，可以限制一下）
  // 也可以让用户选择版本，但为了演示清晰，只用颜色+尺寸
  const mockSpecs = [
    { specId: 'color', specName: '颜色', specValues: colors },
    { specId: 'size', specName: '尺寸', specValues: sizes }
  ]
  
  const mockSkus = []
  const basePrice = productData.price || 2499
  colors.forEach(color => {
    sizes.forEach(size => {
      // 根据颜色和尺寸调整价格
      let priceDelta = 0
      if (color === '香槟金') priceDelta += 100
      if (color === '珊瑚红') priceDelta += 80
      if (color === '深海蓝') priceDelta += 60
      if (size === 'XL') priceDelta += 50
      if (size === 'XXL') priceDelta += 100
      if (size === '3XL') priceDelta += 150
      const skuPrice = +(basePrice + priceDelta).toFixed(2)
      // 不同规格库存不同
      let stock = Math.floor(Math.random() * 300) + 50
      if (color === '香槟金' && size === '3XL') stock = 20 // 热门组合库存少
      mockSkus.push({
        skuId: `${productData.id}_${color}_${size}`,
        specsMap: { color, size },
        price: skuPrice,
        stock: stock
      })
    })
  })
  return { specs: mockSpecs, skus: mockSkus }
}

// 规格选择辅助函数
const isSpecSelected = (specId, value) => {
  return selectedSpecs.value[specId] === value
}

const isSpecDisabled = (specId, value) => {
  if (!skus.value.length) return false
  const tempSelected = { ...selectedSpecs.value, [specId]: value }
  return !skus.value.some(sku => {
    return Object.entries(tempSelected).every(([sId, val]) => {
      return sku.specsMap[sId] === val
    })
  })
}

const selectSpecValue = (specId, value) => {
  if (isSpecDisabled(specId, value)) return
  selectedSpecs.value[specId] = value
  updateCurrentSku()
}

const updateCurrentSku = () => {
  const selectedKeys = Object.keys(selectedSpecs.value)
  if (selectedKeys.length !== specs.value.length) {
    currentSku.value = null
    return
  }
  const matchedSku = skus.value.find(sku => {
    return Object.entries(selectedSpecs.value).every(([sId, val]) => {
      return sku.specsMap[sId] === val
    })
  })
  currentSku.value = matchedSku || null
  if (!currentSku.value) {
    quantity.value = 1
  }
}

// 切换图片
const switchImage = (idx) => {
  currentImageIndex.value = idx
}

// 获取商品详情（包括模拟数据填充）
const fetchProductDetail = async () => {
  const productId = route.params.id
  if (!productId) {
    ElMessage.error('商品不存在')
    router.push('/')
    return
  }
  loading.value = true
  try {
    const res = await getProductDetail(productId)
    const data = res.data || res
    product.value = data

    // 如果接口没有返回originalPrice，我们根据price做一个模拟
    if (!product.value.originalPrice && product.value.price) {
      product.value.originalPrice = (product.value.price * 1.2).toFixed(2)
    }
    if (!product.value.sales && product.value.salesCount) {
      product.value.sales = product.value.salesCount
    } else if (!product.value.sales) {
      product.value.sales = 3280 // mock 销量
    }

    // 图片处理
    let images = []
    if (data.images) {
      if (typeof data.images === 'string') {
        try {
          images = JSON.parse(data.images)
        } catch (e) {
          images = [data.images]
        }
      } else if (Array.isArray(data.images)) {
        images = data.images
      }
    }
    if (!images.length) {
      images = ['https://picsum.photos/600/600?random=1']
    }
    productImages.value = images

    // 生成丰富的规格SKU数据
    const { specs: mockSpecs, skus: mockSkus } = generateMockSpecsAndSkus(data)
    specs.value = mockSpecs
    skus.value = mockSkus

    // 初始化默认规格：选择每个规格的第一个有效值
    for (const spec of specs.value) {
      const firstValid = spec.specValues.find(val => !isSpecDisabled(spec.specId, val))
      if (firstValid) {
        selectedSpecs.value[spec.specId] = firstValid
      }
    }
    updateCurrentSku()
  } catch (error) {
    console.error('获取商品详情失败', error)
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

// 加入购物车
const addToCart = async () => {
  if (cartLoading.value) return
  const productId = product.value.id
  const buyQuantity = quantity.value
  const skuId = currentSku.value ? currentSku.value.skuId : null

  if (!productId) {
    ElMessage.error('商品信息错误')
    return
  }
  if (buyQuantity > currentSkuStock.value) {
    ElMessage.warning('库存不足')
    return
  }

  cartLoading.value = true
  try {
    await addToCartApi(productId, buyQuantity, skuId)
    ElMessage.success('已加入购物车')
    cartStore.fetchCart()
  } catch (error) {
    const msg = error.response?.data?.message || '加入购物车失败'
    ElMessage.error(msg)
  } finally {
    cartLoading.value = false
  }
}

// 立即购买
const buyNow = () => {
  if (buyLoading.value) return
  if (quantity.value > currentSkuStock.value) {
    ElMessage.warning('库存不足')
    return
  }
  const skuId = currentSku.value ? currentSku.value.skuId : null
  router.push({
    path: '/confirm-order',
    query: {
      productId: product.value.id,
      skuId: skuId,
      quantity: quantity.value
    }
  })
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<style lang="scss" scoped>
.product-detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 40px;
}
.detail-container {
  width: 1200px;
  margin: 20px auto 0;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}
.breadcrumb {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.detail-main {
  display: flex;
  gap: 40px;
}
.gallery {
  width: 480px;
  flex-shrink: 0;
}
.main-image {
  width: 100%;
  height: 480px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  :deep(.el-image) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
}
.thumb-list {
  display: flex;
  margin-top: 12px;
  gap: 8px;
  .thumb-item {
    width: 60px;
    height: 60px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
    &.active {
      border-color: #ff6a00;
    }
    :deep(.el-image) {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
.info {
  flex: 1;
}
.product-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin-bottom: 10px;
}
.brand-info {
  margin-bottom: 15px;
  font-size: 14px;
  .brand-label {
    color: #666;
  }
  .brand-name {
    color: #ff6a00;
    font-weight: 500;
  }
}
.price-section {
  background: #f9f9f9;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 15px;
  flex-wrap: wrap;
  .current-price {
    font-size: 28px;
    font-weight: bold;
    color: #ff3b3b;
  }
  .original-price {
    font-size: 16px;
    color: #999;
    text-decoration: line-through;
  }
  .sales-info {
    font-size: 14px;
    color: #666;
    margin-left: auto;
  }
}
.sku-section {
  margin-bottom: 20px;
  .spec-group {
    margin-bottom: 18px;
    display: flex;
    align-items: flex-start;
    .spec-name {
      width: 70px;
      font-size: 14px;
      color: #666;
      line-height: 32px;
    }
    .spec-values {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      .spec-value {
        display: inline-block;
        padding: 0 12px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        &.active {
          border-color: #ff6a00;
          color: #ff6a00;
          background-color: #fff7e6;
        }
        &.disabled {
          background-color: #f5f5f5;
          color: #ccc;
          cursor: not-allowed;
          border-color: #eee;
        }
        &:not(.disabled):hover {
          border-color: #ff6a00;
        }
      }
    }
  }
}
.quantity-section {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  .label {
    font-size: 14px;
    color: #666;
  }
  .stock-info {
    font-size: 13px;
    color: #999;
    margin-left: 10px;
  }
}
.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  .el-button {
    min-width: 160px;
  }
}
.service-promise {
  display: flex;
  gap: 20px;
  padding: 12px 0;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 12px;
}
.detail-tabs {
  margin-top: 30px;
  border-top: 1px solid #eee;
}
.detail-description {
  padding: 20px 0;
  .content {
    font-size: 14px;
    line-height: 1.6;
    color: #555;
  }
}
.review-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  .rate {
    font-size: 18px;
    font-weight: bold;
    color: #ff6a00;
  }
}
.review-list {
  .review-item {
    display: flex;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
    .user-avatar {
      flex-shrink: 0;
    }
    .review-content {
      flex: 1;
      .user-name {
        font-weight: 500;
        margin-bottom: 5px;
      }
      .rate-star {
        margin: 5px 0;
      }
      .sku-info {
        font-size: 12px;
        color: #999;
        margin: 5px 0;
      }
      .content {
        font-size: 14px;
        color: #333;
        margin: 8px 0;
      }
      .images {
        display: flex;
        gap: 8px;
        margin: 8px 0;
      }
      .time {
        font-size: 12px;
        color: #aaa;
      }
    }
  }
}
</style>