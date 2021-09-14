<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn text depressed small max-width=25px id="no-background-hover" v-on="on"><v-icon small>mdi-plus</v-icon></v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">New View</span>
      </v-card-title>
      <v-card-text>
        <v-container>
            <v-col>
              <v-select dense class="ma-0 pa-0" v-model="selectedView" :items="availableViewTypes()" label="View"/>
            </v-col>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn text @click="dialog = false; create()" :disabled="selectedView==''">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ErrorHandler from '../../store/modules/error-handler-module'
import {PLYLoader} from '../../store/modules/ply-loader'
import {PLYToMesh} from '../../store/modules/ply-to-mesh'

const errorHandler = new ErrorHandler()

export default {
  name: 'new-view',
  props: ['parentObject'],
  data: function () {
    return {selectedView: '', dialog: false}
  },
  methods: {
    availableViewTypes: function () {
      let allTypes = Object.keys(this.parentObject.scenario.availableViewTypes)
      let views = this.parentObject.simulation.views
      let availableTypes = allTypes.filter(type => views.find(e => e.viewName === type) === undefined)
      return availableTypes
    },
    create: function () {
      this.$store.dispatch('addRealizationView',
        {
          realizationName: this.parentObject.name,
          runDir: this.parentObject.simulation.runDir,
          scriptName: this.parentObject.scenario.availableViewTypes[this.selectedView],
          viewName: this.selectedView
        }
      )
    }
  },
  mounted () {
    const appThis = this
    this.$store.commit('addEventListener', {
      aName: 'realizationViewData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        const dataObject = JSON.parse(data)
        const {realizationName, viewName, data: geometryData} = dataObject
        const loader = new PLYLoader()
        const url = URL.createObjectURL(new Blob([geometryData]))
        loader.load(url, (geometry) => {
          let mesh = PLYToMesh(geometry)
          let graphics = appThis.$graphics
          appThis.$store.commit('addViewToRealization', {realizationName: realizationName, viewName: viewName, geometry: mesh, graphics: graphics})
        }, undefined, function (error) { errorHandler.report(error) })
      }
    })

  }
}
</script>
