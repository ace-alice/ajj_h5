import request from '@/utils/request';

/**
 * 获取收款账户手机验证码
 */
export function getCollectionCode(data) {
  return request({
    url: '/index/Collection/phoneCaptcha',
    method: 'get',
    data
  })
}

