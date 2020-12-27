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
        this.$store.commit('setSceneSettings', {key: 'size', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.size
      }
    },
    divs: {
      set: function(newVal) {
        this.$store.commit('setSceneSettings', {key: 'divs', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.divs
      }
    },
    displayGridX: {
      set: function(newVal) {
        this.$store.commit('setSceneSettings', {key: 'showX', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.showX
      }
    },
    displayGridY: {
      set: function(newVal) {
        this.$store.commit('setSceneSettings', {key: 'showY', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.showY
      }
    },
    displayGridZ: {
      set: function(newVal) {
        this.$store.commit('setSceneSettings', {key: 'showZ', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.showZ
      }
    },
    gridAtCenter: {
      set: function(newVal) {
        this.$store.commit('setSceneSettings', {key: 'AtCenter', val: newVal, graphics: this.$graphics})
      },
      get: function() {
        return this.$store.state.sceneSettings.AtCenter
      }
    }
  },
  created: function () {
    this.$store.commit('initializeScene', this.$graphics)
  }
}
</script>
