// src/router/index.ts

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'
// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    // 将默认路径指向新的登录页
    path: '/',
    redirect: '/login'
  },
  {
    // 新增登录页路由
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    // 保持仪表盘页面路由不变
    path: '/call-search',
    name: 'CallDataSearch',
    component: () => import('@/views/example/index.vue')
  }
]

// 创建 router 实例
const router = createRouter({
  // 使用 History 模式，URL 中不会带有 '#'
  // 这是现代 Web 应用推荐的模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 简写，相当于 routes: routes
})
// --- 新增：全局前置守卫 ---
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 如果目标路由不是登录页，且用户未认证
  if (to.name !== 'Login' && !userStore.isAuthenticated()) {
    // 重定向到登录页
    next({ name: 'Login' });
  } else {
    // 否则，正常放行
    next();
  }
});
export default router