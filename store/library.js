import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  status: null,
})

export const getters = {
  getStatus: (state) => state.status,
}

export const actions = {
  async saveAlbum({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.addToMySavedAlbums([id])
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('saveAlbum', id)
      } else {
        throw err
      }
    }
  },
  async removeAlbum({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.removeFromMySavedAlbums([id])
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('removeAlbum', id)
      } else {
        throw err
      }
    }
  },
  async checkAlbum({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const data = await SpotifyApi.containsMySavedAlbums([id])
      return data.body[0]
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('checkAlbum', id)
      } else {
        throw err
      }
    }
  },
  async savePlaylist({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.followPlaylist(id, { public: false })
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('savePlaylist', id)
      } else {
        throw err
      }
    }
  },
  async removePlaylist({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.unfollowPlaylist(id)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('removePlaylist', id)
      } else {
        throw err
      }
    }
  },
  async checkPlaylist(
    { rootState, dispatch },
    { ownerId, playlistId, userId }
  ) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const data = await SpotifyApi.areFollowingPlaylist(ownerId, playlistId, [
        userId,
      ])
      return data.body[0]
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('checkPlaylist', { ownerId, playlistId, userId })
      } else {
        throw err
      }
    }
  },
  async saveTrack({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.addToMySavedTracks([id])
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('saveTrack', id)
      } else {
        throw err
      }
    }
  },
  async removeTrack({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.removeFromMySavedTracks([id])
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('removeTrack', id)
      } else {
        throw err
      }
    }
  },
  async checkTrack({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const data = await SpotifyApi.containsMySavedTracks([id])
      return data.body[0]
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('checkTrack', id)
      } else {
        throw err
      }
    }
  },
  async followArtist({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.followArtists([id])
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('saveTrack', id)
      } else {
        throw err
      }
    }
  },
  async unfollowArtist({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      await SpotifyApi.unfollowArtists([id])
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('removeTrack', id)
      } else {
        throw err
      }
    }
  },
  async checkArtistFollow({ rootState, dispatch }, id) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const data = await SpotifyApi.isFollowingArtists([id])
      return data.body[0]
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('checkTrack', id)
      } else {
        throw err
      }
    }
  },
}

export const mutations = {}
