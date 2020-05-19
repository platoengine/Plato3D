<template>
  <v-text-field dense class="ma-0 pa-0 body-2" v-model="parameterValue" :label="name" v-on:input="setPending()"/>
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
    }
  },
  methods: {
    setPending: function () {
      this.$emit('pending')
    }
  }
}
</script>
