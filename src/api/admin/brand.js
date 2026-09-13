import request from '../request'

// 分页查询品牌（管理端）
export function adminGetBrandPage(params) {
  return request({
    url: '/admin/brands/page',
    method: 'get',
    params
  })
}

// 获取品牌详情
export function adminGetBrandDetail(brandId) {
  return request({
    url: `/admin/brands/${brandId}`,
    method: 'get'
  })
}

// 创建品牌
export function adminCreateBrand(data) {
  return request({
    url: '/admin/brands',
    method: 'post',
    data
  })
}

// 更新品牌
export function adminUpdateBrand(brandId, data) {
  return request({
    url: `/admin/brands/${brandId}`,
    method: 'put',
    data
  })
}

// 删除品牌（逻辑删除）
export function adminDeleteBrand(brandId) {
  return request({
    url: `/admin/brands/${brandId}`,
    method: 'delete'
  })
}