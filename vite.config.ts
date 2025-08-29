import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 1. 确保导入 'path' 模块
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 2. 添加 resolve 配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 3. 配置开发服务器的代理
  server: {
    host: true, // 或者写成 host: '0.0.0.0'
    proxy: {
      '/api': {
        target: 'http://your-backend-api-url.com', // 将这里替换为你的后端 API 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})