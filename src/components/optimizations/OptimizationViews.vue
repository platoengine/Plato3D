<template>
  <v-card outlined class="ma-0 pa-0">
    <v-card-title class="justify-center ma-0 pa-0 caption">Iteration</v-card-title>
    <v-card :class="'d-flex justify-space-between'">
      <v-btn x-small @click = "toFirst()"> <v-icon small>mdi-arrow-collapse-left</v-icon> </v-btn>
      <v-btn x-small @click = "prev()"> <v-icon small>mdi-arrow-left</v-icon> </v-btn>
      <v-text-field :disabled=true class="centered-input ma-0 pa-0 caption" small v-model="iteration"/>
      <v-btn x-small @click = "next()"> <v-icon small>mdi-arrow-right</v-icon> </v-btn>
      <v-btn x-small @click = "toLast()"> <v-icon small>mdi-arrow-collapse-right</v-icon> </v-btn>
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'optimization-views',
  props: ['optimization'],
  computed: {
    iteration: {
      get: function () {
        return this.optimization.run.activeIteration
      },
      set: function () {
        // no-op
      }
    }
  },
  methods: {
    toFirst: function () {
      this.$store.commit('toFirstOptimizationIteration', {optimizationName: this.optimization.name, graphics: this.$graphics})
    },
    prev: function () {
      this.$store.commit('decrementOptimizationIteration', {optimizationName: this.optimization.name, graphics: this.$graphics})
    },
    next: function () {
      this.$store.commit('incrementOptimizationIteration', {optimizationName: this.optimization.name, graphics: this.$graphics})
    },
    toLast: function () {
      this.$store.commit('toLastOptimizationIteration', {optimizationName: this.optimization.name, graphics: this.$graphics})
    }
  }
}
</script>

<style scoped>
    .centered-input >>> input {
      text-align: center
    }
</style>
