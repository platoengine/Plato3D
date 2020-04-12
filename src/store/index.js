import Vue from '../plugins/graphics'
import Vuex from 'vuex'

import ExodusModel from './modules/exodus-module'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    models: [],
    availableModelTypes: null
  },
  mutations: {
    initialize (state) {
      state.availableModelTypes = ['Exodus', 'OpenCSM (comming soon)', 'Cogent (comming soon)']
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
    }
  }
})
