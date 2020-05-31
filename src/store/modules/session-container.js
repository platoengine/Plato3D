function SessionContainer () {
  this.data = {
  username: '',
  authenticated: false,
  token: '',
  projects: [],
  activeproject: null
}

this.updateAuthentication = function (sessionAuth) {
    this.data.authenticated = true
    this.data.username = sessionAuth.authenticateduser
    this.data.token = sessionAuth.newtoken
  }

}

export default SessionContainer
