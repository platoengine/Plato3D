<template>
  <v-card>
    <new-model/>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel
        v-for="(item,index) in models"
        :key="index"
      >
        <v-expansion-panel-header>{{name(item)}}</v-expansion-panel-header>
        <v-expansion-panel-content id="expansion-panel">
          <model :model="item" :displayID="index"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<style>
  .v-expansion-panel-content{
    padding: 0px;
  }
</style>

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
  },
  methods: {
    name: function (arg) {
      return arg.name
    }
  }
}
</script>
