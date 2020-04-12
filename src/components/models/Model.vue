<template>
    <div v-if="type === 'ExodusModel'">
      <exodus-model :model="model" :displayID="'model_'+displayID"/>
    </div>
</template>

<script>
import ExodusModel from './ExodusModel'

export default {
  name: 'model-tree',
  props: ['model', 'displayID'],
  computed: {
    type: function () {
      return this.model._type
    }
  },
  components: {
    ExodusModel
  }
}
</script>
