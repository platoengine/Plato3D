function SessionContainer () {
  this.session = {
  username: '',
  authenticated: false,
  token: '',
  projects: [],
  activeproject: null
}

this.updateAuthentication = function (sessionAuth) {
    this.session.authenticated = true
    this.session.username = sessionAuth.authenticateduser
    this.session.token = sessionAuth.newtoken
  }

}

export default SessionContainer
