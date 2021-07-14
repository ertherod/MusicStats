<template>
  <b-container fluid="lg">
    <div v-if="getTopTracks">
      <h3 class="text-center my-3">
        <u>{{ $t('pages.top_tracks.title') }}</u>
      </h3>
      <b-row align-h="center" class="m-3">
        <b-button-group>
          <b-button
            v-if="getUserData && getUserData.product === 'premium'"
            variant="outline-light"
            @click="playTrack(topTracks.idList)"
            ><fa-icon :icon="['fas', 'play']" />
            {{ $t('pages.top_tracks.listen') }}</b-button
          >
          <b-button
            variant="outline-light"
            @click="
              createAndAddPlaylist({
                name: playlistName,
                status: false,
                description: $t(`playlistCreation.top_${period}`),
                uris: topTracks.idList,
              })
            "
            ><fa-icon :icon="['fas', 'list']" />
            {{ $t('pages.top_tracks.create_playlist') }}</b-button
          >
        </b-button-group>
      </b-row>

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
      <b-row>
        <b-col
          v-for="(track, index) in topTracks.items"
          :key="track.id"
          :sm="6"
          :md="index === 0 ? 8 : 4"
          class="my-3"
        >
          <b-card bg-variant="dark">
            <template #header
              ><h5 class="text-center">
                <b-link :to="localePath(`/track/${track.id}`)">
                  #{{ index + 1 }} {{ track.name }}</b-link
                >
              </h5></template
            >
            <b-row>
              <b-col cols="4">
                <b-link
                  :to="localePath(`/album/${track.album.id}`)"
                  :title="track.album.name"
                >
                  <img
                    v-if="track.album.images && track.album.images[0]"
                    :src="track.album.images[0].url"
                    width="100%"
                    class="top-artist" /></b-link
              ></b-col>
              <b-col cols="8"
                >{{ $t('pages.myplaylists.by') }}
                <span
                  v-for="(artist, artist_index) in track.artists"
                  :key="artist.id"
                >
                  <b-link
                    v-if="artist_index == track.artists.length - 1"
                    :to="localePath(`/artist/${artist.id}`)"
                    ><b>{{ artist.name }}</b></b-link
                  >
                  <span v-else-if="artist_index == track.artists.length - 2">
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
              </b-col>
            </b-row>
            <template #footer>
              <b-row align-h="center" class="mx-1">
                <b-button-group class="mt-2">
                  <b-button
                    v-if="getUserData && getUserData.product === 'premium'"
                    variant="outline-light"
                    @click="playTrack(track.uri)"
                  >
                    <fa-icon :icon="['fas', 'play']" />
                    {{ $t('songlist.listen') }}
                  </b-button>

                  <b-button
                    v-if="getUserData && getUserData.product === 'premium'"
                    variant="outline-light"
                    @click="addToQueue(track.uri)"
                  >
                    <fa-icon :icon="['fas', 'step-forward']" />
                    {{ $t('songlist.nextQueue') }}
                  </b-button>
                </b-button-group>
                <h6 v-if="getStatus === 404">
                  {{ $t('songlist.noplayer') }}
                </h6>
              </b-row>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <Loading v-else />
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Loading from '~/components/Loading.vue'

export default {
  name: 'TopTracks',
  components: { Loading },
  middleware: 'auth',
  data: () => ({
    period: 'medium',
  }),
  computed: {
    ...mapGetters('tops', ['getTopTracks']),
    ...mapGetters('userprofile', ['getUserData']),
    ...mapGetters('player', ['getStatus']),
    topTracks() {
      if (this.period === 'short') {
        return this.getTopTracks.short
      } else if (this.period === 'medium') {
        return this.getTopTracks.medium
      } else {
        return this.getTopTracks.long
      }
    },
    playlistName() {
      const date = new Date()
      return `Top 50 ${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`
    },
  },
  mounted() {
    this.requestTopTracks()
  },
  methods: {
    ...mapActions('tops', ['requestTopTracks']),
    ...mapActions('player', ['addToQueue', 'skipTrack', 'playTrack']),
    ...mapActions('playlists', ['createAndAddPlaylist']),
  },
}
</script>

<style scoped>
.card-header {
  min-height: 8vh;
}
.card {
  height: 100%;
}
</style>
