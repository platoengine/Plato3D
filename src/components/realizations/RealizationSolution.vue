<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-text-field dense class="ml-2 ma-0 pa-0 caption" v-model="solutionStatus" label="Status"/>
      <v-btn text block small @click="compute()" :disabled="pending==false">Compute</v-btn>
    </v-card>
  </v-card>
</template>

<script>

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
      this.$store.dispatch('conductRealizationSimulation', {realizationName: this.parentObject.name})
      this.pending = false
    }
  }
}
</script>
