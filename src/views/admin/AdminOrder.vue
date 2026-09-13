<template>
  <div class="admin-order">
    <h2>订单管理</h2>
    <div class="filters">
      <el-select v-model="statusFilter" placeholder="订单状态" clearable @change="fetchOrders">
        <el-option label="待支付" :value="0" /><el-option label="已支付" :value="1" />
        <el-option label="已取消" :value="2" /><el-option label="已发货" :value="3" />
        <el-option label="已完成" :value="4" />
      </el-select>
      <el-input v-model="userIdFilter" placeholder="用户ID" style="width:150px" clearable @clear="fetchOrders" />
      <el-button type="primary" @click="fetchOrders">搜索</el-button>
    </div>

    <el-table :data="orderList" border stripe v-loading="loading">
      <el-table-column prop="orderNo" label="订单号" width="220" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="totalAmount" label="总金额" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }"><el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-dropdown @command="(cmd) => updateStatus(row.orderNo, cmd)">
            <el-button size="small">修改状态</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="3">发货</el-dropdown-item>
                <el-dropdown-item :command="4">完成</el-dropdown-item>
                <el-dropdown-item :command="2">取消</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
      layout="total, sizes, prev, pager, next" @current-change="fetchOrders" @size-change="fetchOrders" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminGetOrderList, adminUpdateOrderStatus } from '@/api/admin/order'

const orderList = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const statusFilter = ref(null)
const userIdFilter = ref('')

const statusText = (s) => ({ 0: '待支付', 1: '已支付', 2: '已取消', 3: '已发货', 4: '已完成' }[s] || '未知')
const statusType = (s) => ({ 0: 'danger', 1: 'warning', 2: 'info', 3: 'primary', 4: 'success' }[s] || '')

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value, status: statusFilter.value, userId: userIdFilter.value || undefined }
    const res = await adminGetOrderList(params)
    orderList.value = res.records || []
    total.value = res.total || 0
  } catch (err) { ElMessage.error('获取订单列表失败') } finally { loading.value = false }
}

const updateStatus = async (orderNo, status) => {
  try {
    await adminUpdateOrderStatus(orderNo, status)
    ElMessage.success('订单状态已更新')
    fetchOrders()
  } catch (err) { ElMessage.error('更新失败') }
}

onMounted(() => fetchOrders())
</script>

<style lang="scss" scoped>
.admin-order { padding: 20px; .filters { margin-bottom: 20px; display: flex; gap: 10px; align-items: center; } }
</style>