import Vue from '../plugins/graphics'
import Vuex from 'vuex'

import ExodusModel from './modules/exodus-module'
import UI from './modules/plato-ui-module'
import SessionContainer from './modules/session-container'
import {APIService} from './modules/rest-api-module'
import ErrorHandler from './modules/error-handler-module'
import EventsContainer from './modules/events-container'

import AnalyzeScenarioFactory from './modules/analyze/analyze-scenario-factory-module'
import Realization from './modules/realization-module'




const apiService = new APIService()
const errorHandler = new ErrorHandler()


Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    ui: UI
  },
  state: {
    models: [],
    scenarios: [],
    realizations: [],
    activeModel: null, // refers to the to which requests and modifications are applied
    availableModelTypes: null,
    availableScenarioTypes: null,
    events: { type: EventsContainer },
    session: { type: SessionContainer }
  },
  mutations: {
    initialize (state) {
      state.availableModelTypes = ['Exodus', 'OpenCSM (coming soon)', 'Cogent (coming soon)']
      state.events = new EventsContainer()
      state.session = new SessionContainer()

      state.availableScenarioTypes = new Map()

      // add Analyze scenarios
      let analyzeScenarioFactory = new AnalyzeScenarioFactory()
      let analyzeScenarioTypes = analyzeScenarioFactory.availableScenarioTypes()
      analyzeScenarioTypes.forEach((value, key) => state.availableScenarioTypes.set(key, value))

    },
    setSimulationAttribute ({realizations}, {name, key, value}) {
      let realizationIndex = realizations.findIndex(realization => realization.name === name)
      if (realizationIndex !== -1) {
        realizations[realizationIndex].simulation[key] = value
      }
    },
    updateAuthentication ({session}, sessionAuth) {
      session.updateAuthentication(sessionAuth)
      apiService.updateToken(sessionAuth.newtoken)
    },
    destroySession ({session}) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('server')
      session.data.authenticated = false
      session.data.username = ''
      session.data.token = ''
      for (var i = 0; i < session.data.projects.length; i++) {
        Vue.set(session.data.projects, i, undefined)
      }
      session.data.projects = []
      session.data.activeproject = null
    },
    setEventSource ({events}, server) {
      events.setSource(server)
    },
    setDisplayAttributes (state, {model, payload}) {
      model.setDisplayAttributes(payload)
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
        // see if model with requested name already exists
        let dupIndex = models.findIndex(model => model.name === modelAttributes.name)
        if (dupIndex !== -1) {
          modelAttributes.name = currentName
        }
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
    },
    addScenario ({scenarios, availableScenarioTypes}, {name, description, type}) {
      let newScenario = null
      let hostPhysics = availableScenarioTypes.get(type).type
      let hostCode = availableScenarioTypes.get(type).code
      if (hostCode === 'Analyze') {
        let newScenarioFactory = new AnalyzeScenarioFactory()
        newScenario = newScenarioFactory.create(hostPhysics)
      }
      // Scenarios are accessed by name, so if 'name' is empty, change it to 'Scenario N'.
      if (name === '') {
        name = 'Scenario ' + scenarios.length.toString()
      }
      newScenario.name = name
      newScenario.description = description
      newScenario.type = type
      newScenario.hostPhysics = availableScenarioTypes.get(type).type
      newScenario.hostCode = availableScenarioTypes.get(type).code
      scenarios.push(newScenario)
    },
    deleteScenario ({scenarios}, {name}) {
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === name)
      if (scenarioIndex !== -1) {
        scenarios.splice(scenarioIndex, 1)
      }
    },
    setScenarioAttributes ({scenarios}, {currentName, scenarioAttributes}) {
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === currentName)
      if (scenarioIndex !== -1) {
        scenarios[scenarioIndex].name = scenarioAttributes.name
        scenarios[scenarioIndex].description = scenarioAttributes.description
      }
    },
    setScenarioModel ({scenarios, models}, {scenarioName, modelName}) {
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === scenarioName)
      if (scenarioIndex !== -1) {
        scenarios[scenarioIndex].setModel(modelName, models)
      }
    },
    setScenarioOptionData ({scenarios}, {scenarioName, dataName, data}) {
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === scenarioName)
      if (scenarioIndex !== -1) {
        scenarios[scenarioIndex].setOptionData(dataName, data)
      }
    },
    appendScenarioListData ({scenarios}, {scenarioName, dataName, newEntryName, data}) {
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === scenarioName)
      if (scenarioIndex !== -1) {
        scenarios[scenarioIndex].appendListData(dataName, newEntryName, data)
      }
    },
    setScenarioListData ({scenarios}, {scenarioName, dataName, data}) {
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === scenarioName)
      if (scenarioIndex !== -1) {
        scenarios[scenarioIndex].setListData(dataName, data)
      }
    },
    loadScenario ({scenarios}, definition) {
      // Scenarios are accessed by name, so if 'name' is empty, change it to 'Scenario N'.
      if (definition.name === '') {
        definition.name = 'Scenario ' + scenarios.length.toString()
      }
      let newScenario = null
      const hostCode = 'Analyze' // only supporting Analyze currently
      if (hostCode === 'Analyze') {
        let newScenarioFactory = new AnalyzeScenarioFactory()
        newScenario = newScenarioFactory.createFromFile(definition)
      }
      if (newScenario !== null) {
        scenarios.push(newScenario)
      }
    },
    addParameter (state, {parentObject, definition}) {
      parentObject.parameters.push(definition)
    },
    modifyParameter (state, {parentObject, definition}) {
      const tModIndex = parentObject.parameters.findIndex(p => p.ParameterName === definition.ParameterName)
      parentObject.parameters[tModIndex] = definition
    },
    addRealization ({scenarios, realizations}, {name, description, scenarioName}) {
      const newRealization = new Realization()
      // Realizations are accessed by name, so if 'name' is empty, change it to 'Realization N'.
      if (name === '') {
        name = 'Realization ' + realizations.length.toString()
      }
      newRealization.name = name
      newRealization.description = description
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === scenarioName)
      if (scenarioIndex !== -1) {
        newRealization.scenario = scenarios[scenarioIndex]
      }
      realizations.push(newRealization)
    },
    deleteRealization ({realizations}, {name}) {
      let realizationIndex = realizations.findIndex(realization => realization.name === name)
      if (realizationIndex !== -1) {
        realizations.splice(realizationIndex, 1)
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
    },
    async createRealizationSimulation ({state, commit}, {realization}) {
      const response = await apiService.createSimulation(state, commit, realization)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: create simulation')
      }
    },
    async startRealizationSimulation ({commit}, {realization}) {
      const response = await apiService.startSimulation(commit, realization)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: start simulation')
      }
    },
    async conductRealizationSimulation ({dispatch, state}, {realizationName}) {
      let realizationIndex = state.realizations.findIndex(realization => realization.name === realizationName)
      if (realizationIndex !== -1) {
        let realization = state.realizations[realizationIndex]
        await dispatch('createRealizationSimulation', {realization: realization})
        await dispatch('startRealizationSimulation', {realization: realization})
      }
    }
  }
})
