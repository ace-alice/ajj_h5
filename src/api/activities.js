import request from '@/utils/request.js';

/**
 * 优惠活动奖励记录
 */
export function rewardRecord(data) {
  return request({
    url: 'index/Activity/rewardRecord',
    method: 'post',
    data
  });
}

/**
 * vip奖励记录
 */
export function vipRewardRecord(data) {
  return request({
    url: 'index/Vip/vipRewardRecord',
    method: 'post',
    data
  });
}
