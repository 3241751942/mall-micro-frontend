import request from './request'

// 创建支付单
export function createPayment(data) {
  return request({
    url: '/payments',     
    method: 'post',
    data
  })
}

// 查询支付状态
export function getPayment(paymentNo) {
  return request({
    url: `/payments/${paymentNo}`,
    method: 'get'
  })
}

// 模拟支付成功（开发测试）
export function mockPaymentSuccess(paymentNo, orderNo) {
  return request({
    url: '/payments/mock-callback',
    method: 'post',
    params: { paymentNo, orderNo }
  })
}