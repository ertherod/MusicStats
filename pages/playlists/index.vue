<template>
  <div class="container-lg pb-5 pt-5">
    <div v-if="getPlaylistList">
      <h2 class="text-center">
        <u>
          {{ $t('pages.myplaylists.title') }}
        </u>
      </h2>
      <h6>
        {{ $t('pages.myplaylists.resultperpage') }}
        <b-form-select
          v-model="filter"
          class="col-md-1 col-3"
          @change="
            currentPage = 1
            updateData()
          "
        >
          <b-form-select-option :value="3">3</b-form-select-option>
          <b-form-select-option :value="6">6</b-form-select-option>
          <b-form-select-option :value="9">9</b-form-select-option>
          <b-form-select-option :value="12">12</b-form-select-option>
          <b-form-select-option :value="15">15</b-form-select-option>
        </b-form-select>
      </h6>
      <br />
      <div class="row justify-content-center">
        <b-btn-group v-if="pageList" class="text-center">
          <b-button
            :disabled="pageNumber <= 1 || currentPage === 1"
            class="mx-1"
            :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
            @click="
              currentPage -= 1
              updateData()
            "
            >{{ '&lt;' }}</b-button
          >
          <b-button
            v-for="page in pageList"
            :key="page"
            class="mx-1"
            :variant="`${getTheme == 'dark' ? 'outline-light' : 'outline-dark'}
        ${currentPage == page ? 'active' : ''}`"
            @click="
              currentPage = page
              updateData()
            "
            >{{ page }}</b-button
          >
          <b-button
            :disabled="pageNumber <= 1 || currentPage === pageNumber"
            class="mx-1"
            :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
            @click="
              currentPage += 1
              updateData()
            "
            >{{ '&gt;' }}</b-button
          >
        </b-btn-group>
      </div>
      <div>
        <b-card-group columns>
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
        <div class="row justify-content-center">
          <b-btn-group v-if="pageList && filter >= 6" class="text-center">
            <b-button
              :disabled="pageNumber <= 1 || currentPage === 1"
              class="mx-1"
              :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
              @click="
                currentPage -= 1
                updateData()
              "
              >{{ '&lt;' }}</b-button
            >
            <b-button
              v-for="page in pageList"
              :key="page"
              class="mx-1"
              :variant="`${
                getTheme == 'dark' ? 'outline-light' : 'outline-dark'
              }
        ${currentPage == page ? 'active' : ''}`"
              @click="
                currentPage = page
                updateData()
              "
              >{{ page }}</b-button
            >
            <b-button
              :disabled="pageNumber <= 1 || currentPage === pageNumber"
              class="mx-1"
              :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
              @click="
                currentPage += 1
                updateData()
              "
              >{{ '&gt;' }}</b-button
            >
          </b-btn-group>
        </div>
      </div>
    </div>
    <div v-else class="text-center pt-2">
      <b-spinner
        class="spinner"
        :variant="getTheme == 'dark' ? 'light' : 'primary'"
      />
      <h2>{{ $t('pages.myplaylists.getting') }}</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MyPlaylists',
  data() {
    return {
      filter: 9,
      firstItem: 0,
      lastItem: 9,
      currentPage: 1,
      pageList: null,
    }
  },
  computed: {
    ...mapGetters('playlists', ['getPlaylistList']),
    ...mapGetters(['getTheme']),
    filterPlaylists() {
      return this.getPlaylistList.items.slice(this.firstItem, this.lastItem)
    },
  },
  async mounted() {
    await this.requestPlaylistList()
    this.updateData()
  },
  methods: {
    ...mapActions('playlists', ['requestPlaylistList', 'requestNextPlaylists']),
    updateData() {
      this.firstItem = this.filter * (this.currentPage - 1)
      this.lastItem = this.filter * this.currentPage
      this.pageNumber = Math.ceil(
        this.getPlaylistList.items.length / this.filter
      )
      if (this.pageNumber > 2) {
        if (this.currentPage === 1) {
          this.pageList = [1, 2, 3]
        } else if (this.currentPage === this.pageNumber) {
          this.pageList = [
            this.currentPage - 2,
            this.currentPage - 1,
            this.currentPage,
          ]
        } else {
          this.pageList = [
            this.currentPage - 1,
            this.currentPage,
            this.currentPage + 1,
          ]
        }
      } else if (this.pageNumber === 2) {
        this.pageList = [1, 2]
      } else {
        this.pageList = null
      }
    },
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

.spinner {
  height: 8vh;
  width: 8vh;
}
</style>
