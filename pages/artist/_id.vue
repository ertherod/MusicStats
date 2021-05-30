<template>
  <b-container fluid="lg" class="pt-3 pb-5 mb-5">
    <b-card> </b-card>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ArtistPage',
  computed: {
    ...mapGetters('artists', ['getCurrentArtist']),
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
