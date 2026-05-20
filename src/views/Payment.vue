<template>
  <div class="payment-page">
    <AppTopNav />
    <div class="container">
      <h2>订单支付</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="paymentInfo" class="payment-info">
        <div class="order-info">
          <p>订单号：{{ paymentInfo.orderNo }}</p>
          <p>支付金额：¥{{ paymentInfo.amount }}</p>
        </div>
        <div class="payment-methods">
          <h3>选择支付方式</h3>
          <el-radio-group v-model="payMethod">
            <el-radio value="ALIPAY">支付宝</el-radio>
            <el-radio value="WECHAT">微信支付</el-radio>
            <el-radio value="BALANCE">模拟支付（测试）</el-radio>
          </el-radio-group>
        </div>
        <div class="actions">
          <el-button type="primary" :loading="paying" @click="handlePay">立即支付</el-button>
        </div>
      </div>
      <div v-else class="error">
        <p>订单信息不存在，请返回重试</p>
        <router-link to="/order/list">查看订单</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createPayment, mockPaymentSuccess } from '@/api/payment'
import AppTopNav from '@/components/home/AppTopNav.vue'

const route = useRoute()
const router = useRouter()
const orderNo = ref(route.query.orderNo || '')
const orderId = ref(route.query.orderId ? parseInt(route.query.orderId) : null)
const amount = ref(route.query.amount ? parseFloat(route.query.amount) : null)
const paymentInfo = ref(null)
const loading = ref(false)
const paying = ref(false)
const payMethod = ref('BALANCE')

// 初始化：直接设置支付信息
const initPaymentInfo = () => {
  if (!orderNo.value || !orderId.value || !amount.value) {
    ElMessage.error('订单信息不完整')
    router.push('/order/list')
    return
  }
  paymentInfo.value = {
    orderNo: orderNo.value,
    amount: amount.value,
    orderId: orderId.value
  }
}

// 发起支付
const handlePay = async () => {
  if (!paymentInfo.value) return
  paying.value = true
  try {
    // 创建支付单（后端幂等，若已有未完成支付单则直接返回）
    const paymentData = {
      orderId: paymentInfo.value.orderId,
      userId: 1, // 实际应从 store 或 localStorage 获取当前用户ID
      amount: paymentInfo.value.amount,
      payType: payMethod.value
    }
    const paymentRes = await createPayment(paymentData)
    const paymentNo = paymentRes.paymentNo

    if (payMethod.value === 'BALANCE') {
      // 模拟支付成功回调
      await mockPaymentSuccess(paymentNo, paymentInfo.value.orderNo)
      ElMessage.success('支付成功')
      // 跳转到个人中心的历史订单标签页
      router.push({ path: '/user/profile', query: { tab: 'history' } })
    } else {
      // 真实支付：跳转支付网关（示例）
      const paymentUrl = `http://localhost:8080/pay/gateway?paymentNo=${paymentNo}`
      window.location.href = paymentUrl
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '支付失败'
    ElMessage.error(msg)
  } finally {
    paying.value = false
  }
}

onMounted(() => {
  initPaymentInfo()
})
</script>

<style lang="scss" scoped>
.payment-page {
  background: #f5f5f5;
  min-height: 100vh;
}
.container {
  max-width: 800px;
  margin: 20px auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}
.order-info {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}
.payment-methods {
  margin-bottom: 24px;
}
.actions {
  text-align: center;
}
.loading,
.error {
  text-align: center;
  padding: 60px;
}
</style>