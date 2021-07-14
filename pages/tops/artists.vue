<template>
  <b-container fluid="lg">
    <div v-if="getTopArtists">
      <h3 class="text-center my-3">
        <u>{{ $t('pages.top_artists.title') }}</u>
      </h3>

      <h6>
        {{ $t('pages.top_artists.period') }} :
        <b-form-select v-model="period" class="col-md-3 col-8">
          <b-form-select-option value="short">{{
            $t('pages.top_artists.short')
          }}</b-form-select-option>
          <b-form-select-option value="medium">{{
            $t('pages.top_artists.medium')
          }}</b-form-select-option>
          <b-form-select-option value="long">{{
            $t('pages.top_artists.long')
          }}</b-form-select-option>
        </b-form-select>
      </h6>
      <div v-if="getTopArtists">
        <b-row>
          <b-col
            v-for="(artist, index) in topArtists"
            :key="artist.id"
            :sm="index === 0 ? 12 : 6"
            :md="index === 0 ? 12 : 4"
          >
            <b-card bg-variant="dark" class="my-3">
              <template #header
                ><h4 class="text-center">
                  <b-link :to="localePath(`/artist/${artist.id}`)">
                    #{{ index + 1 }} {{ artist.name }}</b-link
                  >
                </h4></template
              >
              <b-row align-h="center"
                ><b-link :to="localePath(`/artist/${artist.id}`)">
                  <img
                    v-if="artist.images && artist.images[0]"
                    :src="artist.images[0].url"
                    class="top-artist" /></b-link
              ></b-row> </b-card
          ></b-col>
        </b-row>
      </div>
    </div>
    <div v-else><Loading /></div>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '~/components/Loading.vue'

export default {
  name: 'TopArtists',
  components: { Loading },
  middleware: 'auth',
  data: () => ({
    period: 'medium',
  }),
  computed: {
    ...mapGetters('tops', ['getTopArtists']),
    topArtists() {
      if (this.period === 'short') {
        return this.getTopArtists.short.items
      } else if (this.period === 'medium') {
        return this.getTopArtists.medium.items
      } else {
        return this.getTopArtists.long.items
      }
    },
  },
  mounted() {
    this.requestTopArtists()
  },
  methods: {
    ...mapActions('tops', ['requestTopArtists']),
  },
}
</script>

<style scoped>
.top-artist {
  height: 20vh;
  width: 20vh;
  object-fit: cover;
}

.card-header {
  min-height: 10vh;
}
</style>
