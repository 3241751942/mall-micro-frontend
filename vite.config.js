import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',           // 允许外部访问
    port: 5173,                // 保持你的端口
    allowedHosts: true,        // ✅ 允许所有 Host（解决 Cloudflare Tunnel 访问限制）
    proxy: {
      '/api': {
        target: 'http://localhost:8994',   // 网关地址
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})