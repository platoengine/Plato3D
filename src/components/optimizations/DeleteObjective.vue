<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn block small v-on="on">Delete</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Delete Objective</v-card-title>
      <v-card-text>Are you sure you want to remove this objective?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text @click="deleteObjective()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'delete-objective',
  props: ['optimization', 'objective'],
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    deleteObjective () {
      this.dialog = false
      this.$store.commit('deleteOptimizationObjective', {
        optimization: this.optimization, objective: this.objective
      })
    }
  }
}
</script>
