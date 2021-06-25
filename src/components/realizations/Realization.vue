<template>
  <v-card color=green>
    <v-card outlined class="ml-2">
      <v-expansion-panels :focusable=true accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>Parameters</v-expansion-panel-header>
          <v-expansion-panel-content>
            <parameters :parentObject="realization.scenario"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Resources</v-expansion-panel-header>
          <v-expansion-panel-content>
            <realization-resources :parentObject="realization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Solution</v-expansion-panel-header>
          <v-expansion-panel-content>
            <realization-solution :parentObject="realization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="solutionStatus==='done'">
          <v-expansion-panel-header>Views</v-expansion-panel-header>
          <v-expansion-panel-content>
            <realization-views :parentObject="realization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card :class="'d-flex justify-space-between'">
      <edit-realization :realization="realization"/>
      <delete-realization :realization="realization"/>
    </v-card>
  </v-card>
</template>

<script>
import Parameters from '../parameters/Parameters'
import EditRealization from './EditRealization'
import DeleteRealization from './DeleteRealization'
import RealizationResources from './RealizationResources'
import RealizationSolution from './RealizationSolution'
import RealizationViews from './RealizationViews'

export default {
  name: 'realization',
  props: ['realization', 'displayID'],
  data: function () {
    return {
      resourcesState: {pending: false, numProcs: 1},
      openSolution: false,
      solutionState: {pending: false}
    }
  },
  mounted () {
    const appThis = this
    this.$store.commit('addEventListener', {
      aName: 'simulationExited',
      aFunction: function (event) {
        const {data} = event
        const dataObject = JSON.parse(data)
        const {code, name} = dataObject
        console.log(`code: ${code}`)
        appThis.$store.commit('setSimulationAttribute', {name: name, key: 'computeStatus', value: 'done'})
      }
    })
  },
  computed: {
    model: function () {
      let modelName = this.realization.scenario.geometry.body.modelName
      let models = this.$store.state.models
      let modelIndex = models.findIndex(m => m.name === modelName)
      if (modelIndex !== -1) {
        return models[modelIndex]
      } else {
        return null
      }
    },
    solutionPending: function () {
      return this.realization.scenario !== null
    },
    resourcesNumProcs: {
      get: function () {
        return this.realization.resources.numProcs
      },
      set: function (newValue) {
        this.resourcesState.numProcs = newValue
      }
    },
    solutionStatus: {
      get: function () {
        return this.realization.simulation.computeStatus
      },
      set: function () {
        // This property is never set.  The setter is defined to prevent errors in the console.
      }
    },
    realizationName: {
      get: function () {
        return this.realization.name
      },
      set: function (newValue) {
        this.attributesState.name = newValue
      }
    },
    realizationDescription: {
      get: function () {
        return this.attributesState.description
      },
      set: function (newVal) {
        this.attributesState.description = newVal
      }
    }
  },
  methods: {
    save_resources: function () {
      this.$store.commit('setRealizationResources', {realizationName: this.realization.name, numProcs: this.resourcesState.numProcs})
      this.resourcesState.pending = false
      this.openResources = false
    },
    compute_solution: function () {
      this.$store.dispatch('conductRealizationSimulation', {realizationName: this.realization.name})
      this.solutionState.pending = false
      this.openSolution = false
    }
  },
  components: {
    Parameters,
    EditRealization,
    DeleteRealization,
    RealizationResources,
    RealizationSolution,
    RealizationViews
  }
}
</script>
