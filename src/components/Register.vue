<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small block v-on="on" raised>
          Register
      </v-btn>
    </template>
    <v-container>
      <v-layout row>
        <v-flex md6>
          <v-card>
            <v-card-title>
              <span class="headline">Register</span>
            </v-card-title>
            <v-card-text>
              <validation-observer>
                <validation-provider rules="required|alpha_num" name="Username" v-slot="{ errors }">
                  <v-text-field autocomplete="off" v-model="username" label="Username" :error-messages="errors"/>
                </validation-provider>
                <validation-provider rules="required|email" name="email" v-slot="{ errors }">
                  <v-text-field autocomplete="off" v-model="email" label="Email address" :error-messages="errors"/>
                </validation-provider>
                <validation-provider rules="required|email" name="confirmEmail" v-slot="{ errors }">
                  <v-text-field autocomplete="off" v-model="confirmemail" label="Confirm Email" :error-messages="errors"/>
                </validation-provider>
                <validation-provider rules="required|min:6" name="password" v-slot="{ errors }">
                  <v-text-field autocomplete="off" v-model="password" type="password" label="Password" :error-messages="errors"/>
                </validation-provider>
                <validation-provider rules="required|confirmed:password" name="confirmPassword" v-slot="{ errors }">
                  <v-text-field autocomplete="off" v-model="confirmpassword" type="password" label="Confirm Password" :error-messages="errors"/>
                </validation-provider>
              </validation-observer>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false;">Cancel</v-btn>
              <validation-provider name="registerButton" v-slot="{ errors }">
                <v-btn text @click="dialog = false; registerNewUser()" :disabled="errors[0] || checkNullForms()">Create</v-btn>
              </validation-provider>
            </v-card-actions>  
          </v-card>
        </v-flex>
        <v-flex md6>
          <img :src="logo" class= "logo"/>
        </v-flex>
      </v-layout>
    </v-container>  
  </v-dialog>
</template>

<script>
import Logo from '../assets/Logo.png'
import {APIService} from '../store/modules/rest-api-module'
import {ValidationObserver, ValidationProvider, extend} from 'vee-validate'
import {required, alpha_num, email, min, confirmed} from 'vee-validate/dist/rules'
extend('required', required)
extend('alpha_num', alpha_num)
extend('email', email)
extend('min', min)
extend('confirmed', confirmed)

const apiService = new APIService()

export default {
  name: 'Register',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    server: {
      type: String,
      required: true
    }
  },
  computed: {
    isAuthenticated: function () {
      return this.$store.state.session.authenticated
    },
    registerErrors: function () {
      return this.registrationerrors
    }
  },
  data: function () {
    return {
      dialog: false,
      username: '',
      email: '',
      password: '',
      confirmpassword: '',
      confirmemail: '',
      registrationerrors: '',
      logo: Logo
    }
  },
  methods: {
    registerNewUser () {
      this.dialog=false
      let appThis = this
      apiService.registerUser(appThis.server, appThis.username, appThis.email, appThis.password).then((response) => {
        if (!response.Authenticated) {
          appThis.registrationerrors = 'appThis username is already taken'
        }
      })
    },
    checkNullForms () {
      if (this.username === '' || this.email === '' || this.password === '' || this.confirmpassword === '' || this.confirmemail === '') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
.logo{
  height: 100%;
  width: 100%;
  object-fit: cover; 
}
</style>


