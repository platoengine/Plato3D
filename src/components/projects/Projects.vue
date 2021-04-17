<template>
    <v-container>
      <v-card outlined class="mb-4 pa-1">
      <v-row no-gutters><v-col><hr/></v-col></v-row>
      <v-row no-gutters v-if="activeProject"><v-col><h3>Current Project</h3></v-col></v-row>
      <v-row no-gutters v-else><v-col><h3>Current Project (Not Saved)</h3></v-col></v-row>
      <v-row no-gutters v-if="activeProject">
        <v-row no-gutters>
          <v-col v-if="hasThumbnail">
            <v-img max-height="80" max-width="80" :src="activeThumbnail"/>
          </v-col>
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
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="pa-1"><v-btn small block @click="updateProject">Save</v-btn></v-col>
          <v-col class="pa-1"><close-project/></v-col>
        </v-row>
      </v-row>
      <v-row no-gutters v-else>
        <v-col>
          <v-text-field autocomplete="off" dense v-model="newName" label="Name"/>
          <v-btn small block :disabled="newName==='' || !isUnique" @click="saveProject">{{saveButtonLabel}}</v-btn>
        </v-col>
      </v-row>
      </v-card>
      <v-card outlined class="mb-2 pa-1">
      <v-row no-gutters><v-col><hr/></v-col></v-row>
      <v-row no-gutters><v-col><h3>Saved Projects</h3></v-col></v-row>
      <v-row no-gutters>
        <v-col>
          <div id="project-content">
            <v-expansion-panels v-model="panels" accordion focusable>
              <v-expansion-panel v-for="(project,i) in projects" :key="i" >
                <v-expansion-panel-header>{{project.projectname}}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <project @close-all="closeAll" :project="project"/>
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
import CloseProject from './CloseProject'

export default {
  name: 'projects',
  data: function () {
    return {
      newName: "",
      panels: []
    }
  },
  components: {
    CloseProject,
    Project
  },
  methods: {
    closeAll: function () {
      this.panels = []
    },
    saveProject: function () {
      this.$store.dispatch('saveProject', {name: this.newName, graphics: this.$graphics})
      this.newName = ''
    },
    updateProject: function () {
      const screenshot = this.$graphics.renderer.domElement.toDataURL( 'image/png' );
      this.$store.dispatch('updateProject', {thumbnail: screenshot})
    },
    closeProject: function () {
      this.$store.commit('closeUserProject')
    },
    prettyDate: function (uglyDate) {
      const tokens = uglyDate.split('T')
      return `${tokens[0]} ${tokens[1].split('.')[0]}`
    }
  },
  computed: {
    isUnique: function () {
      let projectIndex = this.$store.state.session.data.projects.findIndex((p) => p.projectname === this.newName)
      if (projectIndex === -1) {
        return true
      } else {
        return false
      }
    },
    saveButtonLabel: function () {
      if (this.isUnique) {
        return 'Save as New Project'
      } else {
        return '(Project exists.  Try another name.)'
      }
    },
    projects: function () {
      return this.$store.state.session.data.projects
    },
    activeProject: function () {
      return this.$store.state.active.project !== null
    },
    hasThumbnail: function () {
      if (this.activeProject) {
        return 'thumbnail' in this.$store.state.active.project.projectdata
      } else {
        return false
      }
    },
    activeThumbnail: function () {
      return this.$store.state.active.project.projectdata.thumbnail
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
