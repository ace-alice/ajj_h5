import request from '@/utils/request';

/**
 * 首页轮播图
 */
export function homeBanner(data) {
  return request({
    url: '/index/SetUp/banner',
    method: 'post',
    data
  });
}

/**
 * 热门游戏列表
 */
export function hotGame(data) {
  return request({
    url: '/index/IaGame/getHotGame',
    method: 'post',
    data
  });
}

/**
 * IA游戏入口
 */
export function iaGameEntrance(data) {
  return request({
    url: '/index/IaGame/index',
    method: 'post',
    data
  });
}

/**
 * 沙巴游戏入口
 */
export function sbGameEntrance(data) {
  return request({
    url: '/index/SabaGame/index',
    method: 'post',
    data
  });
}

/**
 * 平博游戏入口
 */
export function pbGameEntrance(data) {
  return request({
    url: '/index/PinnacleGame/index',
    method: 'post',
    data
  });
}

/**
 * 小金体育入口
 */
export function xjGameEntrance(data) {
  return request({
    url: '/index/XjGame/index',
    method: 'post',
    data
  })
}

/**
 * ag真人入口
 */
export function agGameEntrance(data) {
  return request({
    url: '/index/AgGame/index',
    method: 'post',
    data
  })
}

/**
 * 获取维护状态
 */
export function maintainStatus(params) {
  return request({
    url: '/index/SetUp/checkMaintain',
    method: 'get',
    params
  });
}
