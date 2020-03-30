<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped >
      <v-tabs>
      <v-tab>
        <v-icon>mdi-shape-outline</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-wrench-outline</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-pencil-outline</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-code-braces</v-icon>
      </v-tab>
    </v-tabs>
    </v-navigation-drawer>

    <v-app-bar app clipped-left >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Plato3D</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu :close-on-content-click="false" offset-x transition="slide-x-transition" bottom left offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-lightbulb-outline</v-icon>
          </v-btn>
        </template>
        <lighting-settings/>
      </v-menu>

      <v-menu :close-on-content-click="false" offset-x transition="slide-x-transition" bottom left offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-border-all</v-icon>
          </v-btn>
        </template>
        <grid-settings/>
      </v-menu>

      <v-menu :close-on-content-click="false" offset-x transition="slide-x-transition" bottom left offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-content-save-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-text>Save</v-list-item-text>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-folder-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-text>Load</v-list-item-text>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-information-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-text>About</v-list-item-text>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

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
