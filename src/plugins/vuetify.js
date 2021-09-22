import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import Models from '@/icons/Models.vue'
import Scenarios from '@/icons/Scenarios.vue'
import Realize from '@/icons/Realize.vue'
import Optimize from '@/icons/Optimize.vue'
import Wireframe from '@/icons/Wireframe.vue'
import Solid from '@/icons/Solid.vue'
import Discard from '@/icons/Discard.vue'
import Visible from '@/icons/Visible.vue'
import Invisible from '@/icons/Invisible.vue'


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
      wireframe: {
        component: Wireframe,
      },
      solid: {
        component: Solid,
      },
      discard: {
        component: Discard,
      },
      visible: {
        component: Visible,
      },
      invisible: {
        component: Invisible,
      },
    },
  },
});
