import {
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  getAgentInfo,
  setAgentInfo,
  removeAgentInfo
} from '@/utils/index.js'
const state = {
  token: getToken() || '',
  userInfo: getUserInfo() || {},
  agentInfo: getAgentInfo() || {},
  isPubLoading: false,
  gameUrl: ''
}

const mutations = {
  SET_TOKEN: (state, value) => {
    setToken(value)
  },
  REMOVE_TOKEN: (state, value) => {
    removeToken()
  },
  SET_USER_INFO: (state, value) => {
    state.userInfo = JSON.parse(value)
    setUserInfo(value)
  },
  REMOVE_USER_INFO: (state, value) => {
    removeUserInfo()
  },

  SET_AGENT_INFO: (state, value) => {
    state.agentInfo = value
    setAgentInfo(value)
  },
  REMOVE_AGENT_INFO: (state, value) => {
    state.agentInfo = {}
    removeAgentInfo()
  },
  GET_LOADING: (state, value) => {
    state.isPubLoading = value
  },
  GET_GAME_URL: (state, value) => {
    state.gameUrl = value
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
