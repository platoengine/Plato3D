<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-card outlined class="ma-2">
      <div class="text-center text-h7"> status: {{ runStatus }} </div>
      <div v-if="runStatus==='running'" class="text-center">
        <v-progress-linear height=8 indeterminate color="primary" ></v-progress-linear>
      </div>
      </v-card>
      <v-card class="ma-2"><v-btn block small @click="run()">{{buttonName}}</v-btn></v-card>
      <optimization-views :optimization="optimization"/>
<!-- plotly refuses to react to changing data.  The Vue plugin shows that data are
     being updated, but the plots aren't reacting.  Perhaps plotly just sucks.
      <v-card>
        <plot :optimizationName="optimization.name"/>
      </v-card>
-->
    </v-card>
  </v-card>
</template>

<script>
import ErrorHandler from '../../store/modules/error-handler-module'
import {PLYLoader} from '../../store/modules/ply-loader'
import {PLYToMesh} from '../../store/modules/ply-to-mesh'
// import plot from './ConvergencePlot'

import * as THREE from 'three'

const errorHandler = new ErrorHandler()

import OptimizationViews from './OptimizationViews'
export default {
  name: 'optimization-run',
  props: ['optimization'],
  components: {
    OptimizationViews,
    // plot
  },
  /*data : function() {
    return {
      fx : [],
      iter : []
    }
  },*/
  computed: {
    buttonName: function () {
      if (this.runStatus === 'idle') {
        return "Run"
      } else
      if (this.runStatus === 'done') {
        return "Re-run"
      } else
      if (this.runStatus === 'running') {
        return "Cancel"
      }
      return ''
    },
    runStatus: {
      get: function () {
        return this.optimization.run.computeStatus
      },
      set: function () {
        // This property is never set.  The setter is defined to prevent errors in the console.
      }
    }
  },
  methods: {
    run: function () {
      if (this.runStatus === 'idle' || this.runStatus === 'done') {
        this.$store.dispatch('conductOptimizationRun', {optimizationName: this.optimization.name, graphics: this.$graphics})
      } else
      if (this.runStatus === 'running') {
        this.$store.dispatch('cancelOptimizationRun', {optimizationName: this.optimization.name})
      }
    }
  },
  mounted () {
    const appThis = this
    this.$store.commit('addEventListener', {
      aName: 'optimizationIterationData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        const dataObject = JSON.parse(data)
        const {optimizationName, iteration, data: geometryData} = dataObject
        const loader = new PLYLoader()
        const url = URL.createObjectURL(new Blob([geometryData]))
        loader.load(url, (geometry) => {
          let mesh = PLYToMesh(geometry)
          mesh.material = new THREE.MeshPhysicalMaterial();
          let graphics = appThis.$graphics
          appThis.$store.commit('addIterationToOptimization', {optimizationName: optimizationName, iteration: iteration, geometry: mesh, graphics: graphics})
        }, undefined, function (error) { errorHandler.report(error) })
      }
    });
    this.$store.commit('addEventListener', {
      aName: 'convergencePlotData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        const dataObject = JSON.parse(data)
        const {optimizationName, data: dataIn} = dataObject
        console.log("received convergence data.  committing.")
        appThis.$store.commit('plotConvergence', {optimizationName: optimizationName, plotData: dataIn})
      }
    });
  }
}
</script>
