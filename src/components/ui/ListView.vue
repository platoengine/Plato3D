<template>
  <v-card> 
    <v-expansion-panel-header>
      <span :style="this.getListColor">{{this.name}} </span>
      <span class="d-flex justify-end" tile >
        <v-tooltip right open-delay=500 close-delay=100>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text depressed small min-width=25px id="no-background-hover" v-bind="attrs" v-on="on" @click="createNewListEntry()" @click.native.stop><v-icon small>mdi-plus</v-icon></v-btn>
          </template>
          <span>Add</span>
        </v-tooltip>
        <NewListEntry :dialog = "this.newListEntryDialogVisibility" @closeNewListEntryDialog = "closeNewListEntryDialog()" :modelviews = "this.modelviews" :name = "this.name" :scenario="this.scenario"/>
      </span>   
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card class="ma-0 pa-0" v-if="myList.length === 0">
        <v-card-subtitle class="ma-2 pa-0 font-italic">
          None
        </v-card-subtitle>
      </v-card>
      <v-card class="ma-0 pa-0" color=green>
        <v-card class="ml-2">
          <new-list-entry :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
          <v-expansion-panels accordion>
            <v-expansion-panel v-for="(item,index) in myList" :key="index">
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
    },
    myList: function () {
      return this.scenario.modelviews[this.name]['data'];
    }
  },
  methods: {
    changeIndicatorColor: function(entry, color) {
      Vue.set(this.indicator, entry, color)
    },
    closeNewListEntryDialog:function() {
      this.newListEntryDialogVisibility = false
    },
    createNewListEntry: function() {
      this.newListEntryDialogVisibility = true
      this.$emit('open-panel')
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
</style>
