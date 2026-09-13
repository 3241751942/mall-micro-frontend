import request from '../request'

// 管理员分页查询订单
export function adminGetOrderList(params) {
  return request({
    url: '/admin/orders/page',
    method: 'get',
    params
  })
}

// 更新订单状态
export function adminUpdateOrderStatus(orderNo, status) {
  return request({
    url: `/admin/orders/${orderNo}/status`,
    method: 'put',
    params: { status }
  })
}