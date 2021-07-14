<template>
  <b-container fluid="lg" style="word-break: break-all">
    <h6>{{ getToken }}</h6>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MainPage',
  computed: {
    ...mapGetters(['getToken']),
  },
}
</script>

<style>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
