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
      <v-card>
        <plot :optimizationName="optimization.name"/>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
import ErrorHandler from '../../store/modules/error-handler-module'
import plot from './ConvergencePlot'

const errorHandler = new ErrorHandler()

import OptimizationViews from './OptimizationViews'
export default {
  name: 'optimization-run',
  props: ['optimization'],
  components: {
    OptimizationViews,
    plot
  },
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
    let commit = this.$store.commit
    let graphics = this.$graphics
    commit('addEventListener', {
      aName: 'optimizationIterationData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        commit('addIterationToOptimization', {graphics, data})
      }
    });
    commit('addEventListener', {
      aName: 'convergencePlotData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        const dataObject = JSON.parse(data)
        const {optimizationName, data: dataIn} = dataObject
        console.log("received convergence data.  committing.")
        commit('plotConvergence', {optimizationName: optimizationName, plotData: dataIn})
      }
    });
    commit('addEventListener', {
      aName: 'resultsData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        const dataObject = JSON.parse(data)
        const {name: optimizationName, data: dataIn} = dataObject
        console.log("received results data.  committing.")
        commit('optResultsData', {optimizationName: optimizationName, resultsData: dataIn})
      }
    });
  }
}
</script>
