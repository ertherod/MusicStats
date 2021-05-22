<template>
  <div
    :class="`container-lg pt-3 pb-5 ${
      getTheme == 'dark' ? 'dark-theme' : 'light-theme'
    }`"
  >
    <div
      v-if="getAlbum && getAlbum.id == $route.params.id && getAverageFeatures"
    >
      <b-card :bg-variant="getTheme == 'dark' ? 'dark' : 'light'" class="track">
        <template #header>
          <span class="h2">{{ getAlbum.name }}</span>
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
              {{ $t('pages.myplaylists.by') }}
              <span
                v-for="(artist, index) in getAlbum.artists"
                :key="artist.id"
              >
                <b-link
                  v-if="index == getAlbum.artists.length - 1"
                  :to="localePath(`/artists/${artist.id}`)"
                  ><b>{{ artist.name }}</b></b-link
                >
                <span v-else-if="index == getAlbum.artists.length - 2">
                  <b-link :to="localePath(`/artists/${artist.id}`)"
                    ><b>{{ artist.name }}</b></b-link
                  >
                  &
                </span>
                <span v-else>
                  <b-link :to="localePath(`/artists/${artist.id}`)"
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
                      `analysis.${requestAnalysis(
                        getAverageFeatures.valence,
                        getAverageFeatures.energy
                      )}`
                    )
                  }}</u
                ></b
              >
              <br /><br />
              <ProgressAnalysis :analysis="getAverageFeatures" />
            </div>
          </div>
        </b-row>
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
  },
  async mounted() {
    await this.requestAlbum(this.$route.params.id)
    await this.requestAverageFeatures()
  },
  methods: {
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
