<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small v-on="on" @click = "disableErrModalIfSet()">
        <v-icon>mdi-folder-download</v-icon> 
      </v-btn>
    </template>
    <div v-if= "displayErrors">
      <v-card>
        <Error v-bind:errors = "errors"/>
      </v-card>
    </div>
    <div v-if= "dialog">
      <v-card>
        <v-card-title>
          <span class="headline">Export</span>
        </v-card-title>
        <v-card-text>
          <v-text-field dense class="ma-0 pa-0" v-model="values.Basename" label="Basename"/>
          <v-checkbox dense class="ma-0 pa-0" v-model="values.includeMeshFile" label="Include mesh file"/>
        </v-card-text>
      </v-card>
    </div>
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn   text @click="dialog = false">Cancel</v-btn>
        <v-btn  class="pa-4" text @click="exportOptimization();" ref="saveToggle">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.action {
  padding : 10px;
}
 </style>
<script>
import Error from '../Error'
import { saveAs } from 'file-saver'
import JSZip from 'jszip';
// TODO import {validateOptimization} from './optimization-validation'

export default {
  name: 'export-optimization',
  components:{Error},
  props: ['optimization'],
  data: function () {
    return {
      values: {Basename: '', includeMeshFile: true},
      dialog: false,
      errors: [],
      displayErrors: false,
      enableSaveWithErrors : false
    }
  },
  methods: {
    disableErrModalIfSet: function() {
      if(this.displayErrors === true) {
        this.displayErrors = false
        this.enableSaveWithErrors = false
      }
    },
    validation: function () {
      // TODO this.errors = validateOptimization(this.optimization)
      // TODO return this.errors
      return []
    },
    exportOptimization: function () {
      if(this.validation().length === 0 || this.enableSaveWithErrors === true){
        let {files, meshes} = this.optimization.toDOM(this.$store.state)

        let zip = new JSZip();
        Object.keys(files).forEach((key) => {
          zip.file(`${this.values.Basename}/${key}`, files[key])
        }, this)

        if (this.values.includeMeshFile) {
          meshes.forEach((mesh) => {
            zip.file(`${this.values.Basename}/${mesh.fileName}`, mesh.file, {base64: true})
          })
        }
        let fileName = `${this.values.Basename}.zip`
        zip.generateAsync({type: "blob"}).then(function(content) {
          saveAs(content, fileName)
        });

        this.dialog = false
      } else {
        this.displayErrors = true
        this.dialog = true   
        this.enableSaveWithErrors = true
      }
    }
  }
}
</script>
