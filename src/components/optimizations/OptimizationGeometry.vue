<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-card outlined class="pl-2 pr-2">
        <v-text-field label="Filter Radius" dense class="ml-2 ma-0 pa-0 body-2" v-model="filterRadius"/>
<!--
        <v-checkbox label="Apply Filter" dense class="ml-2 ma-0 pa-0 body-2" v-model="applyFilter"/>
-->
      </v-card>
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'optimization-geometry',
  props: ['optimization'],
  computed: {
    filterRadius: {
      get: function () {
        return this.optimization.filterRadius
      },
      set: function (newValue) {
        this.$store.commit('setOptimizationFilterRadius', {optimizationName: this.optimization.name, filterRadius: newValue})
      }
    },
    applyFilter: {
      get: function () {
        return this.optimization.applyFilter
      },
      set: function (newValue) {
        this.$store.commit('setOptimizationApplyFilter', {optimizationName: this.optimization.name, applyFilter: newValue})
      }
    }
  }
}
</script>
