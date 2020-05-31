<template>
    <v-card>
      <v-form @submit.prevent>
        <v-container>
          <v-row v-if="!loggedIn">
            <v-col>
              <v-text-field dense v-model="server" label="Server"/>
              <v-text-field dense v-model="username" label="Username"/>
              <span v-if="loginerrors != null" style="color:red"> {{ loginError }} </span>
              <v-text-field dense v-model="password" label="Password" type="password"/>
              <v-btn block @click="loginUser">login</v-btn>
              <register/>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <v-text-field dense v-model="server" label="Server" :disabled="true"/>
              <v-text-field dense v-model="username" label="Username" :disabled="true"/>
              <v-btn block @click="logoutUser">log out</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
</template>

<script>
import ErrorHandler from '../store/modules/error-handler-module'
import {APIService} from '../store/modules/rest-api-module'
import Register from './Register'

const apiService = new APIService()
const errorHandler = new ErrorHandler()

export default {
  name: 'login',
  props: ['scene'],
  data: function () {
    return {server: 'http://127.0.0.1:3000', username: '', password: '', loginerrors: ''}
  },
  components: {
    Register
  },
  computed: {
    loginError: function () {
      return this.loginerrors
    },
    loggedIn: function () {
      return this.$store.state.session.data.authenticated
    }
  },
  methods: {
    loginUser () {
      errorHandler.report(`login username ${this.username}`)
      let callbackThis = this
      apiService.loginUser(this.server, this.username, this.password).then((response) => {
        //  if login was successful, there will be a JWT token in the response
        errorHandler.report(response)
        if (response.Authenticated) {
          callbackThis.$store.commit('updateAuthentication',
            {authenticateduser: callbackThis.username, newtoken: response.token})
          callbackThis.$store.commit('setEventSource', callbackThis.server)
          apiService.loadUsersProjects().then(data => {
            callbackThis.$store.commit('storeUserProjects', data)
          })
          callbackThis.loginerrors = ''
        } else if (response.invaliduser) {
          callbackThis.loginerrors = 'no user found'
        } else {
          callbackThis.loginerrors = 'password is incorrect!'
        }
      })
    },
    logoutUser () {
      this.$store.commit('destroySession')
    }
  }
}
</script>
