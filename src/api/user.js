import request from '@/utils/request'

// 登录接口
export function login(data) {
  // 返回一个axios对象 => promise
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户资料接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 根据用户的id获取用户的详情
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
