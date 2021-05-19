<template>
  <div :class="getTheme == 'dark' ? 'dark-theme' : 'light-theme'">
    <b-card
      v-for="item in tracks"
      :key="item.track.id"
      :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
      class="track my-2"
    >
      <template #header>
        <span class="h5">{{ item.track.name }}</span>
      </template>

      <b-row align-h="left" class="mx-1">
        <b-col cols="4" md="auto">
          <img :src="item.track.album.images[0].url" class="cover-art" />
        </b-col>
        <b-col cols="8" md="auto">
          <b-card-text>
            {{ $t('pages.myplaylists.by') }}
            <span
              v-for="(artist, index) in item.track.artists"
              :key="artist.id"
            >
              <b-link
                v-if="index == item.track.artists.length - 1"
                :to="localePath(`/artists/${artist.id}`)"
                ><b>{{ artist.name }}</b></b-link
              >
              <span v-else-if="index == item.track.artists.length - 2">
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
            <span v-if="type === 'recent' && item.played_at">
              <br />
              {{ $t('pages.recent.listened_on') }}
              {{ ISOtoHour(item.played_at) }}
            </span>
            <br /><br />
            <u>
              {{ $t('pages.myplaylists.analysis_song') }}
              {{
                $t(
                  `analysis.${requestAnalysis(
                    item.audio_features.valence,
                    item.audio_features.energy
                  )}`
                )
              }}</u
            >
          </b-card-text>
        </b-col>
      </b-row>

      <template #footer>
        <b-row align-h="center" class="mx-1">
          <b-button
            v-b-toggle="`collapse-${item.track.id}`"
            :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
            @click="closeOtherCollapses(item.track.id)"
          >
            {{ $t('pages.myplaylists.more') }}
            <fa-icon :icon="['fas', 'chevron-up']" class="when-open" /><fa-icon
              :icon="['fas', 'chevron-down']"
              class="when-closed"
            />
          </b-button>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-collapse :id="`collapse-${item.track.id}`" class="mt-3">
              <b-card
                :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
                class="track my-2"
              >
                <b-row>
                  <b-col cols="12" md="4">
                    <img
                      :src="item.track.album.images[0].url"
                      class="full-cover"
                    />
                  </b-col>
                  <b-col cols="12" md="8">
                    <h6>
                      <span v-if="item.track.album.album_type === 'single'">{{
                        $t('pages.myplaylists.in_single')
                      }}</span>
                      <span v-else>{{ $t('pages.myplaylists.in_album') }}</span>
                      <b
                        ><b-link
                          :to="localePath(`/album/${item.track.album.id}`)"
                          >{{ item.track.album.name }}</b-link
                        ></b
                      >
                    </h6>
                    <h6>
                      {{ $t('pages.myplaylists.released_on') }}
                      {{ getDateFromISO(item.track.album.release_date, 'd') }}
                      {{
                        $t(
                          `date.month.${getDateFromISO(
                            item.track.album.release_date,
                            'm'
                          )}`
                        )
                      }}
                      {{ getDateFromISO(item.track.album.release_date, 'y') }}
                    </h6>
                    <h6>{{ $t('pages.myplaylists.valence') }}</h6>
                    <b-progress :max="1" variant="warning" class="my-2">
                      <b-progress-bar
                        :value="item.audio_features.valence"
                        :label="`${(item.audio_features.valence * 100).toFixed(
                          0
                        )}%`"
                      ></b-progress-bar>
                    </b-progress>
                    <h6>{{ $t('pages.myplaylists.energy') }}</h6>
                    <b-progress :max="1" variant="danger" class="my-2">
                      <b-progress-bar
                        :value="item.audio_features.energy"
                        :label="`${(item.audio_features.energy * 100).toFixed(
                          0
                        )}%`"
                      ></b-progress-bar>
                    </b-progress>
                    <h6>{{ $t('pages.myplaylists.danceability') }}</h6>
                    <b-progress :max="1" variant="primary" class="my-2">
                      <b-progress-bar
                        :value="item.audio_features.danceability"
                        :label="`${(
                          item.audio_features.danceability * 100
                        ).toFixed(0)}%`"
                      ></b-progress-bar>
                    </b-progress>
                    <h6>
                      {{ $t('pages.myplaylists.popularity') }}
                    </h6>
                    <b-progress :max="100" variant="success" class="my-2">
                      <b-progress-bar
                        :value="item.track.popularity"
                        :label="`${item.track.popularity}%`"
                      ></b-progress-bar>
                    </b-progress>
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
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>
      </template>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['getTheme']),
  },
  methods: {
    requestAnalysis: getAnalysis,
    getDateFromISO(date, type) {
      date = date.split('-')
      if (type === 'y') {
        return date[0]
      } else if (type === 'm') {
        return Math.round(date[1])
      } else {
        return Math.round(date[2])
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
      return `${date[0]}:${date[1]}`
    },
  },
}
</script>

<style>
.cover-art {
  width: auto;
  height: auto;
  max-height: 8vh;
  max-width: 100%;
  border-radius: 0.5em;
}

.full-cover {
  width: 100%;
  height: auto;
  border-radius: 2vh;
}

.dark-theme a {
  color: rgb(250, 250, 250);
}

.light-theme a {
  color: #2d8fd3;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

.audio-player {
  width: 100%;
}

.track {
  border-radius: 2vh;
  overflow: hidden;
}
</style>
