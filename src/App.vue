<template>
  <v-app id="inspire">
    <item-detail/>
    <opt-view-detail/>

    <v-app-bar app clipped-left >
      <v-app-bar-nav-icon @click.stop="toggleDrawer()" />
      <v-toolbar-title>Plato3D</v-toolbar-title>
      <v-spacer></v-spacer>
       
      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-help-circle-outline</v-icon>
        </template>
        <tooltipToggler />
        <Help/>
      </p-menu>      

      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-console</v-icon>
        </template>
          <v-card>
          <v-textarea outlined class="p-console" style="padding:12px;"
            :no-resize=true :reverse=true :readonly=true id="error-console" disabled/>
          </v-card>
      </p-menu>

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

      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-cog-outline</v-icon>
        </template>
        <login/>
      </p-menu>

    </v-app-bar>

    <v-container class="px-0 fill-height" fluid >
      <v-row align="center" justify="center" >
        <v-col class="shrink">
          <three-renderer/>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer v-model="drawerOpen" app clipped width=293>
      <control/>
    </v-navigation-drawer>

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import Login from './components/Login'
import GridSettings from './components/settings/GridSettings'
import ThreeRenderer from './components/ThreeRenderer'
import LightingSettings from './components/settings/LightingSettings'
import ItemDetail from './components/settings/ItemDetail'
import OptViewDetail from './components/settings/OptViewDetail'
import Control from './components/Control'
import PMenu from './components/ui/PMenu'
import TooltipToggler from './components/settings/tooltipToggler'
import Help from './components/Help'
export default {
  name: 'App',
    components: {
      GridSettings,
      LightingSettings,
      ItemDetail,
      OptViewDetail,
      ThreeRenderer,
      Control,
      Login,
      PMenu,
      TooltipToggler,
      Help
    },
    props: {
      source: String,
    },
    data: () => ({
      drawerOpen: false
    }),
    methods: {
      toggleHelpSetup(){
        this.disablehelp = !this.disablehelp
      },
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
<style>
.p-console {
    font-size: 0.6em;
    padding: 2px;
}
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: gray;
  border-radius: 4px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background:DarkGray;
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: LightGray;
  border-radius: 4px;
}
.v-label {
  font-size: 10px
}
</style>

