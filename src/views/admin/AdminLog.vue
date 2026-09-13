<template>
  <div class="admin-log">
    <h2>系统日志</h2>
    <div class="filters">
      <el-input v-model="logType" placeholder="日志类型" style="width:150px" clearable />
      <el-input v-model="operation" placeholder="操作描述" style="width:200px" clearable />
      <el-input v-model="userId" placeholder="用户ID" style="width:150px" clearable />
      <el-date-picker v-model="dateRange" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
      <el-button type="primary" @click="fetchLogs">搜索</el-button>
    </div>

    <el-table :data="logList" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="logType" label="日志类型" width="120" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="operation" label="操作" min-width="250" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
    </el-table>

    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" @current-change="fetchLogs" @size-change="fetchLogs" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLogList } from '@/api/admin/log'

const logList = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(20)
const total = ref(0)
const logType = ref('')
const operation = ref('')
const userId = ref('')
const dateRange = ref([])

const fetchLogs = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      logType: logType.value || undefined,
      operation: operation.value || undefined,
      userId: userId.value || undefined,
      startTime: dateRange.value?.[0],
      endTime: dateRange.value?.[1]
    }
    const res = await getLogList(params)
    logList.value = res.records || []
    total.value = res.total || 0
  } catch (err) { ElMessage.error('获取日志失败') } finally { loading.value = false }
}
onMounted(() => fetchLogs())
</script>

<style lang="scss" scoped>
.admin-log { padding: 20px; .filters { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; } }
</style>