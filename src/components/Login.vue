<template>
    <v-card>
      <v-form>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field dense v-model="server" label="Server"/>
              <v-text-field dense v-model="username" label="Username"/>
              <span v-if="loginerrors != null" style="color:red"> {{ loginError }} </span>
              <v-text-field dense v-model="password" label="Password" type="password"/>
              <v-btn block @click="loginUser">login</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
</template>

<script>
import ErrorHandler from '../store/modules/error-handler-module'
import {APIService} from '../store/modules/rest-api-module'

const apiService = new APIService()
const errorHandler = new ErrorHandler()

export default {
  name: 'login',
  props: ['scene'],
  data: function () {
    return {server: '', username: '', password: '', loginerrors: ''}
  },
  computed: {
    loginError: function () {
      return this.loginerrors
    }
  },
  methods: {
    loginUser () {
      errorHandler.report(`login username ${this.username}`)
      apiService.loginUser(this.server, this.username, this.password).then((response) => {
        //  if login was successful, there will be a JWT token in the response
        errorHandler.report(response)
        if (response.Authenticated) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('server', this.server)
          localStorage.setItem('username', this.username)
          this.$store.commit('updateAuthentication', this.username, response.token)
          this.$store.commit('setEventSource', this.server)
          // var usertoken = localStorage.getItem('token')
          apiService.loadUsersProjects(this.username).then(data => {
            this.$store.commit('storeUserProjects', data)
          })
        } else if (response.invaliduser) {
          this.loginerrors = 'no user found'
        } else {
          this.loginerrors = 'password is incorrect!'
        }
      })
    }
  }
}
</script>
