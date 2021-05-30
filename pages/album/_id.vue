<template>
  <div
    :class="`container-lg pt-3 pb-5 ${
      getTheme == 'dark' ? 'dark-theme' : 'light-theme'
    }`"
  >
    <div v-if="getAlbum && getAlbum.id == $route.params.id">
      <b-card :bg-variant="getTheme == 'dark' ? 'dark' : 'light'" class="track">
        <template #header>
          <b-row align-h="center">
            <span class="h3">
              <fa-icon :icon="['fas', 'record-vinyl']" />
              {{ getAlbum.name }}</span
            >
          </b-row>
        </template>
        <b-row>
          <div class="col-md-4 mb-3">
            <img
              :src="getAlbum.images[0].url"
              alt="Album image"
              class="playlist-img"
            />
          </div>
          <div class="col-md-8 px-5 mb-3">
            <h4>
              <span
                v-if="
                  getAlbum.album_type === 'single' &&
                  getAlbum.tracks.items.length === 1
                "
                >{{ $t('pages.album.single') }}</span
              >
              <span v-else-if="getAlbum.album_type === 'single'">{{
                $t('pages.album.ep')
              }}</span>
              <span v-else>{{ $t('pages.album.album') }}</span>
              {{ $t('pages.album.by') }}
              <span
                v-for="(artist, index) in getAlbum.artists"
                :key="artist.id"
              >
                <b-link
                  v-if="index == getAlbum.artists.length - 1"
                  :to="localePath(`/artist/${artist.id}`)"
                  ><b>{{ artist.name }}</b></b-link
                >
                <span v-else-if="index == getAlbum.artists.length - 2">
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
            </h4>
            <br />
            <ul>
              <li v-if="getAlbum.tracks.total > 0">
                {{ getAlbum.tracks.total }}
                {{ $t('pages.myplaylists.tracks') }}
              </li>
              <li v-if="getAverageFeatures.duration">
                {{ $t('pages.album.total_duration')
                }}{{
                  `${
                    getAverageFeatures.duration.hour
                      ? `${getAverageFeatures.duration.hour}h`
                      : ''
                  } ${
                    getAverageFeatures.duration.min
                      ? `${getAverageFeatures.duration.min}min`
                      : ''
                  } ${getAverageFeatures.duration.sec}sec`
                }}
              </li>
            </ul>
            <div v-if="getAverageFeatures">
              <b
                ><u>
                  {{ $t('pages.album.analysis') }}
                  {{
                    $t(
                      `pages.album.${requestAnalysis(
                        getAverageFeatures.valence,
                        getAverageFeatures.energy
                      )}`
                    )
                  }}</u
                ></b
              >
              <br /><br />
              <ProgressAnalysis
                v-if="getAverageFeatures"
                :analysis="getAverageFeatures"
              />
            </div>
          </div>
        </b-row>
        <template v-if="getUserData.product === 'premium'" #footer>
          <b-row align-h="center">
            <b-button-group class="mt-2">
              <b-button
                :variant="`${
                  getTheme == 'dark' ? 'outline-light' : 'outline-dark'
                }`"
                @click="playContext({ uri: getAlbum.uri, shuffle: false })"
              >
                <fa-icon :icon="['fas', 'play']" />
                {{ $t('songlist.listen') }}
              </b-button>
              <b-button
                :variant="`${
                  getTheme == 'dark' ? 'outline-light' : 'outline-dark'
                }`"
                @click="playContext({ uri: getAlbum.uri, shuffle: true })"
              >
                <fa-icon :icon="['fas', 'random']" />
                {{ $t('songlist.listenshuffle') }}
              </b-button>
            </b-button-group>
          </b-row>
        </template>
      </b-card>

      <br />

      <ListButtonFilter
        type="album"
        :filters="{ list: [5, 10, 15, 20, 25], filter: 10 }"
        :objectlist="getAlbum.tracks.items"
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
    ...mapGetters('albums', ['getAlbum', 'getAverageFeatures']),
    ...mapGetters(['getTheme']),
    ...mapGetters('userprofile', ['getUserData']),
  },
  async mounted() {
    await this.requestAlbum(this.$route.params.id)
    await this.requestAverageFeatures()
  },
  methods: {
    ...mapActions('player', ['playContext']),
    ...mapActions('albums', ['requestAlbum', 'requestAverageFeatures']),
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
