<template>
  <b-container fluid="lg" class="pt-3 pb-5 mb-5">
    <b-card class="card" bg-variant="dark">
      <template #header>
        <b-row align-h="center">
          <span class="h3">
            <fa-icon :icon="['fas', 'search']" /> {{ $t('pages.search.title') }}
          </span>
        </b-row>
      </template>
      <b-row class="mx-3">
        <b-input-group class="search">
          <b-form-input
            v-model="search"
            type="search"
            :placeholder="$t('pages.search.placeholder')"
            @keyup.enter="launchSearch()"
          />
          <b-input-group-append>
            <b-button variant="outline-primary" @click="launchSearch()"
              ><fa-icon :icon="['fas', 'search']"
            /></b-button>
          </b-input-group-append>
        </b-input-group>
      </b-row>
      <b-row align-h="center" class="my-2">
        <b-button v-b-toggle="'option-collapse'" variant="outline-light">
          {{ $t('pages.search.options') }}
          <fa-icon :icon="['fas', 'chevron-up']" class="when-open" /><fa-icon
            :icon="['fas', 'chevron-down']"
            class="when-closed"
          />
        </b-button>
      </b-row>
      <b-collapse id="option-collapse">
        <b-card bg-variant="dark">
          <b-row>
            <b-col md="6" class="px-5 my-3">
              <h6>{{ $t('pages.search.include') }}</h6>
              <b-form-checkbox-group v-model="types" @change="launchSearch()">
                <b-row>
                  <b-col cols="6">
                    <b-form-checkbox class="m-2" value="artist">{{
                      $t('pages.search.artists')
                    }}</b-form-checkbox>
                  </b-col>
                  <b-col cols="6">
                    <b-form-checkbox class="m-2" value="album">{{
                      $t('pages.search.albums')
                    }}</b-form-checkbox></b-col
                  >
                </b-row>
                <b-row>
                  <b-col cols="6">
                    <b-form-checkbox class="m-2" value="track">{{
                      $t('pages.search.tracks')
                    }}</b-form-checkbox>
                  </b-col>
                  <b-col cols="6">
                    <b-form-checkbox class="m-2" value="playlist">{{
                      $t('pages.search.playlists')
                    }}</b-form-checkbox>
                  </b-col>
                </b-row>
              </b-form-checkbox-group>
            </b-col>
            <b-col md="6" class="px-5 my-3">
              <h6>{{ $t('pages.search.resultperpage') }}</h6>
              <b-form-select v-model="options.limit" @input="launchSearch()">
                <b-form-select-option :value="5">5</b-form-select-option>
                <b-form-select-option :value="10">10</b-form-select-option>
                <b-form-select-option :value="15">15</b-form-select-option>
                <b-form-select-option :value="20">20</b-form-select-option>
              </b-form-select>
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </b-card>
    <br />
    <b-card
      v-if="
        getSearch && getSearch.tracks && getSearch.tracks.items.length !== 0
      "
      class="card"
      bg-variant="dark"
    >
      <template #header>
        <b-row v-b-toggle="`tracks-collapse`" align-h="between" class="mx-3 h3">
          <div>{{ $t('pages.search.tracks') }}</div>
          <div>
            <fa-icon :icon="['fas', 'chevron-up']" class="when-open" /><fa-icon
              :icon="['fas', 'chevron-down']"
              class="when-closed"
            />
          </div>
        </b-row>
      </template>
      <b-collapse id="tracks-collapse" visible>
        <b-list-group>
          <b-list-group-item
            v-for="item in getSearch.tracks.items"
            :key="item.id"
            class="list p-0"
          >
            <b-row class="m-0 item" align-h="start">
              <b-col cols="3" md="1">
                <img :src="item.album.images[2].url" />
              </b-col>
              <b-col
                v-b-toggle="`collapse-${item.id}`"
                class="my-auto d-flex justify-content-between"
                @click="closeOtherCollapses(item.id)"
              >
                <div>
                  {{ item.name }}
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
                <b-collapse :id="`collapse-${item.id}`" class="mt-3">
                  <b-card bg-variant="dark" class="track my-2">
                    <b-row>
                      <b-col cols="12" md="4" class="mb-2">
                        <img
                          :src="item.album.images[0].url"
                          class="full-cover"
                        />
                      </b-col>
                      <b-col cols="12" md="8">
                        <h6>
                          {{ $t('pages.myplaylists.by') }}
                          <span
                            v-for="(artist, artist_index) in item.artists"
                            :key="artist.id"
                          >
                            <b-link
                              v-if="artist_index == item.artists.length - 1"
                              :to="localePath(`/artist/${artist.id}`)"
                              ><b>{{ artist.name }}</b></b-link
                            >
                            <span
                              v-else-if="
                                artist_index == item.artists.length - 2
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
                              item.album.album_type === 'single' &&
                              item.album.total_tracks === 1
                            "
                            >{{ $t('pages.myplaylists.in_single') }}</span
                          >
                          <span
                            v-else-if="item.album.album_type === 'single'"
                            >{{ $t('pages.myplaylists.in_ep') }}</span
                          >
                          <span v-else>{{
                            $t('pages.myplaylists.in_album')
                          }}</span>
                          <b
                            ><b-link
                              :to="localePath(`/album/${item.album.id}`)"
                              >{{ item.album.name }}</b-link
                            ></b
                          ><br />
                          {{ $t('pages.myplaylists.released_on') }}
                          <span
                            v-if="getDateFromISO(item.album.release_date, 'd')"
                            >{{
                              getDateFromISO(item.album.release_date, 'd')
                            }}</span
                          >
                          <span
                            v-if="getDateFromISO(item.album.release_date, 'm')"
                            >{{
                              $t(
                                `date.month.${getDateFromISO(
                                  item.album.release_date,
                                  'm'
                                )}`
                              )
                            }}</span
                          >
                          {{ getDateFromISO(item.album.release_date, 'y') }}

                          <br /><br />

                          <br />
                          <div v-if="item.preview_url">
                            <h6>{{ $t('pages.myplaylists.preview') }}</h6>
                            <audio
                              :ref="`player-${item.id}`"
                              controls
                              :src="item.preview_url"
                              type="audio/mpeg"
                              class="audio-player"
                              @play="stopOthers(item.id)"
                            />
                          </div>
                          <div v-else>
                            <h6>{{ $t('pages.myplaylists.no_preview') }}</h6>
                          </div>
                        </h6>

                        <b-row align-h="center">
                          <b-button-group class="mt-2">
                            <b-button
                              v-if="
                                getUserData && getUserData.product === 'premium'
                              "
                              variant="outline-light"
                              @click="playTrack(item.uri)"
                            >
                              <fa-icon :icon="['fas', 'play']" />
                              {{ $t('songlist.listen') }}
                            </b-button>

                            <b-button
                              v-if="
                                getUserData && getUserData.product === 'premium'
                              "
                              variant="outline-light"
                              @click="addToQueue(item.uri)"
                            >
                              <fa-icon :icon="['fas', 'step-forward']" />
                              {{ $t('songlist.nextQueue') }}
                            </b-button>
                            <b-button
                              variant="outline-light"
                              :to="`/track/${item.id}`"
                            >
                              <fa-icon
                                :icon="['fas', 'external-link-square-alt']"
                              />
                              {{ $t('pages.search.open_page') }}
                            </b-button>
                          </b-button-group>
                          <br /><br />
                          <h6 v-if="getStatus === 404">
                            {{ $t('songlist.noplayer') }}
                          </h6>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-card>
                </b-collapse>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </b-card>
    <br />
    <b-card
      v-if="
        getSearch && getSearch.artists && getSearch.artists.items.length !== 0
      "
      class="card"
      bg-variant="dark"
    >
      <template #header>
        <b-row
          v-b-toggle="`artists-collapse`"
          align-h="between"
          class="mx-3 h3"
        >
          <div>{{ $t('pages.search.artists') }}</div>
          <div>
            <fa-icon :icon="['fas', 'chevron-up']" class="when-open" /><fa-icon
              :icon="['fas', 'chevron-down']"
              class="when-closed"
            />
          </div>
        </b-row>
      </template>
      <b-collapse id="artists-collapse" visible>
        <b-list-group>
          <b-list-group-item
            v-for="item in getSearch.artists.items"
            :key="item.id"
            class="list p-0"
          >
            <b-link :to="localePath(`/artist/${item.id}`)">
              <b-row class="m-0 item" align-h="start">
                <b-col cols="3" md="1" class="m-0">
                  <img
                    v-if="item.images && item.images[1]"
                    :src="item.images[1].url"
                    width="100%"
                  />
                </b-col>
                <b-col class="my-auto">
                  <span>{{ item.name }}</span>
                </b-col>
              </b-row>
            </b-link>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </b-card>
    <br />
    <b-card
      v-if="
        getSearch && getSearch.albums && getSearch.albums.items.length !== 0
      "
      class="card"
      bg-variant="dark"
    >
      <template #header>
        <b-row v-b-toggle="`albums-collapse`" align-h="between" class="mx-3 h3">
          <div>{{ $t('pages.search.albums') }}</div>
          <div>
            <fa-icon :icon="['fas', 'chevron-up']" class="when-open" /><fa-icon
              :icon="['fas', 'chevron-down']"
              class="when-closed"
            />
          </div>
        </b-row>
      </template>
      <b-collapse id="albums-collapse" visible>
        <b-list-group>
          <b-list-group-item
            v-for="album in getSearch.albums.items"
            :key="album.id"
            class="list p-0"
          >
            <b-link :to="localePath(`/album/${album.id}`)">
              <b-row class="m-0 item" align-h="start">
                <b-col cols="3" md="1" class="m-0">
                  <img :src="album.images[1].url" width="100%" />
                </b-col>
                <b-col class="my-auto">
                  <span>{{ album.name }}</span>
                  <span>({{ album.release_date.split('-')[0] }})</span>
                </b-col>
              </b-row>
            </b-link>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </b-card>
    <br />
    <b-card
      v-if="getSearch && getSearch.playlists"
      class="card"
      bg-variant="dark"
    >
      <template #header>
        <b-row
          v-b-toggle="`playlists-collapse`"
          align-h="between"
          class="mx-3 h3"
        >
          <div>{{ $t('pages.search.playlists') }}</div>
          <div>
            <fa-icon :icon="['fas', 'chevron-up']" class="when-open" /><fa-icon
              :icon="['fas', 'chevron-down']"
              class="when-closed"
            />
          </div>
        </b-row>
      </template>
      <b-collapse id="playlists-collapse" visible>
        <b-list-group>
          <b-list-group-item
            v-for="item in getSearch.playlists.items"
            :key="item.id"
            class="list p-0"
          >
            <b-link :to="localePath(`/playlists/${item.id}`)">
              <b-row class="m-0 item" align-h="start">
                <b-col cols="3" md="1" class="m-0">
                  <img
                    v-if="item.images && item.images[0]"
                    :src="item.images[0].url"
                    width="100%"
                  />
                </b-col>
                <b-col class="my-auto">
                  <span>{{ item.name }}</span>
                </b-col>
              </b-row>
            </b-link>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </b-card>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SearchPage',
  middleware: 'auth',
  data: () => ({
    search: null,
    types: ['artist', 'album', 'playlist', 'track'],
    options: {
      limit: 5,
    },
    currentTrack: null,
    currentCollapse: null,
  }),
  computed: {
    ...mapGetters('userprofile', ['getUserData']),
    ...mapGetters('search', ['getSearch', 'getQuery']),
    ...mapGetters('player', ['getStatus']),
  },
  mounted() {
    this.search = this.getQuery
  },
  methods: {
    ...mapActions('search', ['makeSearch']),
    ...mapActions('player', ['addToQueue', 'skipTrack', 'playTrack']),
    launchSearch() {
      this.makeSearch({
        query: this.search,
        types: this.types,
        options: this.options,
      })
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
        if (this.$refs[refName]) {
          const player = this.$refs[refName][0]
          player.pause()
        }
      } else {
        this.currentCollapse = newCollapse
      }
    },
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
    stopOthers(newTrack) {
      if (this.currentTrack && !(this.currentTrack === newTrack)) {
        const refName = `player-${this.currentTrack}`
        if (this.$refs[refName]) {
          const player = this.$refs[refName][0]
          player.pause()
        }
      }
      this.currentTrack = newTrack
    },
  },
}
</script>

<style>
.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}

.list,
.track {
  background-color: #0000;
}

.track {
  border: none;
}

.search {
  width: 100%;
}

.item {
  min-height: 55px;
}
</style>
