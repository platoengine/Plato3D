<template>
  <v-card class="ml-2">
    <v-checkbox dense class="ma-0 pa-0 v-label" v-model="isVisible" label="Visible"/>
    <v-checkbox dense class="ma-0 pa-0 v-label" v-model="isWireframe" label="Wireframe"/>
    <v-btn block small @click="apply()" type="button">Apply</v-btn>
    <v-btn block small @click="remove()" type="button">Remove</v-btn>
  </v-card>
</template>

<script>

export default {
  name: 'modify-view',
  props: ['parentObject', 'viewID'],
  data: function () {
    return {stateIsVisible: '', stateIsWireframe: ''}
  },
  mounted: function () {
    let thisView = this.parentObject.simulation.views.find(p => p.viewID === this.viewID)
    this.stateIsVisible = thisView.isVisible
    this.stateIsWireframe = thisView.isWireframe
  },
  computed: {
    isVisible: {
      get: function () {
        let thisView = this.parentObject.simulation.views.find(p => p.viewID === this.viewID)
        return thisView.isVisible
      },
      set: function (newValue) {
        this.stateIsVisible = newValue
      }
    },
    isWireframe: {
      get: function () {
        let thisView = this.parentObject.simulation.views.find(p => p.viewID === this.viewID)
        return thisView.isWireframe
      },
      set: function (newValue) {
        this.stateIsWireframe = newValue
      }
    }
  },
  methods: {
    apply: function () {
      this.$store.commit('modifyView',
        {
          parentObject: this.parentObject,
          definition: {
            viewID: this.viewID,
            isVisible: this.stateIsVisible,
            isWireframe: this.stateIsWireframe
          },
          graphics: this.$graphics
        }
      )
    },
    remove: function () {
      this.$store.commit('removeView',
        {
          parentObject: this.parentObject,
          viewID: this.viewID,
          graphics: this.$graphics
        }
      )
    }
  }
}
</script>
