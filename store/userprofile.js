import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  userData: undefined,
})

export const getters = {
  getUserData: (state) => state.userData,
}

export const actions = {
  async requestUserProfile({ rootState, commit, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const userData = await SpotifyApi.getMe()
      commit('updateUserData', userData)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('requestUserProfile')
      }
    }
  },
}

export const mutations = {
  updateUserData(state, userData) {
    state.userData = userData.body
  },
}
