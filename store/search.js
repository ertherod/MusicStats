import SpotifyWebApi from 'spotify-web-api-node'

export const state = () => ({
  search: null,
  query: null,
})

export const getters = {
  getSearch: (state) => state.search,
  getQuery: (state) => state.query,
}

export const actions = {
  async makeSearch(
    { rootState, commit, dispatch },
    {
      query,
      types = ['artist', 'album', 'playlist', 'track'],
      options = { limit: 5 },
    }
  ) {
    const SpotifyApi = new SpotifyWebApi()
    try {
      options.country = rootState.country
      options.include_external = 'audio'
      SpotifyApi.setAccessToken(rootState.token.access)
      const search = await SpotifyApi.search(query, types, options)
      commit('updateSearch', search.body)
      commit('saveQuery', query)
    } catch (err) {
      if (
        err.statusCode === 401 &&
        err.body.error.message === 'The access token expired'
      ) {
        await dispatch('auth/refreshToken', rootState.token.refresh, {
          root: true,
        })
        dispatch('makeSearch', { query, types, options })
      } else {
        throw err
      }
    }
  },
}

export const mutations = {
  updateSearch(state, search) {
    state.search = search
  },

  saveQuery(state, query) {
    state.query = query
  },
}
