<template>
  <b-container v-if="getRecentlyPlayed" fluid="lg" class="pt-3 pb-5 mb-5">
    <b-card :bg-variant="getTheme == 'dark' ? 'dark' : 'light'" class="track">
      <template #header>
        <span class="h2"
          ><fa-icon :icon="['far', 'clock']" />
          {{ $t('pages.recent.title') }}</span
        >
      </template>
      <b-row v-if="getAverageFeatures">
        <b-col cols="12" class="text-center">
          <fa-icon
            v-if="averageAnalysis === 'chill'"
            :icon="['far', 'smile']"
            class="emoji"
          />
          <fa-icon
            v-else-if="averageAnalysis === 'happy'"
            :icon="['far', 'smile-beam']"
            class="emoji"
          />
          <fa-icon
            v-else-if="averageAnalysis === 'sad'"
            :icon="['far', 'frown']"
            class="emoji"
          />
          <fa-icon
            v-else-if="averageAnalysis === 'angry'"
            :icon="['far', 'angry']"
            class="emoji"
          />
          <br /><br />
          <h5>
            <b
              ><u>
                {{ $t('pages.recent.analysis') }}
                {{ `${$t(`analysis.${averageAnalysis}`)}s` }}</u
              ></b
            >
          </h5>
        </b-col>
      </b-row>
      <b-row v-if="getAverageFeatures">
        <b-col cols="12">
          <div>
            <br /><br />
            <h6>{{ $t('pages.recent.average_valence') }}</h6>
            <b-progress :max="1" variant="warning" class="my-2">
              <b-progress-bar
                :value="getAverageFeatures.valence"
                :label="`${(getAverageFeatures.valence * 100).toFixed(0)}%`"
              ></b-progress-bar>
            </b-progress>
            <h6>{{ $t('pages.recent.average_energy') }}</h6>
            <b-progress :max="1" variant="danger" class="my-2">
              <b-progress-bar
                :value="getAverageFeatures.energy"
                :label="`${(getAverageFeatures.energy * 100).toFixed(0)}%`"
              ></b-progress-bar>
            </b-progress>
            <h6>{{ $t('pages.recent.danceability') }}</h6>
            <b-progress :max="1" variant="primary" class="my-2">
              <b-progress-bar
                :value="getAverageFeatures.danceability"
                :label="`${(getAverageFeatures.danceability * 100).toFixed(
                  0
                )}%`"
              ></b-progress-bar>
            </b-progress>
            <h6>{{ $t('pages.recent.average_popularity') }}</h6>
            <b-progress :max="100" variant="success" class="my-2">
              <b-progress-bar
                :value="getAverageFeatures.popularity"
                :label="`${getAverageFeatures.popularity}%`"
              ></b-progress-bar>
            </b-progress>
          </div>
        </b-col>
      </b-row>
    </b-card>
    <div id="top"></div>
    <br />

    <h6>
      {{ $t('pages.recent.resultperpage') }}
      <filter-select
        :filter-list="[10, 20, 30, 50]"
        :default-filter="filter"
        @change="changeFilter"
      ></filter-select>
    </h6>

    <br />
    <div class="row justify-content-center">
      <page-buttons
        :current-page="currentPage"
        :page-number="pageNumber"
        @change="buttonChange"
      />
    </div>

    <div v-if="getRecentlyPlayed">
      <song-list :tracks="filterTracks" type="recent"></song-list>
    </div>

    <br />
    <div class="row justify-content-center">
      <page-buttons
        :current-page="currentPage"
        :page-number="pageNumber"
        @change="buttonChange"
      />
    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FilterSelect from '~/components/filters/FilterSelect.vue'
import PageButtons from '~/components/filters/PageButtons.vue'
import SongList from '~/components/SongList.vue'
import { getAnalysis } from '~/utils'

export default {
  name: 'RecentlyPlayed',
  components: { PageButtons, FilterSelect, SongList },
  data() {
    return {
      firstItem: 0,
      lastItem: 10,
      filter: 10,
      currentPage: 1,
      pageList: null,
      pageNumber: 1,
    }
  },
  computed: {
    ...mapGetters('recently_played', [
      'getRecentlyPlayed',
      'getAverageFeatures',
    ]),
    ...mapGetters(['getTheme']),
    filterTracks() {
      return this.getRecentlyPlayed.slice(this.firstItem, this.lastItem)
    },
    averageAnalysis() {
      return this.requestAnalysis(
        this.getAverageFeatures.valence,
        this.getAverageFeatures.energy
      )
    },
  },
  async mounted() {
    await this.requestRecentlyPlayed()
    this.requestAverageFeatures()
    this.updateData()
  },
  methods: {
    ...mapActions('recently_played', [
      'requestRecentlyPlayed',
      'requestAverageFeatures',
    ]),
    updateData() {
      this.firstItem = this.filter * (this.currentPage - 1)
      this.lastItem = this.filter * this.currentPage
      this.pageNumber = Math.ceil(this.getRecentlyPlayed.length / this.filter)
    },
    buttonChange(page) {
      this.currentPage = page
      this.updateData()
    },
    changeFilter(filter) {
      this.filter = filter
      this.currentPage = 1
      this.updateData()
    },
    requestAnalysis: getAnalysis,
  },
}
</script>

<style>
.emoji {
  font-size: 12em;
}
</style>
