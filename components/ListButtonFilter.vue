<template>
  <div v-if="objectlist" class="list">
    <div id="top"></div>

    <h6>
      {{ $t(texts.resultperpage) }}
      <FilterSelect
        :filter-list="filters.list"
        :default-filter="filters.filter"
        @change="changeFilter"
      />
    </h6>
    <br />
    <div class="row justify-content-center">
      <PageButtons
        :current-page="currentPage"
        :page-number="pageNumber"
        @change="buttonChange"
      />
    </div>

    <PlaylistList
      v-if="type === 'playlist_list'"
      :filter-playlists="filterItems"
    />

    <SongList
      v-if="type === 'recent' || type === 'playlist_tracks' || type === 'album'"
      :tracks="filterItems"
      :type="type"
    />

    <div class="row justify-content-center">
      <PageButtons
        :current-page="currentPage"
        :page-number="pageNumber"
        @change="buttonChange"
      />
    </div>
  </div>
</template>

<script>
import FilterSelect from './filters/FilterSelect.vue'
import PlaylistList from './lists/PlaylistList.vue'
import PageButtons from './filters/PageButtons.vue'
import SongList from './lists/SongList.vue'

export default {
  name: 'ListButtonFilter',
  components: { FilterSelect, PlaylistList, PageButtons, SongList },
  props: {
    type: {
      type: String,
      default: null,
    },
    filters: {
      type: Object,
      default: () => ({
        list: null,
        filter: null,
      }),
    },
    objectlist: {
      type: Array,
      default: null,
    },
    texts: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      firstItem: null,
      lastItem: null,
      filter: this.filters.filter,
      currentPage: 1,
      pageNumber: null,
    }
  },
  computed: {
    filterItems() {
      return this.objectlist.slice(this.firstItem, this.lastItem)
    },
  },
  mounted() {
    if (this.objectlist) {
      this.updateData()
    }
  },
  methods: {
    updateData() {
      this.firstItem = this.filter * (this.currentPage - 1)
      this.lastItem = this.filter * this.currentPage
      this.pageNumber = Math.ceil(this.objectlist.length / this.filter)
    },
    buttonChange(page) {
      this.currentPage = page
      this.updateData()
    },
    changeFilter(filter) {
      this.filter = filter
      this.currentPage = 1
      this.updateData()
    },
  },
}
</script>

<style></style>
