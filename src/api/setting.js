import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 根据id查询企业
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    method: 'delete',
    url: `/sys/role/${id}`
  })
}

// 读取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

// 添加角色
export function addRole(data) {
  return request({
    method: 'post',
    url: '/sys/role',
    data
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
