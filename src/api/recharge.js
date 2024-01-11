import request from '@/utils/request'

/**
 * 充值线路
 */
export function depositType(params) {
  return request({
    url: '/index/Deposit/DepositType',
    method: 'post',
    data: params
  })
}

/**
 * 用户充值
 */
export function doDeposit(params) {
  return request({
    url: '/index/Deposit/doDeposit',
    method: 'post',
    data: params
  })
}

/**
 * 快捷金额
 */
export function expressAmount(data) {
  return request({
    url: '/index/Dictionary/getValue',
    method: 'post',
    data
  })
}
