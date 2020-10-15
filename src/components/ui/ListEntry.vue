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
  },
  watch: {
    dataState : {
      handler: function(){
        if(listViewValidation(this.dataState) === true){
          this.indicator.color = 'green'
        } else {
          this.indicator.color = 'red'
        }
        this.$emit('change-color', this.indicator)
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
