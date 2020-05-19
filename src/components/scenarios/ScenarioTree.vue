<template>
  <v-card>
    <new-scenario/>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel
        v-for="(item,index) in scenarios"
        :key="index"
      >
        <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
        <v-expansion-panel-content id="expansion-panel">
          <scenario :scenario="item" :displayID="index"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import Scenario from './Scenario'
import NewScenario from './NewScenario'

export default {
  name: 'scenario-tree',
  components: {
    Scenario,
    NewScenario
  },
  computed: {
    scenarios: function () {
      return this.$store.state.scenarios
    }
  }
}
</script>
