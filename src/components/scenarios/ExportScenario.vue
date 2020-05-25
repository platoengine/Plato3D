<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
      <v-btn small v-on="on">
        <v-icon>mdi-folder-download</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Export</span>
      </v-card-title>
      <v-card-text>
        <v-text-field dense class="ma-0 pa-0" v-model="values.Filename" label="Filename"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text @click="exportModel(); dialog = false">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { saveAs } from 'file-saver'

export default {
  name: 'export-scenario',
  props: ['scenario'],
  data: function () {
    return {
      values: {Filename: ''},
      dialog: false
    }
  },
  methods: {
    exportModel: function () {
      let blob = new Blob([this.scenario.toDOM(this.$store.state.models)], {type: 'text/xml;charset=utf-8'})
      saveAs(blob, this.values.Filename)
      this.dialog = false
    }
  }
}
</script>
