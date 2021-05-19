export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'MusicStats',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/icon.png' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/bootstrap-custom.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  vue: {
    config: {
      silent: true,
    },
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: './plugins/persistedState.js' },
    { src: './plugins/vue-country-flag.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    [
      '@nuxtjs/fontawesome',
      {
        component: 'Fa',
        suffix: true,
        icons: {
          solid: [
            'faSun',
            'faMoon',
            'faCheckSquare',
            'faCompactDisc',
            'faLink',
            'faDirections',
            'faWrench',
            'faHome',
            'faUser',
            'faSignOutAlt',
            'faList',
            'faLock',
            'faChevronUp',
            'faChevronDown',
          ],
          brands: ['faTwitter', 'faInstagram', 'faGithub', 'faSpotify'],
          regular: ['faClock', 'faAngry', 'faFrown', 'faSmileBeam', 'faSmile'],
        },
      },
    ],
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    [
      'bootstrap-vue/nuxt',
      {
        icons: false,
      },
    ],
    [
      'nuxt-i18n',
      {
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'lang',
          onlyOnRoot: true,
        },
        locales: [
          {
            code: 'en',
            file: 'en-US.js',
          },
          {
            code: 'fr',
            file: 'fr-FR.js',
          },
        ],
        langDir: 'lang/',
        strategy: 'no_prefix',
        defaultLocale: 'fr',
        vueI18n: {
          fallbackLocale: 'en',
        },
      },
    ],
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    extend(config, { isClient }) {
      if (isClient) {
        config.optimization.splitChunks.maxSize = 200000
      }
    },
  },

  server: {
    host: '0.0.0.0',
    port: process.env.PORT,
  },
}
