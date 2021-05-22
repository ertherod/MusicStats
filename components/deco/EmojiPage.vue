<template>
  <div :style="`font-size: ${size}em;`">
    <fa-icon v-if="stats === 'chill'" :icon="['far', 'smile']" />
    <fa-icon v-else-if="stats === 'happy'" :icon="['far', 'smile-beam']" />
    <fa-icon v-else-if="stats === 'sad'" :icon="['far', 'frown']" />
    <fa-icon v-else-if="stats === 'angry'" :icon="['far', 'angry']" />
  </div>
</template>

<script>
export default {
  name: 'EmojiPage',
  props: {
    stats: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: 5,
    },
  },
}
</script>

<style></style>
