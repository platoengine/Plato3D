<template>
  <v-dialog v-model="isOpen" persistent max-width="300px" origin='top left'>
    <v-card outlined>
      <v-card-title class="ma-0 pa-0 pl-2"> <span class="headline">Display</span> </v-card-title>
      <v-card-text class="pa-0 ma-0">
        <v-container class="pa-0 ma-0">
            <v-col>
              <v-row no-gutters>
                <v-col><v-slider v-model="opacity" label="Opacity" :min="0.0" :max="1.0" step="0.05"></v-slider></v-col>
                <v-col cols="1"><v-text-field autocomplete="off" dense :disabled="true" class="ma-0 pa-0" v-model="opacity"/></v-col>
              </v-row>
              <v-row no-gutters>
                <v-col><v-checkbox dense class="ma-0 pa-0" label="Visible" v-model="visible"/></v-col>
                <v-col><v-checkbox dense class="ma-0 pa-0" label="Wireframe" v-model="wireframe"/></v-col>
              </v-row>
            </v-col>
        </v-container>
      </v-card-text>
    </v-card>
    <v-btn text @click.stop="isOpen = false">Okay</v-btn>
  </v-dialog>
</template>


<script>
export default {
  name: 'opt-view-detail',
  computed: {
    opacity: {
      get: function () {
        if (this.$store.state.active.optimization) {
          return this.$store.state.active.optimization.display.opacity
        } else {
          return 1.0
        }
      },
      set: function (newValue) {
        this.$store.commit('setOptDisplayAttributes', { graphics: this.$graphics, attribute: 'opacity', value: newValue })
      }
    },
    wireframe: {
      get: function () {
        if (this.$store.state.active.optimization) {
          return this.$store.state.active.optimization.display.wireframe
        } else {
          return false
        }
      },
      set: function (newValue) {
        this.$store.commit('setOptDisplayAttributes', { graphics: this.$graphics, attribute: 'wireframe', value: newValue })
      }
    },
    visible: {
      get: function () {
        if (this.$store.state.active.optimization) {
          return this.$store.state.active.optimization.display.visible
        } else {
          return true
        }
      },
      set: function (newValue) {
        this.$store.commit('setOptDisplayAttributes', { graphics: this.$graphics, attribute: 'visible', value: newValue })
      }
    },
    isOpen: {
      get: function () {
        return this.$store.state.ui.showOptViewDetail
      },
      set: function () {
        this.$store.commit('closeOptViewDetail')
      }
    }
  }
}
</script>

<style scoped>
p {
  width: 120px;
  font-size: 10px;
  margin: 1px;
  padding-left: 4px;
}
.info-card {
  padding: 1px;
  padding-left: 6px;
  background-color: #BBBBBB;
  margin: 0px;
  width: 100%;
  color: #FFFFFF;
  text-align: left;
}
</style>
