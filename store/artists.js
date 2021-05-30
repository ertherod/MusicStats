import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  currentArtist: null,
  topTracks: null,
})

export const getters = {
  getCurrentArtist: (state) => state.currentArtist,
  getTopTracks: (state) => state.topTracks,
}

export const actions = {
  async requestFullArtist({ rootState, commit, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const artist = await SpotifyApi.getArtist(id)
      // const topTracks = await SpotifyApi.getArtistTopTracks(id, country)
      commit('updateCurrentArtist', artist.body)
      dispatch('getArtistDiscography', { id, limit: 5 })
      dispatch('getArtistTopTracks', id)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestArtist', id)
      }
    }
  },

  async getArtistDiscography(
    { rootState, commit, dispatch },
    { id, limit = null }
  ) {
    const country = rootState.country
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const albums = await SpotifyApi.getArtistAlbums(id, {
        album_type: 'album',
        country,
        limit,
      })
      const singles = await SpotifyApi.getArtistAlbums(id, {
        album_type: 'single',
        country,
        limit,
      })
      commit('updateArtistDiscography', {
        albums: albums.body,
        singles: singles.body,
      })
    } catch (err) {}
  },

  async getArtistTopTracks({ rootState, commit, dispatch }, id) {
    const country = rootState.country
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const topTracks = await SpotifyApi.getArtistTopTracks(id, country)
      const idList = []
      topTracks.body.tracks.forEach((track) => {
        idList.push(track.id)
      })
      const features = await SpotifyApi.getAudioFeaturesForTracks(idList)
      topTracks.body.tracks.forEach((track, index) => {
        topTracks.body.tracks[index] = {
          track,
          audio_features: features.body.audio_features[index],
        }
      })
      commit('updateTopTracks', topTracks.body)
    } catch (err) {}
  },
}

export const mutations = {
  updateCurrentArtist(state, artist) {
    state.currentArtist = artist
  },

  updateArtistDiscography(state, { albums, singles }) {
    state.currentArtist = {
      ...state.currentArtist,
      albums,
      singles,
    }
  },

  updateTopTracks(state, topTracks) {
    state.topTracks = topTracks
  },
}
