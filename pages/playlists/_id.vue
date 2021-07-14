<template>
  <div class="container-lg pt-3 pb-5 dark-theme">
    <div
      v-if="
        getCurrentPlaylist &&
        getCurrentPlaylist.id == $route.params.id &&
        getCurrentAverageData
      "
    >
      <b-card bg-variant="dark" class="track">
        <template #header>
          <b-row align-h="center" class="m-2">
            <span class="h3 text-center">
              <fa-icon :icon="['fas', 'list']" />
              {{ getCurrentPlaylist.name }}</span
            >
          </b-row>
        </template>
        <b-row>
          <div class="col-md-4 mb-3">
            <img
              :src="getCurrentPlaylist.images[0].url"
              alt="Playlist image"
              class="playlist-img"
            />
            <h6
              v-if="getCurrentPlaylist.followers.total"
              class="mt-3 text-center"
            >
              {{ getCurrentPlaylist.followers.total }}
              {{ $t('pages.myplaylists.followers') }}
            </h6>
          </div>
          <div class="col-md-8 px-5 mb-3">
            <h4>
              {{ $t('pages.myplaylists.by') }}
              {{ getCurrentPlaylist.owner.display_name }}
            </h4>
            <h6 v-if="getCurrentPlaylist.description !== ''">
              {{ getCurrentPlaylist.description }}
            </h6>
            <br />
            <ul>
              <li v-if="getCurrentPlaylist.tracks.total > 0">
                {{ getCurrentPlaylist.tracks.total }}
                {{ $t('pages.myplaylists.tracks') }}
              </li>
              <li v-if="getCurrentPlaylist.collaborative">
                {{ $t('pages.myplaylists.collaborative') }}
              </li>
              <li v-else-if="getCurrentPlaylist.public">
                {{ $t('pages.myplaylists.public') }}
              </li>
              <li v-else>
                {{ $t('pages.myplaylists.private') }}
              </li>
              <li v-if="getCurrentAverageData">
                {{ $t('pages.myplaylists.average_duration')
                }}{{
                  `${
                    getCurrentAverageData.duration.hour
                      ? `${getCurrentAverageData.duration.hour}h`
                      : ''
                  } ${
                    getCurrentAverageData.duration.min
                      ? `${getCurrentAverageData.duration.min}min`
                      : ''
                  } ${getCurrentAverageData.duration.sec}sec`
                }}
              </li>
            </ul>
            <div v-if="getCurrentAverageData">
              <b
                ><u>
                  {{ $t('pages.myplaylists.analysis_playlist') }}
                  {{
                    $t(
                      `analysis.${requestAnalysis(
                        getCurrentAverageData.valence,
                        getCurrentAverageData.energy
                      )}`
                    )
                  }}</u
                ></b
              >
              <br /><br />
              <h6>{{ $t('pages.myplaylists.average_valence') }}</h6>
              <b-progress :max="1" variant="warning" class="my-2">
                <b-progress-bar
                  :value="getCurrentAverageData.valence"
                  :label="`${(getCurrentAverageData.valence * 100).toFixed(
                    0
                  )}%`"
                ></b-progress-bar>
              </b-progress>
              <h6>{{ $t('pages.myplaylists.average_energy') }}</h6>
              <b-progress :max="1" variant="danger" class="my-2">
                <b-progress-bar
                  :value="getCurrentAverageData.energy"
                  :label="`${(getCurrentAverageData.energy * 100).toFixed(0)}%`"
                ></b-progress-bar>
              </b-progress>
              <h6>{{ $t('pages.myplaylists.danceability') }}</h6>
              <b-progress :max="1" variant="primary" class="my-2">
                <b-progress-bar
                  :value="getCurrentAverageData.danceability"
                  :label="`${(getCurrentAverageData.danceability * 100).toFixed(
                    0
                  )}%`"
                ></b-progress-bar>
              </b-progress>
              <h6>{{ $t('pages.myplaylists.average_popularity') }}</h6>
              <b-progress :max="100" variant="success" class="my-2">
                <b-progress-bar
                  :value="getCurrentAverageData.popularity"
                  :label="`${getCurrentAverageData.popularity}%`"
                ></b-progress-bar>
              </b-progress>
            </div>
          </div>
        </b-row>
        <template
          v-if="getUserData && getUserData.product === 'premium'"
          #footer
        >
          <b-row align-h="center">
            <b-button-group class="mt-2">
              <b-button
                variant="outline-light"
                @click="
                  playContext({ uri: getCurrentPlaylist.uri, shuffle: false })
                "
              >
                <fa-icon :icon="['fas', 'play']" />
                {{ $t('songlist.listen') }}
              </b-button>
              <b-button
                variant="outline-light"
                @click="
                  playContext({ uri: getCurrentPlaylist.uri, shuffle: true })
                "
              >
                <fa-icon :icon="['fas', 'random']" />
                {{ $t('songlist.listenshuffle') }}
              </b-button>
              <b-button
                v-if="
                  getUserData && getUserData.id !== getCurrentPlaylist.owner.id
                "
                variant="outline-light"
                @click="updateSaved"
              >
                <div v-if="saved">
                  <fa-icon :icon="['fas', 'heart']" /> {{ $t('library.saved') }}
                </div>
                <div v-else>
                  <fa-icon :icon="['far', 'heart']" /> {{ $t('library.save') }}
                </div>
              </b-button>
            </b-button-group>
          </b-row>
        </template>
      </b-card>

      <br />

      <ListButtonFilter
        type="playlist_tracks"
        :filters="{ list: [5, 10, 15, 20, 25], filter: 10 }"
        :objectlist="getCurrentPlaylist.tracks.items"
        :texts="{ resultperpage: 'pages.recent.resultperpage' }"
      />
    </div>
    <div v-else class="text-center pt-2">
      <Loading />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ListButtonFilter from '~/components/ListButtonFilter.vue'

import { getAnalysis } from '~/utils'

export default {
  name: 'PlaylistPage',
  components: { ListButtonFilter },
  middleware: 'auth',
  data: () => ({
    saved: null,
  }),
  computed: {
    ...mapGetters('playlists', ['getCurrentPlaylist', 'getCurrentAverageData']),
    ...mapGetters('userprofile', ['getUserData']),
  },
  watch: {
    getCurrentPlaylist() {
      this.computeAverageAudioFeatures()
    },
  },
  async mounted() {
    await this.requestPlaylistItems(this.$route.params.id)
    if (
      this.getUserData &&
      this.getCurrentPlaylist &&
      this.getUserData.id !== this.getCurrentPlaylist.owner.id
    ) {
      this.saved = await this.checkPlaylist({
        ownerId: this.getCurrentPlaylist.owner.id,
        playlistId: this.$route.params.id,
        userId: this.getUserData.id,
      })
    }
  },
  methods: {
    ...mapActions('playlists', [
      'requestPlaylistItems',
      'computeAverageAudioFeatures',
    ]),
    ...mapActions('library', [
      'savePlaylist',
      'checkPlaylist',
      'removePlaylist',
    ]),
    ...mapActions('player', ['playContext']),
    requestAnalysis: getAnalysis,
    async updateSaved() {
      const isSaved = await this.checkPlaylist({
        ownerId: this.getCurrentPlaylist.owner.id,
        playlistId: this.$route.params.id,
        userId: this.getUserData.id,
      })
      if (!isSaved) {
        await this.savePlaylist(this.$route.params.id)
      } else {
        await this.removePlaylist(this.$route.params.id)
      }
      this.saved = !isSaved
    },
  },
}
</script>

<style scoped>
.playlist-img {
  width: 100%;
}

.track {
  overflow: hidden;
}
</style>
