<template>
      <div v-if="hasOptions()">
      <v-select  :label=getName dense class="ml-2 ma-0 pa-0 body-2" v-model="getValue" :items="getOptions"/>
      </div>
      <div v-else>
      <v-text-field autocomplete="off" :label=getName dense class="ml-2 ma-0 pa-0 body-2" v-model="getValue"/>
      </div>
</template>

<script>
export default {
  name: 'optimizer-option',
  props: ['optimization', 'name', 'value'],
  methods: {
    hasOptions: function () {
      return ('options' in this.value)
    }
  },
  computed: {
    getOptions: function () {
      if (this.hasOptions()) {
        return this.value.options
      } else {
        return []
      }
    },
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
