<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-text-field dense class="ml-2 ma-0 pa-0 caption" v-model="solutionStatus" label="Status" disabled/>
      <v-btn text block small @click="compute()" :disabled="pending==false">Compute</v-btn>
    </v-card>
  </v-card>
</template>

<script>
import {validateScenario} from '../scenarios/scenario-validation'
export default {
  name: 'realization-solution',
  props: ['parentObject'],
  data: function () {
    return { pending: true }
  },
  computed: {
    solutionStatus: {
      get: function () {
        return this.parentObject.simulation.computeStatus
      },
      set: function () {
        // This property is never set.  The setter is defined to prevent errors in the console.
      }
    }

  },
  methods: {
    compute: function () {
      const errors = validateScenario(this.parentObject.scenario)
      if(errors.length > 0){
        alert(JSON.stringify(errors))
      } else {
        this.$store.dispatch('conductRealizationSimulation', {realizationName: this.parentObject.name})
        this.pending = false
      }
    }
  }
}
</script>
