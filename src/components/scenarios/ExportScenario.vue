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
          <v-text-field dense class="ma-0 pa-0" v-model="values.Filename" label="Filename"/>
        </v-card-text>
      </v-card>
    </div>
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn   text @click="dialog = false">Cancel</v-btn>
        <v-btn  class="pa-4" text @click="exportModel();" ref="saveToggle">Save</v-btn>
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
import {validateScenario} from './scenario-validation'

export default {
  name: 'export-scenario',
  components:{Error},
  props: ['scenario'],
  data: function () {
    return {
      values: {Filename: ''},
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
      this.errors = validateScenario(this.scenario)
      return this.errors
    },
    exportModel: function () {
      if(this.validation().length === 0 || this.enableSaveWithErrors === true){
        let blob = new Blob([this.scenario.toDOM(this.$store.state.models)], {type: 'text/xml;charset=utf-8'})
        saveAs(blob, this.values.Filename)
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
