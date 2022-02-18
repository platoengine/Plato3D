<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small v-on="on">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Delete Optimization</v-card-title>
      <v-card-text>Are you sure you want to remove this optimization?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text @click="deleteOptimization()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'delete-optimization',
  props: ['optimization'],
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    deleteOptimization () {
      this.dialog = false
      this.$store.commit('deleteOptimization', {
        name: this.optimization.name,
        graphics: this.$graphics
      })
    }
  }
}
</script>
