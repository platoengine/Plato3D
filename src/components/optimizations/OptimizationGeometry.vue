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
      <v-card class="pa-0 ml-2" v-for="(modelName, modelIndex) in modelNames" :key="modelIndex">
        <v-card-title class="ml-2 pa-0 subtitle-1">model: {{ modelName }}</v-card-title>
        <v-card>
          <v-card-title class="ml-2 pa-0 caption">Fixed Blocks</v-card-title>
          <p-checkbox v-for="(blockName, blockIndex) in blockNames(modelName)"
            :key="blockIndex"
            :label="blockName"
            :state="getFixedBlock(modelName, blockName)"
            @change-state="setFixedBlock(modelName, blockName, $event)"/>
        </v-card>
        <v-card>
          <v-card-title class="ml-2 pa-0 caption">Symmetry</v-card-title>
          <p-checkbox label="X" :state="getSymmetry(modelName, 'X')" @change-state="setSymmetry(modelName, 'X', $event)"/>
          <p-checkbox label="Y" :state="getSymmetry(modelName, 'Y')" @change-state="setSymmetry(modelName, 'Y', $event)"/>
          <p-checkbox label="Z" :state="getSymmetry(modelName, 'Z')" @change-state="setSymmetry(modelName, 'Z', $event)"/>
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
    setSymmetry: function (modelName, direction, isSym) {
      this.$store.commit('setOptimizationSymmetry', {
        optimizationName: this.optimization.name,
        model: modelName,
        direction: direction,
        isSymmetric: isSym
      })
    },
    setFixedBlock: function (modelName, blockName, isFixed) {
      this.$store.commit('setOptimizationFixedBlock', {
        optimizationName: this.optimization.name,
        model: modelName,
        block: blockName,
        isFixed: isFixed
      })
    },
    getSymmetry: function (modelName, direction) {
      let index = this.optimization.symmetry.findIndex( entry => entry.modelName === modelName )
      if (index !== -1) {
        return this.optimization.symmetry[index][direction]
      } else {
        return false
      }
    },
    getFixedBlock: function (modelName, blockName) {
      let index = this.optimization.fixedBlocks.findIndex( entry => entry.modelName === modelName )
      if (index !== -1) {
        let fixedBlockNames = this.optimization.fixedBlocks[index].blockNames
        return fixedBlockNames.filter(fixedBlockName => fixedBlockName === blockName).length === 0 ? false : true
      } else {
        return false
      }
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
