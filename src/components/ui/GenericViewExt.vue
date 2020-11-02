<template>
  <div v-if="this.isActive">
    <v-card v-if="this.viewType === 'option-view'">
      <option-view :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
    </v-card>
    <v-card v-else-if="this.viewType === 'single-view'">
      <single-view :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
    </v-card>
    <v-card v-else-if="this.viewType === 'list-view'">
      <list-view :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
    </v-card>
  </div>
</template>

<script>
import OptionView from './OptionView'
import SingleView from './SingleView'
import ListView from './ListView'

export default {
  name: 'generic-view-ext',
  props: ['scenario', 'modelviews', 'name'],
  components: {
    OptionView,
    SingleView,
    ListView
  },
  data: function () {
    return {
      viewType: ''
    }
  },
  created: function () {
    this.viewType = this.modelviews[this.name]['view']['type']
  },
  computed: {
    isActive: function () {
      let tParent = this.modelviews[this.name]
      if (Object.prototype.hasOwnProperty.call(tParent, 'isActive')) {
        return tParent.isActive(this.modelviews);
      }
      return true
    }
  }
}
</script>
