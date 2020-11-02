<template>
  <v-card>
    <v-expansion-panel-header> {{this.name}} <Indicator v-bind:style="this.getListColor" /> </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card class="ma-0 pa-0" color=green>
        <v-card class="ml-2">
          <new-list-entry :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
          <v-expansion-panels accordion>
            <v-expansion-panel v-for="(item,index) in this.scenario.modelviews[this.name]['data']" :key="index">
              <list-entry :scenario="scenario" :data="item" :name="name" @change-color ="changeIndicatorColor(index, $event)"/>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-card>
    </v-expansion-panel-content>
  </v-card>
</template>

<script>
import NewListEntry from './NewListEntry'
import ListEntry from './ListEntry'
import Indicator from './Indicator'
import Vue from 'vue'

export default {
  name: 'list-view',
  props: ['scenario', 'modelviews', 'name'],
  components: {
    NewListEntry,
    ListEntry,
    Indicator
  },
  data: function(){
    return {
      indicator: {}
    }
  },
  computed: {
    getListColor: function () {
      let keys = Object.keys(this.indicator)
      if ( keys.length === 0 ) return {color: 'yellow'}
      let vals = keys.map( k => this.indicator[k]['color'] === 'green', this)
      let val = vals.reduce( (acc, cur) => { return acc && cur }, true ) 
      let retVal = val === true ? {color: 'green'} : {color: 'red'}
      return retVal
    }
  },
  methods: {
    changeIndicatorColor: function(entry, color){
      Vue.set(this.indicator, entry, color)
    },     
    getIndicatorColor: function(entry) {
      if (Object.prototype.hasOwnProperty.call(this.indicator, entry)) {
        return this.indicator[entry]
      } else {
        return {color: 'yellow'}
      }
    },
    getName: function (obj) {
      let propNames = Object.keys(obj)
      return propNames[0]
    }
  }
}
</script>
