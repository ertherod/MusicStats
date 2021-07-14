<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" sticky>
    <b-navbar-brand :to="localePath('/')" class="my-auto">
      <img id="logo" src="/img/logo.png" />

      <span class="h4 align-middle my-auto"
        >MUSIC<span class="blue-title">STATS</span></span
      >
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" class="my-auto"
      ><fa-icon :icon="['fas', 'bars']" class="closed" />
      <fa-icon :icon="['fas', 'times']" class="opened" />
    </b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item
          :to="localePath('/')"
          :active="$route.path == localePath('/')"
        >
          <fa-icon :icon="['fas', 'home']" />
          {{ $t('header.home') }}
        </b-nav-item>
        <b-nav-item
          v-if="!isConnected"
          :to="localePath('/login')"
          :active="$route.path == localePath('/login')"
        >
          <fa-icon :icon="['fas', 'lock']" />
          {{ $t('header.login') }}
        </b-nav-item>
        <b-nav-item-dropdown
          v-if="isConnected"
          class="dropdown-dark my-auto"
          left
        >
          <template #button-content>
            <fa-icon :icon="['fas', 'chart-bar']" /><span class="my-auto">
              Tops</span
            >
          </template>
          <b-dropdown-item :to="localePath('/tops/artists')"
            ><fa-icon :icon="['fas', 'user']" />
            {{ $t('header.top_artists') }}</b-dropdown-item
          >
          <b-dropdown-item :to="localePath('/tops/tracks')">
            <fa-icon :icon="['fas', 'list']" />
            {{ $t('header.top_tracks') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          v-if="isConnected"
          :to="localePath('/recently-played')"
          :active="$route.path == localePath('/recently-played')"
        >
          <fa-icon :icon="['far', 'clock']" />
          {{ $t('header.recently_played') }}
        </b-nav-item>
        <b-nav-item
          v-if="!isConnected"
          :to="localePath('/settings')"
          :active="$route.path == localePath('/settings')"
        >
          <fa-icon :icon="['fas', 'wrench']" />
          {{ $t('header.settings') }}
        </b-nav-item>
        <b-nav-item-dropdown
          v-if="isConnected"
          class="dropdown-dark my-auto"
          left
        >
          <template #button-content>
            <fa-icon :icon="['fas', 'list']" /><span class="my-auto">
              {{ $t('header.playlists') }}</span
            >
          </template>
          <b-dropdown-item :to="localePath('/playlists')"
            ><fa-icon :icon="['fas', 'list']" />
            {{ $t('header.myplaylists') }}</b-dropdown-item
          >
          <b-dropdown-item :to="localePath('/recommendations')">
            <fa-icon :icon="['fas', 'chart-line']" />
            {{ $t('header.recommendations') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          v-if="isConnected"
          :to="localePath('/search')"
          :active="$route.path == localePath('/search')"
        >
          <fa-icon :icon="['fas', 'search']" />
          {{ $t('header.search') }}
        </b-nav-item>
        <b-nav-item-dropdown
          v-if="getUserData && isConnected"
          class="dropdown-dark my-auto"
          right
        >
          <template #button-content>
            <span class="my-auto">{{ getUserData.display_name }}</span>
          </template>
          <b-dropdown-item :to="localePath('/profile')"
            ><fa-icon :icon="['fas', 'user']" />
            {{ $t('header.profile_page') }}</b-dropdown-item
          >
          <b-dropdown-item :to="localePath('/settings')">
            <fa-icon :icon="['fas', 'wrench']" />
            {{ $t('header.settings') }}
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item
            @click="
              disconnect()
              $router.push(localePath('/'))
            "
            ><fa-icon :icon="['fas', 'sign-out-alt']" />
            {{ $t('header.logout') }}</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Header',
  computed: {
    ...mapGetters(['isConnected', 'getToken', 'getState']),
    ...mapGetters('userprofile', ['getUserData']),
  },
  mounted() {
    if (!!this.getToken && !this.isConnected) {
      this.tryConnect()
    }
  },
  methods: {
    ...mapActions(['setTheme', 'disconnect', 'tryConnect']),
  },
}
</script>

<style>
#logo {
  height: 3vh;
}

.nav-item {
  margin-bottom: auto;
  margin-top: auto;
}
.blue-title {
  color: #2e8fe4;
}

.collapsed > .opened,
.not-collapsed > .closed {
  display: none;
}
</style>
