import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  genres: null,
})

export const getters = {
  getAllGenres: (state) => state.genres,
}

export const actions = {
  async getTrackRecommendations(
    { rootState, dispatch, commit },
    { tracks, artists, genres, danceability, valence, energy, limit = 25 }
  ) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const options = {
        seed_artists: artists,
        seed_tracks: tracks,
        seed_genres: genres,
        target_danceability: danceability,
        target_valence: valence,
        target_energy: energy,
        limit,
        market: rootState.country,
      }
      // eslint-disable-next-line no-unused-vars
      const recommendations = await SpotifyApi.getRecommendations(options)
      // console.log(recommendations)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('getTrackRecommendations')
      } else {
        throw err
      }
    }
  },

  async requestAllGenres({ commit, dispatch, rootState }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const genres = await SpotifyApi.getAvailableGenreSeeds()
      commit('updateGenreList', genres.body)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestAllGenres')
      } else {
        throw err
      }
    }
  },
}

export const mutations = {
  updateGenreList(state, list) {
    state.genres = list
  },
}
