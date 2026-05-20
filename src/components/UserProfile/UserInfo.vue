<template>
  <div>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="用户名">{{ userInfo.username || '-' }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ userInfo.nickname || '-' }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ userInfo.phone || '-' }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userInfo.email || '-' }}</el-descriptions-item>
      <el-descriptions-item label="最后登录">{{ userInfo.lastLoginTime || '-' }}</el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" @click="$emit('edit')">编辑资料</el-button>
  </div>
</template>

<script setup>
defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  }
})
defineEmits(['edit'])
</script>