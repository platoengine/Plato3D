<template>
  <div>
    <div v-if="this.viewType === 'option-view'">
      <option-view :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
    </div>
    <div v-else-if="this.viewType === 'single-view'">
      <single-view :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
    </div>
    <div v-else-if="this.viewType === 'list-view'">
      <list-view :scenario="this.scenario" :modelviews="this.modelviews" :name="this.name"/>
    </div>
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
  }
}
</script>
