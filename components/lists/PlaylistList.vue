<template>
  <b-card-group
    v-if="filterPlaylists"
    :deck="filterPlaylists.length < 5"
    :columns="filterPlaylists.length > 4"
  >
    <b-card
      v-for="item in filterPlaylists"
      :key="item.id"
      :class="`my-3 playlist-card align-middle ${
        getTheme == 'dark' ? 'bg-dark list-dark' : 'bg-light list-light'
      }`"
    >
      <b-link :to="localePath(`/playlists/${item.id}`)">
        <b-card-img
          :src="item.images[0].url"
          class="playlist-img mb-2"
          top
        ></b-card-img>
      </b-link>
      <b-card-title class="text-center">
        <b-link :to="localePath(`/playlists/${item.id}`)">{{
          item.name
        }}</b-link>
      </b-card-title>
      <b-card-body>
        <ul>
          <li v-if="item.tracks.total > 0">
            {{ item.tracks.total }} {{ $t('pages.myplaylists.tracks') }}
          </li>
          <li v-if="item.collaborative">
            {{ $t('pages.myplaylists.collaborative') }}
          </li>
          <li v-else-if="item.public || item.owner.id === 'spotify'">
            {{ $t('pages.myplaylists.public') }}
          </li>
          <li v-else>
            {{ $t('pages.myplaylists.private') }}
          </li>
        </ul>
      </b-card-body>
      <template #footer>
        {{ $t('pages.myplaylists.by') }}
        <b-link :to="localePath(`/user/${item.owner.id}`)">{{
          item.owner.display_name
        }}</b-link>
      </template>
    </b-card>
  </b-card-group>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PlaylistList',
  props: {
    filterPlaylists: {
      type: Array,
      default: null,
    },
  },
  computed: {
    ...mapGetters(['getTheme']),
  },
}
</script>

<style>
.playlist-img {
  border-radius: 2vh;
  width: 100%;
}

.playlist-card {
  border-radius: 2vh;
}

.list-dark a {
  color: rgb(250, 250, 250);
}

.list-light a {
  color: #2d8fd3;
}
</style>
