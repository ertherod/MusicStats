<template>
  <div
    :class="`container-lg pt-3 pb-5 ${
      getTheme == 'dark' ? 'dark-theme' : 'light-theme'
    }`"
  >
    <div
      v-if="
        getCurrentPlaylist &&
        getCurrentPlaylist.id == $route.params.id &&
        getCurrentAverageData
      "
    >
      <b-card :bg-variant="getTheme == 'dark' ? 'dark' : 'light'" class="track">
        <template #header>
          <span class="h2">{{ getCurrentPlaylist.name }}</span>
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
              <b-link
                :to="localePath(`/user/${getCurrentPlaylist.owner.id}`)"
                >{{ getCurrentPlaylist.owner.display_name }}</b-link
              >
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
  computed: {
    ...mapGetters('playlists', ['getCurrentPlaylist', 'getCurrentAverageData']),
    ...mapGetters(['getTheme']),
  },
  watch: {
    getCurrentPlaylist() {
      this.computeAverageAudioFeatures()
    },
  },
  async mounted() {
    await this.requestPlaylistItems(this.$route.params.id)
  },
  methods: {
    ...mapActions('playlists', [
      'requestPlaylistItems',
      'computeAverageAudioFeatures',
    ]),
    requestAnalysis: getAnalysis,
  },
}
</script>

<style scoped>
.playlist-img {
  width: 100%;
}

.track {
  border-radius: 2vh;
  overflow: hidden;
}
</style>
