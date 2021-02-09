<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-card outlined class="pl-2 pr-2">
        <v-text-field autocomplete="off" label="Filter Radius" dense class="ml-2 ma-0 pa-0 body-2" v-model="filterRadius"/>
        <v-text-field autocomplete="off" label="Initial Value" dense class="ml-2 ma-0 pa-0 body-2" v-model="initialValue"/>
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
        this.$store.commit('setOptimizationKeysValue', {name: this.optimization.name, keys: ['filterRadius'], value: newValue})
      }
    },
    initialValue: {
      get: function () {
        return this.optimization.initialValue
      },
      set: function (newValue) {
        this.$store.commit('setOptimizationKeysValue', {name: this.optimization.name, keys: ['initialValue'], value: newValue})
      }
    },
    applyFilter: {
      get: function () {
        return this.optimization.applyFilter
      },
      set: function (newValue) {
        this.$store.commit('setOptimizationKeysValue', {name: this.optimization.name, keys: ['applyFilter'], value: newValue})
      }
    }
  }
}
</script>
