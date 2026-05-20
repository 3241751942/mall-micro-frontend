import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('token')
      this.userInfo = null
    },
    async fetchUserInfo() {
      if (!this.token) return
      // 暂时不调用真实接口，避免依赖
      console.log('fetchUserInfo called')
    }
  }
})