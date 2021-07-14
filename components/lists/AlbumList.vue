<template>
  <b-row class="my-3">
    <b-col v-for="album in albums" :key="album.id" md="6" class="my-1">
      <b-card class="album" bg-variant="dark">
        <template #header>
          <h5 class="text-center">
            <b-link :to="localePath(`/album/${album.id}`)">{{
              album.name
            }}</b-link>
          </h5></template
        >
        <b-row>
          <b-col cols="3">
            <img
              v-if="album.images && album.images[1]"
              :src="album.images[1].url"
              class="cover"
            />
          </b-col>
          <b-col cols="9">
            <p>
              {{ $t('pages.myplaylists.by') }}
              <span
                v-for="(artist, index) in album.artists"
                :key="artist.id"
                class="mt-0"
              >
                <b-link
                  v-if="index == album.artists.length - 1"
                  :to="localePath(`/artist/${artist.id}`)"
                  ><b>{{ artist.name }}</b></b-link
                >
                <span v-else-if="index == album.artists.length - 2">
                  <b-link :to="localePath(`/artist/${artist.id}`)"
                    ><b>{{ artist.name }}</b></b-link
                  >
                  &
                </span>
                <span v-else>
                  <b-link :to="localePath(`/artist/${artist.id}`)"
                    ><b>{{ artist.name }}</b></b-link
                  >,
                </span> </span
              ><br />
              {{ album.release_date.split('-')[0] }}
            </p>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'AlbumList',
  props: {
    albums: {
      type: Array,
      default: null,
    },
  },
}
</script>

<style scoped>
.cover {
  height: 10vh;
}
.album {
  min-height: 25vh;
}
.card-header {
  min-height: 8vh;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
