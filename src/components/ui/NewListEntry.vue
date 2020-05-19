<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small block v-on="on" raised>Create New</v-btn>
    </template>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <display-leaf :data="newEntryName" :name="'Name'" v-on:set-value="newEntryName = $event" v-on:pending="setPending()"/>
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
  props: ['scenario', 'modelviews', 'name'],
  components: {
    DisplayLeaf,
    DisplayBranch
  },
  created: function () {
    dynamicCopy(this.modelviews[this.name]['view']['<Template>'], this.dataState)
  },
  data: function () {
    return {
      dialog: false,
      newEntryName: '',
      dataState: {},
      savePending: false
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
    setPending: function () {
      this.savePending = true
    },
    close: function () {
      this.dialog = false;
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
