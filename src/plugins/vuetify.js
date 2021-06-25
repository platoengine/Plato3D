import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import Models from '@/icons/Models.vue'
import Scenarios from '@/icons/Scenarios.vue'
import Realize from '@/icons/Realize.vue'
import Optimize from '@/icons/Optimize.vue'


export default new Vuetify({
  icons: {
    values: {
      models: {
        component: Models,
      },
      scenarios: {
        component: Scenarios,
      },
      realize: {
        component: Realize,
      },
      optimize: {
        component: Optimize,
      },
    },
  },
});
