import Vue from 'vue'
import ThreeContainer from '../modules/three-container-module'

Vue.prototype.$graphics = Vue.axios = new ThreeContainer()
Vue.prototype.$graphics.initialize()

export default Vue
