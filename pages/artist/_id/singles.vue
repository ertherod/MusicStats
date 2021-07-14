<template>
  <b-container fluid="lg">
    <div v-if="getCurrentArtist && getCurrentArtist.singles" class="my-3">
      <h2 class="my-3 text-center">
        <u>
          Singles {{ $t('pages.myplaylists.by') }}
          <b-link :to="localePath(`/artist/${getCurrentArtist.id}`)">{{
            getCurrentArtist.name
          }}</b-link>
        </u>
      </h2>
      <ListButtonFilter
        type="album_list"
        :filters="{ list: [6, 12], filter: 12 }"
        :objectlist="getCurrentArtist.singles"
        :texts="{ resultperpage: 'pages.recent.resultperpage' }"
      />
      <br /><br />
      <p class="text-center">{{ $t('pages.artist.warning') }}</p>
    </div>
    <div v-else><Loading /></div>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Loading from '~/components/Loading.vue'

export default {
  name: 'Singles',
  components: { Loading },
  middleware: 'auth',
  computed: {
    ...mapGetters('artists', ['getCurrentArtist']),
  },
  mounted() {
    if (!this.getCurrentArtist || !this.getCurrentArtist.singles) {
      this.requestFullArtist(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions('artists', ['requestFullArtist']),
  },
}
</script>
