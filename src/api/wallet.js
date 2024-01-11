import request from '@/utils/request';

/**
 * 获取三方钱包余额
 */
export function getTripartiteBalance(params) {
  return request({
    url: '/index/Exchange/getMoney',
    method: 'post',
    data: params
  })
}

/**
 * 获取中心钱包余额
 */
export function getCenterBalance(params) {
  return request({
    url: '/index/Member/centerWallet',
    method: 'post',
    data: params
  })
}

/**
 * 主钱包转到三方钱包
 */
export function mainToTripartiteWallet(params) {
  return request({
    url: '/index/Exchange/moneyTransferIn',
    method: 'post',
    data: params,
    loading: false
  })
}

/**
 * 三方钱包转到主钱包
 */
export function tripartiteToMainWallet(params) {
  return request({
    url: '/index/Exchange/moneyTransferOut',
    method: 'post',
    data: params,
    config: { loading: false }
  })
}

/**
 * 余额回收
 */
export function balanceRecovery(data) {
  return request({
    url: '/index/Exchange/getBackAllMoney',
    method: 'get',
    data
  })
}

/**
 * 设置一键转入开关
 */
export function setQuicklyTransfer(params) {
  return request({
    url: '/index/Exchange/setQuicklyTransfer',
    method: 'post',
    data: params
  })
}
