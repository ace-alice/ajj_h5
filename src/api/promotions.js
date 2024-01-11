import request from '@/utils/request.js'

/**
 * 活动tab
 */
export function tabList(data) {
  return request({
    url: '/index/Activity/tabList',
    method: 'post',
    data
  })
}

/**
 * 活动列表
 */
export function promotionList(params) {
  return request({
    url: 'index/Activity/list',
    method: 'post',
    data: params
  })
}
