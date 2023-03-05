// 该文件负责所有的公共的组件的全局注册
import PageTools from './pageTools'
export default {
  install(Vue) {
    // 组件的注册
    Vue.component('PageTools', PageTools)
  }
}
