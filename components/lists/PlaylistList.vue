<template>
  <b-row v-if="filterPlaylists" class="my-3">
    <b-col v-for="item in filterPlaylists" :key="item.id" md="6" class="my-1">
      <b-card class="playlist align-middle" bg-variant="dark">
        <template #header>
          <h4 class="text-center">
            <b-link :to="localePath(`/playlists/${item.id}`)">{{
              item.name
            }}</b-link>
          </h4>
        </template>
        <b-row>
          <b-col cols="3">
            <b-link :to="localePath(`/playlists/${item.id}`)">
              <b-card-img
                v-if="item.images && item.images[0]"
                :src="item.images[0].url"
                class="cover mb-2"
                top
              ></b-card-img>
              <h6 v-else class="text-center my-auto">
                {{ $t('error.no_img') }}
              </h6>
            </b-link>
          </b-col>
          <b-col cols="9">
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
          </b-col>
        </b-row>
        <template #footer>
          {{ $t('pages.myplaylists.by') }}
          {{ item.owner.display_name }}
        </template>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'PlaylistList',
  props: {
    filterPlaylists: {
      type: Array,
      default: null,
    },
  },
}
</script>

<style>
.cover {
  height: 10vh;
  width: 10vh;
  object-fit: cover;
}

.playlist {
  height: 30vh;
}
</style>
