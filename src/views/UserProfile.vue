<template>
  <div class="user-profile">
    <AppTopNav />
    <div class="profile-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="个人信息" name="info">
          <UserInfo :user-info="userInfo" @edit="openEditDialog" />
        </el-tab-pane>

        <el-tab-pane label="待支付" name="unpaid">
          <UnpaidOrders
            :orders="unpaidOrders"
            :loading="unpaidLoading"
            :page-num="unpaidPageNum"
            :page-size="unpaidPageSize"
            :total="unpaidTotal"
            @pay="payOrder"
            @cancel="cancelOrder"
            @reorder="reorder"
            @add-to-cart="addToCartHandler"
            @page-change="fetchUnpaidOrders"
          />
        </el-tab-pane>

        <el-tab-pane label="历史订单" name="history">
          <HistoryOrders
            :orders="historyOrders"
            :loading="historyLoading"
            @reorder="reorder"
            @add-to-cart="addToCartHandler"
          />
        </el-tab-pane>

        <el-tab-pane label="地址管理" name="address">
          <AddressManagement />
        </el-tab-pane>
      </el-tabs>
    </div>

    <EditProfileDialog
      v-model:visible="editDialogVisible"
      :user-info="userInfo"
      @save="submitEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getUserInfo,
  updateUserInfo
} from '@/api/user'
import { getOrderList, cancelOrder as cancelOrderApi, getOrderIdByOrderNo } from '@/api/order'
import { addToCart } from '@/api/cart'
import { getProductDetail } from '@/api/product'
import { createPayment } from '@/api/payment'

import AppTopNav from '@/components/home/AppTopNav.vue'
import UserInfo from '@/components/UserProfile/UserInfo.vue'
import EditProfileDialog from '@/components/UserProfile/EditProfileDialog.vue'
import UnpaidOrders from '@/components/UserProfile/UnpaidOrders.vue'
import HistoryOrders from '@/components/UserProfile/HistoryOrders.vue'
import AddressManagement from '@/components/UserProfile/AddressManagement.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref('info')

// 待支付订单
const unpaidOrders = ref([])
const unpaidLoading = ref(false)
const unpaidPageNum = ref(1)
const unpaidPageSize = ref(10)
const unpaidTotal = ref(0)

// 历史订单
const historyOrders = ref([])
const historyLoading = ref(false)

// 商品详情缓存
const productDetailCache = new Map()

const userInfo = ref({})

// 编辑资料相关
const editDialogVisible = ref(false)

// 补充商品品牌、描述和图片信息
const enrichOrdersWithProductDetails = async (orders) => {
  const productIds = new Set()
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.productId && !productDetailCache.has(item.productId)) {
        productIds.add(item.productId)
      }
    })
  })

  const promises = Array.from(productIds).map(async (productId) => {
    try {
      const detail = await getProductDetail(productId)
      productDetailCache.set(productId, {
        brand: detail.brand || '暂无品牌',
        description: detail.description || '暂无描述',
        images: detail.images
      })
    } catch (error) {
      console.error(`获取商品${productId}详情失败`, error)
      productDetailCache.set(productId, {
        brand: '品牌加载失败',
        description: '描述加载失败',
        images: null
      })
    }
  })

  await Promise.allSettled(promises)

  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.productId && productDetailCache.has(item.productId)) {
        const detail = productDetailCache.get(item.productId)
        item.brand = detail.brand
        item.description = detail.description
        item.images = detail.images
      } else {
        item.brand = '暂无品牌'
        item.description = '暂无描述'
        item.images = null
      }
    })
  })
}

// 获取待支付订单
const fetchUnpaidOrders = async (page = unpaidPageNum.value) => {
  unpaidPageNum.value = page
  unpaidLoading.value = true
  try {
    const res = await getOrderList({ pageNum: unpaidPageNum.value, pageSize: unpaidPageSize.value, status: 0 })
    const orders = (res.records || []).filter(o => o.status === 0)
    unpaidOrders.value = orders
    unpaidTotal.value = res.total || 0
    if (orders.length > 0) {
      await enrichOrdersWithProductDetails(orders)
    }
  } catch (error) {
    console.error('获取待支付订单失败', error)
    ElMessage.error('获取待支付订单失败')
  } finally {
    unpaidLoading.value = false
  }
}

