<template>
  <v-card>
    <v-expansion-panel-header>
      {{this.name}}
      <Indicator v-bind:style="indicator" />
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card class="ma-0 pa-0" color=green>
        <v-card class="ml-2">
          <new-list-entry :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
          <v-expansion-panels accordion>
            <v-expansion-panel v-for="(item,index) in this.scenario.modelviews[this.name]['data']" :key="index">
              <v-expansion-panel-header>
                {{getName(item)}} 
                <Indicator v-bind:style="indicator"  />
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card color=green>
                  <v-card outlined class="pt-4 ml-2">
                    <list-entry :scenario="scenario" :data="item" :name="name" @change-color ="changeIndicatorColor"/>
                  </v-card>
                </v-card>
              </v-expansion-panel-content>
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
      indicator: {color : 'red'},
    }
  },
  methods: {
    changeIndicatorColor: function(color){
      this.indicator = color
    },     
    getName: function (obj) {
      let propNames = Object.keys(obj)
      return propNames[0]
    }
  }
}
</script>
