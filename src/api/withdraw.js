import request from '@/utils/request';

/**
 * 用户提现信息
 */
export function todayWithdrawTime(data) {
  return request({
    url: '/index/Withdraw/todayWithdrawTime',
    method: 'post',
    data
  })
}

/**
 * 用户提现
 */
export function doWithdraw(params) {
  return request({
    url: '/index/Withdraw/doWithdraw',
    method: 'post',
    data: params
  })
}

/**
 * 提现验证码
 */
export function phoneCaptcha(data) {
  return request({
    url: '/index/Withdraw/phoneCaptcha',
    method: 'post',
    data
  })
}

/**
 * 提现限额
 */
export function dictionary(params) {
  return request({
    url: '/index/SetUp/dictionary',
    method: 'post',
    data: params
  })
}

/**
 * 预期流水  字段 bet_expected 预期流水 bet_amount 当前流水
 */
export function lackBetAmount(data) {
  return request({
    url: '/index/Withdraw/lackBetAmount',
    method: 'post',
    data
  })
}

/**
 * 添加银行卡验证
 */
export function checkBank(params) {
  return request({
    url: '/index/Collection/checkBank',
    method: 'post',
    data: params
  })
}

/**
 * 添加USDT验证
 */
export function checkBlockchain(params) {
  return request({
    url: '/index/Collection/checkBlockchain',
    method: 'post',
    data: params
  })
}
