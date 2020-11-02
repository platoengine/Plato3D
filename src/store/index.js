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
import Optimization from './modules/optimization-module'

import UniqueID from './modules/unique-id'




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
    optimizations: [],
    activeModel: null, // refers to the to which requests and modifications are applied
    availableModelTypes: null,
    availableScenarioTypes: null,
    events: { type: EventsContainer },
    session: { type: SessionContainer },
    uniqueID: { type: UniqueID }
  },
  mutations: {
    initialize (state) {
      state.uniqueID = new UniqueID()
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
    addScenario ({scenarios, availableScenarioTypes, uniqueID}, {name, description, type}) {
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
      newScenario.id = uniqueID.newID()
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
    setRealizationAttributes ({realizations}, {currentName, realizationAttributes}) {
      let realizationIndex = realizations.findIndex(realization => realization.name === currentName)
      if (realizationIndex !== -1) {
        realizations[realizationIndex].name = realizationAttributes.name
        realizations[realizationIndex].description = realizationAttributes.description
      }
    },
    deleteRealization ({realizations}, {name}) {
      let realizationIndex = realizations.findIndex(realization => realization.name === name)
      if (realizationIndex !== -1) {
        realizations.splice(realizationIndex, 1)
      }
    },
    addViewToRealization ({realizations}, payload) {
      let realizationIndex = realizations.findIndex(realization => realization.name === payload.realizationName)
      if (realizationIndex !== -1) {
        realizations[realizationIndex].addView(payload)
      }
    },
    removeView ({realizations}, payload) {
      let realizationIndex = realizations.findIndex(realization => realization.name === payload.parentObject.name)
      if (realizationIndex !== -1) {
        realizations[realizationIndex].removeView(payload)
      }
    },
    modifyView ({realizations}, payload) {
      let realizationIndex = realizations.findIndex(realization => realization.name === payload.parentObject.name)
      if (realizationIndex !== -1) {
        realizations[realizationIndex].modifyView(payload)
      }
    },
    addOptimization ({optimizations}, {name, description}) {
      const newOptimization = new Optimization()
      // Optimizations are accessed by name, so if 'name' is empty, change it to 'Optimization N'.
      if (name === '') {
        name = 'Optimization ' + optimizations.length.toString()
      }
      newOptimization.name = name
      newOptimization.description = description
      optimizations.push(newOptimization)
    },
    deleteOptimization ({optimizations}, {name}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === name)
      if (optimizationIndex !== -1) {
        optimizations.splice(optimizationIndex, 1)
      }
    },
    deleteOptimizationObjective ({optimizations}, {optimization, objective}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        let opt = optimizations[optimizationIndex]
        let objectiveIndex = opt.objectives.findIndex(obj => obj.name === objective.name)
        opt.objectives.splice(objectiveIndex, 1)
      }
    },
    modifyOptimizationObjective ({optimizations}, {optimization, objective, weight}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        let opt = optimizations[optimizationIndex]
        let objectiveIndex = opt.objectives.findIndex(obj => obj.name === objective.name)
        opt.objectives[objectiveIndex].weight = weight
      }
    },
    setOptimizationAttributes ({optimizations}, {currentName, optimizationAttributes}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === currentName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].name = optimizationAttributes.name
        optimizations[optimizationIndex].description = optimizationAttributes.description
      }
    },
    addObjectiveToOptimization ({scenarios, optimizations}, {optimizationName, newEntry}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let scenarioIndex = scenarios.findIndex(scenario => scenario.name === newEntry.scenarioName)
        if (scenarioIndex !== -1) {
          optimizations[optimizationIndex].addObjective(scenarios[scenarioIndex], newEntry.objectiveName, newEntry.weight)
        }
      }
    },
    deleteOptimizationConstraint ({optimizations}, {optimization, constraint}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        let opt = optimizations[optimizationIndex]
        let constraintIndex = opt.constraints.findIndex(obj => obj.name === constraint.name)
        opt.constraints.splice(constraintIndex, 1)
      }
    },
    modifyOptimizationConstraint ({optimizations}, {optimization, constraint, weight}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        let opt = optimizations[optimizationIndex]
        let constraintIndex = opt.constraints.findIndex(obj => obj.name === constraint.name)
        opt.constraints[constraintIndex].weight = weight
      }
    },
    addConstraintToOptimization ({scenarios, optimizations}, {optimizationName, newEntry}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let scenarioIndex = scenarios.findIndex(scenario => scenario.name === newEntry.scenarioName)
        if (scenarioIndex !== -1) {
          optimizations[optimizationIndex].addConstraint(scenarios[scenarioIndex], newEntry.constraintName, newEntry.target)
        }
      }
    }
  },
  actions: {
    async addRealizationView (state, viewDefinition) {
      const response = await apiService.createRealizationView(viewDefinition)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: add view')
      }
    },
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
