<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <div v-if="this.hasOptions()">
          <display-leaf :data="newEntryName" :options="this.getOptions()" :name="'Options'" v-on:set-value="newEntryName = $event" v-on:pending="setPending()"/>
        </div>
        <div v-else>
          <display-leaf :data="newEntryName" :name="'Name'" v-on:set-value="newEntryName = $event" v-on:pending="setPending()"/>
        </div>
        <display-branch :data="getData()" v-on:set-pending="setPending()"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close()">Cancel</v-btn>
        <v-btn text @click="save()" :disabled="!savePending">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DisplayLeaf from './DisplayLeaf'
import DisplayBranch from './DisplayBranch'
import {dynamicCopy, staticCopy} from './ByValue'

export default {
  name: 'new-list-entry',
  props: ['scenario', 'modelviews', 'name', 'dialog'],
  components: {
    DisplayLeaf,
    DisplayBranch
    
  },
  created: function () {
    dynamicCopy(this.modelviews[this.name]['view']['<Template>'], this.dataState)
  },
  data: function () {
    return {
      newEntryName: '',
      dataState: {},
      savePending: false,
     
    }
  },
  computed: {
    title () {
      return 'New ' + this.name
    }
  },
  methods: {
    getData: function () {
      return this.dataState
    },
    hasOptions: function () {
      let tData = this.modelviews[this.name]['view']
      if (Object.prototype.hasOwnProperty.call(tData, 'options')) {
        return true
      }
      return false
    },
    getOptions: function () {
      let tData = this.modelviews[this.name]['view']
      if (Object.prototype.hasOwnProperty.call(tData, 'options')) {
        return tData['options']
      }
      return []
    },
    setPending: function () {
      this.savePending = true
    },
    close: function () {
      this.$emit('closeNewListEntryDialog')
    },
    save: function () {
      let newListEntry = {}
      staticCopy(this.dataState, newListEntry)
      this.$store.commit('appendScenarioListData',
        { scenarioName: this.scenario.name,
          dataName: this.name,
          newEntryName: this.newEntryName,
          data: newListEntry
        })
      this.savePending = false
      this.close()
    }
  }
}
</script>
