<template>
  <div class="admin-user">
    <h2>用户管理</h2>
    <div class="filters">
      <el-input v-model="username" placeholder="用户名" style="width:200px" clearable @clear="fetchUsers" />
      <el-select v-model="status" placeholder="用户状态" clearable @change="fetchUsers">
        <el-option label="启用" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
      <el-button type="primary" @click="fetchUsers">搜索</el-button>
    </div>

    <el-table :data="userList" border stripe v-loading="loading">
      <el-table-column prop="id" label="用户ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 角色列 -->
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === '管理员' ? 'warning' : 'info'">
            {{ row.role || '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'" @click="toggleStatus(row)">
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="primary" @click="setRole(row, '管理员')">设为管理员</el-button>
          <el-button size="small" type="info" @click="setRole(row, '普通用户')">设为普通用户</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @current-change="fetchUsers"
      @size-change="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminGetUserList, adminChangeUserStatus } from '@/api/admin/user'

const userList = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const username = ref('')
const status = ref(null)

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = { pageNum: pageNum.value, pageSize: pageSize.value, username: username.value, status: status.value }
    const res = await adminGetUserList(params)
    const records = res.records || []
    // 初始化角色（示例：第一个用户为管理员，其余为普通用户）
    userList.value = records.map((user, index) => ({
      ...user,
      role: index === 0 ? '管理员' : '普通用户'
    }))
    total.value = res.total || 0
  } catch (err) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    await adminChangeUserStatus(row.id, newStatus)
    ElMessage.success(`用户已${newStatus === 1 ? '启用' : '禁用'}`)
    fetchUsers()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

// 设置角色（仅前端模拟，不调用后端接口）
const setRole = (row, role) => {
  row.role = role
  ElMessage.success(`已将用户 ${row.username} 设为${role}`)
}

onMounted(() => fetchUsers())
</script>

<style lang="scss" scoped>
.admin-user {
  padding: 20px;
  .filters {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
}
</style>