<template>
  <v-app id="inspire">
    <item-detail/>
    <p-important-info/>
    <opt-view-detail/>

    <v-app-bar app clipped-left >
      <v-app-bar-nav-icon :disabled="loggedIn===false" @click.stop="toggleDrawer()" />
      <v-toolbar-title>Plato3D</v-toolbar-title>
      <v-spacer></v-spacer>
       
      <div v-if="loggedIn">
      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-help-circle-outline</v-icon>
        </template>
        <tooltipToggler />
        <Help/>
      </p-menu>      

      <v-btn icon @click="reset_scene"><v-icon>mdi-cube-scan</v-icon></v-btn>
       
      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-console</v-icon>
        </template>
          <v-card>
          <v-card-text class="pa-0">
          <v-textarea outlined class="p-console" style="padding:12px;"
            :no-resize=true :reverse=true :readonly=true id="error-console" disabled/>
          <v-btn x-small block @click="openConsole()">Open Console</v-btn>
          </v-card-text>
          </v-card>
      </p-menu>

      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-cube-outline</v-icon>
        </template>
        <p-menu>
          <template v-slot:button>
            <v-icon>mdi-help-circle-outline</v-icon>
          </template>
          <tooltipToggler />       
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
      </p-menu>
      </div>

      <p-menu>
        <template v-slot:button>
          <v-icon>mdi-power</v-icon>
        </template>
        <login/>
      </p-menu>

    </v-app-bar>

    <v-container class="px-0 mx-0 fill-height" fluid >
      <v-row class="pa-0 ma-0" align="center" justify="center" >
        <v-col class="pa-0 ma-0 shrink">
          <three-renderer/>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer v-model="drawerOpen" app clipped :width="drawerWidth">
      <control v-on:set-width="setWidth($event)"/>
    </v-navigation-drawer>

    <v-footer app>
      <span>&copy; 2022</span>
    </v-footer>
  </v-app>
</template>

<script>
import Login from './components/Login'
import PImportantInfo from './components/ui/PImportantInfo'
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
      PImportantInfo,
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
      drawerOpen: false,
      drawerWidth: 293
    }),
    computed: {
      loggedIn: function () {
        return this.$store.state.session.data.authenticated
      }
    },
    methods: {
      setWidth(newWidth){
        this.drawerWidth = newWidth
      },
      toggleHelpSetup(){
        this.disablehelp = !this.disablehelp
      },
      toggleDrawer: function () {
        this.drawerOpen = !this.drawerOpen
      },
      reset_scene: function () {
        this.$graphics.controls.reset()
      },
      openConsole: function () {
        this.$store.commit('setSystemInfoModalState', true)
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
#scene {
  background: linear-gradient(to bottom,  #111111 0%,#999999 100%);
}
.v-navigation-drawer {
z-index: 999999 !important;
}

</style>

