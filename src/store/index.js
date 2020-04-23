import Vue from '../plugins/graphics'
import Vuex from 'vuex'

import ExodusModel from './modules/exodus-module'
import UI from './modules/plato-ui-module'
import Session from './modules/session-module'
import {APIService} from './modules/rest-api-module'
import ErrorHandler from './modules/error-handler-module'
import EventsContainer from './modules/events-container'



const apiService = new APIService()
const errorHandler = new ErrorHandler()


Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    ui: UI,
    session: Session
  },
  state: {
    models: [],
    activeModel: null, // refers to the to which requests and modifications are applied
    availableModelTypes: null,
    events: { type: EventsContainer }
  },
  mutations: {
    initialize (state) {
      state.availableModelTypes = ['Exodus', 'OpenCSM (coming soon)', 'Cogent (coming soon)']
      state.events = new EventsContainer()

    },
    setEventSource ({events}, server) {
      events.setSource(server)
    },
    setModelRemoteData ({activeModel}, payload) {
      activeModel.remote = payload
    },
    addObj ({activeModel}, payload) {
      activeModel.addPrimitive(payload)
    },
    addEventListener ({events}, {aName, aFunction}) {
      events.addListener(aName, aFunction)
    },
    addModel ({models}, {name, description, type}) {
      let newModel = null
      if (type === 'Exodus') {
        newModel = new ExodusModel()
      }
      // Models are accessed by name, so if 'name' is empty, change it to 'Model N'.
      if (name === '') {
        name = 'Model ' + models.length.toString()
      }
      newModel.name = name
      newModel.description = description
      models.push(newModel)
    },
    deleteModel ({models}, {name, graphics}) {
      let modelIndex = models.findIndex(model => model.name === name)
      if (modelIndex !== -1) {
        models[modelIndex].clearModel(graphics)
        models.splice(modelIndex, 1)
      }
    },
    setModelAttributes ({models}, {currentName, modelAttributes}) {
      let modelIndex = models.findIndex(model => model.name === currentName)
      if (modelIndex !== -1) {
        models[modelIndex].setModelAttributes(modelAttributes)
      }
    },
    setActiveModel (state, activeModelName) {
      let activeModelIndex = state.models.findIndex(model => model.name === activeModelName)
      if (activeModelIndex !== -1) {
        state.activeModel = state.models[activeModelIndex]
      } else {
        state.activeModel = null
      }
    }
  },
  actions: {
    async uploadExodusModel ({state}, formData) {
      state.activeModel.fileName = formData.get('file').name
      const response = await apiService.uploadExodusModel(formData)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: upload exodus model')
      }
    }
  }
})
