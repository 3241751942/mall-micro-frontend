import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'


// 页面组件懒加载
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const ProductDetail = () => import('@/views/ProductDetail.vue')
const Cart = () => import('@/views/Cart.vue')
const OrderConfirm = () => import('@/views/OrderConfirm.vue')
const OrderList = () => import('@/views/OrderList.vue')
const UserInfo = () => import('@/views/UserInfo.vue')
const AddressList = () => import('@/views/AddressList.vue')
const SearchResults = () => import('@/views/SearchResults.vue')
const Favorites = () => import('@/views/Favorites.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const Payment = () => import('@/views/Payment.vue')


const routes = [
  { path: '/', component: Home, meta: { title: '首页', requiresAuth: false } },
  { path: '/search', component: SearchResults, meta: { title: '搜索', requiresAuth: false } },
  { path: '/product/:id', component: ProductDetail, meta: { title: '商品详情', requiresAuth: false } },
  { path: '/cart', component: Cart, meta: { title: '购物车', requiresAuth: true } },
  { path: '/order/confirm', component: OrderConfirm, meta: { title: '订单确认', requiresAuth: true } },
  { path: '/order/list', component: OrderList, meta: { title: '我的订单', requiresAuth: true } },
  { path: '/user/info', component: UserInfo, meta: { title: '个人资料', requiresAuth: true } },
  { path: '/address', component: AddressList, meta: { title: '地址管理', requiresAuth: true } },
  { path: '/login', component: Login, meta: { title: '登录', requiresAuth: false } },
  { path: '/register', component: Register, meta: { title: '注册', requiresAuth: false } },
  { path: '/favorites', component: Favorites, meta: { title: '我的收藏', requiresAuth: true } },
  { path: '/user/profile', component: UserProfile, meta: { title: '我的商城', requiresAuth: true } },
  { path: '/payment', component: Payment, meta: { title: '订单支付', requiresAuth: true } }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫（不使用 next() 回调）
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const isLoggedIn = !!userStore.token
  console.log('路由跳转:', to.path, '需要登录:', to.meta.requiresAuth, '登录状态:', isLoggedIn)

  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log('未登录，跳转到登录页')
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router