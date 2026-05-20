import request from './request'

// 获取购物车
export function getCart() {
  return request({
    url: '/cart',
    method: 'get'
  })
}

// 添加商品到购物车
export function addToCart(productId, quantity) {
  return request({
    url: '/cart/items',
    method: 'post',
    data: { productId, quantity }
  })
}

// 修改商品数量
export function updateCartItemQuantity(productId, quantity) {
  return request({
    url: `/cart/items/${productId}`,
    method: 'put',
    data: { quantity }
  })
}

// 更新商品选中状态
export function updateCartItemChecked(productId, checked) {
  return request({
    url: `/cart/items/${productId}/check`,
    method: 'put',
    data: { checked }
  })
}

// 删除购物车商品
export function deleteCartItem(productId) {
  return request({
    url: `/cart/items/${productId}`,
    method: 'delete'
  })
}

// 全选/全不选
export function updateAllChecked(checked) {
  return request({
    url: '/cart/check-all',
    method: 'put',
    params: { checked }
  })
}

// 清空购物车
export function clearCart() {
  return request({
    url: '/cart',
    method: 'delete'
  })
}