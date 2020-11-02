<template>
 <v-card class="ma-0 pa-0">
  <display-branch :modify_button="true" :data="getData()" v-on:save="save()"/>
 </v-card>
</template>

<script>
import DisplayBranch from './DisplayBranch'
import {dynamicCopy, staticCopy} from './ByValue'
import {listViewValidation} from './FieldChecker'

export default {
  name: 'list-entry',
  props: ['scenario', 'data', 'name'],
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
    dynamicCopy(this.data, this.dataState)
    this.emitDisplayColor()
  },
  watch: {
    dataState : {
      handler: function () {
        this.emitDisplayColor()
      },
    deep: true
    }
  },
  methods: {
    emitDisplayColor: function () {
      if(listViewValidation(this.dataState) === true){
        this.indicator.color = 'green'
      } else {
        this.indicator.color = 'red'
      }
      this.$emit('change-color', this.indicator)
    },
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
