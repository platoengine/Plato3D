<template>
  <v-checkbox dense class="ma-0 pa-0" :label="label" v-model="computedState"/>
</template>

<script>
export default {
  name: 'PCheckbox',
  computed: {
    computedState: {
      get: function () { return this.state },
      set: function (val) { this.$emit('change-state', val) }
    }
  },
  props: [ 'label', 'state' ]
};
</script>
