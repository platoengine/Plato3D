<template>
  <v-card>
    <new-realization/>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel
        v-for="(item,index) in realizations"
        :key="index"
      >
        <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
        <v-expansion-panel-content id="expansion-panel">
          <realization :realization="item" :displayID="index"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import Realization from './Realization'
import NewRealization from './NewRealization'

export default {
  name: 'realization-tree',
  components: {
    Realization,
    NewRealization
  },
  computed: {
    realizations: function () {
      return this.$store.state.realizations
    }
  }
}
</script>
