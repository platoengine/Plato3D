<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small block v-on="on" raised>Add Objective</v-btn>
    </template>
    <v-card>
      <v-card-title>Add Objective</v-card-title>
      <v-card-text>
        <v-select label="Scenario" dense class="ml-2 ma-0 pa-0" v-on:change="setPending()" v-model="selectedScenario" :items="getScenarios()"/>
        <v-select label="Criterion" :disabled="selectedScenario===''" dense class="ml-2 ma-0 pa-0" v-on:change="setPending()" v-model="selectedCriterion" :items="getCriteria()"/>
        <v-text-field autocomplete="off" label="Weight" dense class="ml-2 ma-0 pa-0 body-2" v-on:input="setPending()" v-model="weightValue"/>
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
  name: 'add-objective',
  data: function () {
    return {
      selectedScenario: '',
      selectedCriterion: '',
      weightValue: 1.0,
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
      return this.$store.state.scenarios.map(s => s.name)
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
      this.$store.commit('addObjectiveToOptimization',
        { optimizationName: this.optimization.name,
          newEntry: {
            scenarioName: this.selectedScenario,
            objectiveName: this.selectedCriterion,
            weight: this.weightValue
          }
        })
      this.addPending = false
      this.close()
    }
  }
}
</script>
