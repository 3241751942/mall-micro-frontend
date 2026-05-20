import request from './request'

// ========== 商品 ==========
// 分页查询商品列表（POST）
export function getProductList(params) {
  return request({
    url: '/products/page',
    method: 'post',
    data: params   // 将分页参数放在请求体中
  })
}

export function getProductDetail(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'get'
  })
}

// ========== 分类 ==========
export function getCategoryTree() {
  return request({
    url: '/categories/tree',
    method: 'get'
  })
}

// ========== 品牌 ==========
export function getBrandList() {
  return request({
    url: '/brands',
    method: 'get'
  })
}