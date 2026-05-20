import request from './request'

// 创建订单
export function createOrder(data) {
  return request({
    url: '/orders/create',
    method: 'post',
    data
  })
}

// 查询订单详情
export function getOrderDetail(orderNo) {
  return request({
    url: `/orders/${orderNo}`,
    method: 'get'
  })
}

// 分页查询订单列表
export function getOrderList(params) {
  return request({
    url: '/orders/page',
    method: 'get',
    params   // 重要：使用 params 而不是 data
  })
}

// 取消订单
export function cancelOrder(orderNo) {
  return request({
    url: '/orders/cancel',
    method: 'put',
    data: { orderNo }
  })
}


// 根据订单号获取订单数字ID
export function getOrderIdByOrderNo(orderNo) {
  return request({
    url: `/orders/orderId/${orderNo}`,
    method: 'get'
  })

  
}