<template>
   <div v-if='hasOptions'>
     <v-select :label=getName dense class="ml-2 ma-0 pa-0 body-2" v-model="getValue" :items="getOptions()"/>
   </div>
   <div v-else>
     <v-text-field autocomplete="off" :label=getName dense class="ml-2 ma-0 pa-0 body-2" v-model="getValue"/>
   </div>
</template>

<script>
export default {
  name: 'solver-option',
  props: ['optimization', 'name', 'value'],
  computed: {
    getName: function () {
      if ('alias' in this.value) {
        return this.value.alias
      } else {
        return this.name
      }
    },
    hasOptions: function () {
      return 'options' in this.value
    },
    getValue: {
      set: function (newVal) {
        this.$store.commit('setOptimizationSolverOption', {optimization: this.optimization, optionName: this.name, optionValue: newVal})
      },
      get: function () {
        return this.value.value
      }
    }
  },
  methods: {
    getOptions: function () {
      return this.value.options
    }
  }
}
</script>
