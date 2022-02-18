<template>
  <v-card color=green>
    <v-card outlined class="ml-2">
      <v-expansion-panels :focusable=true accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>Objectives</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card color=green>
            <v-card outlined class="ml-2">
            <add-objective :optimization="optimization"/>
            <v-expansion-panels :focusable=true accordion>
              <v-expansion-panel v-for="(item,index) in optimization.objectives" :key="index" >
                <v-expansion-panel-header>{{ criterionName(item) }}</v-expansion-panel-header>
                <v-expansion-panel-content id="expansion-panel">
                  <objective :optimization="optimization" :objective="item"/>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-card-text>
              <v-checkbox dense class="ma-0 pa-0" v-model="normalizeObjectives" label="Normalize Objectives"/>
            </v-card-text>
            </v-card>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>Constraints</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card color=green>
            <v-card outlined class="ml-2">
            <add-constraint :optimization="optimization"/>
            <v-expansion-panels :focusable=true accordion>
              <v-expansion-panel v-for="(item,index) in optimization.constraints" :key="index" >
                <v-expansion-panel-header>{{ criterionName(item) }}</v-expansion-panel-header>
                <v-expansion-panel-content id="expansion-panel">
                  <constraint :optimization="optimization" :constraint="item"/>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            </v-card>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Optimizer</v-expansion-panel-header>
          <v-expansion-panel-content>
            <optimization-optimizer :optimization="optimization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Solver</v-expansion-panel-header>
          <v-expansion-panel-content>
            <optimization-solver :optimization="optimization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Geometry</v-expansion-panel-header>
          <v-expansion-panel-content>
            <optimization-geometry :optimization="optimization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Run</v-expansion-panel-header>
          <v-expansion-panel-content>
            <optimization-run :optimization="optimization"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card :class="'d-flex justify-space-between'">
      <edit-optimization :optimization="optimization"/>
      <delete-optimization :optimization="optimization"/>
      <export-optimization :optimization="optimization"/>
      <v-btn small @click="toggleVisibility()">
        <v-icon v-if="isVisible" large>$vuetify.icons.visible</v-icon>
        <v-icon v-else large>$vuetify.icons.invisible</v-icon>
      </v-btn>
    </v-card>
  </v-card>
</template>

<script>
//import Parameters from '../parameters/Parameters'
import EditOptimization from './EditOptimization'
import DeleteOptimization from './DeleteOptimization'
import ExportOptimization from './ExportOptimization'
import AddObjective from './AddObjective'
import AddConstraint from './AddConstraint'
import Objective from './Objective'
import Constraint from './Constraint'
import OptimizationOptimizer from './OptimizationOptimizer'
import OptimizationSolver from './OptimizationSolver'
import OptimizationGeometry from './OptimizationGeometry'
import OptimizationRun from './OptimizationRun'

export default {
  name: 'optimization',
  props: ['optimization'],
  data: function () {
    return { isVisible: true }
  },
  computed: {
    normalizeObjectives: {
      get: function () {
        return this.optimization.normalizeObjectives
      },
      set: function (newVal) {
        this.$store.commit('setNormalizeObjectives', {optimization: this.optimization, normalize: newVal})
      }
    }
  },
  methods: {
    criterionName: function (criterion) {
      return `${criterion.scenario.name}: ${criterion.criterionName}`
    },
    toggleVisibility: function () {
      const appThis = this
      this.isVisible = !(this.isVisible)
      this.$store.commit('setOptimizationVisibility', {
        optimizationName: this.optimization.name,
        isVisible: this.isVisible,
        graphics: appThis.$graphics
      })
    }
  },
  mounted () {
    const appThis = this
    this.$store.commit('addEventListener', {
      aName: 'optimizationExited',
      aFunction: function (event) {
        const {data} = event
        const dataObject = JSON.parse(data)
        const {code, name} = dataObject
        console.log(`code: ${code}`)
        appThis.$store.commit('setOptimizationAttribute', {name: name, key: 'computeStatus', value: 'done'})
      }
    })
  },
  
  components: {
    EditOptimization,
    DeleteOptimization,
    ExportOptimization,
    AddObjective,
    AddConstraint,
    Objective,
    Constraint,
    OptimizationOptimizer,
    OptimizationSolver,
    OptimizationGeometry,
    OptimizationRun
  }
}
</script>
