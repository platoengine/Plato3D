<template>
  <v-card>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-checkbox class="ma-0 pa-0" :label="`Hemisphere: ${hemisphere.display.toString()}`" v-model="hemisphere.display"/>
            <v-checkbox class="ma-0 pa-0" :label="`Ambient: ${ambient.display.toString()}`" v-model="ambient.display"/>
            <v-card>
              <v-text-field class="ma-0 pa-0" v-model="directional.X" label="X"/>
              <v-text-field class="ma-0 pa-0" v-model="directional.Y" label="Y"/>
              <v-text-field class="ma-0 pa-0" v-model="directional.Z" label="Z"/>
              <v-checkbox class="ma-0 pa-0" :label="`Directional: ${directional.display.toString()}`" v-model="directional.display"/>
            </v-card>
            <v-card>
              <v-text-field class="ma-0 pa-0" v-model="spot.X" label="X"/>
              <v-text-field class="ma-0 pa-0" v-model="spot.Y" label="Y"/>
              <v-text-field class="ma-0 pa-0" v-model="spot.Z" label="Z"/>
              <v-text-field class="ma-0 pa-0" v-model="spot.angle" label="Angle"/>
              <v-checkbox class="ma-0 pa-0" :label="`Spotlight: ${spot.display.toString()}`" v-model="spot.display"/>
            </v-card>
            <v-btn @click="apply" small>Apply</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'lighting-settings',
  data: function () {
    return {
      directional: {
        display: true,
        X: 10,
        Y: 10,
        Z: 10
      },
      hemisphere: {
        display: true
      },
      ambient: {
        display: true
      },
      spot: {
        display: true,
        X: 15,
        Y: 40,
        Z: 35,
        angle: 7.5
      }
    }
  },
  created: function () {
    this.apply()
  },
  methods: {
    apply: function () {
      this.$graphics.setLighting({
        directional: this.directional,
        hemisphere: this.hemisphere,
        ambient: this.ambient,
        spot: this.spot
      })
    }
  }
}
</script>
