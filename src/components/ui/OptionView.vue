<template>
  <v-card>
    <v-expansion-panel-header>
      {{this.name}}
      <Indicator v-bind:style="indicator" />
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card class="ma-0 pa-0" color=green>
        <v-card class="ml-2">
          <v-select dense class="ml-2 ma-0 pa-0 caption" v-model="selectedOption" :items="availableOptions" v-on:change="setPending()"/>
          <div v-for="(param, index) in parameterNames" :key="index">
            <display-leaf :data="getParameterValue(param)" :name="param" v-on:set-value="setParameterValue(param, $event)" v-on:pending="setPending()"/>
          </div>
          <v-btn block small @click="save()" :disabled="!savePending">Apply</v-btn>
        </v-card>
      </v-card>
    </v-expansion-panel-content>
  </v-card>
</template>

<script>
import DisplayLeaf from './DisplayLeaf'
import {dynamicCopy} from './ByValue'
import {listViewValidation} from './FieldChecker'
import Indicator from './Indicator'

export default {
  name: 'option-view',
  props: ['scenario', 'modelviews', 'name'],
  components: {
    DisplayLeaf,
    Indicator
  },
  data: function () {
    return {
      savePending: false,
      selectedOption: null,
      availableOptions: null,
      dataState: {},
      indicator : {color : 'red'}
    }
  },
  created: function () {
    this.availableOptions = Object.keys(this.modelviews[this.name]['view']['<Options>'])
    dynamicCopy(this.modelviews[this.name]['view']['<Options>'], this.dataState)
    this.selectedOption = this.modelviews[this.name]['option']
    if (this.selectedOption !== null) {
      this.save()
    }
  },
  computed: {
    parameterNames: function () {
      if (this.selectedOption !== null) {
        let params = this.dataState[this.selectedOption]
        return Object.keys(params)
      } else {
        return []
      }
    }
  },
  watch: {
    dataState : {
      handler: function() {
        if(this.selectedOption !== null) {
          if(listViewValidation(this.dataState) === true) {
            this.indicator.color = 'green'     
          } else {
            this.indicator.color = 'red'
          }
        }
      },
      deep: true
    },
    selectedOption: {
      handler: function(){
        if(this.selectedOption === null){
          this.indicator.color = 'red'
        } else {
          this.indicator.color = 'green'
        }
      }
    }  
  },
  methods: {
    getParameterValue: function (param) {
      return this.dataState[this.selectedOption][param]['value']
    },
    setParameterValue: function (param, value) {
      this.dataState[this.selectedOption][param]['value'] = value
    },
    setPending: function () {
      this.savePending = true
    },
    save: function () {
      let option = {}
      option[this.selectedOption] = this.dataState[this.selectedOption]
      this.$store.commit('setScenarioOptionData',
        { scenarioName: this.scenario.name,
          dataName: this.name,
          data: option
        })
      this.savePending = false
    }
  }
}
</script>
