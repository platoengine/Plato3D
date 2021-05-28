<template>
  <v-card outlined class="ma-2 pa-0">
    <v-card-title class="justify-center ma-0 pa-0 caption">Iteration</v-card-title>
    <v-card :class="'d-flex justify-space-between'">
      <v-btn x-small @click = "toFirst()"> <v-icon small>mdi-arrow-collapse-left</v-icon> </v-btn>
      <v-btn x-small @click = "prev()"> <v-icon small>mdi-arrow-left</v-icon> </v-btn>
      <v-text-field autocomplete="off" :disabled=true class="centered-input ma-0 pa-0 caption" small v-model="iteration"/>
      <v-btn x-small @click = "next()"> <v-icon small>mdi-arrow-right</v-icon> </v-btn>
      <v-btn x-small @click = "toLast()"> <v-icon small>mdi-arrow-collapse-right</v-icon> </v-btn>
    </v-card>
    <v-card>
      <v-btn x-small block @click="displayAttributes()">Display Attributes</v-btn>
      <v-btn x-small block @click="exportSTL()">Export STL</v-btn>
    </v-card>
  </v-card>
</template>

<script>

import { saveAs } from 'file-saver'

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
  mounted () {
    this.$store.commit('addEventListener', {
      aName: 'exportSTL',
      aFunction: function (event) {
        const {data} = event
        const dataObject = JSON.parse(data)
        const fileName = dataObject.fileName
        const stlData = dataObject.data
        let blob = new Blob([stlData], {type: 'application/object'})
        saveAs(blob, fileName)
      }
    })
  },
  methods: {
    exportSTL: function () {
      console.log("export STL")
      this.$store.dispatch('getOptimizationSTL', {optimizationName: this.optimization.name})
    },
    displayAttributes: function () {
      this.$store.commit('setActiveOptimization', {optimizationName: this.optimization.name})
      this.$store.commit('openOptViewDetail')
    },
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
