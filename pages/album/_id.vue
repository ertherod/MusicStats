<template>
  <div class="container-lg pt-3 pb-5 dark-theme">
    <div v-if="getAlbum && getAlbum.id == $route.params.id">
      <b-card bg-variant="dark" class="track">
        <template #header>
          <b-row align-h="center" class="m-2">
            <span class="h3 text-center">
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
        <template #footer>
          <b-row align-h="center">
            <b-button-group class="mt-2">
              <b-button
                v-if="getUserData && getUserData.product === 'premium'"
                variant="outline-light"
                @click="playContext({ uri: getAlbum.uri, shuffle: false })"
              >
                <fa-icon :icon="['fas', 'play']" />
                {{ $t('songlist.listen') }}
              </b-button>
              <b-button
                v-if="getUserData && getUserData.product === 'premium'"
                variant="outline-light"
                @click="playContext({ uri: getAlbum.uri, shuffle: true })"
              >
                <fa-icon :icon="['fas', 'random']" />
                {{ $t('songlist.listenshuffle') }}
              </b-button>
              <b-button variant="outline-light" @click="updateSaved">
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
        type="album"
        :filters="{ list: [5, 10, 15, 20, 25], filter: 10 }"
        :objectlist="getAlbum.tracks.items"
        :texts="{ resultperpage: 'pages.recent.resultperpage' }"
      />

      <br />
      <div class="text-center">
        <span v-for="copyright in getAlbum.copyrights" :key="copyright.type"
          >{{ copyright.text }}<br
        /></span>
      </div>
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
    ...mapGetters('albums', ['getAlbum', 'getAverageFeatures']),
    ...mapGetters('userprofile', ['getUserData']),
    ...mapGetters('library', ['getStatus']),
  },
  async mounted() {
    await this.requestAlbum(this.$route.params.id)
    await this.requestAverageFeatures()
    this.saved = await this.checkAlbum(this.$route.params.id)
  },
  methods: {
    ...mapActions('player', ['playContext']),
    ...mapActions('albums', ['requestAlbum', 'requestAverageFeatures']),
    ...mapActions('library', ['saveAlbum', 'checkAlbum', 'removeAlbum']),
    requestAnalysis: getAnalysis,
    async updateSaved() {
      const isSaved = await this.checkAlbum(this.$route.params.id)
      if (!isSaved) {
        await this.saveAlbum(this.$route.params.id)
      } else {
        await this.removeAlbum(this.$route.params.id)
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
