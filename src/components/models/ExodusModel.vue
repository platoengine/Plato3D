<template>
  <v-card>
    <div v-if= "isLoading && (!loaded)">
      <div class="text-center">
        <div class="text-h6">Loading</div>
        <div><v-progress-linear indeterminate color="primary" ></v-progress-linear></div>
      </div>
    </div>
    <div v-if ="!isLoading">
      <load-model v-if="!loaded" v-on:load-model='loadModel($event)'/>
    </div>
    <v-card :class="'d-flex justify-space-between'">
      <v-container>
        <v-row>
          <v-col class="pa-0 ma-0">
            <template v-for="(item,index) in primitives">
              <v-hover v-slot:default="{ hover }" :key="index">
                <v-card @click="select(item)" :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
                  <v-card-actions>
                    <v-btn small @click="open(item)"> <v-icon dense>mdi-information-outline</v-icon></v-btn>
                    <div class="entity-title">{{item.definition.Name}}</div>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card :class="'d-flex justify-space-between'">
      <import-model @load-model="loadModel($event)"/>
      <delete-model :model="model"/>
      <edit-model :model="model"/>
      <v-btn small>
        <v-icon>mdi-folder-download</v-icon>
      </v-btn>
    </v-card>
  </v-card>
</template>

<script>
import LoadModel from './LoadModel'
import ImportModel from './ImportModel'
import DeleteModel from './DeleteModel'
import EditModel from './EditModel'
import ErrorHandler from '../../store/modules/error-handler-module'
import {OBJLoader} from 'three-obj-mtl-loader'


const errorHandler = new ErrorHandler()

export default {
  name: 'exodus-model',
  props: ['model'],
  components: {
    LoadModel,
    ImportModel,
    DeleteModel,
    EditModel
  },
  data: function () {
    return { isLoading: false}
  },
  computed: {
    primitives: function () {
      return this.model.primitives
    },
    selectedPrimitive: function () {
      return this.$store.state.ui.showItemDetailPrimitive
    },
    loaded: function () {
      const tLoaded = this.model.primitives.length!==0
      return tLoaded
    }
  },
  mounted () {
    const appThis = this
    this.$store.commit('addEventListener', {
      aName: 'modelRemoteData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        const dataObject = JSON.parse(data)
        appThis.$store.commit('setModelRemoteData', {
          remoteName: dataObject.remoteName,
          remotePath: dataObject.remotePath
        })
      }
    })
    this.$store.commit('addEventListener', {
      aName: 'modelGeometryData',
      aFunction: function (event) {
        const {isTrusted, data, origin} = event
        errorHandler.report('source: ' + origin)
        errorHandler.report('trusted source: ' + isTrusted)
        const dataObject = JSON.parse(data)
        const {modelName, name: geometryName, type: geometryType, id: geometryID, data: geometryData} = dataObject
        const loader = new OBJLoader()
        const url = URL.createObjectURL(new Blob([geometryData]))
        loader.load(url, (geometry) => {
          this.isLoading = false;
          appThis.$store.commit('addObj', {
            modelName: modelName,
            name: geometryName,
            id: geometryID,
            type: geometryType,
            geometry: geometry,
            graphics: appThis.$graphics
          });

        }, undefined, function (error) { errorHandler.report(error) })
      }
    })
  },
  methods: {
    loadModel: function (eventData) {
      // change the model name to the filename of the loaded model
      //
      this.isLoading = true;
      let modelName = eventData.get('name')

      this.$store.commit('setModelAttributes', {
        currentName: this.model.name,
        modelAttributes: {
          name: modelName,
          description: null
        }})

      // set the newly loaded model as the active model.
      //
      this.$store.commit('setActiveModel', this.model.name)

      // upload the model to the back-end which triggers SSEs that load the model into the scene.
      //
      this.$store.dispatch('uploadExodusModel', eventData)

    },
    open: function (primitive) {
      this.$store.commit('setActiveModel', this.model.name)
      this.$store.commit('openSelected', {model: this.model, primitive: primitive, surface: null})
    },
    select: function (primitive) {
      this.$store.commit('showSelected', {model: this.model, primitive: primitive, graphics: this.$graphics})
    }
  }
}
</script>

<style scoped>
.entity-title {
  margin-left: 6px;
}
.v-card {
  transition: opacity .2s ease-in-out;
}

.v-card .on-hover  {
  outline-style: solid;
  outline-width: 1px;
  outline-color: rgba(55, 55, 55, 1) !important;
 }

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>
