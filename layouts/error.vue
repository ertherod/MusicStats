<template>
  <div class="container-lg text-center pt-5 pb-5">
    <div v-if="error.statusCode === 404">
      <h2>{{ $t('error.404') }}</h2>
      <p>{{ $t('error.nopage') }}</p>
    </div>
    <h1 v-else>An error occurred</h1>
    <nuxt-link
      :to="localePath('/')"
      :class="`btn ${
        getTheme == 'dark' ? 'btn-outline-light' : 'btn-outline-dark'
      } btn-floating p-2 m-1 mx-auto login_button`"
      ><fa-icon :icon="['fas', 'home']" /> {{ $t('error.return_home') }}
    </nuxt-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'default',
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
  computed: {
    ...mapGetters(['getTheme']),
  },
}
</script>
