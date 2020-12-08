<template>
      <v-text-field :label=getName dense class="ml-2 ma-0 pa-0 body-2" v-model="getValue"/>
</template>

<script>
export default {
  name: 'optimizer-option',
  props: ['optimization', 'name', 'value'],
  computed: {
    getName: function () {
      if ('alias' in this.value) {
        return this.value.alias
      } else {
        return this.name
      }
    },
    getValue: {
      set: function (newVal) {
        this.$store.commit('setOptimizationOptimizerOption', {optimization: this.optimization, optionName: this.name, optionValue: newVal})
      },
      get: function () {
        return this.value.value
      }
    }
  }
}
</script>
