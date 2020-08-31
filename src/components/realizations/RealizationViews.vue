<template>
  <v-card color=green>
  <v-card outlined class="ml-2">
    <new-view :parentObject="parentObject"/>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel v-for="(item, index) in parentObject.simulation.views" :key="index">
        <v-expansion-panel-header>{{item.viewName}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card color=green>
          <v-card outlined class="ml-2">
            <modify-view :parentObject="parentObject" :viewID="item.viewID"/>
          </v-card>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
  </v-card>
</template>

<script>
import NewView from './NewView'
import ModifyView from './ModifyView'

export default {
  name: 'realization-views',
  props: ['parentObject'],
  components: {
    NewView,
    ModifyView
  }
}
</script>
