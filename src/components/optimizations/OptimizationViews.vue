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
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col><v-btn x-small block @click="displayAttributes()">Display</v-btn></v-col>
          <v-col>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small block v-bind="attrs" v-on="on" >
                  Export
                </v-btn>
              </template>
              <v-list class="pa-0">
                <v-list-item style="min-height:20px"><v-btn x-small block @click="exportSTL()">STL</v-btn></v-list-item>
                <v-list-item style="min-height:20px"><v-btn x-small block @click="exportEXO()">EXO</v-btn></v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
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
    exportSTL: function () {
      this.$store.dispatch('getOptimizationFile', {optimizationName: this.optimization.name, remoteFileName: 'design.stl', localFileName: 'design.stl'})
    },
    exportEXO: function () {
      this.$store.dispatch('getOptimizationFile', {optimizationName: this.optimization.name, remoteFileName: 'platomain.exo.1.0', localFileName: 'result.exo'})
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
