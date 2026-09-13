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
          <p>支付单号：{{ paymentInfo.paymentNo }}</p>
        </div>
        <div class="payment-methods">
          <h3>选择支付方式</h3>
          <el-radio-group v-model="payMethod">
            <el-radio value="BALANCE">模拟支付（测试）</el-radio>
            <el-radio value="ALIPAY">支付宝</el-radio>
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
import { mockPaymentSuccess, alipayPagePay } from '@/api/payment'
import AppTopNav from '@/components/home/AppTopNav.vue'

const route = useRoute()
const router = useRouter()

// 从 URL 参数获取支付信息
const orderNo = ref(route.query.orderNo || '')
const orderId = ref(route.query.orderId ? parseInt(route.query.orderId) : null)
const amount = ref(route.query.amount ? parseFloat(route.query.amount) : null)
const paymentNo = ref(route.query.paymentNo || '')

const paymentInfo = ref(null)
const loading = ref(false)
const paying = ref(false)
const payMethod = ref('BALANCE')

// 初始化
const initPaymentInfo = () => {
  if (!orderNo.value || !orderId.value || !amount.value) {
    ElMessage.error('订单信息不完整')
    router.push('/order/list')
    return
  }
  if (!paymentNo.value) {
    ElMessage.error('支付单号缺失，请重新下单')
    router.push('/order/list')
    return
  }
  paymentInfo.value = {
    orderNo: orderNo.value,
    orderId: orderId.value,
    amount: amount.value,
    paymentNo: paymentNo.value
  }
}

// 发起支付
const handlePay = async () => {
  if (!paymentInfo.value) return
  
  paying.value = true
  try {
    if (payMethod.value === 'BALANCE') {
      await mockPaymentSuccess(paymentInfo.value.paymentNo, paymentInfo.value.orderNo)
      ElMessage.success('支付成功')
      router.push({ path: '/user/profile', query: { tab: 'history' } })
    } else if (payMethod.value === 'ALIPAY') {
      const res = await alipayPagePay(
        paymentInfo.value.paymentNo,
        paymentInfo.value.orderId
      )
      
      const html = res.data || res
      if (html && html.includes('form')) {
        const div = document.createElement('div')
        div.innerHTML = html
        document.body.appendChild(div)
        const form = div.querySelector('form')
        if (form) {
          form.submit()
        } else {
          ElMessage.error('支付页面加载失败')
        }
        setTimeout(() => document.body.removeChild(div), 1000)
      } else {
        ElMessage.error('支付页面加载失败')
      }
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