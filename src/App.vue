<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pa-0">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content class="d-flex">
            <v-menu class="px-0" :close-on-content-click="false" offset-x transition="slide-x-transition">
              <template v-slot:activator="{ on }">
                <v-card class="d-flex" v-on="on">Settings</v-card>
              </template>
              <v-card>
                <v-menu :close-on-content-click="false" offset-x transition="slide-x-transition">
                  <template v-slot:activator="{ on }">
                    <v-card v-on="on">Grid</v-card>
                  </template>
                  <grid-settings/>
                </v-menu>
                <v-menu :close-on-content-click="false" offset-x transition="slide-x-transition">
                  <template v-slot:activator="{ on }">
                    <v-card v-on="on">Lighting</v-card>
                  </template>
                  <lighting-settings/>
                </v-menu>
              </v-card>
            </v-menu>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Plato3D</v-toolbar-title>
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
import GridSettings from './components/GridSettings'
import ThreeRenderer from './components/ThreeRenderer'
import LightingSettings from './components/LightingSettings'

export default {
  name: 'App',
    components: {GridSettings, LightingSettings, ThreeRenderer},
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
    created () {
      this.$vuetify.theme.dark = true
    }
};
</script>
