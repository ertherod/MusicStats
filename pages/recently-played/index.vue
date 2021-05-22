<template>
  <b-container v-if="getRecentlyPlayed" fluid="lg" class="pt-3 pb-5 mb-5">
    <div v-if="ready">
      <b-card :bg-variant="getTheme == 'dark' ? 'dark' : 'light'" class="track">
        <template #header>
          <b-row align-h="between" class="mx-2">
            <span class="h2"
              ><fa-icon :icon="['far', 'clock']" />
              {{ $t('pages.recent.title') }}</span
            >
            <b-button
              :variant="`${
                getTheme == 'dark' ? 'outline-light' : 'outline-dark'
              }`"
              @click="requestRecentlyPlayed()"
              ><fa-icon :icon="['fas', 'sync']" />
              {{ $t('pages.recent.refresh') }}</b-button
            >
          </b-row>
        </template>
        <b-row>
          <b-col cols="12" class="text-center">
            <EmojiPage :size="12" :stats="averageAnalysis" />
            <h5>
              <b
                ><u>
                  {{ $t('pages.recent.analysis') }}
                  {{
                    `${$t(`analysis.${averageAnalysis}`)}${
                      $i18n.locale === 'fr' ? 's' : ''
                    }`
                  }}</u
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
    ...mapGetters(['getTheme']),
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
