// 专门处理权限路由的模块
// 引入静态路由的路由表
import { asyncRoutes, constantRoutes } from '@/router'
const state = {
  // 一开始 用户肯定拥有静态路由的权限
  routes: constantRoutes // 路由表 表示 当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改routes的mutations
  // payload 认为是我们登录成功需要添加的新路由
  setRoutes(state, newRoutes) {
    // state.routes = [...state.routes, ...newRoutes] // 这么写业务不太正确
    // 每次都是在静态路由的基础上去加新的路由
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus:["settings","permissions",...]
  // asyncRoutes是所有的动态路由
  // asyncRoutes => [{path:'settings',name="settings"},{},{},...]
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出 动态路由中和menus中能够对上的路由
    menus.forEach(key => {
      // key就是一个个的标识
      // asyncRoutes 里找有没有对象中的name属性等于 key的  如果找不到就是没有权限 如果找到了有权限 筛选出来
      // asyncRoutes.filter(item => item.name === key) // 得到一个数组 有可能有元素也有可能是空数组
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // 这个routes就是当前用户所拥有的 动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给 mutations
    return routes // 为毛这里要 return  state数据 是用来显示左侧菜单用的 return 是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
