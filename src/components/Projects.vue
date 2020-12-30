<template>
    <v-container>
      <v-card outlined class="mb-4 pa-1">
      <v-row no-gutters><v-col><hr/></v-col></v-row>
      <v-row no-gutters><v-col><h3>Current Project</h3></v-col></v-row>
      <v-row no-gutters v-if="activeProject">
        <v-col>
          <v-row no-gutters>
            <v-col cols="3"><v-row no-gutters justify="end">Name:</v-row></v-col>
            <v-col cols="1"/>
            <v-col cols="6">{{name}}</v-col>
          </v-row>
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
          <v-btn small block @click="updateProject">Save Current Project</v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters v-else>
        <v-col>
          <v-text-field dense v-model="newName" label="Name"/>
          <v-btn small block @click="saveProject">Save as New Project</v-btn>
        </v-col>
      </v-row>
      </v-card>
      <v-card outlined class="mb-2 pa-1">
      <v-row no-gutters><v-col><hr/></v-col></v-row>
      <v-row no-gutters><v-col><h3>Saved Projects</h3></v-col></v-row>
      <v-row no-gutters>
        <v-col>
          <div id="project-content">
            <v-expansion-panels accordion>
              <v-expansion-panel v-for="(project,i) in projects" :key="i" >
                <v-expansion-panel-header>{{project.projectname}}</v-expansion-panel-header>
                <v-expansion-panel-content class="pl-4">
                  <project :project="project"/>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>
      </v-row>
      </v-card>
    </v-container>
</template>

<script>
import Project from './Project'

export default {
  name: 'projects',
  data: function () {
    return {
      newName: ""
    }
  },
  components: {
    Project
  },
  methods: {
    saveProject: function () {
      // todo: verify name isn't empty string and is unique
      this.$store.dispatch('saveProject', {name: this.newName})
    },
    updateProject: function () {
      this.$store.dispatch('updateProject')
    },
    prettyDate: function (uglyDate) {
      const tokens = uglyDate.split('T')
      return `${tokens[0]} ${tokens[1].split('.')[0]}`
    }
  },
  computed: {
    projects: function () {
      return this.$store.state.session.data.projects
    },
    activeProject: function () {
      return this.$store.state.active.project !== null
    },
    created: function () { return this.activeProject ? this.prettyDate(this.$store.state.active.project.DateCreated) : "" },
    modified: function () { return this.activeProject ? this.prettyDate(this.$store.state.active.project.LastModified) : "" },
    name: function () { return this.activeProject ? this.$store.state.active.project.projectname : "" }
  }
}
</script>
<style scoped>
#project-content {
  height:150px;
  overflow-x:hidden;
  overflow-y:auto;
}
</style>
