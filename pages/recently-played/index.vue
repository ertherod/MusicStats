<template>
  <b-container v-if="getRecentlyPlayed" fluid="lg" class="pt-3 pb-5 mb-5">
    <div v-if="ready">
      <b-card bg-variant="dark" class="track">
        <template #header>
          <b-row align-h="center" class="mx-2">
            <span class="h3"
              ><fa-icon :icon="['far', 'clock']" />
              {{ $t('pages.recent.title') }}</span
            >
          </b-row>
        </template>
        <b-row>
          <b-col cols="12" class="text-center">
            <EmojiPage :size="5" :stats="averageAnalysis" />
            <h5>
              <b
                ><u>
                  {{ $t('pages.recent.analysis') }}
                  {{ $t(`pages.recent.${averageAnalysis}`) }}</u
                ></b
              >
            </h5>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12">
            <ProgressAnalysis :analysis="getAverageFeatures" />
          </b-col>
        </b-row>
        <template #footer>
          <b-row align-h="center" class="mx-1">
            <b-button variant="outline-light" @click="requestRecentlyPlayed()"
              ><fa-icon :icon="['fas', 'sync']" />
              {{ $t('pages.recent.refresh') }}</b-button
            >
          </b-row>
        </template>
      </b-card>
      <div id="top"></div>
      <br />
      <ListButtonFilter
        type="recent"
        :filters="{ list: [5, 10, 20, 30], filter: 10 }"
        :objectlist="getRecentlyPlayed"
        :texts="{ resultperpage: 'pages.recent.resultperpage' }"
      />
    </div>
    <div v-else class="text-center pt-2">
      <Loading />
    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EmojiPage from '~/components/deco/EmojiPage.vue'
import ListButtonFilter from '~/components/ListButtonFilter.vue'
import ProgressAnalysis from '~/components/ProgressAnalysis.vue'
import { getAnalysis } from '~/utils'

export default {
  name: 'RecentlyPlayed',
  components: { ListButtonFilter, EmojiPage, ProgressAnalysis },
  middleware: 'auth',
  data() {
    return {
      ready: false,
    }
  },
  computed: {
    ...mapGetters('recently_played', [
      'getRecentlyPlayed',
      'getAverageFeatures',
    ]),
    averageAnalysis() {
      return this.requestAnalysis(
        this.getAverageFeatures.valence,
        this.getAverageFeatures.energy
      )
    },
  },

  async mounted() {
    await this.requestRecentlyPlayed()
    this.ready = true
  },
  methods: {
    ...mapActions('recently_played', [
      'requestRecentlyPlayed',
      'requestAverageFeatures',
    ]),
    requestAnalysis: getAnalysis,
  },
}
</script>

<style></style>
