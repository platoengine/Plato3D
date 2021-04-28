import axios from 'axios'
import ErrorHandler from './error-handler-module'

const errorHandler = new ErrorHandler()

export class APIService {
  loadScene (username) {
    const {token, server} = this.getSession()
    const url = `${server}/api/loadscene`
    return axios.post(url, {
      username,
      token
    }).then(response => response.data)
  }
  saveProject (projectData, projectName) {
    const {token, username, server} = this.getSession()
    errorHandler.report(`saveProject: ${projectName}`)
    const url = `${server}/api/saveproject`
    return axios.post(url, {
      projectData,
      projectName,
      username,
      token
    })
  }
  updateProject (projectData, projectName, username, dateCreated) {
    const {token, server} = this.getSession()
    const url = `${server}/api/updateproject`
    return axios.post(url, {
      projectData,
      projectName,
      username,
      dateCreated,
      token
    }).then(response => response.data)
  }
  registerUser (server, username, email, password) {
    const url = `${server}/register`
    return axios.post(url, {
      username,
      email,
      password
    }).then(response => response.data)
  }
  loginUser (server, username, password) {
    localStorage.setItem('server', server)
    localStorage.setItem('username', username)
    const url = `${server}/login`
    errorHandler.report(`logging in: ${url}`)
    return axios.post(url, {
      username,
      password
    }).then(response => response.data)
  }
  getSession () {
    return { token: localStorage.getItem('token'),
             username: localStorage.getItem('username'),
             server: localStorage.getItem('server') }
  }
  updateToken (token) {
    localStorage.setItem('token', token)
  }
  isValidToken () {
    const {token, username, server} = this.getSession()
    const url = `${server}/validatetoken`
    return axios.post(url, {
      username,
      token
    })
  }
  deleteProject (projectId) {
    const {token, username, server} = this.getSession()
    errorHandler.report(`deleting project: ${projectId}`)
    const url = `${server}/api/deleteProject`
    return axios.post(url, {
      projectId,
      username,
      token
    }).then(response => response.data)
  }
  loadUsersProjects () {
    const {token, username, server} = this.getSession()
    const url = `${server}/api/getprojects`
    errorHandler.report(`loading projects for user: ${username}`)
    return axios.post(url, {
      username,
      token
    }).then(response => response.data)
  }
  createRealizationView (viewDefinition) {
    const {token, username, server} = this.getSession()

    const url = `${server}/jobs/create-realization-view`
    errorHandler.report('creating view')
    return axios.post(url, {
      viewDefinition,
      username,
      token
    }).then(response => response.data)
  }
  uploadExodusModel (formData) {
    const {token, username, server} = this.getSession()

    const url = `${server}/jobs/upload-exodus-model`
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
  loadExodusModel (model) {
    const {token, username, server} = this.getSession()

    const url = `${server}/jobs/load-exodus-model`
    errorHandler.report('loading exodus model')
    return axios.post(url, {
      token,
      username,
      exoFileName: model.remote.remoteName,
      exoFilePath: model.remote.remotePath,
      modelName: model.name
    }).then(response => response.data)
  }
  createSimulation (state, commit, realization) {
    const {token, username, server} = this.getSession()

    let hostCode = realization.scenario.hostCode

    if (hostCode === 'Analyze') {
      let inputFileString = realization.scenario.toDOM(state.models)
      const url = `${server}/jobs/create-simulation`
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
        commit('setSimulationAttribute', {name: realization.name, key: 'computeStatus', value: 'created'})
        commit('setSimulationAttribute', {name: realization.name, key: 'runDir', value: response.data})
      })
    }
  }
  startSimulation (commit, realization) {
    const {token, username, server} = this.getSession()

    let hostCode = realization.scenario.hostCode

    const url = `${server}/jobs/start-simulation`

    if (hostCode === 'Analyze') {
      return axios.post(url, {
        token,
        username,
        payload: {runDir: realization.simulation.runDir, useMPI: false, hostCode: hostCode}
      }).then(() => {
        commit('setSimulationAttribute', {name: realization.name, key: 'computeStatus', value: 'started'})
      })
    }
  }
  //
  // optimization services
  //
  createOptimization (state, commit, optimization) {
    const {token, username, server} = this.getSession()

      let {files, meshes} = optimization.toDOM(state.models)

      const url = `${server}/jobs/create-optimization`

      let remoteAssets = meshes.map((mesh) => {return {fileName: mesh.fileName, remoteName: mesh.remote.remoteName, remotePath: mesh.remote.remotePath}})
      return axios.post(url, {
        token,
        username,
        files,
        remoteAssets
      })
      .then(response => {
        commit('setOptimizationAttribute', {name: optimization.name, key: 'computeStatus', value: 'created'})
        commit('setOptimizationAttribute', {name: optimization.name, key: 'runDir', value: response.data})
      })
  }
  startOptimization (commit, optimization) {
    const {token, username, server} = this.getSession()

    const url = `${server}/jobs/start-optimization`

    return axios.post(url, {
      token,
      username,
      payload: {runDir: optimization.run.runDir}
    }).then(() => {
      commit('setOptimizationAttribute', {name: optimization.name, key: 'computeStatus', value: 'started'})
    })
  }
  createOptimizationView (viewDefinition) {
    const {token, username, server} = this.getSession()

    const url = `${server}/jobs/create-optimization-view`
    errorHandler.report('creating view')
    return axios.post(url, {
      viewDefinition,
      username,
      token
    }).then(response => response.data)
  }
}
