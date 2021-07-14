<template>
  <div class="text-center my-5" style="min-height: 60vh">
    <b-spinner
      class="spinner"
      variant="light"
      style="height: 8vh; width: 8vh"
    />
    <h2 v-if="!text">{{ $t('pages.myplaylists.getting') }}</h2>
    <h2 v-else>{{ $t(text) }}</h2>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: { text: { type: String, default: null } },
}
</script>
