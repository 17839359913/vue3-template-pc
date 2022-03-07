import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import createProgressGuard from '@/router/progressGuard'
import { Modal } from 'ant-design-vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页',
      expand: false
    },
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/search-list',
    name: 'SearchList',
    meta: {
      title: '查询表单',
      expand: false
    },
    component: () => import('@/views/SearchList/index.vue')
  },
  {
    // 错误页面请放在最后面，因为它会匹配任意路径
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    meta: {
      title: '404',
      expand: false
    },
    component: () => import('@/views/NotFound.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  document.title = [to.meta?.title || to.name, 'xx系统'].filter(v => !!v).join(' - ')
  Modal.destroyAll() // 处理路由前进、后退不能销毁确认对话框的问题
  next()
})
createProgressGuard(router)
export default router
