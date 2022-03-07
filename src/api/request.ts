import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'ant-design-vue'
console.log('process.env.VUE_APP_BASEURL', process.env.VUE_APP_BASEURL)
const axiosInstance = axios.create()
// 默认请求连接
axiosInstance.defaults.baseURL = process.env.VUE_APP_BASEURL;
 
// 超时时间（ms）
axiosInstance.defaults.timeout = 2000 * 1000;
// axios请求开启cookie，支持跨域请求携带cookie
axiosInstance.defaults.withCredentials = true;
 
// 请求拦截
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => { 
    // 可在这里做一些数据的校验。
    // session的校验等。
    return config 
  },
  (error: AxiosError) => { 
    return error 
  }
)
// 响应拦截
axiosInstance.interceptors.response.use((result: AxiosResponse) => {
  if (result.status === 200) {
    if (result.data && result.data.code === 0) {
      if(result.config.method === 'post') {
        message.success(result.data.desc || '操作成功')
      }
      return Promise.resolve(result.data);
    } else {
      message.error(result.data.desc || '操作失败')
      return Promise.reject(result);
    }
  } else {
    message.error('网络异常')
    return Promise.reject(result);
  }
}, (err: AxiosError) => {
  console.log(err)
  // 返回数据前做了什么
  return Promise.reject(err)
})
export default axiosInstance
