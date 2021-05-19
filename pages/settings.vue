<template>
  <div class="container-lg page">
    <b-card
      :bg-variant="getTheme == 'dark' ? 'dark' : 'light'"
      class="settings"
    >
      <template #header>
        <span class="h2">
          <fa-icon :icon="['fas', 'wrench']" /> {{ $t('pages.settings.title') }}
        </span>
      </template>
      <b-row>
        <b-col md="6">
          <h4>{{ $t('pages.settings.choose_lang') }}</h4>
          <b-button-group size="lg" class="col-12">
            <b-button
              :variant="`${
                getTheme == 'dark' ? 'outline-light' : 'outline-dark'
              }
          ${$i18n.locale == 'en' ? 'active' : ''}`"
              @click="$i18n.setLocale('en')"
            >
              <country-flag country="us" size="normal" class="flag" />
              English
            </b-button>
            <b-button
              :variant="`${
                getTheme == 'dark' ? 'outline-light' : 'outline-dark'
              }
        ${$i18n.locale == 'fr' ? 'active' : ''}`"
              @click="$i18n.setLocale('fr')"
            >
              <country-flag country="fr" size="normal" class="flag" />
              Français
            </b-button>
          </b-button-group>
          <br />
          <br />
        </b-col>
        <b-col md="6">
          <h4>{{ $t('pages.settings.choose_theme') }}</h4>
          <b-button-group size="lg" class="col-12">
            <b-button
              :variant="`${
                getTheme == 'dark' ? 'outline-light' : 'outline-dark'
              }
          ${getTheme == 'light' ? 'active' : ''}`"
              @click="setTheme('light')"
            >
              <fa-icon :icon="['fas', 'sun']" />
              {{ $t('pages.settings.light_theme') }}
            </b-button>
            <b-button
              :variant="`${
                getTheme == 'dark' ? 'outline-light' : 'outline-dark'
              }
          ${getTheme == 'dark' ? 'active' : ''}`"
              @click="setTheme('dark')"
            >
              <fa-icon :icon="['fas', 'moon']" />
              {{ $t('pages.settings.dark_theme') }}
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Settings',
  computed: {
    ...mapGetters(['getTheme']),
  },
  methods: {
    ...mapActions(['setTheme']),
  },
}
</script>

<style>
.page {
  padding-top: 2em;
  padding-bottom: 2em;
}

.settings {
  border-radius: 2vh;
  overflow: hidden;
}
</style>
