<template>
  <v-dialog v-model="dialog" persistent max-width="300px">
    <template v-slot:activator="{ on }">
      <v-btn class="px-1" min-width=30px small v-on="on">
        <v-icon>mdi-content-duplicate</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Duplicate Optimization</v-card-title>
      <v-card-text>Duplicate this optmization?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text @click="duplicateOptimization()">Duplicate</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'duplicate-optimization',
  props: ['optimization'],
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    duplicateOptimization () {
      this.dialog = false
      this.$store.commit('duplicateOptimization', {
        name: this.optimization.name
      })
    }
  }
}
</script>
