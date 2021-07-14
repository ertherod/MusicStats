export const state = () => ({
  token: null,
  connected: false,
  country: null,
  ready: false,
})

export const getters = {
  getState: (state) => state,
  getToken: (state) => state.token,
  isReady: (state) => state.ready,
  isConnected: (state) => state.connected,
}

export const actions = {
  async tryConnect({ commit, dispatch, state }) {
    if (state.token && state.token.expire < Date.now()) {
      await dispatch('auth/refreshToken', state.token.refresh)
    } else if (state.token) {
      await dispatch('userprofile/requestUserProfile')
      await commit('setConnected')
    }
    commit('setReady')
  },

  disconnect({ commit }) {
    commit('logOut')
  },
}

export const mutations = {
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

  setCountry(state, country) {
    state.country = country
  },

  setReady(state) {
    state.ready = true
  },
}
