<template>
 <v-card class="ma-0 pa-0">
  <display-branch :modify_button="true" :data="getData()" v-on:save="save()"/>
 </v-card>
</template>

<script>
import DisplayBranch from './DisplayBranch'
import {dynamicCopy, staticCopy} from './ByValue'

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
      let updatedListEntry = {}
      staticCopy(this.dataState, updatedListEntry)
      this.$store.commit('setScenarioListData',
        { scenarioName: this.scenario.name,
          dataName: this.name,
          data: updatedListEntry
        })
      this.savePending = false
      this.$emit('close')
    }
  }
}
</script>
