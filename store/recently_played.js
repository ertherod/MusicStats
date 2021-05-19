import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  list: [],
  averageFeatures: {},
})

export const getters = {
  getRecentlyPlayed: (state) => state.list,
  getAverageFeatures: (state) => state.averageFeatures,
}

export const actions = {
  async requestRecentlyPlayed({ rootState, commit, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const data = await SpotifyApi.getMyRecentlyPlayedTracks({
        limit: 50,
        after: Date.now() - 24 * 3600 * 1000,
      })
      const idlist = []
      data.body.items.forEach((item) => {
        if (!item.is_local) {
          idlist.push(item.track.id)
        } else {
          data.body.items.splice(data.body.items.indexOf(item), 1)
        }
      })
      const features = await SpotifyApi.getAudioFeaturesForTracks(idlist)
      data.body.items.forEach((item) => {
        data.body.items[data.body.items.indexOf(item)] = {
          ...item,
          audio_features:
            features.body.audio_features[data.body.items.indexOf(item)],
        }
      })

      commit('updateRecentlyPlayedList', data.body.items)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestRecentlyPlayed')
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
    let popularity = 0
    state.list.forEach((item) => {
      Object.keys(average).forEach((key) => {
        average[key] += item.audio_features[key]
      })
      popularity += item.track.popularity
      total += 1
    })
    average.popularity = popularity
    Object.keys(average).forEach((key) => {
      if (key === 'valence' || key === 'energy' || key === 'danceability') {
        average[key] = Math.round((average[key] / total) * 100) / 100
      } else {
        average[key] = Math.round(average[key] / total)
      }
    })
    average.duration = {
      hour: parseInt(average.duration_ms / 3600000),
      min: parseInt((average.duration_ms % 3600000) / 60000),
      sec: parseInt(((average.duration_ms % 3600000) % 60000) / 1000),
    }

    commit('updateAverageFeatures', average)
  },
}

export const mutations = {
  updateRecentlyPlayedList(state, list) {
    state.list = list
  },
  updateAverageFeatures(state, average) {
    state.averageFeatures = average
  },
  setNullAverage(state) {
    state.averageFeatures = null
  },
}
