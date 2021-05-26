import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  seed: {
    artists: [],
    tracks: [],
    genres: [],
  },
  track_info: null,
  artists_info: null,
  all_genres: null,
})

export const getters = {
  seed_length: (state) =>
    state.seed.artists.length +
    state.seed.genres.length +
    state.seed.tracks.length,
  seed_artists: (state) => state.seed.artists,
  seed_genres: (state) => state.seed.genres,
  seed_tracks: (state) => state.seed.tracks,
}

export const actions = {
  async getTrackRecommendations({ state, rootState, dispatch, commit }) {
    const SpotifyApi = await new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const options = {
        seed_artists: state.seed.artists,
        seed_genres: state.seed.genres,
        seed_tracks: state.seed.tracks,
      }
      const recommandations = await SpotifyApi.getRecommendations(options)
      console.log(recommandations)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('getTrackRecommendations')
      }
    }
  },

  async getSeedItems({ commit, dispatch, state, rootState }, type) {
    const SpotifyApi = await new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      if (type === 'track') {
        const tracks = await SpotifyApi.getTracks(state.seed.tracks)
        commit('updateTrackInfo', tracks)
      } else {
        const artists = await SpotifyApi.getArtists(state.seed.artists)
        commit('updateArtistsInfo', artists)
      }
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('getTrackRecommendations')
      }
    }
  },

  async getAllGenres({ rootState, commit, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      if (!state.all_genres) {
        SpotifyApi.setAccessToken(rootState.token.access)
        const list = SpotifyApi.getAvailableGenreSeeds()
        commit('updateGenreList', list)
      }
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('getAllGenres')
      }
    }
  },

  addSeedItem({ commit }, type, id) {
    commit('updateSeed', type, id)
  },
}

export const mutations = {
  updateSeed(state, type, id) {
    if (type === 'genre') {
      state.seed.genres += id
    } else if (type === 'artist') {
      state.seed.artists += id
    } else {
      state.seed.tracks += id
    }
  },

  updateTrackInfo(state, tracks) {
    state.tracks = tracks.body
  },

  updateArtistsInfo(state, artists) {
    state.artists = artists.body
  },

  updateGenreList(state, list) {
    state.all_genres = list
  },
}
