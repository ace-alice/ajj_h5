import request from '@/utils/request'

/**
 * 登录
 */
export function login(params) {
  return request({
    url: '/index/Login/login',
    method: 'post',
    data: params
  })
}

/**
 * 获取验证码
 */
export function getCode(data) {
  return request({
    url: '/index/Login.captcha',
    method: 'get',
    data
  })
}

/**
 * 获取手机验证码
 */
export function getPhoneCode(params) {
  return request({
    url: '/index/Login/phoneCaptcha',
    method: 'post',
    data: params
  })
}

/**
 * 手机登录
 */
export function phoneLogin(params) {
  return request({
    url: '/index/Login/login',
    method: 'post',
    data: params
  })
}

/**
 * 手机注册
 */
export function phoneRegister(params) {
  return request({
    url: '/index/Register/phoneRegister',
    method: 'post',
    data: params
  })
}

/**
 * 获取个人信息
 */
export function getPersonalInfo(data) {
  return request({
    url: '/index/Member/personalInfo',
    method: 'post',
    data
  })
}

/**
 * 退出登录
 */
export function signOutUser(data) {
  return request({
    url: '/index/Login/logout',
    method: 'get',
    data
  })
}

/**
 * 获取头像列表
 */
export function avatarList(params) {
  return request({
    url: '/index/Member/avatarList',
    method: 'post',
    data: params
  })
}

/**
 * 修改头像
 */
export function setAvatar(params) {
  return request({
    url: '/index/Member/setPersonalInfo',
    method: 'post',
    data: params
  })
}

/**
 * 找回密码
 */
export function findPassword(params) {
  return request({
    url: '/index/Login/findPassword',
    method: 'post',
    data: params
  })
}

/**
 * 获取验证码图片
 */
export function loginCodeImg(data) {
  return request({
    url: '/index/Login/captcha',
    method: 'post',
    data
  })
}

/**
 * 注册手机验证码
 */
export function registerPhoneCaptcha(params) {
  return request({
    url: '/index/Register/phoneCaptcha',
    method: 'post',
    data: params
  })
}
