<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small block v-on="on" raised>Add Constraint</v-btn>
    </template>
    <v-card>
      <v-card-title>Add Constraint</v-card-title>
      <v-card-text>
        <v-select label="Scenario" dense class="ml-2 ma-0 pa-0" v-on:change="setPending()" v-model="selectedScenario" :items="getScenarios()"/>
        <v-select label="Criterion" :disabled="selectedScenario===''" dense class="ml-2 ma-0 pa-0" v-on:change="setPending()" v-model="selectedCriterion" :items="getCriteria()"/>
        <v-card outlined class="pl-2 pr-2">
          <v-text-field autocomplete="off" label="Target Value" dense class="ml-2 ma-0 pa-0 body-2" v-on:input="setPending()" v-model="targetValue"/>
          <v-checkbox label="Per Volume" dense class="ml-2 ma-0 pa-0 body-2" v-on:input="setPending()" v-model="perVolume"/>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close()">Cancel</v-btn>
        <v-btn text @click="add()" :disabled="!pending">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'add-constraint',
  data: function () {
    return {
      selectedScenario: '',
      selectedCriterion: '',
      targetValue: 0.25,
      perVolume: true,
      dialog: false,
      addPending: false
    }
  },
  props: ['optimization'],
  computed: {
    title () {
      return 'New ' + this.name
    },
    pending () {
      return this.selectedScenario!=='' && this.selectedCriterion!=='' && this.addPending
    }
  },
  methods: {
    getScenarios: function () {
      let returnScenarios = []
      // if the optimization has any objectives or constraints, only list scenarios that are based on
      // the same model.  (Plato doesn't currrently support multi-model optimizations.)
      if (this.optimization.objectives.length === 0 && this.optimization.constraints.length === 0) {
        returnScenarios = this.$store.state.scenarios.map(s => s.name)
      } else
      if (this.optimization.objectives.length > 0) {
        // there's an objective defined.  only show criteria that used the same underlying model.
        let modelName = this.optimization.objectives[0].scenario.geometry.body.modelName
        let scenarios = this.$store.state.scenarios.filter(s => s.geometry.body.modelName === modelName)
        returnScenarios = scenarios.map(s => s.name)

      } else
      if (this.optimization.constraints.length > 0) {
        // there's a constraint defined.  only show criteria that used the same underlying model.
        let modelName = this.optimization.constraints[0].scenario.geometry.body.modelName
        let scenarios = this.$store.state.scenarios.filter(s => s.geometry.body.modelName === modelName)
        returnScenarios = scenarios.map(s => s.name)
      }
      if (returnScenarios.length === 1) {
        this.selectedScenario = returnScenarios[0]
      }
      return returnScenarios
    },
    getCriteria: function () {
      if (this.selectedScenario!=='') {
        let scenario = this.$store.state.scenarios.find(s => s.name === this.selectedScenario)
        return scenario.selectables['Criteria']
      } else {
        return []
      }
    },
    setPending: function () {
      this.addPending = true
    },
    close: function () {
      this.dialog = false;
    },
    add: function () {
      this.$store.commit('addConstraintToOptimization',
        { optimizationName: this.optimization.name,
          newEntry: {scenarioName: this.selectedScenario, constraintName: this.selectedCriterion, target: this.targetValue, perVolume: this.perVolume}
        })
      this.addPending = false
      this.close()
    }
  }
}
</script>
