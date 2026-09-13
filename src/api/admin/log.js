import request from '../request'

// 分页查询日志
export function getLogList(params) {
  return request({
    url: '/logs/page',
    method: 'get',
    params
  })
}