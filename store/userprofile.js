import SpotifyWebApi from 'spotify-web-api-node'

const state = () => ({
  userData: undefined,
})

const getters = {
  getUserData: (state) => state.userData,
}

const actions = {
  async requestUserProfile({ rootState, commit, dispatch }) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      SpotifyApi.setAccessToken(rootState.token.access)
      const userData = await SpotifyApi.getMe()
      commit('updateUserData', userData)
      commit('setCountry', userData.body.country, { root: true })
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

const mutations = {
  updateUserData(state, userData) {
    state.userData = userData.body
  },
}

export { state, getters, actions, mutations }
