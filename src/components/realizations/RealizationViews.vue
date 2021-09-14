<template>
  <v-card color=green>
  <v-card outlined class="ml-2">
    <v-expansion-panels v-model="openPanelIndex" :focusable=true accordion>
      <v-expansion-panel v-for="(item, index) in parentObject.simulation.views" :key="index">
        <v-expansion-panel-header>{{item.viewName}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card color=green>
          <v-card outlined class="ml-2">
            <modify-view :panelIsOpen="openPanelIndex === index" :parentObject="parentObject" :viewID="item.viewID"/>
          </v-card>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="parentObject.simulation.views.length === 0">
        <v-card-subtitle class="ma-2 pa-0 font-italic">
          None
        </v-card-subtitle>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
  </v-card>
</template>

<script>
import ModifyView from './ModifyView'

export default {
  name: 'realization-views',
  data: function () {
    return {openPanelIndex: null}
  },
  props: ['parentObject'],
  components: {
    ModifyView
  }
}
</script>
