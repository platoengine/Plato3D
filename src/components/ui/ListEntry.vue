<template>
 <v-card class="ma-0 pa-0">
  <display-branch :modify_button="true" :remove_button="true" :data="getData()" v-on:save="save()" v-on:remove="remove()"/>
  <p-you-sure
    :query="this.confirmQuery" :dialog="this.dialog"
    v-on:confirm="confirmRemove === true" v-on:set-dialog="setDialog($event)" />
 </v-card>
</template>

<script>
import DisplayBranch from './DisplayBranch'
import PYouSure from './PYouSure'
import {dynamicCopy, staticCopy} from './ByValue'
import {listViewValidation} from './FieldChecker'

export default {
  name: 'list-entry',
  props: ['scenario', 'data', 'name'],
  components: {
    DisplayBranch,
    PYouSure
  },
  data: function () {
    return {
      savePending: false,
      dataState: {},
      indicator : {color : 'red'},
      dialog: false,
      confirmRemove: false
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
  computed: {
    confirmQuery: function () {
      return "Are you sure you want to remove " + Object.keys(this.dataState)[0]
    }
  },
  methods: {
    setDialog: function (value) {
      this.dialog = value
    },
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
    },
    remove: function () {
      this.dialog = true
      if (this.confirmRemove === true) {
        this.$store.commit('removeScenarioListData',
          { scenarioName: this.scenario.name,
            dataName: this.name,
            entryName: Object.keys(this.dataState)[0]
          })
      }
    }
  }
}
</script>
