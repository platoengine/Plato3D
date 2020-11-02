<template>
  <v-card color=green>
    <v-card outlined class="ml-2">
      <v-card-text>
        <v-text-field dense class="ma-0 pa-0" v-model="target" label="Target Value"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn block text @click="modify()">Modify</v-btn>
      </v-card-actions>
      <delete-constraint :optimization="optimization" :constraint="constraint"/>
    </v-card>
  </v-card>
</template>

<script>
import DeleteConstraint from './DeleteConstraint'

export default {
  name: 'constraint',
  props: ['optimization', 'constraint'],
  components: {
    DeleteConstraint
  },
  data: function () {
    return {
      state: {target: 0.0},
      pending: false
    }
  },
  computed: {
    target: {
      get: function () {
        return this.constraint.target
      },
      set: function (newValue) {
        this.state.target = newValue
        this.pending = true
      }
    }
  },
  methods: {
    modify: function () {
      this.pending = false
      this.$store.commit('modifyOptimizationConstraint', {
        optimization: this.optimization, constraint: this.constraint, target: this.state.target
      })
    }
  }
}
</script>
