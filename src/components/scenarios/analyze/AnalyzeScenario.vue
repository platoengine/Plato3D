<template>
  <v-card>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Parameters
          <Indicator v-bind:style="indicatorParameter" />
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <parameters :parentObject="scenario"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Model
          <Indicator v-bind:style="indicator" />
        </v-expansion-panel-header>
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
import Indicator from '../../ui/Indicator'

export default {
  name: 'analyze-scenario',
  props: ['scenario'],
  data: function () {
    return {
      attributesState: {pending: false, name: '', type: '', description: ''},
      modelState: {pending: false, name: ''},
      model: null,
      selectedModelName: "",
      indicator:{color : 'red'},
      indicatorParameter:{color : 'yellow'}
    }
  },
  components: {
    Parameters,
    GenericViewExt,
    Indicator
  },
  created: function () {
    this.attributesState.description = this.scenario.description
    if(this.$store.state.models.length == 1){
      this.selectedModelName = this.$store.state.models[0]._name
    }
  },
  watch: {
    selectedModelName : {
      handler: function(){
        this.$store.commit('setScenarioModel', {scenarioName: this.scenario.name, modelName: this.selectedModelName})
        if(this.selectedModelName !== ""){
          this.indicator.color = 'green'
        } else {
          this.indicator.color = 'red'
        }
      }
    }
  },
  computed: {
    /*selectedModelName: {
      get: function () {
        return this.scenario.geometry.body.modelName
      },
      set: function (newValue) {
        this.$store.commit('setScenarioModel', {scenarioName: this.scenario.name, modelName: newValue})       
      }
    },*/
    availableModels: function () {
      return this.$store.state.models.map(m => m.name)
    }
  }
}
</script>
