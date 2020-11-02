<template>
  <v-card color=green>
    <v-card outlined class="ml-2">
      <v-expansion-panels :focusable=true accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>Objectives</v-expansion-panel-header>
          <v-expansion-panel-content>
            <add-objective :optimization="optimization"/>
            <v-expansion-panels :focusable=true accordion>
              <v-expansion-panel v-for="(item,index) in optimization.objectives" :key="index" >
                <v-expansion-panel-header>{{ criterionName(item) }}</v-expansion-panel-header>
                <v-expansion-panel-content id="expansion-panel">
                  <objective :optimization="optimization" :objective="item"/>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>Constraints</v-expansion-panel-header>
          <v-expansion-panel-content>
            <add-constraint :optimization="optimization"/>
            <v-expansion-panels :focusable=true accordion>
              <v-expansion-panel v-for="(item,index) in optimization.constraints" :key="index" >
                <v-expansion-panel-header>{{ criterionName(item) }}</v-expansion-panel-header>
                <v-expansion-panel-content id="expansion-panel">
                  <constraint :optimization="optimization" :constraint="item"/>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-content>
        </v-expansion-panel>
<!--

        add constraint(s) w/ target value(s)

        compute



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
          <v-expansion-panel-header>Views</v-expansion-panel-header>
          <v-expansion-panel-content>
            <realization-views :parentObject="realization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
-->
      </v-expansion-panels>
    </v-card>
    <v-card :class="'d-flex justify-space-between'">
      <edit-optimization :optimization="optimization"/>
      <delete-optimization :optimization="optimization"/>
    </v-card>
  </v-card>
</template>

<script>
//import Parameters from '../parameters/Parameters'
import EditOptimization from './EditOptimization'
import DeleteOptimization from './DeleteOptimization'
import AddObjective from './AddObjective'
import AddConstraint from './AddConstraint'
import Objective from './Objective'
import Constraint from './Constraint'
//import RealizationResources from './RealizationResources'
//import RealizationSolution from './RealizationSolution'
//import RealizationViews from './RealizationViews'

export default {
  name: 'optimization',
  props: ['optimization'],
  methods: {
    criterionName: function (criterion) {
      return `${criterion.scenario.name}: ${criterion.criterionName}`
    },
    compute_solution: function () {
//      this.$store.dispatch('conductOptimizationSimulation', {optimizationName: this.optimization.name})
    }
  },
  components: {
//    Parameters,
    EditOptimization,
    DeleteOptimization,
    AddObjective,
    AddConstraint,
    Objective,
    Constraint
//    RealizationResources,
//    RealizationSolution,
//    RealizationViews
  }
}
</script>
