import crypto from 'crypto'
import querystring from 'querystring'
import pkceChallenge from 'pkce-challenge'
import axios from 'axios'

export const state = () => ({
  pkce: undefined,
  secret: undefined,
  url: undefined,
})

export const getters = {
  getPKCE: (state) => state.pkce,
  getSecret: (state) => state.secret,
  getUrl: (state) => state.url,
}

export const actions = {
  async genPKCE({ commit }) {
    const pkce = await pkceChallenge(50)
    const secret = await crypto.randomBytes(15).toString('hex')
    commit('pkceUpdate', { pkce, secret })
  },

  async requestToken({ commit, state, dispatch }, reqCode) {
    const reqData = {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      code: reqCode,
      redirect_uri: `http://${process.env.REDIRECT_URI}/auth`,
      code_verifier: state.pkce.code_verifier,
    }
    const config = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify(reqData),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    try {
      const response = await axios.request(config)
      commit('updateToken', response, { root: true })
      commit('clearPKCE')
      dispatch('userprofile/requestUserProfile', null, { root: true })
      return true
    } catch (err) {
      return err
    }
  },

  async refreshToken({ commit, dispatch }, refreshToken) {
    const reqData = {
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID,
      refresh_token: refreshToken,
    }
    const config = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify(reqData),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    try {
      const response = await axios.request(config)
      commit('updateToken', response, { root: true })
      dispatch('userprofile/requestUserProfile', null, { root: true })
      return true
    } catch (err) {
      return err
    }
  },
}

export const mutations = {
  pkceUpdate(state, { pkce, secret }) {
    state.pkce = pkce
    state.secret = secret
    state.url = `https://accounts.spotify.com/authorize?response_type=code&code_challenge_method=S256&redirect_uri=http://${process.env.REDIRECT_URI}/auth&client_id=${process.env.CLIENT_ID}&scope=user-read-private user-read-recently-played user-read-currently-playing user-top-read user-read-playback-position playlist-modify-private user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative&code_challenge=${pkce.code_challenge}&state=${secret}`
  },
  clearPKCE(state) {
    state.pkce = undefined
    state.secret = undefined
  },
}
