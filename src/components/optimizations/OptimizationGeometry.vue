<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-card outlined class="pl-2 pr-2">
        <v-text-field autocomplete="off" label="Filter Radius" dense class="ml-2 ma-0 pa-0 body-2" v-model="filterRadius"/>
        <v-text-field autocomplete="off" label="Initial Value" dense class="ml-2 ma-0 pa-0 body-2" v-model="initialValue"/>
<!--
        <v-checkbox label="Apply Filter" dense class="ml-2 ma-0 pa-0 body-2" v-model="applyFilter"/>
-->
      </v-card>
      <v-card>
        <v-card-title class="ml-2 pa-0 subtitle-1">Fixed Blocks</v-card-title>
        <v-card class="pa-0 ml-2" v-for="(modelName, modelIndex) in modelNames" :key="modelIndex">
          <v-card-title class="ml-2 pa-0 caption">model: {{ modelName }}</v-card-title>
<!--
          <v-checkbox v-for="(blockName, blockIndex) in blockNames(modelName)" dense class="ma-0 pa-0" :label="blockName" v-model="fixBlock(blockIndex)" :key="blockIndex"/>
-->
          <p-checkbox v-for="(blockName, blockIndex) in blockNames(modelName)"
            :key="blockIndex"
            :label="blockName"
            :state="getFixedBlock(modelName, blockName)"
            @change-state="setFixedBlock(modelName, blockName, $event)"/>
        </v-card>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>

import PCheckbox from '../ui/PCheckbox'

export default {
  name: 'optimization-geometry',
  props: ['optimization'],
  components: {PCheckbox},
  methods: {
    setFixedBlock: function (modelName, blockName, isFixed) {
      this.$store.commit('setOptimizationFixedBlock', {
        optimizationName: this.optimization.name,
        model: modelName,
        block: blockName,
        isFixed: isFixed
      })
    },
    getFixedBlock: function (modelName, blockName) {
      let fixedBlockNames = this.optimization.fixedBlocks[modelName]
      return fixedBlockNames.filter(fixedBlockName => fixedBlockName === blockName).length === 0 ? false : true
    },
    blockNames: function (modelName) {
      let names = []
      let models = this.$store.state.models
      const entryIndex = models.findIndex((m) => m.name === modelName)
      if (entryIndex !== -1) {
        models[entryIndex].primitives.forEach( (p) => {
          if (p.type === 'block') {
            names.push(p.definition.Name)
          }
        })
      }
      return names
    }
  },
  computed: {
    modelNames: function () {
      // currently optimizations aren't allowed to have more than one underlying model
      // this is here for when multi-model optimizations are allowed.
      return this.optimization.uniqueModels()
    },
    filterRadius: {
      get: function () {
        return this.optimization.filterRadius
      },
      set: function (newValue) {
        this.$store.commit('setOptimizationKeysValue', {name: this.optimization.name, keys: ['filterRadius'], value: newValue})
      }
    },
    initialValue: {
      get: function () {
        return this.optimization.initialValue
      },
      set: function (newValue) {
        this.$store.commit('setOptimizationKeysValue', {name: this.optimization.name, keys: ['initialValue'], value: newValue})
      }
    },
    applyFilter: {
      get: function () {
        return this.optimization.applyFilter
      },
      set: function (newValue) {
        this.$store.commit('setOptimizationKeysValue', {name: this.optimization.name, keys: ['applyFilter'], value: newValue})
      }
    }
  }
}
</script>
