import request from '@/utils/request'

/**
 * 获取联系方式
 */
export function getContactUs(data) {
  return request({
    url: 'index/SetUp/contactUs',
    method: 'post',
    data
  })
}

export const contactAllTimeUrl = 'https://direct.lc.chat/14128890/'
