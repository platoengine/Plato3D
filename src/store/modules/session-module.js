const state = {
  username: '',
  authenticated: false,
  token: '',
  projects: [],
  activeproject: null
}

const actions = {
}

const mutations = {
  updateAuthentication (state, authenticateduser, newtoken) {
    state.authenticated = true
    state.username = authenticateduser
    state.token = newtoken
  }
}

export default {
  state,
  actions,
  mutations
}
