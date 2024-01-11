import request from '@/utils/request'

// 获取交易列表
export function getTradeRecordList(params) {
  return request({
    url: '/index/MoneyOrder/list',
    method: 'get',
    params
  })
}

// 获取交易详情
export function getTradeRecordDetail(params) {
  return request({
    url: '/index/MoneyOrder/detail',
    method: 'get',
    params
  })
}

// 获取交易类型
export function getTradeRecordType(params) {
  return request({
    url: '/index/MoneyOrder/moneyType',
    method: 'get',
    params
  })
}
