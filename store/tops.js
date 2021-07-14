import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  topArtists: null,
  topTracks: null,
})

export const getters = {
  getTopArtists: (state) => state.topArtists,
  getTopTracks: (state) => state.topTracks,
}

export const actions = {
  async requestTopArtists({ rootState, commit, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const short = await SpotifyApi.getMyTopArtists({
        time_range: 'short_term',
        limit: 25,
      })
      const medium = await SpotifyApi.getMyTopArtists({
        time_range: 'medium_term',
        limit: 25,
      })
      const long = await SpotifyApi.getMyTopArtists({
        time_range: 'long_term',
        limit: 25,
      })
      const payload = {
        short: short.body,
        medium: medium.body,
        long: long.body,
      }
      commit('updateTopArtists', payload)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestTopArtists')
      } else {
        throw err
      }
    }
  },
  async requestTopTracks({ rootState, commit, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const short = await SpotifyApi.getMyTopTracks({
        time_range: 'short_term',
        limit: 50,
      })
      let idList = []
      short.body.items.forEach((item) => {
        idList.push(item.uri)
      })
      short.body = {
        ...short.body,
        idList,
      }
      const medium = await SpotifyApi.getMyTopTracks({
        time_range: 'medium_term',
        limit: 50,
      })
      idList = []
      medium.body.items.forEach((item) => {
        idList.push(item.uri)
      })
      medium.body = {
        ...medium.body,
        idList,
      }
      const long = await SpotifyApi.getMyTopTracks({
        time_range: 'long_term',
        limit: 50,
      })
      idList = []
      long.body.items.forEach((item) => {
        idList.push(item.uri)
      })
      long.body = {
        ...long.body,
        idList,
      }
      const payload = {
        short: short.body,
        medium: medium.body,
        long: long.body,
      }
      commit('updateTopTracks', payload)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestTopTracks')
      } else {
        throw err
      }
    }
  },
}

export const mutations = {
  updateTopArtists(state, payload) {
    state.topArtists = payload
  },
  updateTopTracks(state, payload) {
    state.topTracks = payload
  },
}
