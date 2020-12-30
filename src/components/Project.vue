<template>
  <v-card>
      <v-row no-gutters>
        <v-col>
          <v-row no-gutters>
            <v-col cols="3"><v-row no-gutters justify="end">Created:</v-row></v-col>
            <v-col cols="1"/>
            <v-col cols="6">{{created}}</v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="3"><v-row no-gutters justify="end">Modified:</v-row></v-col>
            <v-col cols="1"/>
            <v-col cols="6">{{modified}}</v-col>
          </v-row>
          <v-btn small block @click="deleteProject">Delete Project</v-btn>
        </v-col>
      </v-row>

  </v-card>
</template>

<script>
export default {
  name: 'project',
  props: ['project'],
  methods: {
    deleteProject: function () {
      this.$store.dispatch('deleteProject', {projectID: this.project._id})
    },
    prettyDate: function (uglyDate) {
      const tokens = uglyDate.split('T')
      return `${tokens[0]} ${tokens[1].split('.')[0]}`
    }
  },
  computed: {
    created: function () { return this.prettyDate(this.project.DateCreated)},
    modified: function () { return this.prettyDate(this.project.LastModified)},
  }
}
</script>
