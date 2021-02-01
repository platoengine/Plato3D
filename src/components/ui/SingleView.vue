<template>
  <v-card>
    <v-expansion-panel-header>
      <span :style="this.indicator">{{this.name}}</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card class="ma-0 pa-0" color=green>
        <v-card class="pt-4 ml-2">
          <display-branch :data="getData()" v-on:pending="setPending();"/>
          <v-btn block small @click="save(); printData()" :disabled="!savePending">Modify</v-btn>
        </v-card>
      </v-card>
    </v-expansion-panel-content>
  </v-card>
</template>

<script>
import DisplayBranch from './DisplayBranch'
import {dynamicCopy, staticCopy} from './ByValue'
import {singleViewValidation} from './FieldChecker'

export default {
  name: 'single-view',
  props: ['scenario', 'modelviews', 'name'],
  components: {
    DisplayBranch
  },
  data: function () {
    return {
      savePending: false,
      dataState: {},
      indicator : {color : 'red'}
    }
  },
  created: function () {
    if (this.scenario.modelviews[this.name]['data'] === null) {
      dynamicCopy(this.scenario.modelviews[this.name]['view']['<Template>'], this.dataState)
    } else {
      dynamicCopy(this.scenario.modelviews[this.name]['data'], this.dataState)
    }
    this.save()
  },
  watch: {
    dataState : {
      handler: function(){
        if(singleViewValidation(this.dataState) === true){
          this.indicator.color = 'green'
        } else {
          this.indicator.color = 'red'
        }
      },
    deep: true
    }
  },
  methods: {
    getData: function () {
      return this.dataState
    },
    setPending: function () {
      this.savePending = true
    },
    save: function () {
      let staticState = {}
      staticCopy(this.dataState, staticState)
      this.$store.commit('setScenarioOptionData',
        { scenarioName: this.scenario.name,
          dataName: this.name,
          data: staticState
        })
      this.savePending = false
    }   
  }
}
</script>
