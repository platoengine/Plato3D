<template>
  <v-card>
    <new-model/>
    <v-expansion-panels :focusable=true>
      <v-expansion-panel
        v-for="(item,index) in models"
        :key="index"
      >
        <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0 ma-0">
          <model :model="item" :displayID="index"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import Model from './Model'
import NewModel from './NewModel'

export default {
  name: 'model-tree',
  components: {
    Model,
    NewModel
  },
  computed: {
    models: function () {
      return this.$store.state.models
    }
  }
}
</script>
