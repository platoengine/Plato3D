<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-select label="Optimizer" dense class="ml-2 ma-0 pa-0" v-model="selectedOptimizer" :items="getOptimizers()"/>
      <optimizer-option v-for="(entry, index) in Object.keys(options)" :optimization=optimization :name="entry" :key="index" :value="options[entry]"/>
    </v-card>
  </v-card>
</template>

<script>
import OptimizerOption from './OptimizerOption'

export default {
  name: 'optimization-optimizer',
  props: ['optimization'],
  components: {
    OptimizerOption
  },
  computed: {
    selectedOptimizer: {
      get: function () {return this.optimization.optimizer.selected},
      set: function (newVal) {
        this.$store.commit('setOptimizationOptimizerPackage', {optimization: this.optimization, packageName: newVal})
      }
    },
    options: function () {
      return this.optimization.optimizer.packages[this.selectedOptimizer]
    }
  },
  methods: {
    getOptimizers: function () {
      return Object.keys(this.optimization.optimizer.packages)
    }
  }
}
</script>
