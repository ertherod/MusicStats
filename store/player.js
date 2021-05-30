import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  status: null,
  track: null,
})

export const getters = {
  getStatus: (state) => state.status,
  getTrack: (state) => state.track,
}

export const actions = {
  async addToQueue({ rootState, dispatch, commit }, uri) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const response = await SpotifyApi.addToQueue(uri)
      commit('setStatus', response.statusCode)
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

  async skipTrack({ rootState, dispatch, commit }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const response = await SpotifyApi.skipToNext()
      commit('setStatus', response.statusCode)
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

  async requestTrack({ rootState, dispatch, commit }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const track = await SpotifyApi.getMyCurrentPlayingTrack()
      if (track.statusCode === 204) {
        commit('updateCurrentTrack', 204)
      } else {
        commit('updateCurrentTrack', track.body)
      }
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

  async requestState({ rootState, dispatch, commit }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const track = await SpotifyApi.getMyCurrentPlaybackState()
      commit('updateCurrentTrack', track.body)
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

  async playTrack({ rootState, dispatch }, uri) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.play({ uris: [uri] })
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('playTrack', uri)
      }
    }
  },

  async playContext({ rootState, dispatch }, { uri, shuffle }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await dispatch('setShuffle', !!shuffle)
      await SpotifyApi.play({ context_uri: uri })
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('playContext', uri, shuffle)
      }
    }
  },

  async setShuffle({ rootState, commit, dispatch }, shuffle = false) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.setShuffle(shuffle)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('setShuffle', shuffle)
      }
    }
  },
}

export const mutations = {
  setStatus(state, status) {
    state.status = status
  },

  updateCurrentTrack(state, track) {
    state.track = track
  },
}
