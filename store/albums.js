import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  currentAlbum: [],
  averageFeatures: {},
})

export const getters = {
  getAlbum: (state) => state.currentAlbum,
  getAverageFeatures: (state) => state.averageFeatures,
}

export const actions = {
  async requestAlbum({ rootState, commit, dispatch }, id) {
    const market = rootState.country
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      let offset = 0
      const finaldata = await SpotifyApi.getAlbum(id, {
        market,
      })

      let data = await SpotifyApi.getAlbumTracks(id, {
        limit: 50,
        market,
      })
      const idlist = []
      data.body.items.forEach((item) => {
        idlist.push(item.id)
      })

      let features = await SpotifyApi.getAudioFeaturesForTracks(idlist)
      data.body.items.forEach((item) => {
        data.body.items[data.body.items.indexOf(item)] = {
          track: {
            ...item,
            album: {
              images: finaldata.body.images,
              release_date: finaldata.body.release_date,
            },
          },
          audio_features:
            features.body.audio_features[data.body.items.indexOf(item)],
        }
      })

      finaldata.body.tracks = data.body
      while (data.body.next) {
        offset += 50
        data = await SpotifyApi.getAlbumTracks(id, {
          offset,
          limit: 50,
          market,
        })
        const idlist = []
        data.body.items.forEach((item) => {
          idlist.push(item.id)
        })
        features = await SpotifyApi.getAudioFeaturesForTracks(idlist)
        data.body.items.forEach((item) => {
          data.body.items[data.body.items.indexOf(item)] = {
            track: {
              ...item,
              album: {
                images: finaldata.body.images,
                release_date: finaldata.body.release_date,
              },
            },
            audio_features:
              features.body.audio_features[data.body.items.indexOf(item)],
          }
        })
        finaldata.body.tracks.items = [
          ...finaldata.body.tracks.items,
          ...data.body.items,
        ]
      }
      commit('addAlbumContent', finaldata.body)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestAlbum', id)
      } else {
        throw err
      }
    }
  },

  requestAverageFeatures({ state, commit }) {
    commit('setNullAverage')
    const average = {
      valence: 0,
      energy: 0,
      tempo: 0,
      duration_ms: 0,
      danceability: 0,
    }
    let total = 0
    state.currentAlbum.tracks.items.forEach((item) => {
      Object.keys(average).forEach((key) => {
        if (item.audio_features && item.audio_features[key]) {
          average[key] += item.audio_features[key]
        }
      })
      if (item.audio_features) {
        total += 1
      }
    })
    Object.keys(average).forEach((key) => {
      if (key === 'valence' || key === 'energy' || key === 'danceability') {
        average[key] = Math.round((average[key] / total) * 100) / 100
      } else if (!key === 'duration_ms') {
        average[key] = Math.round(average[key] / total)
      }
    })
    average.popularity = state.currentAlbum.popularity
    average.duration = {
      hour: parseInt(average.duration_ms / 3600000),
      min: parseInt((average.duration_ms % 3600000) / 60000),
      sec: parseInt(((average.duration_ms % 3600000) % 60000) / 1000),
    }

    commit('updateAverageFeatures', average)
  },
}

export const mutations = {
  addAlbumContent(state, data) {
    state.currentAlbum = data
  },
  updateAverageFeatures(state, average) {
    state.averageFeatures = average
  },
  setNullAverage(state) {
    state.averageFeatures = null
  },
}
