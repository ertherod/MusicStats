<template>
  <div class="container-lg page">
    <h2 class="text-center">{{ $t('pages.login.title') }}</h2>
    <br />
    <h4>{{ $t('pages.login.subtitle1') }}</h4>
    <ul>
      <li>{{ $t('pages.login.ul1.li1') }}</li>
      <li>{{ $t('pages.login.ul1.li2') }}</li>
      <li>{{ $t('pages.login.ul1.li3') }}</li>
    </ul>
    <h5>{{ $t('pages.login.subtitle2') }}</h5>
    <br />
    <b-row align-h="center">
      <b-col md="4" sm="8">
        <a
          :href="getUrl"
          class="btn btn-outline-light btn-floating p-2 m-1 login_button"
          ><fa-icon :icon="['fab', 'spotify']" />
          {{ $t('pages.login.spotify_login') }}</a
        >
      </b-col>
    </b-row>
    <br />
    <p class="font-italic">{{ $t('pages.login.leaving_site') }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  computed: {
    ...mapGetters('auth', ['getUrl', 'getPKCE']),
    ...mapGetters(['isConnected']),
  },
  mounted() {
    if (this.isConnected) {
      this.$router.push(this.localePath('/'))
    }
    if (!this.getPKCE || !this.getUrl) {
      this.genPKCE()
    }
  },
  methods: {
    ...mapActions('auth', ['genPKCE']),
  },
}
</script>

<style scoped>
.page {
  padding-top: 2em;
  padding-bottom: 2em;
}

h2 {
  text-decoration: underline;
}

.login_button {
  display: block;
  min-width: 50%;
}

.login_button:hover {
  color: #1db954 !important;
}
</style>
