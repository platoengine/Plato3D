<template>
 <v-card class="ma-0 pa-0">
  <display-branch :level="0" :data="getData()" v-on:pending="setPending()"/>
  <v-btn small block @click="save()" :disabled="!savePending" type="button">
    Modify
  </v-btn>
 </v-card>
</template>

<script>
import DisplayBranch from './DisplayBranch'
import {dynamicCopy} from './ByValue'

export default {
  name: 'list-entry',
  props: ['scenario', 'data', 'name'],
  components: {
    DisplayBranch
  },
  data: function () {
    return {
      savePending: false,
      dataState: {}
    }
  },
  created: function () {
    dynamicCopy(this.data, this.dataState)
  },
  methods: {
    getData: function () {
      return this.dataState
    },
    setPending: function () {
      this.savePending = true
    },
    save: function () {
      this.$store.commit('setScenarioListData',
        { scenarioName: this.scenario.name,
          dataName: this.name,
          data: this.dataState
        })
      this.savePending = false
      this.$emit('close')
    }
  }
}
</script>
