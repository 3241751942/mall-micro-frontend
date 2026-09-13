<template>
  <el-container class="admin-layout">
    <el-aside width="220px" class="admin-aside">
      <div class="logo">商城管理后台</div>
      <el-menu
        router
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/admin/product">
          <el-icon><Goods /></el-icon><span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/order">
          <el-icon><List /></el-icon><span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/brand">
          <el-icon><Collection /></el-icon><span>品牌管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/category">
          <el-icon><FolderOpened /></el-icon><span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/user">
          <el-icon><User /></el-icon><span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/log">
          <el-icon><Document /></el-icon><span>日志管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <div class="title">欢迎回来，管理员</div>
        <div class="actions">
          <el-button type="link" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Goods, List, Collection, FolderOpened, User, Document } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const logout = () => {
  userStore.clearToken()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.admin-layout {
  height: 100vh;
}
.admin-aside {
  background-color: #304156;
  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    border-bottom: 1px solid #263445;
  }
  .el-menu {
    border-right: none;
  }
}
.admin-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}
</style>