<template>
  <div class="container-lg page">
    <b-card bg-variant="dark" class="settings">
      <template #header>
        <span class="h2">
          <fa-icon :icon="['fas', 'wrench']" /> {{ $t('pages.settings.title') }}
        </span>
      </template>
      <b-row align-h="center">
        <b-col md="6" class="text-center">
          <h4>{{ $t('pages.settings.choose_lang') }}</h4>
          <b-button-group size="lg" class="col-12">
            <b-button
              :variant="`outline-light
          ${$i18n.locale == 'en' ? 'active' : ''}`"
              @click="$i18n.setLocale('en')"
            >
              English
            </b-button>
            <b-button
              :variant="`outline-light
          ${$i18n.locale == 'fr' ? 'active' : ''}`"
              @click="$i18n.setLocale('fr')"
            >
              Français
            </b-button>
          </b-button-group>
          <br />
          <br />
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Settings',
}
</script>

<style>
.page {
  padding-top: 2em;
  padding-bottom: 2em;
}

.settings {
  overflow: hidden;
}
</style>
