import request from '../request'

// 管理员分页查询用户
export function adminGetUserList(params) {
  return request({
    url: '/users/admin/users',   // 你的 UserController 中已有该接口
    method: 'get',
    params
  })
}

// 修改用户状态（启用/禁用）
export function adminChangeUserStatus(userId, status) {
  return request({
    url: `/users/admin/users/${userId}/status`,
    method: 'put',
    params: { status }
  })
}