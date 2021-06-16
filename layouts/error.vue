<template>
  <div class="container-lg text-center pt-5 pb-5">
    <div v-if="error.statusCode === 404">
      <h2>{{ $t('error.404') }}</h2>
      <p>{{ $t('error.nopage') }}</p>
    </div>
    <h1 v-else>An error occurred</h1>
    <b-button-group>
      <b-button
        :to="localePath('/')"
        :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
        ><fa-icon :icon="['fas', 'home']" /> {{ $t('error.return_home') }}
      </b-button>
      <b-button
        :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
        @click="reloadPage"
        >Reload page</b-button
      >
    </b-button-group>
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
  methods: {
    reloadPage() {
      window.location.reload()
    },
  },
}
</script>
