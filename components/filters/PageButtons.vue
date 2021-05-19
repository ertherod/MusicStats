<template>
  <b-btn-group v-if="pageList" class="text-center">
    <b-button
      :disabled="pageNumber <= 1 || currentPage === 1"
      class="mx-1"
      href="#top"
      :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
      @click="$emit('change', currentPage - 1)"
      >{{ '&lt;' }}</b-button
    >
    <b-button
      v-for="page in pageList"
      :key="page"
      href="#top"
      class="mx-1"
      :variant="`${getTheme == 'dark' ? 'outline-light' : 'outline-dark'}
        ${currentPage == page ? 'active' : ''}`"
      @click="$emit('change', page)"
      >{{ page }}</b-button
    >
    <b-button
      :disabled="pageNumber <= 1 || currentPage === pageNumber"
      class="mx-1"
      href="#top"
      :variant="getTheme == 'dark' ? 'outline-light' : 'outline-dark'"
      @click="$emit('change', currentPage + 1)"
      >{{ '&gt;' }}</b-button
    >
  </b-btn-group>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageButtons',
  props: {
    currentPage: { type: Number, default: 1 },
    pageNumber: { type: Number, default: 1 },
  },
  data() {
    return {
      pageList: null,
    }
  },
  computed: {
    ...mapGetters(['getTheme']),
  },
  watch: {
    pageNumber() {
      this.updateData()
    },
    currentPage() {
      this.updateData()
    },
  },
  mounted() {
    this.updateData()
  },
  methods: {
    updateData() {
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

<style></style>
