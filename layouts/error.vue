<template>
  <div class="container-lg text-center pt-5 pb-5">
    <div v-if="error.statusCode === 404">
      <h3><fa-icon :icon="['far', 'dizzy']" /> {{ $t('error.404') }}</h3>
      <p>{{ $t('error.nopage') }}</p>
    </div>

    <div v-else>
      <h3><fa-icon :icon="['far', 'dizzy']" /> {{ $t('error.occured') }}</h3>
    </div>
    <div v-if="error.statusCode && error.message">
      <b-button
        v-b-toggle="'error_details'"
        variant="outline-light"
        class="my-2"
      >
        {{ $t('error.details') }}
        <fa-icon :icon="['fas', 'chevron-up']" class="when-open" />
        <fa-icon :icon="['fas', 'chevron-down']" class="when-closed" />
      </b-button>

      <b-collapse id="error_details" class="text-center">
        <p class="error-details p-4 m-3">
          Error {{ error.statusCode }} : {{ error.message }}
        </p>
      </b-collapse>
    </div>
    <b-button-group>
      <b-button :to="localePath('/')" variant="outline-light"
        ><fa-icon :icon="['fas', 'home']" /> {{ $t('error.return_home') }}
      </b-button>
      <b-button variant="outline-light" @click="reloadPage">
        {{ $t('error.reload') }}
        <fa-icon :icon="['fas', 'sync']"
      /></b-button>
    </b-button-group>
  </div>
</template>

<script>
export default {
  layout: 'default',
  // eslint-disable-next-line vue/require-prop-types
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  methods: {
    reloadPage() {
      window.location.reload()
    },
  },
}
</script>

<style>
.error-details {
  font-family: 'Courier New', Courier, monospace;
  background-color: black;
  color: white;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
