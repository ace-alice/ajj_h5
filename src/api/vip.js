import request from '@/utils/request';

/**
 * vip轮播图
 */
export function getVipList(data) {
  return request({
    url: 'index/Vip/vipList',
    method: 'post',
    data
  })
}

/**
 * vip返水
 */
export function rebateVip(data) {
  return request({
    url: '/index/Vip/vipRebateInfo',
    method: 'post',
    data
  })
}

/**
 * vip会员权益
 */
export function memberVip(data) {
  return request({
    url: '/index/Vip/vipLevelInfo',
    method: 'post',
    data
  })
}

/**
 * vip首充
 */
export function firstVip(data) {
  return request({
    url: '/index/Vip/vipFirstMonthInfo',
    method: 'post',
    data
  })
}

/**
 * vip月复活
 */
export function resurrectionVip(data) {
  return request({
    url: '/index/Vip/vipResurrectionGoldInfo',
    method: 'post',
    data
  })
}

/**
 * 是否有月首充奖励
 */
export function isRechargeStatus(data) {
  return request({
    url: '/index/Vip/vipMonthFirstRechargeStatus',
    method: 'post',
    data
  })
}

/**
 * 领取月首充奖励
 */
export function vipMonthFirstRechargeApply(data) {
  return request({
    url: '/index/Vip/vipMonthFirstRechargeApply',
    method: 'post',
    data
  })
}

/**
 * 是否有月复活奖励
 */
export function vipResurrectionStatus(data) {
  return request({
    url: '/index/Vip/vipResurrectionStatus',
    method: 'post',
    data
  })
}

/**
 * 领取月复活奖励
 */
export function vipResurrectionApply(data) {
  return request({
    url: '/index/Vip/vipResurrectionApply',
    method: 'post',
    data
  })
}

/**
 * vip当前等级
 */
export function vipCurrent(data) {
  return request({
    url: 'index/Vip/vipCurrent',
    method: 'post',
    data
  })
}
