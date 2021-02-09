<template>
  <v-card>
    <v-form @submit.prevent>
      <v-container>
        <v-row>
          <v-col>
            <v-checkbox dense class="ma-0 pa-0" :label="`Hemisphere: ${hemisphere_display.toString()}`" v-model="hemisphere_display"/>
            <v-checkbox dense class="ma-0 pa-0" :label="`Ambient: ${ambient_display.toString()}`" v-model="ambient_display"/>
            <v-card outlined class="mb-2">
              <v-checkbox dense class="ma-0 pa-0" :label="`Directional: ${directional_display.toString()}`" v-model="directional_display"/>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="directional_X" label="X"/>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="directional_Y" label="Y"/>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="directional_Z" label="Z"/>
            </v-card>
            <v-card outlined class="mb-2">
              <v-checkbox dense class="ma-0 pa-0" :label="`Spotlight: ${spot_display.toString()}`" v-model="spot_display"/>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="spot_X" label="X"/>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="spot_Y" label="Y"/>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="spot_Z" label="Z"/>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" v-model="spot_angle" label="Angle"/>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'lighting-settings',
  computed: {
    ambient_display: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['ambient','display'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.ambient.display }
    },
    hemisphere_display: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['hemisphere','display'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.hemisphere.display }
    },
    directional_display: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['directional','display'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.directional.display }
    },
    directional_X: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['directional','X'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.directional.X }
    },
    directional_Y: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['directional','Y'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.directional.Y }
    },
    directional_Z: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['directional','Z'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.directional.Z }
    },
    spot_display: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['spot','display'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.spot.display }
    },
    spot_X: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['spot','X'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.spot.X }
    },
    spot_Y: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['spot','Y'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.spot.Y }
    },
    spot_Z: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['spot','Z'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.spot.Z }
    },
    spot_angle: {
      set: function (newVal) { this.$store.commit('setLightingSettings', {keys: ['spot','angle'], val: newVal, graphics: this.$graphics}) },
      get: function () { return this.$store.state.sceneSettings.lighting.spot.angle }
    }
  },
  created: function () {
    this.$store.commit('initializeLighting', this.$graphics)
  }
}
</script>
