<template>
  <v-card>
      <v-row no-gutters>
        <v-col v-if="hasThumbnail">
          <v-img max-height="80" max-width="80" :src="thumbnail"/>
        </v-col>
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
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="px-1"> <v-btn small block @click="loadProject">Load</v-btn> </v-col>
        <v-col class="px-1"> <delete-project :project="project" @close="this.$emit('closeAll')"/> </v-col>
        <v-col class="px-1"> <v-btn small block @click="archiveProject">Archive</v-btn> </v-col>
      </v-row>
  </v-card>
</template>

<script>
import DeleteProject from './DeleteProject'

export default {
  name: 'project',
  props: ['project'],
  components: {
    DeleteProject
  },
  methods: {
    archiveProject: function () {
      console.log("todo")
      this.$emit('closeAll')
    },
    loadProject: function () {
      this.$store.dispatch('loadProject', {project: this.project, graphics: this.$graphics})
      this.$emit('close-all')
    },
    prettyDate: function (uglyDate) {
      const tokens = uglyDate.split('T')
      return `${tokens[0]} ${tokens[1].split('.')[0]}`
    }
  },
  computed: {
    created: function () { return this.prettyDate(this.project.DateCreated)},
    modified: function () { return this.prettyDate(this.project.LastModified)},
    hasThumbnail: function () {
      return 'thumbnail' in this.project.projectdata
    },
    thumbnail: function () {
      return this.project.projectdata.thumbnail
    }
  }
}
</script>
