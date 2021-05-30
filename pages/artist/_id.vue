<template>
  <b-container fluid="lg" class="pt-3 pb-5 mb-5">
    <b-card
      v-if="getCurrentArtist"
      :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
    >
      <b-row>
        <b-col md="4">
          <img
            :src="getCurrentArtist.images[0].url"
            alt="Album image"
            class="playlist-img"
          />
        </b-col>
        <b-col>
          <h1>{{ getCurrentArtist.name }}</h1>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ArtistPage',
  computed: {
    ...mapGetters('artists', ['getCurrentArtist', 'getTopTracks']),
    ...mapGetters(['getTheme']),
  },
  mounted() {
    this.requestFullArtist(this.$route.params.id)
  },
  methods: {
    ...mapActions('artists', ['requestFullArtist']),
  },
}
</script>

<style></style>
