<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">欢迎回来</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="account">
          <el-input
            v-model="form.account"
            placeholder="用户名/手机号/邮箱"
            size="large"
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            size="large"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" native-type="submit" block>
            登录
          </el-button>
        </el-form-item>
        <div class="footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  account: '',
  password: ''
})

const rules = {
  account: [
    { required: true, message: '请输入用户名/手机号/邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  loading.value = true
  try {
    const res = await login(form)
    // 兼容不同的后端返回格式
    const token = res.token || res.data?.token
    const userId = res.userId || res.data?.userId
    if (!token) throw new Error('登录响应缺少 token')
    
    // 保存 token 和 userId 到 store 和 localStorage
    userStore.setToken(token)
    if (userId) {
      localStorage.setItem('userId', userId)
      userStore.setUserId?.(userId) // 如果 store 中有 setUserId 方法
    }
    await userStore.fetchUserInfo()
    ElMessage.success('登录成功')
    
    // 获取登录前要跳转的页面地址（如果有）
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '登录失败'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 420px;
  padding: 40px 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  .title {
    text-align: center;
    margin-bottom: 32px;
    font-size: 28px;
    font-weight: 600;
    color: #303133;
  }
  .footer {
    text-align: center;
    font-size: 14px;
    color: #909399;
    a {
      color: #667eea;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  :deep(.el-button--primary) {
    width: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border: none;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>