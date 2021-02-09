<template>
  <v-card color=green>
    <v-card outlined class="ml-2">
      <v-card-text>
        <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="weight" label="Weight"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn block text @click="modify()">Modify</v-btn>
      </v-card-actions>
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
  data: function () {
    return {
      state: {weight: 0.0},
      pending: false
    }
  },
  computed: {
    weight: {
      get: function () {
        return this.objective.weight
      },
      set: function (newValue) {
        this.state.weight = newValue
        this.pending = true
      }
    }
  },
  methods: {
    modify: function () {
      this.pending = false
      this.$store.commit('modifyOptimizationObjective', {
        optimization: this.optimization, objective: this.objective, weight: this.state.weight
      })
    }
  }
}
</script>
