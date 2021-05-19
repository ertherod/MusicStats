<template>
  <b-form-select
    v-model="filters"
    class="col-md-1 col-3"
    @change="$emit('change', filters)"
  >
    <b-form-select-option
      v-for="filter in filterList"
      :key="filter"
      :value="filter"
      >{{ filter }}</b-form-select-option
    >
  </b-form-select>
</template>

<script>
export default {
  name: 'FilterSelect',
  props: {
    filterList: {
      type: Array,
      default: new Array([20]),
    },
    defaultFilter: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      filters: null,
    }
  },
  mounted() {
    this.filters = this.defaultFilter
  },
}
</script>

<style></style>
