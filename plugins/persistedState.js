import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

export default ({ store, req }) => {
  createPersistedState({
    paths: ['auth.pkce', 'auth.secret', 'token', 'country'],
    storage: {
      getItem: (key) => Cookies.get(key),
      setItem: (key, value) =>
        Cookies.set(key, value, { expires: 365, secure: false }),
      removeItem: (key) => Cookies.remove(key),
    },
  })(store)
}
