<template>
  <v-card color=green>
    <v-card outlined class="ml-2">
      <v-card-text>
        <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="weight" label="Weight"/>
      </v-card-text>
      <delete-objective :optimization="optimization" :objective="objective"/>
    </v-card>
  </v-card>
</template>

<script>
import DeleteObjective from './DeleteObjective'

export default {
  name: 'objective',
  props: ['optimization', 'objective'],
  components: {
    DeleteObjective
  },
  computed: {
    weight: {
      get: function () {
        return this.objective.weight
      },
      set: function (newValue) {
        this.$store.commit('modifyOptimizationObjective', {
          optimization: this.optimization, objective: this.objective, weight: newValue
        })
      }
    }
  }
}
</script>
