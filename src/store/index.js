import Vue from '../plugins/graphics'
import Vuex from 'vuex'

import {dynamicCopy} from '../components/ui/ByValue'
import ExodusModel from './modules/exodus-module'
import ExplorerData from './modules/explorer-data'
import UI from './modules/plato-ui-module'
import SessionContainer from './modules/session-container'
import {APIService} from './modules/rest-api-module'
import ErrorHandler from './modules/error-handler-module'
import EventsContainer from './modules/events-container'

import AnalyzeScenarioFactory from './modules/analyze/analyze-scenario-factory-module'
import Realization from './modules/realization-module'
import Optimization from './modules/optimization-module'

import UniqueID from './modules/unique-id'

import {OBJLoader} from 'three-obj-mtl-loader'
import {PLYLoader} from './modules/ply-loader'
import {PLYToMesh} from './modules/ply-to-mesh'


import makeNameUnique from './modules/make-name-unique'

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
    sceneSettings: {
      grid: {
        size: 10.0,
        divs: 10,
        showX: true,
        showY: true,
        showZ: true,
        AtCenter: false
      },
      lighting: {
        directional: {
          display: false,
          X: 10,
          Y: 10,
          Z: 10
        },
        hemisphere: {
          display: true
        },
        ambient: {
          display: true
        },
        spot: {
          display: true,
          X: 15,
          Y: 40,
          Z: 35,
          angle: 7.5
        }
      }
    },
    packProjectData: function (thumbnail) {
      // Important: This function should mirror the unpackProjectData function.
      // If you add data here, add unpacking as well.
      return {
        thumbnail: thumbnail,
        models: this.models,
        scenarios: this.scenarios,
        realizations: this.realizations,
        optimizations: this.optimizations,
        explorerData: this.explorerData
      }
    },
    active: {
      project: null, // only defined if project has been saved
      model: null, // refers to the model to which requests and modifications are applied
      optimization: null // refers to the optimization to which requests and modifications are applied
    },
    availableModelTypes: null,
    availableScenarioTypes: null,
    events: { type: EventsContainer },
    session: { type: SessionContainer },
    uniqueID: { type: UniqueID },
    explorerData: { type: ExplorerData },
    disabledByUser : false,
    systemInfoModal: {State: false, Content: []}
  },
  getters: {
    explorerDataState (state) {
      return state.explorerData.changed
    }
  },
  mutations: {
    setSessionDataState ({explorerData}, state) {
      explorerData.setChanged(state)
    },
    setDataVisibility ({explorerData}, {index, newState}) {
      explorerData.setDataVisibility(index, newState)
    },
    setAxisState ({explorerData}, {index, newState}) {
      explorerData.setAxisState(index, newState)
    },
    setAxisMin ({explorerData}, {index, newState}) {
      explorerData.setAxisMin(index, newState)
    },
    setAxisMax ({explorerData}, {index, newState}) {
      explorerData.setAxisMax(index, newState)
    },
    toggleTooltip(state){
      state.disabledByUser = !state.disabledByUser
    },
    initialize (state) {
      state.uniqueID = new UniqueID()
      state.availableModelTypes = ['Exodus', 'OpenCSM (coming soon)', 'Cogent (coming soon)']
      state.events = new EventsContainer()
      state.session = new SessionContainer()
      state.explorerData = new ExplorerData()

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
    storeUserProjects ({session}, retrievedprojects) {
      for (var i = 0; i < retrievedprojects.length; i++) {
        Vue.set(session.data.projects, i, retrievedprojects[i])
      }
    },
    addUserProject ({session}, newproject) {
      session.data.projects.push(newproject)
    },
    closeUserProject (state, {graphics}) {
      state.models.forEach(model => {model.destructor(graphics)})
      state.models = []

      state.scenarios = []

      state.realizations.forEach(realization => {realization.destructor(graphics)})
      state.realizations = []

      state.optimizations.forEach(optimization => {optimization.destructor(graphics)})
      state.optimizations = []

      state.active.project = null
    },
    setActiveProject ({active}, activeproject) {
      active.project = activeproject
    },
    updateUserProject ({session}, updatedproject) {
      const projects = session.data.projects
      let projectIndex = projects.findIndex(project => project.projectname === updatedproject.projectname)
      if (projectIndex !== -1) {
        Vue.set(projects, projectIndex, updatedproject)
      }
    },
    deleteUserProject ({session}, projectIndex) {
      session.data.projects.splice(projectIndex, 1)
    },
    setProjectThumbnail ({active}, image) {
      active.project.projectdata.thumbnail = image
    },
    setEventSource ({events}, server) {
      events.setSource(server)
    },
    setOptimizationVisibility ({optimizations}, {optimizationName, isVisible, graphics}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].setOptimizationVisibility(graphics, isVisible)
      }
    },
    setModelVisibility ({models}, {modelName, isVisible, graphics}) {
      let modelIndex = models.findIndex(model => model.name === modelName)
      if (modelIndex !== -1) {
        models[modelIndex].setIsVisible(isVisible, graphics)
      }
    },
    setDisplayAttributes (state, {model, payload}) {
      model.setDisplayAttributes(payload)
    },
    setModelRemoteData ({active}, payload) {
      active.model.remote = payload
    },
    setSystemInfoModalState ({systemInfoModal}, value) {
      systemInfoModal.State = value
    },
    clearSystemInfoModalContent ({systemInfoModal}) {
      systemInfoModal.Content = []
    },
    addObj ({active, sceneSettings, systemInfoModal}, payload) {
      if (payload.name.includes('unnamed_')) {
        systemInfoModal.State = true
        systemInfoModal.Content.push("Error: An exodus model was loaded that has unnamed entities.  This model cannot be used to define scenarios since entities are referred to by name.\n")
        console.log(systemInfoModal)
      }
      active.model.addPrimitive(payload)
      sceneSettings.grid.size = payload.graphics.getGridSize()
      payload.graphics.setGrid(sceneSettings.grid)
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
        models[modelIndex].destructor(graphics)
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
        state.active.model = state.models[activeModelIndex]
      } else {
        state.active.model = null
      }
    },
    setLightingSettings ({sceneSettings}, {keys, val, graphics}) {
      sceneSettings.lighting[keys[0]][keys[1]] = val
      graphics.setLighting(sceneSettings.lighting)
    },
    initializeLighting ({sceneSettings}, graphics) {
      graphics.setLighting(sceneSettings.lighting)
    },
    setGridSettings ({sceneSettings}, {key, val, graphics}) {
      sceneSettings.grid[key] = val
      graphics.setGrid(sceneSettings.grid)
    },
    initializeGrid ({sceneSettings}, graphics) {
      graphics.setGrid(sceneSettings.grid)
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
    removeScenarioListData ({scenarios}, {scenarioName, dataName, entryName}) {
      let scenarioIndex = scenarios.findIndex(scenario => scenario.name === scenarioName)
      if (scenarioIndex !== -1) {
        scenarios[scenarioIndex].removeListData(dataName, entryName)
      }
    },
    loadScenario ({scenarios, models}, definition) {
      // Scenarios are accessed by name, so if 'name' is empty, change it to 'Scenario N'.
      if (definition.name === '') {
        definition.name = 'Scenario ' + scenarios.length.toString()
      }
      let newScenario = null
      const hostCode = 'Analyze' // only supporting Analyze currently
      if (hostCode === 'Analyze') {
        let newScenarioFactory = new AnalyzeScenarioFactory()
        newScenario = newScenarioFactory.createFromFile(definition)
        newScenario.fetchModel(models)
      }
      if (newScenario !== null) {
        scenarios.push(newScenario)
      }
    },
    setScenarioData(state, scenarioData) {
      let newScenario = null
      if (scenarioData.hostCode === 'Analyze') {
        let newScenarioFactory = new AnalyzeScenarioFactory()
        newScenario = newScenarioFactory.createFromData(scenarioData)
        newScenario.fetchModel(state.models)
      }
      if (newScenario !== null) {
        newScenario.name = scenarioData.name
        state.scenarios.push(newScenario)
      } else {
        errorHandler.report(`error: Attempted to load a scenario with an unknown hostcode (${scenarioData.hostCode})`)
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
    setActiveOptimization ({optimizations, active}, {name}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === name)
      if (optimizationIndex !== -1) {
        active.optimization = optimizations[optimizationIndex]
      }
    },
    setOptDisplayAttributes ({active}, {graphics, attribute, value}) {
      active.optimization.setDisplayAttributes(graphics, attribute, value)
    },
    addOptimization ({active, optimizations}, {name, description}) {
      const newOptimization = new Optimization()
      // Optimizations are accessed by name, so if 'name' is empty, change it to 'Optimization N'.
      if (name === '') {
        name = 'Optimization ' + optimizations.length.toString()
      }
      newOptimization.name = name
      newOptimization.description = description
      optimizations.push(newOptimization)
      active.optimization = newOptimization
    },
    duplicateOptimization (state, {name}) {
      let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === name)
      if (optimizationIndex !== -1) {
        let optimization = state.optimizations[optimizationIndex]
        let optCopy = optimization.copy()
        optCopy.name = makeNameUnique(optCopy.name, state.uniqueID)
        state.optimizations.push(optCopy)
      }
    },
    deleteOptimization (state, {name, graphics}) {
      let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === name)
      if (optimizationIndex !== -1) {
        let optimization = state.optimizations[optimizationIndex]
        optimization.clear(graphics)
        state.explorerData.removeResultsData(optimization)
        state.optimizations.splice(optimizationIndex, 1)
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
        let objectiveIndex = opt.objectives.findIndex(
          obj => obj.criterionName === objective.criterionName && obj.scenario.name === objective.scenario.name
        )
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
    setOptimizationAttribute ({optimizations}, {name, key, value}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === name)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].run[key] = value
      }
    },
    setOptimizationKeysValue ({optimizations}, {name, keys, value}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === name)
      if (optimizationIndex !== -1) {
        let target = optimizations[optimizationIndex]
        let last = keys.pop()
        keys.forEach( key => { target = target[key] } )
        target[last] = value
      }
    },
    addObjectiveToOptimization ({scenarios, optimizations}, {optimizationName, newEntry}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let scenarioIndex = scenarios.findIndex(scenario => scenario.name === newEntry.scenarioName)
        if (scenarioIndex !== -1) {
          optimizations[optimizationIndex].addObjective(
            scenarios[scenarioIndex],
            newEntry.objectiveName,
            newEntry.weight)
        }
      }
    },
    setNormalizeObjectives ({optimizations}, {optimization, normalize}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].normalizeObjectives = normalize
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
    modifyOptimizationConstraint ({optimizations}, {optimization, constraint, target, perVolume}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        let opt = optimizations[optimizationIndex]
        let constraintIndex = opt.constraints.findIndex(obj => obj.name === constraint.name)
        opt.constraints[constraintIndex].target = target
        opt.constraints[constraintIndex].perVolume = perVolume
      }
    },
    addConstraintToOptimization ({scenarios, optimizations}, {optimizationName, newEntry}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let scenarioIndex = scenarios.findIndex(scenario => scenario.name === newEntry.scenarioName)
        if (scenarioIndex !== -1) {
          optimizations[optimizationIndex].addConstraint(scenarios[scenarioIndex], newEntry.constraintName, newEntry.target, newEntry.perVolume)
        }
      }
    },
    setOptimizationOptimizerPackage ({optimizations}, {optimization, packageName}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].optimizer.selected = packageName
      }
    },
    setOptimizationOptimizerOption ({optimizations}, {optimization, optionName, optionValue}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        let opt = optimizations[optimizationIndex].optimizer
        let selected = opt.selected
        opt.packages[selected][optionName].value = optionValue
      }
    },
    setOptimizationSolverOption ({optimizations}, {optimization, optionName, optionValue}) {
      let optimizationIndex = optimizations.findIndex(opt => opt.name === optimization.name)
      if (optimizationIndex !== -1) {
        let solver = optimizations[optimizationIndex].solver
        solver[optionName].value = optionValue
      }
    },
    addIterationToOptimization ({optimizations}, payload) {
      let graphics = payload.graphics
      const dataObject = JSON.parse(payload.data)
      const {optimizationName, iteration, data} = dataObject
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        const loader = new PLYLoader()
        const url = URL.createObjectURL(new Blob([data]))
        loader.load(url,
          (geometryData) => {
            let geometry = PLYToMesh(geometryData)
            geometry.material = graphics.getMaterial()
            optimizations[optimizationIndex].addIteration({iteration, geometry, graphics})
          },
          undefined,
          (error) => {
            errorHandler.report(error)
          }
        )
      }
    },
    plotConvergence({optimizations}, {optimizationName, plotData}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let opt = optimizations[optimizationIndex]
        opt.convergenceData.x.length = 0
        plotData.x.forEach( (val, i) => {
          Vue.set(opt.convergenceData.x, i, val)
          Vue.set(opt.convergenceData.y, i, plotData.y[i])
        })
      }
    },
    optResultsData(state, {optimizationName, resultsData}) {
      let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        state.explorerData.addResultsData(state.optimizations[optimizationIndex], resultsData)
      }
    },
    toFirstOptimizationIteration ({optimizations}, {optimizationName, graphics}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].toFirstIteration(graphics)
      }
    },
    decrementOptimizationIteration ({optimizations}, {optimizationName, graphics}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].decrementActiveIteration(graphics)
      }
    },
    incrementOptimizationIteration ({optimizations}, {optimizationName, graphics}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].incrementActiveIteration(graphics)
      }
    },
    toLastOptimizationIteration ({optimizations}, {optimizationName, graphics}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].toLastIteration(graphics)
      }
    },
    resetOptimizationRun({optimizations}, {optimizationName, graphics}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
          optimizations[optimizationIndex].resetRun(graphics)
      }
    },
    setOptimizationFixedBlock({optimizations}, {optimizationName, model, block, isFixed}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].setFixedBlock(model, block, isFixed)
      }
    },
    setOptimizationSymmetry({optimizations}, {optimizationName, model, direction, isSymmetric}) {
      let optimizationIndex = optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        optimizations[optimizationIndex].setSymmetry(model, direction, isSymmetric)
      }
    },
    setModelData(state, modelData) {
      let newModel = null
      if (modelData.type === 'ExodusModel') {
        newModel = new ExodusModel()
        newModel.fromData(modelData)
      }
      state.models.push(newModel)
    },
    setOptimizationData(state, optimizationData) {
      const newOptimization = new Optimization()
      newOptimization.fromData(optimizationData, state.scenarios)
      state.optimizations.push(newOptimization)
    },
    setExplorerData(state, explorerData) {
      state.explorerData = new ExplorerData()
      dynamicCopy(explorerData, state.explorerData)
    }
  },
  actions: {
    async loadProject ({dispatch, commit}, payload) {
      commit('setActiveProject', payload.project)
      dispatch('unpackProjectData', payload)
    },
    async unpackProjectData ({dispatch, commit, state}, payload) {
      let graphics = payload.graphics
      // load models
      let models = payload.project.projectdata.models
      models.forEach(model => { dispatch('loadExodusModel', {model, graphics}) })

      // load scenarios into state
      let scenarioData = payload.project.projectdata.scenarios
      scenarioData.forEach(scenarioDatum => { dispatch('loadScenario', scenarioDatum) })

      // load realizations
      //let realizations = payload.project.projectdata.realizations
      //realizations.forEach(realization => { dispatch('loadRealizations', {realization}) })

      // load optimizations
      let optimizationData = payload.project.projectdata.optimizations
      optimizationData.forEach(optimizationDatum => {
        commit('setOptimizationData', optimizationDatum)
        let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === optimizationDatum.name)
        if (optimizationIndex !== -1) {
          let optimization = state.optimizations[optimizationIndex]
          dispatch('loadOptimizationScene', {optimization, graphics})
        }
      })

      // load explorerData
      commit('setExplorerData', payload.project.projectdata.explorerData)
    },
    async loadScenario ({commit}, scenarioData) {
      commit('setScenarioData', scenarioData)
    },
    async loadOptimizationScene ({dispatch}, {optimization, graphics}) {
      optimization.run.iterations.forEach( (iteration, index) => {
        dispatch('loadOptimizationIteration', {optimization, graphics, iteration, index})
      })
    },
    async loadOptimizationIteration (state, {optimization, graphics, iteration, index}) {
      const response = await apiService.retrieveOptimizationIteration(optimization, index)
      if (response === 'FAILURE') {
        iteration.geometryID = -1
      } else {
        const loader = new PLYLoader()
        const url = URL.createObjectURL(new Blob([response]))
        loader.load(url,
          (geometryData) => {
            let geometry = PLYToMesh(geometryData)
            geometry.material = graphics.getMaterial()
            optimization.setIteration({iteration, index, geometry, graphics})
          },
          undefined,
          (error) => {
            errorHandler.report(error)
          }
        )
      }
    },
    async loadExodusModel ({commit}, {model, graphics}) {
      commit('setModelData', model)
      commit('setActiveModel', model.name)
      commit('addEventListener', {
        aName: 'modelGeometryData', 
        aFunction: function (event) {
          const {data} = event
          const dataObject = JSON.parse(data)
          const {modelName, name: geometryName, type: geometryType, id: geometryID, data: geometryData} = dataObject
          const loader = new OBJLoader()
          const url = URL.createObjectURL(new Blob([geometryData]))
          loader.load(url, (geometry) => {
            this.showLoader = false;
            commit('addObj', {
              modelName: modelName,
              name: geometryName,
              id: geometryID,
              type: geometryType,
              geometry: geometry,
              graphics: graphics
            });
          })
        }
      })
      const response = await apiService.loadExodusModel(model)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: loadExodusModel')
      }
    },
    async saveProject ({state, commit}, {name, graphics}) {
      if (state.active.project !== null ) {
        errorHandler.report("Internal error: called 'saveProject' instead of 'updateProject'")
      }
      else
      {
        const thumbnail = graphics.renderer.domElement.toDataURL( 'image/png' );
        const projectdata = state.packProjectData(thumbnail)
        const response = await apiService.saveProject(projectdata, name)
        if (response.data.savestatus) {
          errorHandler.report(`save status: ${response.data.savestatus}`)
          let projects = state.session.data.projects
          var lastProjectIndex = projects.length
          commit('addUserProject', response.data.newproject)
          commit('setActiveProject', projects[lastProjectIndex])
          commit('setProjectThumbnail', thumbnail)
        } else if (!response.data.unique) {
          errorHandler.report(`Internal error: project ${name} already exists`)
        } else {
          errorHandler.report("Internal error: unknown server error")
        }
      }
    },
    async updateProject ({state, commit}, {thumbnail}) {
      const projectdata = state.packProjectData(thumbnail)
      const response = await apiService.updateProject(projectdata, state.active.project.name, state.session.data.username, state.active.project.DateCreated)
      if (response.success) {
        errorHandler.report('project saved')
        commit('updateUserProject', response.newproject)
        commit('setProjectThumbnail', thumbnail)
      } else {
        errorHandler.report('error! project NOT saved')
      }
    },
    async updateAndCloseProject ({dispatch, commit}, {graphics}) {
      const screenshot = graphics.renderer.domElement.toDataURL( 'image/png' );
      await dispatch('updateProject', {thumbnail: screenshot})
      commit('closeUserProject', {graphics: graphics})
    },
    async deleteProject ({state, commit}, {projectName}) {
      // delete from server
      let response = await apiService.deleteProject(projectName)
  
      // delete from client
      if (response.success) {
        let projectIndex = state.session.data.projects.findIndex(project => project.projectname === projectName)
        if (projectIndex !== -1) {
          commit('deleteUserProject', projectIndex)
        }
      }
    },
    async addRealizationView (state, viewDefinition) {
      const response = await apiService.createRealizationView(viewDefinition)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: add view')
      }
    },
    async fetchAnalyzeScenario ({commit}, {name, url}) {
      const response = await apiService.fetchXML(url)
      commit('loadScenario', {name: name, data: response, type: 'xml'})
    },
    async fetchExodusModel ({state}, exodusURL) {
      state.active.model.fileName = exodusURL.split('/').pop();
      const response = await apiService.fetchExodusModel(exodusURL)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: fetch exodus model')
      }
    },
    async uploadExodusModel ({state}, formData) {
      state.active.model.file = formData.get('file')

      // If a {csm,CSM} file is sent to uploadExodusModel(), the file is converted
      // to an exodus file on the server.  In input files (i.e., scenario definitions),
      // the model must be referred to as basename.exo, so change the fileName to reflect that.
      let fileName = formData.get('file').name
      let tokens = fileName.split('.')
      let last = tokens.pop()
      if (last === 'csm' || last === 'CSM') {
        fileName = tokens.join('.') + '.exo'
      }
      state.active.model.fileName = fileName

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
    },
    //
    // optimization actions
    //
    async cancelOptimizationRun ({state}, {optimizationName}) {
      let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let optimization = state.optimizations[optimizationIndex]
        const response = await apiService.cancelOptimization(optimization)
        if (response === 'FAILURE') {
          errorHandler.report('server request failed: cancel optimization')
        }
      }
    },
    async conductOptimizationRun ({dispatch, state, commit}, {optimizationName, graphics}) {
      let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let optimization = state.optimizations[optimizationIndex]
        if (optimization.run.iterations.length !== 0) {
          commit('resetOptimizationRun', {optimizationName, graphics})
        }
        await dispatch('createOptimizationRun', {optimization: optimization})
        await dispatch('addOptimizationView', {optimizationName: optimization.name})
        await dispatch('startOptimizationRun', {optimization: optimization})
      }
    },
    async createOptimizationRun ({state, commit}, {optimization}) {
      const response = await apiService.createOptimization(state, commit, optimization)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: create optimization')
      }
    },
    async downloadOptimizationFile ({state}, {optimizationName, remoteFileName, localFileName}) {
      let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === optimizationName)
      if (optimizationIndex !== -1) {
        let optimization = state.optimizations[optimizationIndex]
        const response = await apiService.downloadOptimizationFile(optimization, remoteFileName, localFileName)
        if (response === 'FAILURE') {
          errorHandler.report('server request failed: get optimization file')
        }
      }
    },
    async startOptimizationRun ({commit}, {optimization}) {
      const response = await apiService.startOptimization(commit, optimization)
      if (response === 'FAILURE') {
        errorHandler.report('server request failed: start optimization')
      }
    },
    async addOptimizationView ({state}, viewDefinition) {
      let optimizationIndex = state.optimizations.findIndex(optimization => optimization.name === viewDefinition.optimizationName)
      if (optimizationIndex !== -1) {
        viewDefinition.runDir = state.optimizations[optimizationIndex].run.runDir
        const response = await apiService.createOptimizationView(viewDefinition)
        if (response === 'FAILURE') {
          errorHandler.report('server request failed: add optimization view')
        }
      }
    }
  }
})
