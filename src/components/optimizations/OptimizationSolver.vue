<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <solver-option v-for="(entry, index) in Object.keys(options)" :optimization=optimization :name="entry" :key="index" :value="options[entry]"/>
    </v-card>
  </v-card>
</template>

<script>
import SolverOption from './SolverOption'

export default {
  name: 'optimization-solver',
  props: ['optimization'],
  components: {
    SolverOption
  },
  computed: {
    options: function () {
      return this.optimization.solver
    }
  }
}
</script>
