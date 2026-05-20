import request from './request'

// 查询商品可用库存
export function getProductStock(productId) {
  return request({
    url: `/stocks/${productId}`,
    method: 'get'
  })
}