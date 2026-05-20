<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="title">注册新账号</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            size="large"
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="手机号"
            size="large"
            prefix-icon="Phone"
            clearable
          />
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            size="large"
            prefix-icon="Message"
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
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            size="large"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" native-type="submit" block>
            注册
          </el-button>
        </el-form-item>
        <div class="footer">
          <span>已有账号？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/user'   // 从 user.js 导入注册方法

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  loading.value = true
  try {
    // 去除 confirmPassword，只发送后端需要的字段
    const { confirmPassword, ...registerData } = form
    await register(registerData)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '注册失败'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-card {
  width: 480px;
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