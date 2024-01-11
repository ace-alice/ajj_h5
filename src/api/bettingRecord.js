import request from '@/utils/request'

// 获取投注列表
export function getBetRecordList(params) {
  return request({
    url: '/index/BetOrder/list',
    method: 'get',
    params
  })
}

// 获取投注详情
export function getBetRecordDetail(params) {
  return request({
    url: '/index/BetOrder/detail',
    method: 'get',
    params
  })
}
