import request from '../request'

// 创建商品
export function adminCreateProduct(data) {
  return request({
    url: '/admin/products',
    method: 'post',
    data
  })
}

// 更新商品
export function adminUpdateProduct(productId, data) {
  return request({
    url: `/admin/products/${productId}`,
    method: 'put',
    data
  })
}

// 删除商品（逻辑删除）
export function adminDeleteProduct(productId) {
  return request({
    url: `/admin/products/${productId}`,
    method: 'delete'
  })
}

// 上下架商品
export function adminChangeProductStatus(productId, status) {
  return request({
    url: `/admin/products/${productId}/status`,
    method: 'put',
    params: { status }
  })
}