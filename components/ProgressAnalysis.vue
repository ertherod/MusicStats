<template>
  <div>
    <div v-if="analysis.valence">
      <h6>{{ $t('analysis.valence') }}</h6>
      <b-progress :max="1" variant="warning" class="my-2">
        <b-progress-bar
          :value="analysis.valence"
          :label="`${(analysis.valence * 100).toFixed(0)}%`"
        ></b-progress-bar>
      </b-progress>
    </div>
    <div v-if="analysis.energy">
      <h6>{{ $t('analysis.energy') }}</h6>
      <b-progress :max="1" variant="danger" class="my-2">
        <b-progress-bar
          :value="analysis.energy"
          :label="`${(analysis.energy * 100).toFixed(0)}%`"
        ></b-progress-bar>
      </b-progress>
    </div>
    <div v-if="analysis.danceability">
      <h6>{{ $t('analysis.danceability') }}</h6>
      <b-progress :max="1" variant="primary" class="my-2">
        <b-progress-bar
          :value="analysis.danceability"
          :label="`${(analysis.danceability * 100).toFixed(0)}%`"
        ></b-progress-bar>
      </b-progress>
    </div>
    <div v-if="analysis.popularity == 0 || analysis.popularity">
      <h6>{{ $t('analysis.popularity') }}</h6>
      <b-progress :max="100" variant="success" class="my-2">
        <b-progress-bar
          :value="analysis.popularity"
          :label="`${analysis.popularity}%`"
        ></b-progress-bar>
      </b-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressAnalysis',
  props: {
    analysis: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style></style>
