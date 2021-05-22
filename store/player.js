import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  status: null,
})

export const getters = {
  getStatus: (state) => state.status,
}

export const actions = {
  async addToQueue({ rootState, dispatch, commit }, uri) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const response = await SpotifyApi.addToQueue(uri)
      commit('setStatus', response.status)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('addToQueue')
      }
      commit('setStatus', err.statusCode)
    }
  },

  async skipTrack({ rootState, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.skipToNext()
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('skipTrack')
      }
    }
  },
}

export const mutations = {
  setStatus(state, status) {
    state.status = status
  },
}
