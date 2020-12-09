<template>
  <v-card color=green>
  <v-card outlined class="ml-2">
    <new-parameter  @close = "closeNewParameterDialog()" :dialog = "this.newParameterDialogVisibility" :parentObject="parentObject" @setParamTextColor= "propagateHeaderTextColor()"/>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel v-for="(item, index) in parentObject.parameters" :key="index">
        <v-expansion-panel-header>
          {{item.ParameterName}}
          <Indicator v-bind:style="[!indicator[index]?{ 'color': 'green'} : indicator[index]]"/>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card color=green>
          <v-card outlined class="ml-2">
            <modify-parameter @change-color="changeIndicatorColor(index, $event)" :parentObject="parentObject" :parameterName="item.ParameterName"/>
          </v-card>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
  </v-card>
</template>

<script>
import NewParameter from './NewParameter'
import ModifyParameter from './ModifyParameter'
import Indicator from '../ui/Indicator'
import Vue from 'vue'

export default {
  name: 'parameters',
  props: ['parentObject', 'newParameterDialogVisibility'],
  components: {
    NewParameter,
    ModifyParameter,
    Indicator
  },
  data: function() {
    return {
      indicator :{}
    }
  },  
  computed: {
    getListColor: function() {
      let keys = Object.keys(this.indicator)
      let vals = keys.map( k => this.indicator[k]['color'] === 'green', this)  
      let val = vals.reduce( (acc, cur) => { return acc && cur }, true ) 
      let retVal = val === true ? {color: 'green'} : {color: 'red'} 
      return retVal
    }
  },
  methods: {
    propagateHeaderTextColor: function() {
      this.$emit('setTextColor', this.getListColor)
    },
    changeIndicatorColor: function(entry, color) {   
      Vue.set(this.indicator, entry, color)
      this.propagateHeaderTextColor()
    },
    closeNewParameterDialog: function() {
      this.$emit('close')
    }  
  }
}
</script>
