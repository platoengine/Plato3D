<template>
  <v-dialog v-model="dialog" persistent max-width="300px">
    <template v-slot:activator="{ on }">
      <v-btn small block v-on="on">Close
      </v-btn>
    </template>
    <v-card class="pa-2">
      <v-card-title class="headline">Close Project</v-card-title>
      <v-card-text>Are you sure you want to close this project?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="px-1" small text @click="dialog = false">Cancel</v-btn>
        <v-btn class="px-1" small text @click="saveAndCloseProject()">Save and Close</v-btn>
        <v-btn class="px-1" small text @click="closeProject()">Close Without Saving</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'close-project',
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    closeProject () {
      this.dialog = false
      this.$store.commit('closeUserProject', {graphics: this.$graphics})
    },
    saveAndCloseProject () {
      this.dialog = false
      this.$store.dispatch('updateAndCloseProject', {graphics: this.$graphics})
    }
  }
}
</script>
