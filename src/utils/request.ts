// src/utils/request.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // .env 文件中定义的基础API地址
  timeout: 5000, // 请求超时时间
});

let loadingInstance: any;

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么，比如添加 token
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // 显示加载动画
    loadingInstance = ElLoading.service({ lock: true, text: '加载中...', background: 'rgba(0, 0, 0, 0.7)' });

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 关闭加载动画
    if (loadingInstance) {
        loadingInstance.close();
    }

    const res = response.data;

    // 对响应数据做点什么
    if (res.code !== 200) { // 假设成功的业务代码为 200
        ElMessage({
            message: res.message || 'Error',
            type: 'error',
            duration: 5 * 1000
        })
        // 可以在这里处理特定的错误代码
        return Promise.reject(new Error(res.message || 'Error'));
    } else {
        return res;
    }
  },
  (error) => {
    // 关闭加载动画
    if (loadingInstance) {
        loadingInstance.close();
    }

    // 对响应错误做点什么
    ElMessage({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error);
  }
);

export default service;