import { defineStore } from 'pinia'
import {
    getCart,
    addToCart,
    updateCartItemQuantity,
    deleteCartItem,
    updateCartItemChecked,
    updateAllChecked,
    clearCart
} from '@/api/cart'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        loading: false
    }),
    getters: {
        totalPrice: (state) => {
            if (!Array.isArray(state.items)) return 0
            return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        },
        totalCount: (state) => {
            if (!Array.isArray(state.items)) return 0
            return state.items.reduce((sum, item) => sum + item.quantity, 0)
        }
    },
    actions: {
        parseImage(images) {
            if (!images) return ''
            try {
                const arr = JSON.parse(images)
                return Array.isArray(arr) && arr.length ? arr[0] : ''
            } catch {
                return images
            }
        },
        async fetchCart() {
            this.loading = true
            try {
                const res = await getCart()
                // 响应拦截器已返回 data，所以 res 直接就是 CartResponse 对象
                const rawItems = res?.items || []
                this.items = rawItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity,
                    checked: item.checked,
                    stock: item.stock,
                    imageUrl: this.parseImage(item.productImage)
                }))
            } catch (error) {
                console.error('获取购物车失败', error)
                this.items = []
            } finally {
                this.loading = false
            }
        },
        async addItem(productId, quantity = 1) {
            await addToCart(productId, quantity)
            await this.fetchCart()
        },
        async updateItem(productId, quantity) {
            await updateCartItemQuantity(productId, quantity)
            await this.fetchCart()
        },
        async removeItem(productId) {
            await deleteCartItem(productId)
            await this.fetchCart()
        },
        async updateChecked(productId, checked) {
            await updateCartItemChecked(productId, checked)
            await this.fetchCart()
        },
        async updateAllChecked(checked) {
            await updateAllChecked(checked)
            await this.fetchCart()
        },
        async clearAll() {
            await clearCart()
            this.items = []
        }
    }
})