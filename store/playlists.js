import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  playlists_list: null,
  currentPlaylist: null,
  currentAverageData: null,
})

export const getters = {
  getPlaylistList: (state) => state.playlists_list,
  getCurrentPlaylist: (state) => state.currentPlaylist,
  getCurrentAverageData: (state) => state.currentAverageData,
}

export const actions = {
  async requestPlaylistList({ rootState, commit, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      let offset = 0
      const finaldata = await SpotifyApi.getUserPlaylists()
      let data = {
        body: {
          next: finaldata.body.next,
        },
      }
      while (data.body.next) {
        offset += 20
        data = await SpotifyApi.getUserPlaylists({
          offset,
        })
        finaldata.body.items = [...finaldata.body.items, ...data.body.items]
      }

      commit('createPlaylistList', finaldata)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestPlaylistList')
      }
    }
  },

  async requestPlaylistItems({ rootState, commit, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      let offset = 0

      const finaldata = await SpotifyApi.getPlaylist(id, {
        fields:
          'collaborative,description,followers,id,images,name,owner,public,type',
      })
      let data = await SpotifyApi.getPlaylistTracks(id, {
        fields:
          'next,total,items(added_at,added_by,track(artists,album(!available_markets),is_local,duration,explicit,name,popularity,preview_url,id,uri,type))',
      })
      let idlist = []
      data.body.items.forEach((item) => {
        if (item.is_local || !item.track || item.track.type === 'episode') {
          data.body.items.splice(data.body.items.indexOf(item), 1)
        } else {
          idlist.push(item.track.id)
        }
      })

      let features = await SpotifyApi.getAudioFeaturesForTracks(idlist)
      data.body.items.forEach((item) => {
        data.body.items[data.body.items.indexOf(item)] = {
          ...item,
          audio_features:
            features.body.audio_features[data.body.items.indexOf(item)],
        }
      })

      finaldata.body.tracks = data.body
      while (data.body.next) {
        offset += 100
        data = await SpotifyApi.getPlaylistTracks(id, {
          offset,
          fields:
            'next,items(added_at,added_by,track(artists,album(!available_markets),is_local,duration,explicit,name,popularity,preview_url,id,uri,type))',
        })
        idlist = []
        data.body.items.forEach((item) => {
          if (!item.is_local || item.track.type === 'episode') {
            idlist.push(item.track.id)
          } else {
            data.body.items.splice(data.body.items.indexOf(item), 1)
          }
        })
        features = await SpotifyApi.getAudioFeaturesForTracks(idlist)
        data.body.items.forEach((item) => {
          data.body.items[data.body.items.indexOf(item)] = {
            ...item,
            audio_features:
              features.body.audio_features[data.body.items.indexOf(item)],
          }
        })
        finaldata.body.tracks.items = [
          ...finaldata.body.tracks.items,
          ...data.body.items,
        ]
      }
      commit('addPlaylistContent', finaldata.body)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestPlaylistItems', id)
      }
    }
  },

  computeAverageAudioFeatures({ commit, state }) {
    const average = {
      valence: 0,
      energy: 0,
      tempo: 0,
      duration_ms: 0,
      danceability: 0,
    }
    let total = 0
    let popularity = 0
    state.currentPlaylist.tracks.items.forEach((item) => {
      if (item.audio_features) {
        Object.keys(average).forEach((key) => {
          average[key] += item.audio_features[key]
        })
        popularity += item.track.popularity
        total += 1
      }
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

    commit('updateAverageData', average)
  },
}

export const mutations = {
  createPlaylistList(state, data) {
    state.playlists_list = data.body
  },

  addPlaylistContent(state, data) {
    state.currentPlaylist = data
  },

  updateAverageData(state, data) {
    state.currentAverageData = data
  },
}
