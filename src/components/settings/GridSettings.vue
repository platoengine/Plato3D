<template>
  <v-card>
    <v-form @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field dense class="ma-0 pa-0" v-model="size" label="Size"/>
            <v-text-field dense class="ma-0 pa-0" v-model="divs" label="Divs"/>
            <v-checkbox dense class="ma-0 pa-0" :label="`X: ${displayGridX.toString()}`" v-model="displayGridX"/>
            <v-checkbox dense class="ma-0 pa-0" :label="`Y: ${displayGridY.toString()}`" v-model="displayGridY"/>
            <v-checkbox dense class="ma-0 pa-0" :label="`Z: ${displayGridZ.toString()}`" v-model="displayGridZ"/>
            <v-checkbox dense class="ma-0 pa-0" :label="`At origin: ${displayGridZ.toString()}`" v-model="gridAtCenter"/>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'grid-settings',
  computed: {
    size: {
      set: function(newVal) {
        this.$store.commit('setGridSettings', {key: 'size', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.grid.size
      }
    },
    divs: {
      set: function(newVal) {
        if (isNaN(parseInt(newVal))) {
          newVal = 1
        } else
        if (newVal > 100) {
          newVal = 100
        } else
        if (newVal <= 0) {
          newVal = 1
        }
        this.$store.commit('setGridSettings', {key: 'divs', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.grid.divs
      }
    },
    displayGridX: {
      set: function(newVal) {
        this.$store.commit('setGridSettings', {key: 'showX', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.grid.showX
      }
    },
    displayGridY: {
      set: function(newVal) {
        this.$store.commit('setGridSettings', {key: 'showY', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.grid.showY
      }
    },
    displayGridZ: {
      set: function(newVal) {
        this.$store.commit('setGridSettings', {key: 'showZ', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.grid.showZ
      }
    },
    gridAtCenter: {
      set: function(newVal) {
        this.$store.commit('setGridSettings', {key: 'AtCenter', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.grid.AtCenter
      }
    }
  },
  created: function () {
    this.$store.commit('initializeGrid', this.$graphics)
  }
}
</script>
