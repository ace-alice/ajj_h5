const getters = {
  cachedViews: (state) => state.cachedView.cachedViews,
  getToken: (state) => state.user.token,
  getUserInfo: (state) => state.user.userInfo,
  agentInfo: (state) => state.user.agentInfo,
  getIsPubLoading: (state) => state.user.isPubLoading,
  getGameUrl: (state) => state.user.gameUrl,
  splashShow: (state) => state.cachedView.splashShow
}

export default getters
