<template>
  <v-checkbox v-if="isCheckbox()" dense class="ml-2 ma-0 pa-0 body-2" v-model="checkboxValue" :label="checkboxName" v-on:change="setPending()"/>
  <v-text-field v-else dense class="ml-2 ma-0 pa-0 body-2" v-model="parameterValue" :label="name" v-on:input="setPending()"/>
</template>

<script>

export default {
  name: 'array-input',
  props: {
    data: String,
    name: String
  },
  computed: {
    parameterValue: {
      set: function (param) {
        this.$emit('set-value', param)
      },
      get: function () {
        return this.data
      }
    },
    checkboxValue: {
      set: function (param) {
        let tokens = this.data.split('|')
        let result = (param === true ? 'true' : 'false') + '|' + tokens[1]
        this.$emit('set-value', result)
      },
      get: function () {
        let tokens = this.data.split('|')
        if (tokens.length === 2) {
          return (tokens[0] === 'true' ? true : false)
        }
        return false
      }
    },
    checkboxName: function () {
      let tokens = this.name.split('|')
      if (tokens.length === 2) {
        return tokens[1]
      }
      return this.name
    }
  },
  methods: {
    isCheckbox: function () {
      // if the name property has 'checkbox|' prepended, then display as a checkbox
      let tokens = this.name.split('|')
      if (tokens.length === 2) {
        if (tokens[0] === 'checkbox') {
          return true
        }
      }
      return false
    },
    setPending: function () {
      this.$emit('pending')
    }
  }
}
</script>
