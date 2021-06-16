<template>
  <b-container fluid="lg" class="pt-3 pb-5 mb-5">
    <div v-if="getTrack && getTrack.id === $route.params.id">
      <b-card :bg-variant="getTheme === 'dark' ? 'dark' : 'white'">
        <template #header>
          <b-row align-h="center">
            <span class="h2">{{ getTrack.name }}</span>
          </b-row>
        </template>
        <b-row>
          <b-col md="4">
            <img
              v-if="getTrack.album.images && getTrack.album.images[0]"
              :src="getTrack.album.images[0].url"
              class="cover-art"
            />
          </b-col>
          <b-col md="8">
            <h6>
              {{ $t('pages.myplaylists.by') }}
              <span
                v-for="(artist, index) in getTrack.artists"
                :key="artist.id"
              >
                <b-link
                  v-if="index == getTrack.artists.length - 1"
                  :to="localePath(`/artist/${artist.id}`)"
                  ><b>{{ artist.name }}</b></b-link
                >
                <span v-else-if="index == getTrack.artists.length - 2">
                  <b-link :to="localePath(`/artist/${artist.id}`)"
                    ><b>{{ artist.name }}</b></b-link
                  >
                  &
                </span>
                <span v-else>
                  <b-link :to="localePath(`/artist/${artist.id}`)"
                    ><b>{{ artist.name }}</b></b-link
                  >,
                </span>
              </span>
            </h6>
            <h6>
              <span
                v-if="
                  getTrack.album.album_type === 'single' &&
                  getTrack.album.total_tracks === 1
                "
                >{{ $t('pages.myplaylists.in_single') }}</span
              >
              <span v-else-if="getTrack.album.album_type === 'single'">{{
                $t('pages.myplaylists.in_ep')
              }}</span>
              <span v-else>{{ $t('pages.myplaylists.in_album') }}</span>
              <b
                ><b-link :to="localePath(`/album/${getTrack.album.id}`)">{{
                  getTrack.album.name
                }}</b-link></b
              >
            </h6>
            <br />
            <h6 v-if="getTrack.audio_features">
              {{
                $t(
                  `analysis.${getAnalysis(
                    getTrack.audio_features.valence,
                    getTrack.audio_features.energy
                  )}`
                )
              }}
            </h6>
            <br />
            <ProgressAnalysis
              :analysis="{
                ...getTrack.audio_features,
                popularity: getTrack.popularity,
              }"
            />
          </b-col>
        </b-row>
      </b-card>
    </div>
    <div v-else class="text-center">
      <Loading />
    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Loading from '~/components/Loading.vue'
import { getAnalysis } from '~/utils'

export default {
  name: 'TrackPage',
  components: {
    Loading,
  },
  computed: {
    ...mapGetters(['getTheme']),
    ...mapGetters('tracks', ['getTrack']),
  },
  mounted() {
    this.requestTrack(this.$route.params.id)
  },
  methods: {
    ...mapActions('tracks', ['requestTrack']),
    getAnalysis,
  },
}
</script>

<style>
.cover-art {
  width: 100%;
}
</style>
