<template>
  <b-container fluid="lg">
    <h2 class="my-3 text-center">
      <u>{{ $t('pages.recommendations.title') }}</u>
    </h2>
    <h5 class="text-center">{{ $t('pages.recommendations.howto') }}</h5>
    <br />
    <h5>
      <u>{{ $t('pages.recommendations.step1') }} :</u>
    </h5>
    <b-card class="card my-3 mb-5" bg-variant="dark">
      <template #header>
        <b-row align-h="center">
          <span class="h3 my-auto">
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
                <b-form-checkbox class="m-2" value="track">{{
                  $t('pages.search.tracks')
                }}</b-form-checkbox>
              </b-col>
            </b-row>
          </b-form-checkbox-group>
        </b-col>
      </b-row>
      <div
        v-if="
          getSearch && getSearch.tracks && getSearch.tracks.items.length !== 0
        "
        class="my-1 bg-dark"
      >
        <div class="h4 my-3">
          <u>{{ $t('pages.search.tracks') }} :</u>
        </div>

        <b-list-group>
          <b-list-group-item
            v-for="item in getSearch.tracks.items"
            :key="item.id"
            class="list p-0"
          >
            <b-row class="m-0 item" align-h="start">
              <b-col cols="3" md="1" class="p-0">
                <img
                  v-if="item.album.images && item.album.images[2]"
                  :src="item.album.images[2].url"
                />
              </b-col>
              <b-col class="my-auto">
                {{ item.name }}
              </b-col>
              <b-col sm="12" md="2" class="button-col my-2">
                <b-button
                  v-if="seeds.tracks.includes(item.id)"
                  variant="outline-light"
                  disabled
                  ><fa-icon :icon="['fas', 'check']" class="when-closed" />
                  {{ $t('pages.recommendations.added') }}</b-button
                >
                <b-button
                  v-else-if="seedLength >= 5"
                  disabled
                  variant="outline-light"
                  ><fa-icon :icon="['fas', 'times']" class="when-closed" />
                  {{ $t('pages.recommendations.tooMuch') }}</b-button
                >
                <b-button
                  v-else
                  variant="outline-light"
                  @click="addTrack(item.id, item)"
                  ><fa-icon :icon="['fas', 'plus']" class="when-closed" />
                  {{ $t('pages.recommendations.add') }}</b-button
                >
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </div>
      <br />
      <div
        v-if="
          getSearch && getSearch.artists && getSearch.artists.items.length !== 0
        "
        class="bg-dark my-1"
      >
        <div class="h4 my-2">
          <u>{{ $t('pages.search.artists') }} :</u>
        </div>
        <b-list-group>
          <b-list-group-item
            v-for="item in getSearch.artists.items"
            :key="item.id"
            class="list p-0"
          >
            <b-row class="m-0 item" align-h="start">
              <b-col cols="2" sm="1" class="m-0 mr-3 p-0" style="height: 64px">
                <img
                  v-if="item.images && item.images[1]"
                  :src="item.images[1].url"
                  width="64px"
                  height="64px"
                  style="object-fit: cover"
                />
              </b-col>
              <b-col class="my-auto">
                <span>{{ item.name }}</span>
              </b-col>
              <b-col sm="12" md="2" class="button-col my-2">
                <b-button
                  v-if="seeds.artists.includes(item.id)"
                  variant="outline-light"
                  disabled
                  ><fa-icon :icon="['fas', 'check']" />
                  {{ $t('pages.recommendations.added') }}</b-button
                >
                <b-button
                  v-else-if="seedLength >= 5"
                  disabled
                  variant="outline-light"
                  ><fa-icon :icon="['fas', 'times']" />
                  {{ $t('pages.recommendations.tooMuch') }}</b-button
                >
                <b-button
                  v-else
                  variant="outline-light"
                  @click="addArtist(item.id, item)"
                  ><fa-icon :icon="['fas', 'plus']" />
                  {{ $t('pages.recommendations.add') }}</b-button
                >
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </div>
      <br />
      <div v-if="items.length !== 0">
        <div class="h4 my-2">
          <u>{{ $t('pages.recommendations.items') }} :</u>
        </div>
        <b-list-group>
          <b-list-group-item
            v-for="item in items"
            :key="item.id"
            class="list p-0"
          >
            <b-row class="m-0 item" align-h="start">
              <b-col cols="3" md="1" class="m-0 p-0">
                <img
                  v-if="
                    (item.images && item.images[1]) ||
                    (item.album.images && item.album.images[2])
                  "
                  :src="
                    item.type === 'artist'
                      ? item.images[1].url
                      : item.album.images[2].url
                  "
                  width="64px"
                />
              </b-col>
              <b-col class="my-auto">
                <span
                  >{{ $t(`pages.recommendations.${item.type}`) }}:
                  <u>{{ item.name }}</u></span
                >
              </b-col>
              <b-col sm="12" md="2" class="button-col my-2">
                <b-button
                  variant="outline-light"
                  @click="removeItem(item.id, item.type, item)"
                  ><fa-icon :icon="['fas', 'times']" />
                  {{ $t('pages.recommendations.del') }}</b-button
                >
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-card>
    <h5>
      <u>{{ $t('pages.recommendations.step2') }} :</u>
    </h5>
    <b-card v-if="getAllGenres" bg-variant="dark" class="my-3">
      <template #header
        ><h3 class="text-center my-auto">
          {{ $t('pages.recommendations.genres') }}
        </h3>
      </template>
      <b-row align-h="left" class="m-3">
        <b-col class="my-auto" cols="auto">
          <h6 class="m-0">
            {{ $t('pages.recommendations.selectGenre') }}
          </h6>
        </b-col>
        <b-col>
          <b-select
            v-model="seeds.genre"
            :disabled="!seeds.genre && seedLength >= 5"
            name="genre"
          >
            <b-select-option :value="null">{{ $t('none') }}</b-select-option>
            <b-select-option
              v-for="genre in getAllGenres.genres"
              :key="genre"
              :value="genre"
              >{{ capitalize(genre.split('-').join(' ')) }}
            </b-select-option>
          </b-select>
        </b-col>
      </b-row>
      <b-row v-if="!seeds.genre && seedLength >= 5" class="m-3">
        <h5>
          <fa-icon :icon="['fas', 'exclamation-triangle']" />
          {{ $t('pages.recommendations.tooMuchGenre') }}
        </h5>
      </b-row>
    </b-card>
    <b-card></b-card>
    <b-button @click="startRecommendations">Try</b-button>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Recommendations',
  middleware: 'auth',
  data: () => ({
    search: null,
    types: ['artist', 'track'],
    seeds: {
      artists: [],
      tracks: [],
      genre: null,
    },
    items: [],
    collapseGenre: false,
  }),
  computed: {
    ...mapGetters('userprofile', ['getUserData']),
    ...mapGetters('search', ['getSearch', 'getQuery']),
    ...mapGetters('player', ['getStatus']),
    ...mapGetters('recommendations', ['getAllGenres']),
    seedLength() {
      return (
        this.seeds.artists.length +
        this.seeds.tracks.length +
        (this.seeds.genre ? 1 : 0)
      )
    },
  },
  mounted() {
    this.search = this.getQuery
    if (!this.getAllGenres) {
      this.requestAllGenres()
    }
  },
  methods: {
    ...mapActions('recommendations', [
      'getTrackRecommendations',
      'requestAllGenres',
    ]),
    ...mapActions('search', ['makeSearch']),
    ...mapActions('player', ['addToQueue', 'skipTrack', 'playTrack']),
    launchSearch() {
      this.makeSearch({
        query: this.search,
        types: this.types,
        options: { limit: 5 },
      })
    },
    addTrack(id, track) {
      if (!this.seeds.tracks.includes(id)) {
        this.seeds.tracks.push(id)
        this.items.push(track)
      }
    },
    addArtist(id, artist) {
      if (!this.seeds.artists.includes(id)) {
        this.seeds.artists.push(id)
        this.items.push(artist)
      }
    },
    capitalize(s) {
      return s[0].toUpperCase() + s.slice(1)
    },
    startRecommendations() {
      this.getTrackRecommendations({
        tracks: this.seeds.tracks,
        artists: this.seeds.artists,
        genres: [this.seeds.genre],
      })
    },
    removeItem(id, type, item) {
      if (type === 'artist') {
        this.seeds.artists = this.seeds.artists.filter((value) => {
          return value !== id
        })
      } else {
        this.seeds.tracks = this.seeds.tracks.filter((value) => {
          return value !== id
        })
      }
      this.items = this.items.filter((value) => {
        return value !== item
      })
    },
  },
}
</script>

<style>
.item {
  border: none;
}

.button-col > * {
  width: 100%;
}

.bg-dark .list-group-item {
  background-color: transparent;
}
</style>
