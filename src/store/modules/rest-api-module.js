import axios from 'axios'
import ErrorHandler from './error-handler-module'

const errorHandler = new ErrorHandler()

export class APIService {
  constructor () {
    this.server = localStorage.getItem('server')
    this.token = localStorage.getItem('token')
    this.username = localStorage.getItem('username')
  }
  loadScene (username) {
    const {token} = this
    const url = `${this.server}/api/loadscene`
    return axios.post(url, {
      username,
      token
    }).then(response => response.data)
  }
  saveScene (sceneData, projectName) {
    const {token, username} = this
    errorHandler.report(`saveScene: ${projectName}`)
    const url = `${this.server}/api/savescene`
    return axios.post(url, {
      sceneData,
      projectName,
      username,
      token
    })
  }
  registerUser (username, email, password) {
    const url = `${this.server}/register`
    return axios.post(url, {
      username,
      email,
      password
    }).then(response => response.data)
  }
  loginUser (server, username, password) {
    const url = `${server}/login`
    errorHandler.report(`logging in: ${url}`)
    return axios.post(url, {
      username,
      password
    }).then(response => response.data)
  }
  isValidToken () {
    const {token, username} = this
    const url = `${this.server}/validatetoken`
    return axios.post(url, {
      username,
      token
    })
  }
  deleteProject (projectId) {
    const {token, username} = this
    errorHandler.report(`deleting project: ${projectId}`)
    const url = `${this.server}/api/deleteProject`
    return axios.post(url, {
      projectId,
      username,
      token
    }).then(response => response.data)
  }
  loadUsersProjects () {
    const {token, username} = this
    const url = `${this.server}/api/getprojects`
    errorHandler.report(`loading projects for user: ${username}`)
    return axios.post(url, {
      username,
      token
    }).then(response => response.data)
  }
  updateProject (sceneData, projectName, username, dateCreated) {
    const {token} = this
    const url = `${this.server}/api/updateproject`
    return axios.post(url, {
      sceneData,
      projectName,
      username,
      dateCreated,
      token
    }).then(response => response.data)
  }
  createRealizationView (viewDefinition) {
    const {token, username} = this

    const url = `${this.server}/jobs/create-realization-view`
    errorHandler.report('creating view')
    return axios.post(url, {
      viewDefinition,
      username,
      token
    }).then(response => response.data)
  }
  uploadExodusModel (formData) {
    const {token, username} = this

    const url = `${this.server}/jobs/upload-exodus-model`
    errorHandler.report('uploading exodus model')
    formData.append('token', token)
    formData.append('username', username)
    return axios.post(url,
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data;'
        }
      })
    .then(response => response.data)
  }
  createSimulation (state, realization) {
    const {token, username} = this

    let hostCode = realization.scenario.hostCode

    if (hostCode === 'Albany') {
      let inputFileString = realization.scenario.toDOM(state.models)
      const url = `${this.server}/jobs/create-simulation`
      return axios.post(url, {
        token,
        username,
        inputFileString
      })
      .then(response => {
        realization.simulation.computeStatus = 'created'
        realization.simulation.inputFile = response.data
      })
    } else
    if (hostCode === 'Analyze') {
      let inputFileString = realization.scenario.toDOM(state.models)
      const url = `${this.server}/jobs/create-simulation`
      let modelName = realization.scenario.geometry.body.modelName
      let modelIndex = state.models.findIndex((m) => m.name === modelName)
      if (modelIndex === -1) {
        errorHandler.report('error: no model found')
        return
      }
      let model = state.models[modelIndex]
      let remoteAssets = [{fileName: model.fileName, remoteName: model.remote.remoteName, remotePath: model.remote.remotePath}]
      return axios.post(url, {
        token,
        username,
        inputFileString,
        remoteAssets
      })
      .then(response => {
        realization.simulation.computeStatus = 'created'
        realization.simulation.inputFile = response.data
      })
    }
  }
  startSimulation (realization) {
    const {token, username} = this

    let hostCode = realization.scenario.hostCode

    const url = `${this.server}/jobs/start-simulation`

    if (hostCode === 'Albany') {
      let inputFileName = realization.simulation.inputFile
      let numProcs = realization.resources.numProcs
      return axios.post(url, {
        token,
        username,
        payload: {inputFileName: inputFileName, numProcs: numProcs, useMPI: true, hostCode: hostCode}
      }).then((response) => {
        realization.simulation.computeStatus = 'started'
        realization.simulation.runID = response.data
      })
    } else
    if (hostCode === 'Analyze') {
      let inputFileName = realization.simulation.inputFile
      return axios.post(url, {
        token,
        username,
        payload: {inputFileName: inputFileName, useMPI: false, hostCode: hostCode}
      }).then(() => {
        realization.simulation.computeStatus = 'started'
      })
    }
  }
}
