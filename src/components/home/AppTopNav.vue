<template>
  <div class="topnav">
    <div class="container">
      <div class="logo-area">
        <router-link to="/" class="logo">商城</router-link>
        <span class="slogan">用心挑选的快乐</span>
      </div>
      <ul class="nav-links">
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/user/profile">我的商城</router-link></li>
        <li><router-link to="/cart">购物车</router-link></li>
        <li><router-link to="/favorites">收藏夹</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style lang="scss" scoped>
.topnav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-area {
    display: flex;
    align-items: center;

    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #ff6a00;
      margin-right: 8px;
      text-decoration: none;
    }

    .slogan {
      color: #ff6a00;
    }
  }

  .nav-links {
    display: flex;
    list-style: none;

    li {
      margin-left: 20px;

      a {
        color: #666;
        text-decoration: none;

        &:hover {
          color: #ff6a00;
        }
      }
      .router-link-active {
        color: #ff6a00;
        font-weight: bold;
      }
    }
  }
}
</style>