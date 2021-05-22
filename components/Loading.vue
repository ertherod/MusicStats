<template>
  <div>
    <b-spinner
      class="spinner"
      :variant="getTheme == 'dark' ? 'light' : 'primary'"
    />
    <h2>{{ $t('pages.myplaylists.getting') }}</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Loading',
  computed: {
    ...mapGetters(['getTheme']),
  },
}
</script>

<style>
.spinner {
  height: 8vh;
  width: 8vh;
}
</style>
