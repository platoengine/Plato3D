<template>
  <v-card class="ma-0 pa-0" color=green>
    <v-card class="pt-4 ml-2">
      <v-text-field dense class="ml-2 ma-0 pa-0 caption" @change="pending=true" v-model="numProcs" label="# Processors"/>
      <v-btn text block small @click="save()" :disabled="pending==false">Update</v-btn>
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'realization-resources',
  props: ['parentObject'],
  data: function () {
    return { state: {numProcs: 1}, pending: false }
  },
  computed: {
    numProcs: {
      get: function () {
        return this.parentObject.resources.numProcs
      },
      set: function (newVal) {
        this.state.numProcs = newVal
      }
    }
  },
  methods: {
    save: function () {
      this.$store.commit('setRealizationResources', {realizationName: this.parentObject.name, numProcs: this.state.numProcs})
    }
  }
}
</script>
