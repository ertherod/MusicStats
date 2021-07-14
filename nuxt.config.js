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
      { name: 'theme-color', content: '#343a40' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/bootstrap-custom.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~layouts/global.css'],

  vue: {
    config: {
      silent: true,
    },
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: './plugins/persistedState.js', ssr: false }],

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
            'faSync',
            'faStepForward',
            'faPlay',
            'faRecordVinyl',
            'faRandom',
            'faSearch',
            'faExternalLinkSquareAlt',
            'faHeart',
            'faAngleLeft',
            'faAngleDoubleLeft',
            'faAngleDoubleRight',
            'faAngleRight',
            'faChartBar',
            'faPlus',
            'faCheck',
            'faTimes',
            'faExclamationTriangle',
            'faChartLine',
            'faBars',
          ],
          brands: ['faTwitter', 'faInstagram', 'faGithub', 'faSpotify'],
          regular: [
            'faClock',
            'faAngry',
            'faFrown',
            'faSmileBeam',
            'faSmile',
            'faHeart',
            'faDizzy',
          ],
        },
      },
    ],
    '@nuxtjs/dotenv',
    'bootstrap-vue/nuxt',
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
        strategy: 'prefix',
        defaultLocale: 'en',
        vueI18n: {
          fallbackLocale: 'en',
        },
      },
    ],
  ],

  bootstrapVue: {
    icons: false,
    componentPlugins: [
      'Layout',
      'Nav',
      'Navbar',
      'Card',
      'Button',
      'ButtonGroup',
      'FormSelect',
      'Collapse',
      'Progress',
      'Link',
      'Spinner',
      'ListGroup',
      'FormInput',
      'FormCheckbox',
      'InputGroup',
    ],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: false,
    extractCSS: true,
    extend(config, { isClient }) {
      if (isClient) {
        config.optimization.splitChunks.maxSize = 300000
        config.optimization.splitChunks.minSize = 10000
        config.optimization.runtimeChunk = true
      }
    },
    babel: {
      compact: true,
    },
  },

  server: {
    host: '0.0.0.0',
    port: process.env.PORT,
  },
}
