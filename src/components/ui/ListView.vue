<template>
  <v-card> 
    <v-expansion-panel-header>
      <span :style="this.getListColor">{{this.name}} </span>
      <span class="d-flex justify-end" tile >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn  text depressed small tile id="no-background-hover" class= "add" style="{padding:1px; font-size:17px;}" v-bind="attrs" v-on="on" @click="createNewListEntry()" @click.native.stop>&#x2B;</v-btn>
          </template>
          <span>Add</span>
        </v-tooltip>
        <NewListEntry :dialog = "this.newListEntryDialogVisibility"  @contentEnteredByUser="contentSpecified()" @closeNewListEntryDialog = "closeNewListEntryDialog()" :modelviews = "this.modelviews" :name = "this.name" :scenario="this.scenario"/>
      </span>   
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-expansion-panel v-if="this.noneSelected">
        <v-card-subtitle class="ml-2 font-italic">
          None
        </v-card-subtitle>
      </v-expansion-panel>
      <v-card class="ma-0 pa-0" color=green>
        <v-card class="ml-2">
          <new-list-entry :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
          <v-expansion-panels  accordion>
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
import Vue from 'vue'

export default {
  name: 'list-view',
  props: ['scenario', 'modelviews', 'name'],
  components: {
    NewListEntry,
    ListEntry
  },
  data: function(){
    return {
      indicator: {},
      newListEntryDialogVisibility: false,
      noneSelected:true
    }
  },
  computed: {
    getListColor: function () {
      let keys = Object.keys(this.indicator)
      if(this.scenario.modelviews[this.name].required === false && keys.length === 0 ){
        return {color : 'yellow'}
      } else if(keys.length === 0 ) {
        return {color: 'red'}
      }  
      let vals = keys.map( k => this.indicator[k]['color'] === 'green', this)
      let val = vals.reduce( (acc, cur) => { return acc && cur }, true ) 
      let retVal = val === true ? {color: 'green'} : {color: 'red'} 
      return retVal
    }
  },
  methods: {
    changeIndicatorColor: function(entry, color) {
      Vue.set(this.indicator, entry, color)
    },
    contentSpecified() {
      this.noneSelected = false
    },
    closeNewListEntryDialog:function() {
      this.newListEntryDialogVisibility = false
    },
    createNewListEntry: function() {
      this.newListEntryDialogVisibility = true
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
<style lang="scss">
#no-background-hover::before {
  background-color: transparent !important; 

}
.add:hover {
  color:green;
}
</style>