// 获取历史订单
const fetchHistoryOrders = async () => {
  historyLoading.value = true
  try {
    const res = await getOrderList({ pageNum: 1, pageSize: 200 })
    const all = res.records || []
    const filtered = all.filter(order => order.status !== 0)
    historyOrders.value = filtered
    if (filtered.length > 0) {
      await enrichOrdersWithProductDetails(filtered)
    }
  } catch (error) {
    console.error('获取历史订单失败', error)
    ElMessage.error('获取历史订单失败')
  } finally {
    historyLoading.value = false
  }
}

// 支付订单
const payOrder = async (order) => {
  const orderNo = order.orderNo
  let amount = order.payAmount || order.totalAmount

  if (!amount) {
    ElMessage.error('订单金额缺失，无法支付')
    return
  }

  try {
    // 1. 获取订单数字ID
    const orderId = await getOrderIdByOrderNo(orderNo)
    
    // 2. 创建支付单
    const paymentData = {
      orderId: orderId,
      userId: userInfo.value.id,  // 从用户信息中获取 userId
      amount: amount,
      payType: 'ALIPAY'  // 默认支付宝支付
    }
    
    const paymentResult = await createPayment(paymentData)
    const paymentNo = paymentResult.data?.paymentNo || paymentResult.paymentNo
    
    if (!paymentNo) {
      ElMessage.error('创建支付单失败，请重试')
      return
    }
    
    console.log('支付单创建成功，支付单号：', paymentNo)
    
    // 3. 跳转到支付页面，传递支付单号和订单号
    router.push({
      path: '/payment',
      query: {
        orderNo: orderNo,
        orderId: orderId,
        amount: amount,
        paymentNo: paymentNo  // ✅ 新增支付单号
      }
    })
  } catch (error) {
    console.error('创建支付单失败', error)
    const msg = error.response?.data?.message || error.message || '创建支付单失败，请重试'
    ElMessage.error(msg)
  }
}

// 取消订单
const cancelOrder = async (orderNo) => {
  try {
    await cancelOrderApi(orderNo)
    ElMessage.success('订单已取消')
    fetchUnpaidOrders()
    fetchHistoryOrders()
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '取消失败'
    ElMessage.error(msg)
  }
}

// 加入购物车
const addToCartHandler = async (productId, productName) => {
  if (!productId) {
    ElMessage.error('商品信息不完整')
    return
  }
  try {
    await addToCart(productId, 1)
    ElMessage.success(`已添加 ${productName || '商品'} 到购物车`)
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '加入购物车失败'
    ElMessage.error(msg)
  }
}

// 再来一单
const reorder = async (order) => {
  if (!order.items || order.items.length === 0) {
    ElMessage.warning('订单中没有商品')
    return
  }

  const loadingMsg = ElMessage.info({
    message: '正在将商品加入购物车...',
    duration: 0
  })

  try {
    const promises = order.items.map(item =>
      addToCart(item.productId, item.quantity).catch(err => {
        console.error(`添加商品${item.productName}失败`, err)
        return { error: true, productName: item.productName }
      })
    )

    const results = await Promise.allSettled(promises)
    const failedCount = results.filter(r => r.status === 'rejected' || (r.value && r.value.error)).length

    loadingMsg.close()

    if (failedCount === 0) {
      ElMessage.success(`成功将订单中${order.items.length}件商品加入购物车`)
    } else {
      ElMessage.warning(`成功添加${order.items.length - failedCount}件商品，${failedCount}件添加失败`)
    }
  } catch (error) {
    loadingMsg.close()
    ElMessage.error('再来一单失败，请稍后重试')
  }
}

// 用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo()
    userInfo.value = res || {}
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

// 编辑资料对话框
const openEditDialog = () => {
  editDialogVisible.value = true
}

const submitEdit = async (formData) => {
  try {
    await updateUserInfo(formData)
    ElMessage.success('保存成功')
    editDialogVisible.value = false
    await fetchUserInfo()
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '保存失败'
    ElMessage.error(msg)
  }
}

const handleTabClick = (tab) => {
  const tabName = tab.paneName
  if (tabName === 'unpaid') {
    fetchUnpaidOrders()
  } else if (tabName === 'history') {
    if (historyOrders.value.length === 0) {
      fetchHistoryOrders()
    }
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchUnpaidOrders()
  // 根据URL参数激活标签页（用于支付成功后跳转）
  const tab = route.query.tab
  if (tab && ['info', 'unpaid', 'history', 'address'].includes(tab)) {
    activeTab.value = tab
    if (tab === 'history' && historyOrders.value.length === 0) {
      fetchHistoryOrders()
    }
  }
})
</script>

<style scoped>
.user-profile {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}
.profile-tabs {
  margin-top: 20px;
}
</style>