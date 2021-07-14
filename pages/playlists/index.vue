<template>
  <div class="container-lg pb-5 pt-5">
    <div v-if="getPlaylistList">
      <h2 class="text-center">
        <u>
          {{ $t('pages.myplaylists.title') }}
        </u>
      </h2>
      <br />

      <ListButtonFilter
        type="playlist_list"
        :filters="{ list: [4, 6, 12], filter: 12 }"
        :objectlist="getPlaylistList.items"
        :texts="{ resultperpage: 'pages.myplaylists.resultperpage' }"
      />
    </div>
    <div v-else class="text-center pt-2">
      <Loading />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListButtonFilter from '~/components/ListButtonFilter.vue'
import Loading from '~/components/Loading.vue'

export default {
  name: 'MyPlaylists',
  components: { ListButtonFilter, Loading },
  middleware: 'auth',
  computed: {
    ...mapGetters('playlists', ['getPlaylistList']),
  },
  mounted() {
    this.requestPlaylistList()
  },
  methods: {
    ...mapActions('playlists', ['requestPlaylistList', 'requestNextPlaylists']),
  },
}
</script>

<style></style>
