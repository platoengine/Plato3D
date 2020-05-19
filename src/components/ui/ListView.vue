<template>
  <v-card>
    <v-expansion-panel-header>{{this.name}}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card class="ma-0 pa-0" color=green>
      <v-card class="ml-2">
        <new-list-entry :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
        <v-expansion-panels>
          <v-expansion-panel v-for="(item,index) in this.scenario.modelviews[this.name]['data']" :key="index">
            <v-expansion-panel-header>{{getName(item)}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card color=green>
              <v-card outlined class="pt-4 ml-2">
                <list-entry :scenario="scenario" :data="item" :name="name"/>
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

export default {
  name: 'list-view',
  props: ['scenario', 'modelviews', 'name'],
  components: {
    NewListEntry,
    ListEntry
  },
  methods: {
    getName: function (obj) {
      let propNames = Object.keys(obj)
      return propNames[0]
    }
  }
}
</script>
