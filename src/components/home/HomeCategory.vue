<template>
  <div class="category-bar" @mouseleave="closeSubmenu">
    <div class="category-menu" v-if="topCategories.length">
      <div
        v-for="(cat, idx) in topCategories"
        :key="cat.id"
        class="menu-item"
        @mouseenter="showSubmenu(cat, idx)"
      >
        <a href="#">{{ cat.name }}</a>
      </div>
      <div class="submenu" v-show="activeIndex !== -1 && currentSubCategories.length">
        <div class="submenu-inner">
          <div v-for="sub in currentSubCategories" :key="sub.id" class="sub-item">
            <a href="#">{{ sub.name }}</a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-category">加载分类中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCategoryTree } from '@/api/product';

const topCategories = ref([]);
const currentSubCategories = ref([]);
const activeIndex = ref(-1);

// 从 API 获取分类树，并筛选顶级分类（level === 1）
const fetchCategories = async () => {
  try {
    const res = await getCategoryTree();
    topCategories.value = (res || []).filter(cat => cat.level === 1);
  } catch (error) {
    console.error('获取分类失败', error);
    topCategories.value = [];
  }
};

// 鼠标悬浮时显示子分类
const showSubmenu = (cat, idx) => {
  activeIndex.value = idx;
  currentSubCategories.value = cat.children || [];
};

// 移出整个区域时关闭弹框
const closeSubmenu = () => {
  activeIndex.value = -1;
  currentSubCategories.value = [];
};

onMounted(() => {
  fetchCategories();
});
</script>

<style lang="scss" scoped>
.category-bar {
  width: 280px;               // 适应三列布局
  background: white;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  .category-menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  // 三列等宽
    gap: 4px;
    padding: 12px 8px;
  }
  .menu-item {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    a {
      color: #333;
      text-decoration: none;
      display: block;
      font-size: 13px;
    }
    &:hover {
      background: #f8f8f8;
    }
  }
  .submenu {
    position: absolute;
    top: 0;
    left: 280px;              // 与 category-bar 宽度相同
    width: 400px;
    min-height: 200px;
    background: white;
    border: 1px solid #eee;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 20;
    .submenu-inner {
      padding: 16px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .sub-item a {
      color: #666;
      text-decoration: none;
      font-size: 13px;
      &:hover {
        color: #ff6a00;
      }
    }
  }
}
.loading-category {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>