<template>
  <div class="home-header">
    <div class="container">
      <div class="search-section">
        <div class="search-box">
          <input type="text" placeholder="搜一搜 发现更多好物" v-model="keyword" @keyup.enter="doSearch" />
          <button @click="doSearch">搜索</button>
        </div>
        <div class="hot-words">
          <a href="#">潮流男装</a>
          <a href="#">品质家电</a>
          <a href="#">美妆个护</a>
        </div>
      </div>
      <div class="qr-section">
        <img src="https://picsum.photos/64/64?random=100" alt="App下载" />
        <span>下载APP</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const keyword = ref('');

const doSearch = () => {
  if (keyword.value.trim()) {
    router.push({ path: '/search', query: { q: keyword.value } });
  }
};
</script>

<style lang="scss" scoped>
.home-header {
  background: white;
  padding: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .search-section {
    flex: 1;
    max-width: 630px;
    .search-box {
      display: flex;
      height: 38px;
      input {
        flex: 1;
        border: 2px solid #ff6a00;
        border-right: none;
        padding: 0 10px;
        border-radius: 20px 0 0 20px;
        outline: none;
      }
      button {
        width: 80px;
        background: #ff6a00;
        color: white;
        border: none;
        border-radius: 0 20px 20px 0;
        cursor: pointer;
      }
    }
    .hot-words {
      margin-top: 8px;
      a {
        margin-right: 12px;
        font-size: 12px;
        color: #666;
        text-decoration: none;
      }
    }
  }
  .qr-section {
    text-align: center;
    img {
      width: 64px;
      height: 64px;
      display: block;
      margin-bottom: 4px;
    }
    span {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>