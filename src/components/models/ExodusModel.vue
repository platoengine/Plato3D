<template>
  <v-card class="ma-0 pa-0">
    <v-btn-toggle v-model="toggle_one" shaped dense group>
      <import-model @load-model="loadModel($event)"/>

      <delete-model :model="model"/>

      <edit-model :model="model"/>

      <v-btn small @click="exportModel">
        <v-icon>mdi-folder-download</v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-card>
<!--
  <b-card no-body class="text-right list-item" v-bind:class="{ 'list-item-open': openModel }">
    <b-card no-body>
      <b-collapse v-model="openModel" v-bind:id="displayID" accordion="ModelEntryAccordion">
        <b-card class=list-item v-bind:class="{ 'list-item-open': openAttributes }" no-body>
          <b-collapse v-model="openAttributes" id="modelAttributesPanel" accordion="ModelTreeAccordion">
            <b-form>
              <b-form-group class="m-0 basic-label" label="Name:" label-cols="5">
                <b-form-input class="basic-input" @change="pending=true" type="text" v-model="modelName"></b-form-input>
              </b-form-group>
              <b-form-group class="m-0 basic-label" label="Description:" label-cols="5">
                <b-form-textarea class="basic-textarea" v-on:input="pending=true" :rows="3" v-model="modelDescriptionState"></b-form-textarea>
              </b-form-group>
              <b-btn size="sm" class="thin-button" block @click="update" :disabled="!pending" type="button">Update</b-btn>
            </b-form>
          </b-collapse>
          <div class=bold @click="togglePrimitives">
            <down-right :down="openPrimitives" :title="'Primitives'"/>
          </div>
          <b-collapse v-model="openPrimitives" id="modelPrimitivesPanel" accordion="ModelTreeAccordion">
            <scrollable-component :items=model.primitives>
              <template v-slot="{ item, index }">
                <b-card no-body class=bold-sub @click="select(item)">
                  <p class="content">
                    <b-btn size="sm" class="small-button" @click="open(item)"> <octicon name="info"></octicon> </b-btn>
                    name: {{item.definition.Name}} Type: {{item.definition.Type}}
                  </p>
                </b-card>
              </template>
            </scrollable-component>
          </b-collapse>
        </b-card>
      </b-collapse>
    </b-card>
    <div>
      <b-dialog persistent v-model="dialog">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
          <v-btn size="small" class="small-button" v-bind:id="deleteToolTipID()" @click="getDeleteConfirmation"><octicon name="diff-removed"/></b-btn>
        </template>
        <div class="d-block text-center">
          Are you sure that you want to remove this model from the project?
        </div>
        <b-btn size="sm" class="thin-button" block variant="basic-submit-button" @click="confirmDelete">Remove</b-btn>
        <b-btn size="sm" class="thin-button" block variant="basic-submit-button" @click="cancelDelete">Do Not Remove</b-btn>
      </b-dialog>
    </div>
  </b-card>
-->
</template>

<script>
import ImportModel from './ImportModel'
import DeleteModel from './DeleteModel'
import EditModel from './EditModel'

export default {
  name: 'exodus-model',
  props: ['model', 'displayID'],
  components: {
    ImportModel,
    DeleteModel,
    EditModel
  },
  data: function () {
    return {
      deleteIsConfirmed: false,
      openModel: false,
      openAttributes: false,
      openPrimitives: false,
      openFile: false,
      modelNameState: '',
      modelDescriptionState: '',
      pending: false,
      entitiesDisplay: {from: 0, num: 3},
      visibleEntityPanel: [false, false, false]
    }
  },
  watch: {
    selectedPrimitive: function () {
      if (this.model === this.$store.state.ui.showItemDetailModel) {
        this.$emit('open-models')
        this.openModel = true
        let displayIndex = this.$store.state.ui.currentlySelectedPrimitiveIndex
        if (displayIndex !== -1) {
          for (var i = 0; i < this.visibleEntityPanel.length; i++) {
            this.$set(this.visibleEntityPanel, i, false)
          }
          if (displayIndex < this.entitiesDisplay.num) {
            this.entitiesDisplay.from = 0
            this.$set(this.visibleEntityPanel, displayIndex, true)
          } else {
            let lastDisplayIndex = this.entitiesDisplay.num - 1
            this.entitiesDisplay.from = displayIndex - lastDisplayIndex
            this.$set(this.visibleEntityPanel, lastDisplayIndex, true)
          }
        }
      }
    }
  },
  created: function () {
    this.modelDescriptionState = this.model.description
  },
  computed: {
    selectedPrimitive: function () {
      return this.$store.state.ui.showItemDetailPrimitive
    },
    modelName: {
      get: function () {
        return this.model.name
      },
      set: function (newValue) {
        this.modelNameState = newValue
      }
    }
  },
  methods: {
    loadModel: function (eventData) {
      this.openFile = false
      let modelName = eventData.get('name')
      this.$store.commit('setModelAttributes',
        {currentName: this.model.name, modelName: modelName, modelDesc: '', basisName: ''})
      this.$store.commit('setActiveModel', modelName)
      this.$store.dispatch('uploadExodusModel', eventData)
    },
    deleteToolTipID () {
      return 'deleteModelButton' + this.displayID
    },
    getDeleteConfirmation () {
      this.$refs.removeModelModal.show()
    },
    confirmDelete () {
      this.deleteModel()
      this.$refs.removeModelModal.hide()
    },
    cancelDelete () {
      this.$refs.removeModelModal.hide()
    },
    deleteModel () {
      this.$store.commit('deleteModel', {name: this.model.name})
    },
    toggleEntityPanel (index) {
      this.visibleNewEntityPanel = false
      if (this.visibleEntityPanel[index]) {
        this.$set(this.visibleEntityPanel, index, false)
      } else {
        for (var i = 0; i < this.visibleEntityPanel.length; i++) {
          this.$set(this.visibleEntityPanel, i, false)
        }
        this.$set(this.visibleEntityPanel, index, true)
      }
    },
    modelNameDisplay: function () {
      if (this.model.name === '') {
        return 'Model'
      }
      return this.model.name
    },
    update: function () {
      this.pending = false
      this.$store.commit('setModelAttributes',
        {
          currentName: this.model.name,
          modelName: this.modelNameState,
          modelDesc: this.modelDescriptionState
        })
      this.modelDescriptionState = this.model.description
      this.toggleAttributes()
    },
    toggleFile: function (event) {
      event.stopPropagation()
      this.openFile = !this.openFile
    },
    toggleModel: function () {
      this.openModel = !this.openModel
    },
    toggleAttributes: function () {
      this.openAttributes = !this.openAttributes
    },
    togglePrimitives: function () {
      this.openPrimitives = !this.openPrimitives
    },
    open: function (primitive) {
      this.$store.commit('setActiveModel', this.model.name)
      this.$store.dispatch('openSelected', {model: this.model, primitive: primitive, surface: null})
    },
    select: function (primitive) {
      this.$store.dispatch('showSelected', {model: this.model, primitive: primitive})
    }
  }
}
</script>
