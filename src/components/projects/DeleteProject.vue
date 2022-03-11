<template>
  <v-dialog v-model="dialog" persistent max-width="300px">
    <template v-slot:activator="{ on }">
      <v-btn small block v-on="on">Delete</v-btn>
    </template>
    <v-card class="pa-2">
      <v-card-title class="headline">Delete Project</v-card-title>
      <v-card-text>Are you sure you want to delete this project?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="px-1" small text @click="dialog = false">Cancel</v-btn>
        <v-btn class="px-1" small text @click="deleteProject()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'delete-project',
  props: ['project'],
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    deleteProject () {
      this.dialog = false
      this.$store.dispatch('deleteProject', {projectName: this.project.projectname})
      this.$emit('close')
    }
  }
}
</script>
