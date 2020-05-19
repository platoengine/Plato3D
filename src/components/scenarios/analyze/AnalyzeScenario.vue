<template>
  <v-card>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>Parameters</v-expansion-panel-header>
        <v-expansion-panel-content>
          <parameters :parentObject="scenario"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Model</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card color=green>
          <v-card class="ml-2">
            <v-select dense class="ml-2 ma-0 pa-0" v-model="selectedModelName" :items="availableModels"/>
          </v-card>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-for="(name, index) in Object.keys(scenario.modelviews)" :key="index">
        <generic-view-ext :scenario="scenario" :modelviews="scenario.modelviews" :name="name" />
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import Parameters from '../../parameters/Parameters'
import GenericViewExt from '../../ui/GenericViewExt'

export default {
  name: 'analyze-scenario',
  props: ['scenario'],
  data: function () {
    return {
      attributesState: {pending: false, name: '', type: '', description: ''},
      modelState: {pending: false, name: ''},
      model: null
    }
  },
  components: {
    Parameters,
    GenericViewExt
  },
  created: function () {
    this.attributesState.description = this.scenario.description
  },
  methods: {
    save_model: function () {
      this.$store.commit('setScenarioModel', {scenarioName: this.scenario.name, modelName: this.modelState.name})
      this.modelState.pending = false
    }
  },
  computed: {
    selectedModelName: {
      get: function () {
        return this.scenario.geometry.body.modelName
      },
      set: function (newValue) {
        this.$store.commit('setScenarioModel', {scenarioName: this.scenario.name, modelName: newValue})
      }
    },
    availableModels: function () {
      return this.$store.state.models.map(m => m.name)
    }
  }
}
</script>
