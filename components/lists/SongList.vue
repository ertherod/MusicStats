<template>
  <div class="dark-theme">
    <b-row class="my-3">
      <b-col
        v-for="(item, index) in tracks"
        :key="item.track.id"
        md="6"
        class="my-1"
      >
        <b-card bg-variant="dark" class="track my-2">
          <template #header
            ><span v-if="item.track.explicit" class="explicit">E</span>
            <b-link class="h5" :to="`/track/${item.track.id}`">
              {{ item.track.name }}</b-link
            >
          </template>

          <b-row align-h="left" class="mx-1">
            <b-col cols="4">
              <img :src="item.track.album.images[0].url" class="cover-art" />
            </b-col>
            <b-col cols="8" class="artists my-auto">
              {{ $t('pages.myplaylists.by') }}
              <span
                v-for="(artist, artist_index) in item.track.artists"
                :key="artist.id"
              >
                <b-link
                  v-if="artist_index == item.track.artists.length - 1"
                  :to="localePath(`/artist/${artist.id}`)"
                  ><b>{{ artist.name }}</b></b-link
                >
                <span v-else-if="artist_index == item.track.artists.length - 2">
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

              <span v-if="type === 'recent' && item.played_at">
                <br />
                {{ $t('pages.recent.listened_on') }}
                {{ ISOtoHour(item.played_at) }}
              </span>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <u v-if="item.audio_features">
              <br />
              {{ $t('pages.myplaylists.analysis_song') }}
              {{
                $t(
                  `pages.album.${requestAnalysis(
                    item.audio_features.valence,
                    item.audio_features.energy
                  )}`
                )
              }}</u
            >
          </b-row>

          <template #footer>
            <b-row align-h="center" class="mx-1">
              <b-button-group class="mt-2">
                <b-button
                  v-b-toggle="`collapse-${item.track.id}-${index}`"
                  variant="outline-light"
                  @click="closeOtherCollapses(`${item.track.id}-${index}`)"
                >
                  {{ $t('pages.myplaylists.more') }}
                  <fa-icon
                    :icon="['fas', 'chevron-up']"
                    class="when-open"
                  /><fa-icon
                    :icon="['fas', 'chevron-down']"
                    class="when-closed"
                  />
                </b-button>

                <b-button
                  v-if="getUserData && getUserData.product === 'premium'"
                  variant="outline-light"
                  @click="playTrack(item.track.uri)"
                >
                  <fa-icon :icon="['fas', 'play']" />
                  {{ $t('songlist.listen') }}
                </b-button>

                <b-button
                  v-if="getUserData && getUserData.product === 'premium'"
                  variant="outline-light"
                  @click="addToQueue(item.track.uri)"
                >
                  <fa-icon :icon="['fas', 'step-forward']" />
                  {{ $t('songlist.nextQueue') }}
                </b-button>
              </b-button-group>
              <h6 v-if="getStatus === 404">
                {{ $t('songlist.noplayer') }}
              </h6>
            </b-row>
            <b-row>
              <b-col cols="12">
                <b-collapse
                  :id="`collapse-${item.track.id}-${index}`"
                  class="mt-3"
                >
                  <b-row align-h="center">
                    <b-col cols="12" md="12">
                      <h6 v-if="type !== 'album'">
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
                        >
                      </h6>
                      <h6>
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
                </b-collapse>
              </b-col>
            </b-row>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getAnalysis } from '~/utils'

export default {
  name: 'SongList',
  props: {
    tracks: {
      type: Array,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      timezone: parseInt(Math.round(new Date().getTimezoneOffset() / -60)),
    }
  },
  computed: {
    ...mapGetters('userprofile', ['getUserData']),
    ...mapGetters('player', ['getStatus']),
    ...mapGetters('recommendations', ['seed_length', 'seed_tracks']),
  },
  methods: {
    ...mapActions('player', ['addToQueue', 'skipTrack', 'playTrack']),
    requestAnalysis: getAnalysis,
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
      } else if (this.currentCollapse === newCollapse) {
        this.currentCollapse = null
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
    ISOtoHour(date) {
      date = date.split('T')
      date = date[1].split(':')
      return `${parseInt(date[0]) + this.timezone}:${date[1]}`
    },
  },
}
</script>

<style>
.cover-art {
  width: auto;
  height: auto;

  max-width: 100%;
}

.full-cover {
  width: 100%;
  height: auto;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

.audio-player {
  width: 100%;
}

.track {
  overflow: hidden;
}
</style>

<style scoped>
.card {
  height: 100%;
}
</style>
