<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawerOpen" app clipped width=350>
      <control/>
    </v-navigation-drawer>


    <v-app-bar app clipped-left >
      <v-app-bar-nav-icon @click.stop="toggleDrawer()" />
      <v-toolbar-title>Plato3D</v-toolbar-title>

      <v-spacer></v-spacer>

      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-lightbulb-outline</v-icon>
       </template>
        <lighting-settings/>
      </p-menu>

      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-border-all</v-icon>
        </template>
        <grid-settings/>
      </p-menu>

    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid >
        <v-row align="center" justify="center" >
          <v-col class="shrink">
            <three-renderer/>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import GridSettings from './components/settings/GridSettings'
import ThreeRenderer from './components/ThreeRenderer'
import LightingSettings from './components/settings/LightingSettings'
import Control from './components/Control'
import PMenu from './components/ui/PMenu'

export default {
  name: 'App',
    components: {GridSettings, LightingSettings, ThreeRenderer, Control, PMenu},
    props: {
      source: String,
    },
    data: () => ({
      drawerOpen: false
    }),
    methods: {
      toggleDrawer: function () {
        this.drawerOpen = !this.drawerOpen
      }
    },
    created () {
      this.$vuetify.theme.dark = true
      this.$store.commit('initialize')
    }
};
</script>
