<template>
    <div v-if="type === 'ExodusModel'">
      <exodus-model :model="model"/>
    </div>
</template>

<script>
import ExodusModel from './ExodusModel'

export default {
  name: 'model-tree',
  props: ['model'],
  computed: {
    type: function () {
      return this.model.type
    }
  },
  components: {
    ExodusModel
  }
}
</script>
