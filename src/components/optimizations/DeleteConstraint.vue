<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn block small v-on="on">Delete</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Delete Constraint</v-card-title>
      <v-card-text>Are you sure you want to remove this constraint?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text @click="deleteConstraint()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'delete-constraint',
  props: ['optimization', 'constraint'],
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    deleteConstraint () {
      this.dialog = false
      this.$store.commit('deleteOptimizationConstraint', {
        optimization: this.optimization, constraint: this.constraint
      })
    }
  }
}
</script>
