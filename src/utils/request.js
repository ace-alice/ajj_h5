import axios from 'axios'
import router from '@/router'
import { Toast, Dialog } from 'vant'
import {
  getToken,
  removeToken,
  removeUserInfo,
  removeAgentInfo
} from '@/utils/index.js'
// import store from '@/store/index.js'

// 创建实例
const service = axios.create({
  baseURL: window.location.origin + '/api', // url = base url + request url
  timeout: 10000 // 请求超时
})

// let num = 0
// const startLoading = () => {
//   if (num === 0) {
//     store.commit('user/GET_LOADING', true)
//   }
//   num++
// }
//
// const endLoading = () => {
//   if (num <= 0) return
//   num--
//   if (num === 0) {
//     store.commit('user/GET_LOADING', false)
//   }
// }

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers['deviceId'] = '2'
    // if (config.loading === false) {
    //   console.log('-------------')
    // } else {
    //   // startLoading()
    // }
    // 发送请求前，可在此携带 token
    if (getToken()) {
      config.headers['token'] = getToken()
    }
    return config
  },
  (error) => {
    // 请求错误，可在此进行统一错误处理
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // endLoading()
    if (res.code !== 1) {
      if (res.code === 125) {
        router.push({ name: 'IpError', query: { info: res.msg || res.message }})
      }

      if (res.code === 604 || res.code === 602) {
        removeToken()
        removeUserInfo()
        removeAgentInfo()
        router.push('/login')
        setTimeout(() => {
          location.reload()
        }, 100)
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008) {
        // to re-login
        Dialog.confirm({
          message: '登录失效，请重新登录'
        }).then(() => {
          removeToken()
          removeUserInfo()
          router.push('/login')
          setTimeout(() => {
            location.reload()
          }, 100)
        })
      }
      return Promise.reject(res)
    } else {
      return Promise.resolve(res)
    }
  },
  (error) => {
    // endLoading()
    Toast.fail({
      message: error.msg || error.message,
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
