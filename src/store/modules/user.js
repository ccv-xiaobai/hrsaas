import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(), // 一初始化vuex的时候，就先从缓存中读
  userInfo: {} // 这里定义一个空对象 为什么要定义一个空对象呢
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
  },
  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = result // 这样是响应式
    // state.userInfo = { ...result } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },

  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data)
    // axios默认给数据加了一层data
    // console.log(result)
    // 如果为true，表示登录成功
    context.commit('setToken', result)
    // 拿到token说明登录成功
    setTimeStamp() // 设置时间戳
  },

  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    // console.log(result)
    // 获取用户的详情
    const baseInfo = await getUserDetailById(result.userId)
    // 将两个接口合并
    const baseResult = { ...result, ...baseInfo }
    context.commit('setUserInfo', baseResult) // 提交到mutations // 将整个的个人信息设置到用户的vuex数据中
    return baseResult // 这里为什么要return呢，这里是给我们后期做权限的时候 留下的伏笔
  },

  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('reomveUserInfo')
    // 重置路由
    resetRouter()
    // 去设置权限模块下的路由为初始状态
    // vuex中子模块的action 都没加锁的情况下  可以随意调用
    // 不加命名空间的情况下 所有的mutation action都是挂在全局上的 所有可可以直接调用
    // 但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context、
    context.commit('permission/setRoutes', [], { root: true })
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
