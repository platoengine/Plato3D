<template>
  <v-dialog v-model="isOpen" persistent max-width="300px" origin='top left'>
    <v-card v-if="displayedPrimitive !== null" outlined>
      <v-card-title class="ma-0 pa-0 pl-2"> <span class="headline">Volume</span> </v-card-title>
      <v-card-text class="ma-0 pa-0 pl-4">Type: {{displayedPrimitive.definition.Type}}</v-card-text>
      <v-card-text class="ma-0 pa-0 pl-4">Name: {{displayedPrimitive.definition.Name}}</v-card-text>
      <v-card-text class="ma-0 pa-0 pl-4">Id: {{displayedPrimitive.primitiveObjectID}}</v-card-text>
    </v-card>
    <v-card v-if="displayedSurface !== null">
      <v-card-title> <span class="headline">Surface</span> </v-card-title>
      <v-card-text>Id: {{displayedSurface.id}}</v-card-text>
    </v-card>
    <v-card outlined>
      <v-card-title class="ma-0 pa-0 pl-2"> <span class="headline">Display</span> </v-card-title>
      <v-card-text class="pa-0 ma-0">
        <v-container class="pa-0 ma-0">
            <v-col>
              <v-row no-gutters>
                <v-col><v-slider v-model="opacityView" label="Opacity" :min="0.0" :max="1.0" step="0.05"></v-slider></v-col>
                <v-col cols="1"><v-text-field autocomplete="off" dense :disabled="true" class="ma-0 pa-0" v-model="opacityView"/></v-col>
              </v-row>
              <v-row no-gutters>
                <v-col><v-checkbox dense class="ma-0 pa-0" label="Visible" v-model="visibleView"/></v-col>
                <v-col><v-checkbox dense class="ma-0 pa-0" label="Wireframe" v-model="wireframeView"/></v-col>
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
  name: 'item-detail',
  data: function () {
    return {
      dialog: false, 
      primitiveState: {
        id: -1,
        opacity: 1.0,
        wireframe: false,
        visible: true,
        pending: false
      },
      surfaceState: {
        id: -1,
        alias: '',
        pending: false
      }
    }
  },
  computed: {
    aliasView: {
      get: function () {
        this.setDefaults()
        return this.surfaceState.alias
      },
      set: function (newValue) {
        this.surfaceState.alias = newValue
      }
    },
    opacityView: {
      get: function () {
        this.setDefaults()
        return this.primitiveState.opacity
      },
      set: function (newValue) {
        this.primitiveState.opacity = newValue
        this.setDisplayAttributes()
      }
    },
    wireframeView: {
      get: function () {
        this.setDefaults()
        return this.primitiveState.wireframe
      },
      set: function (newValue) {
        this.primitiveState.wireframe = newValue
        this.setDisplayAttributes()
      }
    },
    visibleView: {
      get: function () {
        this.setDefaults()
        return this.primitiveState.visible
      },
      set: function (newValue) {
        this.primitiveState.visible = newValue
        this.setDisplayAttributes()
      }
    },
    isOpen: {
      get: function () {
        return this.$store.state.ui.showItemDetail
      },
      set: function () {
        this.$store.commit('closeItemDetail')
      }
    },
    displayedPrimitive: function () {
      return this.$store.state.ui.showItemDetailPrimitive
    },
    displayedSurface: function () {
      const id = this.$store.state.ui.showItemDetailSurfaceID
      if (id !== null) {
        const surface = this.$graphics.scene.getObjectById(id)
        return surface
      } else {
        return null
      }
    }
  },
  methods: {
    setSurfacePending: function () {
      this.surfaceState.pending = true
    },
    setPrimitivePending: function () {
      this.primitiveState.pending = true
    },
    setSurfaceAlias: function () {
      this.$store.commit('setSurfaceAlias',
        {
          name: this.surfaceState.alias,
          model: this.$store.state.ui.showItemDetailModel,
          primitive: this.$store.state.ui.showItemDetailPrimitive,
          surfaceID: this.$store.state.ui.showItemDetailSurfaceID
        })
      this.surfaceState.pending = false
    },
    setDisplayAttributes: function () {
      this.$store.commit('setDisplayAttributes',
        {
          model: this.$store.state.ui.showItemDetailModel,
          payload: {
            graphics: this.$graphics,
            primitive: this.displayedPrimitive,
            attributes: {
              opacity: this.primitiveState.opacity,
              wireframe: this.primitiveState.wireframe,
              visible: this.primitiveState.visible
            }
          }
        })
      this.primitiveState.pending = false
    },
    setDefaults: function () {
      let primitive = this.$store.state.ui.showItemDetailPrimitive
      if (primitive !== null) {
        let primitiveObjectID = primitive.primitiveObjectID
        if (primitiveObjectID !== this.primitiveState.id) {
          this.primitiveState.id = primitiveObjectID
          this.primitiveState.opacity = primitive.displayAttributes.opacity
          this.primitiveState.wireframe = primitive.displayAttributes.wireframe
          this.primitiveState.visible = primitive.displayAttributes.visible
        }
      }

      let surfaceID = this.$store.state.ui.showItemDetailSurfaceID
      let model = this.$store.state.ui.showItemDetailModel
      if (surfaceID !== null && model !== null) {
        if (surfaceID !== this.surfaceState.id) {
          this.surfaceState.id = surfaceID
          let boundaries = model.boundaries
          if (boundaries !== null && typeof boundaries !== 'undefined') {
            let bIndex = boundaries.findIndex(b => b.surface.id === surfaceID)
            if (bIndex === -1) {
              this.surfaceState.alias = ''
            } else {
              this.surfaceState.alias = boundaries[bIndex].name
            }
          }
        }
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
