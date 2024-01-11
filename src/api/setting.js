import request from '@/utils/request';

/**
 * 修改账户密码
 */
export function updateAccountPassword(params) {
  return request({
    url: '/index/Member/setLoginPwd',
    method: 'post',
    data: params
  })
}

/**
 * 修改交易密码
 */
export function updateTransactionPassword(params) {
  return request({
    url: '/index/Member/setTradePwd',
    method: 'post',
    data: params
  })
}

/**
 * 设置交易密码
 */
export function setTransactionPassword(params) {
  return request({
    url: '/index/FundsPassword/setPassword',
    method: 'post',
    data: params
  })
}

/**
 * 修改交易密码（验证码）
 */
export function updateTransactionPasswordCode(params) {
  return request({
    url: '/index/ChangeFundsPassword/sendCaptcha',
    method: 'post',
    data: params
  })
}

/**
 * 修改账户密码（验证码）
 */
export function updateAccountPasswordCode(params) {
  return request({
    url: '/index/ChangePassword/sendCaptcha',
    method: 'post',
    data: params
  })
}

/**
 * 设置交易密码（验证码）
 */
export function setTransactionPasswordCode(params) {
  return request({
    url: '/index/FundsPassword/sendCaptcha',
    method: 'post',
    data: params
  })
}

/**
 * 发送验证码（公共）
 */
export function pubCode(data) {
  return request({
    url: '/index/Member/sendCaptcha',
    method: 'post',
    data
  })
}
/**
 * 发送验证码-换绑手机号
 */
 export function phoneCaptcha(data) {
  return request({
    url: '/index/SetUp/phoneCaptcha',
    method: 'post',
    data
  })
}

/**
 * 设置新手机号
 */
 export function setPhone(params) {
  return request({
    url: '/index/SetUp/setPhone',
    method: 'get',
    params
  })
}

