import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  currentArtist: null,
  topTracks: null,
  currentAverageData: null,
})

export const getters = {
  getCurrentArtist: (state) => state.currentArtist,
  getTopTracks: (state) => state.topTracks,
  getAverageData: (state) => state.currentAverageData,
}

export const actions = {
  async requestFullArtist({ rootState, commit, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const artist = await SpotifyApi.getArtist(id)
      commit('updateCurrentArtist', artist.body)
      dispatch('getArtistDiscography', id)
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
      } else {
        throw err
      }
    }
  },

  async getArtistDiscography({ rootState, commit, dispatch }, id) {
    const country = rootState.country
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const finalAlbums = await SpotifyApi.getArtistAlbums(id, {
        album_type: 'album',
        country,
        limit: 20,
      })
      let albums = finalAlbums
      let turn = 0
      while (albums.body.next) {
        albums = await SpotifyApi.getArtistAlbums(id, {
          album_type: 'single',
          country,
          limit: 20,
          offset: turn * 20,
        })
        finalAlbums.body.items.push(...albums.body.items)
        turn++
      }
      const finalSingles = await SpotifyApi.getArtistAlbums(id, {
        album_type: 'single',
        country,
        limit: 20,
      })
      let singles = finalSingles
      turn = 0
      while (singles.body.next) {
        singles = await SpotifyApi.getArtistAlbums(id, {
          album_type: 'single',
          country,
          limit: 20,
          offset: turn * 20,
        })
        finalSingles.body.items.push(...singles.body.items)
        turn++
      }
      commit('updateArtistDiscography', {
        albums: albums.body.items,
        singles: finalSingles.body.items,
      })
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('getArtistDiscography', id)
      } else {
        throw err
      }
    }
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
      await commit('updateTopTracks', topTracks.body.tracks)
      dispatch('averageTopTracks')
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('getArtistTopTracks', id)
      } else {
        throw err
      }
    }
  },

  averageTopTracks({ state, commit }) {
    const average = {
      valence: 0,
      energy: 0,
      tempo: 0,
      duration_ms: 0,
      danceability: 0,
    }
    let popularity = 0
    let total = 0
    state.topTracks.forEach((item) => {
      Object.keys(average).forEach((key) => {
        if (
          item.audio_features &&
          item.audio_features[key] &&
          item.track.popularity
        ) {
          popularity += item.popularity
          average[key] += item.audio_features[key]
        }
      })
      if (item.audio_features && item.track.popularity) {
        total++
      }
    })
    Object.keys(average).forEach((key) => {
      if (key === 'valence' || key === 'energy' || key === 'danceability') {
        average[key] = Math.round((average[key] / total) * 100) / 100
      } else if (!key === 'duration_ms') {
        average[key] = Math.round(average[key] / total)
      }
    })
    average.popularity = popularity / total
    average.duration = {
      hour: parseInt(average.duration_ms / 3600000),
      min: parseInt((average.duration_ms % 3600000) / 60000),
      sec: parseInt(((average.duration_ms % 3600000) % 60000) / 1000),
    }

    commit('updateAverageData', average)
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

  updateAverageData(state, data) {
    state.currentAverageData = data
  },
}
