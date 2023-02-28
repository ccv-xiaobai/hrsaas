import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

// 状态
const state = {
  token: getToken() // 一初始化vuex的时候，就先从缓存中读
}

const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    // 同步到缓存
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data)
    // axios默认给数据加了一层data

    // 如果为true，表示登录成功
    context.commit('setToken', result)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
