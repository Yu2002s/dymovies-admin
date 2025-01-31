import axios from 'axios'
import { useUserStore } from '@/stores/user.js'
import { ElMessage } from 'element-plus'

const API_KEY = "m8wZ0TSYN2"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HTTP_BASE_URL
})

axiosInstance.interceptors.request.use(function (config) {
  const userStore = useUserStore()
  if (userStore.token) {
    // 用户已登录的情况下携带token信息
    config.headers.Authorization = userStore.token
  }
  config.headers['API-KEY'] = API_KEY
  return config
})

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data
  },
  (error) => {
    let msg
    const status = error.response.status
    switch (status) {
      case 400:
        msg = error.response.msg
        break
      case 401:
        useUserStore().logout()
        msg = '登录过期'
        break
      case 403:
        msg = '无权访问呢'
        break
      case 404:
        msg = '请求地址不存在'
        break
      case 500:
        msg = '服务器内部错误'
        break
      default:
        msg = '无网络'
        break
    }
    ElMessage.error({
      message: msg
    })
    return Promise.reject(error)
  }
)

export default axiosInstance
