import request from './request'

// ========== 用户信息 ==========
export function register(data) {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/users/info',
    method: 'get'
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/users/info',
    method: 'put',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/users/password',
    method: 'put',
    data
  })
}

// ========== 地址管理 ==========
export function getAddressList() {
  return request({
    url: '/addresses',
    method: 'get'
  })
}

export function addAddress(data) {
  return request({
    url: '/addresses',
    method: 'post',
    data
  })
}

export function updateAddress(addressId, data) {
  return request({
    url: `/addresses/${addressId}`,
    method: 'put',
    data
  })
}

export function deleteAddress(addressId) {
  return request({
    url: `/addresses/${addressId}`,
    method: 'delete'
  })
}

export function setDefaultAddress(addressId) {
  return request({
    url: `/addresses/default/${addressId}`,
    method: 'put'
  })
}