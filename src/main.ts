// src/main.ts

import { createApp } from 'vue'
import App from './App.vue'

// 1. 导入我们刚刚创建的 router
import router from './router'

import 'element-plus/dist/index.css'
import './styles/theme.css'
const app = createApp(App)

// 2. 在挂载应用之前，使用 .use() 方法来注册路由插件
app.use(router)

app.mount('#app')