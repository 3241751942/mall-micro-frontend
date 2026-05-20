import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

// 请求拦截器：自动添加 token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // 如果后端要求传递用户ID（从JWT解析），前端通常不需要手动传，但为了兼容，可从localStorage获取
    const userId = localStorage.getItem('userId')
    if (userId) {
      config.headers['X-User-Id'] = userId
    }
    return config
  },
  error => Promise.reject(error)
)

// 统一处理未授权（401）
function handleUnauthorized() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  // 避免在登录页无限跳转
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

// 响应拦截器：统一处理错误和 token 过期
request.interceptors.response.use(
  response => {
    const res = response.data
    // 假设后端返回格式为 { code: 200, data: ..., message: ... }
    if (res.code === 200) {
      return res.data
    } else if (res.code === 401) {
      handleUnauthorized()
      return Promise.reject(new Error(res.message || '请重新登录'))
    } else {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    console.error('请求错误', error)
    // 处理 HTTP 状态码 401
    if (error.response && error.response.status === 401) {
      handleUnauthorized()
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    return Promise.reject(error)
  }
)

export default request