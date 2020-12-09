<template>
  <v-card>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span v-bind:style="indicatorParameter"> Parameters </span>
          <span class="d-flex justify-end" tile >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn  text depressed small tile id="no-background-hover" class= "add" style="{padding:1px; font-size:17px;}" v-bind="attrs" v-on="on" @click="createNewParameter()" @click.native.stop>&#x2B;</v-btn>
              </template>
              <span>Add</span>
            </v-tooltip>
          </span>         
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <parameters @close = "closeNewParameterDialog()" :newParameterDialogVisibility="this.newParameterVisibility" :parentObject="scenario" @setTextColor = "setParamTextColor($event)" />     
        <v-card-subtitle v-if="noneSelected" class="ml-2 font-italic">
          None
        </v-card-subtitle>   
        </v-expansion-panel-content>
      </v-expansion-panel>     
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span :style="this.indicator">Model</span>
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
      indicatorParameter:{color : 'yellow'},
      newParameterVisibility: false,
      noneSelected:true
    }
  },
  components: {
    Parameters,
    GenericViewExt
  },
  created: function() {
    this.attributesState.description = this.scenario.description
    if(this.$store.state.models.length == 1){
      this.selectedModelName = this.$store.state.models[0]._name
    }
  },
  watch: {
    selectedModelName: {
      handler: function(){
        this.$store.commit('setScenarioModel', {scenarioName: this.scenario.name, modelName: this.selectedModelName})
        if(this.selectedModelName !== ""){
          this.indicator.color = 'green'
        } else {
          this.indicator.color = 'red'
        }
      }
    },
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
  },
  methods : {
    createNewParameter: function() {
      this.newParameterVisibility = true
    },
    closeNewParameterDialog: function() {
      this.newParameterVisibility = false
      if(Object.keys(this.scenario.parameters).length > 0){
        this.noneSelected = false
      } else {
        this.noneSelected = true
      }
    },
    setParamTextColor : function(color) {
      this.indicatorParameter = color
    }
  }
}
</script>
<style scoped>
.add:hover {
  color:green;
}
</style>
