import request from '@/utils/request'

// 获取存款列表
export function getDepositList(params) {
  return request({
    url: '/index/Records/deposit',
    method: 'get',
    params
  })
}

// 获取存款记录详情
export function getDepositDetail(params) {
  return request({
    url: '/index/Records/depositDetail',
    method: 'get',
    params
  })
}

// 获取存款类型
export function getDepositType(params) {
  return request({
    url: '/index/Records/depositType',
    method: 'get',
    params
  })
}

// 获取取款列表
export function getWithdrawList(params) {
  return request({
    url: '/index/Records/withdraw',
    method: 'get',
    params
  })
}

// 获取取款记录详情
export function getWithdrawDetail(params) {
  return request({
    url: '/index/Records/withdrawDetail',
    method: 'get',
    params
  })
}

// 获取取款类型
export function getWithdrawType(params) {
  return request({
    url: '/index/Records/withdrawType',
    method: 'get',
    params
  })
}
