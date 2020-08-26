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
        <v-expansion-panel>
          <v-expansion-panel-content>
            views
            <!--
            <realization-views :parentObject="realization"/>
            -->
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card :class="'d-flex justify-space-between'">
      <edit-realization :realization="realization"/>
      <delete-realization :realization="realization"/>
    </v-card>
  </v-card>
<!--
  <b-card no-body class="text-right list-item" v-bind:class="{ 'list-item-open': openPanel }">

    <b-collapse v-model="openPanel" id="realizationsPanel">

      <b-card class=list-item v-bind:class="{ 'list-item-open': openSolution }" no-body>
        <div class=bold v-bind:class="{ 'bold-open': openSolution}" @click="toggleSolution">
          <div><span>
              <div v-if="openSolution"><octicon scale="0.75" name="chevron-down"></octicon> Solution</div>
              <div v-else><octicon scale="0.75" name="chevron-right"></octicon> Solution</div>
          </span></div>
        </div>
        <b-collapse v-model="openSolution" id="realizationSolutionPanel" accordion="realizationAccordion">
          <b-form>
            <b-form-group class="m-0 basic-label" label="Status:" label-cols="5">
              <b-form-input disabled class="basic-input" type="text" v-model="solutionStatus"></b-form-input>
            </b-form-group>
            <b-btn size="sm" class="thin-button" block @click="compute_solution" :disabled="!solutionPending" type="button">Compute</b-btn>
          </b-form>
        </b-collapse>
      </b-card>

      <views-component :parentObject="realization" accordion="realizationAccordion"/>
      
    </b-collapse>
  </b-card>
-->
</template>

<script>
import Parameters from '../parameters/Parameters'
import EditRealization from './EditRealization'
import DeleteRealization from './DeleteRealization'
import RealizationResources from './RealizationResources'
import RealizationSolution from './RealizationSolution'
//import ViewsComponent from './ViewsComponent'

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
    RealizationSolution
    //ViewsComponent
  }
}
</script>
