import axios from 'axios'
import { Toast } from 'vant'

export default function createRequestFun(deviceId: string, token: string) {
  // 创建实例
  const service = axios.create({
    baseURL: window.location.origin + '/api', // url = base url + request url
    timeout: 10000 // 请求超时
  })

  // 请求拦截器
  service.interceptors.request.use(
    (config) => {
      config.headers['deviceId'] = deviceId
      // 发送请求前，可在此携带 token
      config.headers['token'] = token
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    (response) => {
      const res = response.data
      // endLoading()
      if (res.code !== 1 && res.code !== 50012 && res.code !== 10001) {
        return Promise.reject(res)
      } else {
        return Promise.resolve(res)
      }
    },
    (error) => {
      // endLoading()
      Toast.fail({
        message: error.msg,
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
  )

  return service
}
