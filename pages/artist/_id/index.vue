<template>
  <b-container fluid="lg" class="pt-3 pb-5 mb-5">
    <div
      v-if="
        getCurrentArtist &&
        getCurrentArtist.id === $route.params.id &&
        isReady()
      "
    >
      <b-card class="card" :bg-variant="getTheme == 'dark' ? 'dark' : 'light'">
        <b-row>
          <b-col md="4">
            <img
              v-if="getCurrentArtist.images && getCurrentArtist.images[0]"
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
        <br />
        <b-row>
          <b-col class="text-center">
            <h5 v-if="analysis">
              {{ $t('pages.artist.artist_happiness') }}
              {{
                $t(`analysis.${getAnalysis(analysis.valence, analysis.energy)}`)
              }}
            </h5>
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
            v-for="(item, index) in getTopTracks"
            :key="item.id"
            class="list p-0"
          >
            <b-row class="m-0" align-h="start">
              <b-col cols="3" md="1">
                <img
                  v-if="item.track.album.images && item.track.album.images[2]"
                  :src="item.track.album.images[2].url"
                />
              </b-col>
              <b-col
                v-b-toggle="`collapse-${item.track.id}`"
                class="my-auto d-flex justify-content-between"
                @click="closeOtherCollapses(item.track.id)"
              >
                <div>
                  {{ index + 1 }}.
                  {{ item.track.name }}
                </div>
                <div>
                  <fa-icon
                    :icon="['fas', 'chevron-down']"
                    class="when-closed"
                  />
                  <fa-icon :icon="['fas', 'chevron-up']" class="when-open" />
                </div>
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
                          v-if="
                            item.track.album.images &&
                            item.track.album.images[0]
                          "
                          :src="item.track.album.images[0].url"
                          class="full-cover"
                        />
                      </b-col>
                      <b-col cols="12" md="8">
                        <h6>
                          {{ $t('pages.myplaylists.by') }}
                          <span
                            v-for="(artist, artist_index) in item.track.artists"
                            :key="artist.id"
                          >
                            <b-link
                              v-if="
                                artist_index == item.track.artists.length - 1
                              "
                              :to="localePath(`/artist/${artist.id}`)"
                              ><b>{{ artist.name }}</b></b-link
                            >
                            <span
                              v-else-if="
                                artist_index == item.track.artists.length - 2
                              "
                            >
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
                          <br />
                          <span
                            v-if="
                              item.track.album.album_type === 'single' &&
                              item.track.album.total_tracks === 1
                            "
                            >{{ $t('pages.myplaylists.in_single') }}</span
                          >
                          <span
                            v-else-if="item.track.album.album_type === 'single'"
                            >{{ $t('pages.myplaylists.in_ep') }}</span
                          >
                          <span v-else>{{
                            $t('pages.myplaylists.in_album')
                          }}</span>
                          <b
                            ><b-link
                              :to="localePath(`/album/${item.track.album.id}`)"
                              >{{ item.track.album.name }}</b-link
                            ></b
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
                          {{
                            getDateFromISO(item.track.album.release_date, 'y')
                          }}

                          <br /><br />

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
                          >
                        </h6>

                        <ProgressAnalysis
                          v-if="item.audio_features"
                          :analysis="{
                            ...item.audio_features,
                            popularity: item.track.popularity,
                          }"
                        />

                        <br />
                        <div v-if="item.track && item.track.preview_url">
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
                            getTheme == 'dark'
                              ? 'outline-light'
                              : 'outline-dark'
                          }`"
                          @click="playTrack(item.track.uri)"
                        >
                          <fa-icon :icon="['fas', 'play']" />
                          {{ $t('songlist.listen') }}
                        </b-button>

                        <b-button
                          v-if="getUserData.product === 'premium'"
                          :variant="`${
                            getTheme == 'dark'
                              ? 'outline-light'
                              : 'outline-dark'
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
      <br />
      <b-card
        v-if="getCurrentArtist.albums && getCurrentArtist.albums.length != 0"
        class="card"
        :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
      >
        <h2 class="text-center">{{ $t('pages.artist.albums') }}</h2>
        <b-list-group>
          <b-list-group-item
            v-for="album in getCurrentArtist.albums"
            :key="album.id"
            class="list p-0"
          >
            <b-link :to="localePath(`/album/${album.id}`)">
              <b-row class="m-0" align-h="start">
                <b-col cols="3" md="1" class="m-0">
                  <img
                    v-if="album.images && album.images[1]"
                    :src="album.images[1].url"
                    width="100%"
                  />
                </b-col>
                <b-col class="my-auto">
                  <span>{{ album.name }}</span>
                  <span>({{ album.release_date.split('-')[0] }})</span>
                </b-col>
              </b-row>
            </b-link>
          </b-list-group-item>
        </b-list-group>
      </b-card>
      <br />
      <b-card
        v-if="getCurrentArtist.singles"
        class="card"
        :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
      >
        <h2 class="text-center">{{ $t('pages.artist.singles') }}</h2>
        <b-list-group>
          <b-list-group-item
            v-for="single in getCurrentArtist.singles"
            :key="single.id"
            class="list p-0"
          >
            <b-link :to="localePath(`/album/${single.id}`)">
              <b-row class="m-0" align-h="start">
                <b-col cols="3" md="1" class="m-0">
                  <img
                    v-if="single.images && single.images[1]"
                    :src="single.images[1].url"
                    width="100%"
                  />
                </b-col>
                <b-col class="my-auto">
                  <span>{{ single.name }}</span>
                  <span>({{ single.release_date.split('-')[0] }})</span>
                </b-col>
              </b-row>
            </b-link>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </div>
    <div v-else class="text-center pt-2">
      <Loading />
    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Loading from '~/components/Loading.vue'
import { getAnalysis } from '~/utils'

export default {
  name: 'ArtistPage',
  components: {
    Loading,
  },
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
    isReady() {
      let status = false
      if (
        this.getCurrentArtist &&
        this.getTopTracks &&
        this.getTopTracks[0] &&
        this.getTopTracks[0].track.artists
      ) {
        this.getTopTracks[0].track.artists.forEach((item) => {
          if (item.id === this.getCurrentArtist.id) {
            status = true
          }
        })
      }
      return status
    },
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

.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}

.track {
  width: 100%;
  border: none;
}

.track .card {
  background-color: #0000;
}

.dark-theme a {
  color: rgb(250, 250, 250);
}

.light-theme a {
  color: #2d8fd3;
}
</style>
