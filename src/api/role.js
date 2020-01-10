import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/roles/roleperm',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/roles/add',
    method: 'post',
    data
  })
}

export function updateRoleTree(data) {
  return request({
    url: '/roles/permupdate',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/roles/update`,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `/roles/del`,
    method: 'post',
    data
  })
}

export function getAccounts(query) {
  return request({
    url: '/account/list',
    method: 'get',
    params: query
  })
}

export function addAccounts(data) {
  return request({
    url: '/admin/add',
    method: 'post',
    data
  })
}

export function updateAccounts(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data
  })
}

export function deleteAccounts(data) {
  return request({
    url: '/admin/del',
    method: 'post',
    data
  })
}
