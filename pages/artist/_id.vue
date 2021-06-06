<template>
  <b-container fluid="lg" class="pt-3 pb-5 mb-5">
    <b-card
      v-if="getCurrentArtist && getCurrentArtist.id === $route.params.id"
      class="card"
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
          <h3>{{ `${followers_number} ${$t('pages.artist.followers')}` }}</h3>
          <br />
          <ProgressAnalysis v-if="analysis" :analysis="analysis" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h4 v-if="analysis">
            {{ $t('') }}
            {{
              $t(`analysis.${getAnalysis(analysis.valence, analysis.energy)}`)
            }}
          </h4>
        </b-col>
      </b-row>
    </b-card>
    <br />
    <b-card
      v-if="
        getCurrentArtist &&
        getCurrentArtist.id === $route.params.id &&
        getTopTracks
      "
      class="card"
      :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
    >
      <h2 class="text-center">
        {{ $t('pages.artist.top_tracks') }}
      </h2>
      <b-list-group>
        <b-list-group-item
          v-for="item in getTopTracks"
          :key="item.id"
          class="list p-0"
        >
          <b-row class="m-0" align-h="start">
            <b-col cols="3" md="1">
              <img :src="item.track.album.images[2].url" />
            </b-col>
            <b-col
              v-b-toggle="`collapse-${item.track.id}`"
              class="my-auto"
              @click="closeOtherCollapses(item.track.id)"
            >
              <fa-icon :icon="['fas', 'chevron-down']" class="when-closed" />
              <fa-icon :icon="['fas', 'chevron-up']" class="when-open" />
              {{ item.track.name }}
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col cols="12">
              <b-collapse :id="`collapse-${item.track.id}`" class="mt-3">
                <b-card
                  :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
                  class="track my-2"
                >
                  <b-row>
                    <b-col cols="12" md="4" class="mb-2">
                      <img
                        :src="item.track.album.images[0].url"
                        class="full-cover"
                      />
                    </b-col>
                    <b-col cols="12" md="8">
                      <h6>
                        <u v-if="item.audio_features">
                          {{ $t('pages.myplaylists.analysis_song') }}
                          {{
                            $t(
                              `analysis.${getAnalysis(
                                item.audio_features.valence,
                                item.audio_features.energy
                              )}`
                            )
                          }}</u
                        ><br />
                        {{ $t('pages.myplaylists.released_on') }}
                        <span
                          v-if="
                            getDateFromISO(item.track.album.release_date, 'd')
                          "
                          >{{
                            getDateFromISO(item.track.album.release_date, 'd')
                          }}</span
                        >
                        <span
                          v-if="
                            getDateFromISO(item.track.album.release_date, 'm')
                          "
                          >{{
                            $t(
                              `date.month.${getDateFromISO(
                                item.track.album.release_date,
                                'm'
                              )}`
                            )
                          }}</span
                        >

                        {{ getDateFromISO(item.track.album.release_date, 'y') }}
                      </h6>

                      <ProgressAnalysis
                        v-if="item.audio_features"
                        :analysis="{
                          ...item.audio_features,
                          popularity: item.track.popularity,
                        }"
                      />

                      <br />
                      <div v-if="item.track.preview_url">
                        <h6>{{ $t('pages.myplaylists.preview') }}</h6>
                        <audio
                          :ref="`player-${item.track.id}`"
                          controls
                          :src="item.track.preview_url"
                          type="audio/mpeg"
                          class="audio-player"
                          @play="stopOthers(item.track.id)"
                        />
                      </div>
                      <div v-else>
                        <h6>{{ $t('pages.myplaylists.no_preview') }}</h6>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row align-h="center">
                    <b-button-group class="mt-2">
                      <b-button
                        v-if="getUserData.product === 'premium'"
                        :variant="`${
                          getTheme == 'dark' ? 'outline-light' : 'outline-dark'
                        }`"
                        @click="playTrack(item.track.uri)"
                      >
                        <fa-icon :icon="['fas', 'play']" />
                        {{ $t('songlist.listen') }}
                      </b-button>

                      <b-button
                        v-if="getUserData.product === 'premium'"
                        :variant="`${
                          getTheme == 'dark' ? 'outline-light' : 'outline-dark'
                        }`"
                        @click="addToQueue(item.track.uri)"
                      >
                        <fa-icon :icon="['fas', 'step-forward']" />
                        {{ $t('songlist.nextQueue') }}
                      </b-button>
                    </b-button-group>
                  </b-row>
                </b-card>
              </b-collapse>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getAnalysis } from '~/utils'

export default {
  name: 'ArtistPage',
  computed: {
    ...mapGetters('artists', [
      'getCurrentArtist',
      'getTopTracks',
      'getAverageData',
    ]),
    ...mapGetters(['getTheme']),
    ...mapGetters('userprofile', ['getUserData']),
    followers_number() {
      const number = this.getCurrentArtist.followers.total
      if (number / 1000000 > 1) {
        return `${Math.round(number / 100000) / 10}M`
      } else if (number / 1000 > 1) {
        return `${Math.round(number / 100) / 10}K`
      } else {
        return number
      }
    },
    analysis() {
      if (this.getAverageData) {
        return {
          valence: this.getAverageData.valence,
          energy: this.getAverageData.energy,
          danceability: this.getAverageData.danceability,
          popularity: this.getCurrentArtist.popularity,
        }
      } else {
        return null
      }
    },
  },
  mounted() {
    this.requestFullArtist(this.$route.params.id)
  },
  methods: {
    ...mapActions('artists', ['requestFullArtist']),
    ...mapActions('player', ['addToQueue', 'skipTrack', 'playTrack']),
    getDateFromISO(date, type) {
      date = date.split('-')
      if (type === 'y') {
        return date[0]
      } else if (type === 'm' && date[1]) {
        return Math.round(date[1])
      } else if (date[2]) {
        return Math.round(date[2])
      } else {
        return null
      }
    },
    closeOtherCollapses(newCollapse) {
      if (this.currentCollapse && !(this.currentCollapse === newCollapse)) {
        this.$root.$emit(
          'bv::toggle::collapse',
          `collapse-${this.currentCollapse}`
        )
        this.currentCollapse = newCollapse
        this.stopOthers(newCollapse)
      } else if (this.currentCollapse === newCollapse) {
        this.currentCollapse = null
        const refName = `player-${newCollapse}`
        const player = this.$refs[refName][0]
        player.pause()
      } else {
        this.currentCollapse = newCollapse
      }
    },
    stopOthers(newTrack) {
      if (this.currentTrack && !(this.currentTrack === newTrack)) {
        const refName = `player-${this.currentTrack}`
        const player = this.$refs[refName][0]
        player.pause()
      }
      this.currentTrack = newTrack
    },
    getAnalysis,
  },
}
</script>

<style scoped>
.card {
  border-radius: 2em;
}

.list {
  background-color: #0000 !important;
}

.list > div {
  height: 100%;
}

.list img {
  display: inline-block;
}

.track-number {
  text-align: center;
  vertical-align: middle;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

.track {
  width: 100%;
  border: none;
}

.track .card {
  background-color: #0000;
}
</style>
