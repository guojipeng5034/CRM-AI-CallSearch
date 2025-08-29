// src/router/index.ts

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    // 默认路由，当用户访问根路径'/'时，自动重定向到我们的查询页面
    path: '/',
    redirect: '/call-search'
  },
  {
    path: '/call-search',
    name: 'CallDataSearch',
    // 使用动态导入（懒加载）来引入页面组件
    // 这意味着只有当用户访问这个路由时，对应的组件代码才会被加载
    // 这对于应用的性能优化非常有好处
    component: () => import('@/views/example/index.vue')
  },
  // 你可以在这里添加更多的路由规则...
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/views/About.vue')
  // }
]

// 创建 router 实例
const router = createRouter({
  // 使用 History 模式，URL 中不会带有 '#'
  // 这是现代 Web 应用推荐的模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 简写，相当于 routes: routes
})

export default router