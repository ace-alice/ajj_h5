import request from '@/utils/request'

/**
 * 获取公告信息
 */
export function getAnnouncement(params) {
  return request({
    url: '/index/SetUp/announcement',
    method: 'post',
    data: params
  })
}

/**
 * 获取公告详情
 */
export function getAnnouncementDetails(params) {
  return request({
    url: 'index/Announcement/list',
    method: 'post',
    data: params
  })
}

/**
 * 获取站内信
 */
export function getLetter(params) {
  return request({
    url: '/index/Letter/list',
    method: 'post',
    data: params
  })
}

/**
 * 获取站内信详情
 */
export function getLetterDetails(data) {
  return request({
    url: '/index/Letter/read',
    method: 'post',
    data
  })
}

/**
 * 多选删除站内信
 */
export function delReadLetter(data) {
  return request({
    url: '/index/Letter/delete',
    method: 'post',
    data
  })
}

/**
 * 站内信设置已读
 */
export function setReadLetter(data) {
  return request({
    url: 'index/Letter/setRead',
    method: 'post',
    data
  })
}

/**
 * 生日弹窗
 */
export function userAlert(data) {
  return request({
    url: 'index/MsgAlert/getUserAlert',
    method: 'post',
    data
  })
}

/**
 * 站内信未读数量
 */
export function unRead(data) {
  return request({
    url: '/index/Letter/unRead',
    method: 'post',
    data
  })
}
