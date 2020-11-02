<template>
  <v-card>
    <new-optimization/>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel
        v-for="(item,index) in optimizations"
        :key="index"
      >
        <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
        <v-expansion-panel-content id="expansion-panel">
          <optimization :optimization="item" :displayID="index"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import Optimization from './Optimization'
import NewOptimization from './NewOptimization'

export default {
  name: 'optimization-tree',
  components: {
    Optimization,
    NewOptimization
  },
  computed: {
    optimizations: function () {
      return this.$store.state.optimizations
    }
  }
}
</script>
