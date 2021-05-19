export const state = () => ({
  theme: 'light',
  token: null,
  connected: false,
})

export const getters = {
  getState: (state) => state,
  getTheme: (state) => state.theme,
  getToken: (state) => state.token,
  isStarting: (state) => state.starting,
  isConnected: (state) => state.connected,
}

export const actions = {
  tryConnect({ commit, dispatch, state }) {
    if (state.token.expire < Date.now()) {
      // dispatch('auth/refreshToken', state.token.refresh)
    } else {
      dispatch('userprofile/requestUserProfile')
      commit('setConnected')
    }
  },

  setTheme({ commit, state }, theme) {
    if (theme !== 'light' && theme !== 'dark') {
      theme = 'dark'
    }
    if (state.theme !== theme) {
      commit('changeTheme', theme)
    }
  },

  disconnect({ commit }) {
    commit('logOut')
  },

  makeReady({ commit }) {
    commit('setReady')
  },
}

export const mutations = {
  changeTheme(state, theme) {
    state.theme = theme
  },

  updateToken(state, response) {
    state.connected = true
    state.token = {
      expire: Date.now() + parseInt(response.data.expires_in) * 1000,
      access: response.data.access_token,
      refresh: response.data.refresh_token,
    }
  },

  logOut(state) {
    state.token = null
    state.connected = false
  },

  setConnected(state) {
    state.connected = true
  },
}
