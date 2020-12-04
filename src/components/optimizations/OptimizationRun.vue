<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-text-field dense class="ml-2 ma-0 pa-0 caption" v-model="runStatus" label="Status"/>
      <v-btn text block small @click="run()" :disabled="pending">{{buttonName}}</v-btn>
      <optimization-views :optimization="optimization"/>
    </v-card>
  </v-card>
</template>

<script>
import ErrorHandler from '../../store/modules/error-handler-module'
import {PLYLoader} from '../../store/modules/ply-loader'
import {PLYToMesh} from '../../store/modules/ply-to-mesh'
import * as THREE from 'three'

const errorHandler = new ErrorHandler()

import OptimizationViews from './OptimizationViews'
export default {
  name: 'optimization-run',
  props: ['optimization'],
  components: {
    OptimizationViews
  },
  computed: {
    buttonName: function () {
      if (this.optimization.run.iterations.length === 0) {
        return "Run"
      } else {
        return "Re-run"
      }
    },
    pending: {
      get: function () {
        return this.runStatus === "Running"
      },
      set: function () {
        // no-op
      }
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
      this.$store.dispatch('conductOptimizationRun', {optimizationName: this.optimization.name, graphics: this.$graphics})
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
    })

  }
}
</script>
