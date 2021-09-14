<template>
  <v-card class="ml-0">
    <v-card class="d-flex justify-space-between">
      <v-btn small min-width=20px @click="remove()"><v-icon medium>$vuetify.icons.discard</v-icon></v-btn>
      <v-btn small min-width=20px @click="toggleWireframe()">
        <v-icon v-if="isWireframe" medium>$vuetify.icons.wireframe</v-icon>
        <v-icon v-else medium>$vuetify.icons.solid</v-icon>
      </v-btn>
    </v-card>
  </v-card>
</template>

<script>

export default {
  name: 'modify-view',
  props: ['parentObject', 'viewID', 'panelIsOpen'],
  data: function () {
    return {stateIsVisible: '', stateIsWireframe: ''}
  },
  mounted: function () {
    let thisView = this.parentObject.simulation.views.find(p => p.viewID === this.viewID)
    this.stateIsVisible = thisView.isVisible
    this.stateIsWireframe = thisView.isWireframe
  },
  watch: {
    panelIsOpen: function(newVal) {
      this.isVisible = newVal
    }
  },
  computed: {
    isVisible: {
      get: function () {
        let thisView = this.parentObject.simulation.views.find(p => p.viewID === this.viewID)
        return thisView.isVisible
      },
      set: function (newValue) {
        this.stateIsVisible = newValue
        this.apply()
      }
    },
    isWireframe: {
      get: function () {
        let thisView = this.parentObject.simulation.views.find(p => p.viewID === this.viewID)
        return thisView.isWireframe
      },
      set: function (newValue) {
        this.stateIsWireframe = newValue
        this.apply()
      }
    }
  },
  methods: {
    toggleVisible: function () {
      this.isVisible = !(this.isVisible)
    },
    toggleWireframe: function () {
      this.isWireframe = !(this.isWireframe)
    },
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
