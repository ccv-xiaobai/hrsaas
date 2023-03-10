import Layout from '@/layout'

// 导出公司设置的路由规则
export default {
  // 路由规则
  path: '/setting',
  name: 'settings',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import ('@/views/setting'),
    meta: {
      title: '公司设置',
      icon: 'setting'
    }
  }]
}
