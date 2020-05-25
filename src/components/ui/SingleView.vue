<template>
  <v-card>
  <v-expansion-panel-header>{{this.name}}</v-expansion-panel-header>
  <v-expansion-panel-content>
    <v-card class="ma-0 pa-0" color=green>
      <v-card class="pt-4 ml-2">
        <display-branch :data="getData()" v-on:pending="setPending()"/>
        <v-btn block small @click="save()" :disabled="!savePending">Modify</v-btn>
      </v-card>
    </v-card>
  </v-expansion-panel-content>
  </v-card>
</template>

<script>
import DisplayBranch from './DisplayBranch'
import {dynamicCopy} from './ByValue'

export default {
  name: 'single-view',
  props: ['scenario', 'modelviews', 'name'],
  components: {
    DisplayBranch
  },
  data: function () {
    return {
      openThings: false,
      savePending: false,
      dataState: {}
    }
  },
  created: function () {
    if (this.scenario.modelviews[this.name]['data'] === null) {
      dynamicCopy(this.scenario.modelviews[this.name]['view']['<Template>'], this.dataState)
    } else {
      dynamicCopy(this.scenario.modelviews[this.name]['data'], this.dataState)
    }
  },
  methods: {
    getData: function () {
      return this.dataState
    },
    toggleThings: function () {
      this.openThings = !this.openThings
    },
    setPending: function () {
      this.savePending = true
    },
    save: function () {
      this.$store.commit('setScenarioOptionData',
        { scenarioName: this.scenario.name,
          dataName: this.name,
          data: this.dataState
        })
      this.savePending = false
      this.openThings = false
    }
  }
}
</script>
