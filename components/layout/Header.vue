<template>
  <b-navbar toggleable="lg" :type="getTheme" :variant="getTheme" sticky>
    <b-navbar-brand :to="localePath('/')">
      <img id="logo" src="/img/logo.png" />
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
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
        <b-nav-item
          v-if="isConnected"
          :to="localePath('/playlists')"
          :active="$route.path == localePath('/playlists')"
        >
          <fa-icon :icon="['fas', 'list']" />
          {{ $t('header.myplaylists') }}
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
          v-if="getUserData && isConnected"
          :class="getTheme == 'dark' ? 'dropdown-dark' : ''"
          right
        >
          <template #button-content>
            <img
              v-if="getUserData.images && getUserData.images[0]"
              :src="getUserData.images[0].url"
              class="header-profile-pic"
            />
            {{ getUserData.display_name }}
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
    ...mapGetters(['getTheme', 'isConnected', 'getToken', 'getState']),
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
  height: 6vh;
}

.header-profile-pic {
  height: 3vh;
  width: 3vh;
  object-fit: cover;
  border-radius: 2vh;
}
</style>
