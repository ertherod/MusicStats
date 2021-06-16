import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  currentTrack: null,
})

export const getters = {
  getTrack: (state) => state.currentTrack,
}

export const actions = {
  async requestTrack({ rootState, commit, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    const market = rootState.country
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      let track = await SpotifyApi.getTrack(id, { market })
      const audioFeatures = await SpotifyApi.getAudioFeaturesForTrack(id)
      track = {
        ...track.body,
        audio_features: audioFeatures.body,
      }
      commit('updateTrack', track)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestTrack', id)
      }
    }
  },
}

export const mutations = {
  updateTrack(state, track) {
    state.currentTrack = track
  },
}
