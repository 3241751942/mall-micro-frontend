import request from '../request'

// 创建分类
export function adminCreateCategory(data) {
  return request({
    url: '/admin/categories',
    method: 'post',
    data
  })
}

// 更新分类
export function adminUpdateCategory(categoryId, data) {
  return request({
    url: `/admin/categories/${categoryId}`,
    method: 'put',
    data
  })
}

// 删除分类
export function adminDeleteCategory(categoryId) {
  return request({
    url: `/admin/categories/${categoryId}`,
    method: 'delete'
  })
}