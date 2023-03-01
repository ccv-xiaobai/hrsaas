// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例  和组件中的this.$store是一回事
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
// next 是前置守卫必须必须执行的钩子
// next 必须执行 如果不执行 页面就死了
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
router.beforeEach(async function(to, from, next) {
  NProgress.start() // 开启进度条
  //  首先判断有无token
  // if(store.state.user.token)
  if (store.getters.token) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页
    } else {
      // 只有放过的时候才去获取用户的资料
      // 是每次都去获取吗？
      // 如果当前vuex中有用户的资料的id 表示 已经有了资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
      }
      next() // 直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
