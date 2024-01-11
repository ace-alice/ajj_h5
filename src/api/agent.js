import request from '@/utils/request'

export function getAgentImage(data) {
  return request({
    url: '/index/Agent/getAgreement',
    method: 'post',
    data
  })
}

// 获取代理盈亏列表
export function getAgentReportList(data) {
  return request({
    url: '/index/Agent/agentProfitList',
    method: 'post',
    data
  })
}

// 获取会员盈亏列表
export function getUserReportList(data) {
  return request({
    url: '/index/Agent/memberProfitList',
    method: 'post',
    data
  })
}

// 获取代理列表
export function getAgentList(data) {
  return request({
    url: '/index/Agent/agentList',
    method: 'post',
    data
  })
}

// 获取会员列表
export function getAgentUserList(data) {
  return request({
    url: '/index/Agent/memberList',
    method: 'post',
    data
  })
}

// 下级会员申请成为代理
export function toBeAgent(data) {
  return request({
    url: '/index/Agent/agentApply',
    method: 'post',
    data
  })
}

// 会员自申请为总代
export function agentSelfApply(data) {
  return request({
    url: '/index/Agent/agentSelfApply',
    method: 'post',
    data
  })
}

// 获取代理信息
export function getAgentInfo() {
  return request({
    url: '/index/Agent/agentIndex',
    method: 'post'
  })
}

// 获取返佣比例
export function getRebateDetail() {
  return request({
    url: '/index/Agent/rebateRatio',
    method: 'get'
  })
}

// 获取代理盈亏详情
export function getAgentReportDetail(data) {
  return request({
    url: '/index/Agent/agentProfitDetail',
    method: 'post',
    data
  })
}

// 获取代理盈亏详情
export function getUserReportDetail(data) {
  return request({
    url: '/index/Agent/memberProfitDetail',
    method: 'post',
    data
  })
}
