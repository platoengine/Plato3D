<template>
  <v-card outlined class="ma-1 pa-1">
    <v-card-title class="ma-0 pa-0 overline">{{ label }}</v-card-title>
    <v-container class="ma-0 py-1">
      <v-row no-gutters>
      <v-col class="px-2"><v-checkbox dense class="ma-0 pa-0" label="Active" v-model="computedState"/></v-col>
      <v-col class="px-2"><v-text-field dense autocomplete="off" label="Min" v-model="computedMin"/></v-col>
      <v-col class="px-2"><v-text-field dense autocomplete="off" label="Max" v-model="computedMax"/></v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'PAxisControl',
  computed: {
    computedMin: {
      get: function () { return this.min },
      set: function (val) { this.$emit('change-min', val) }
    },
    computedMax: {
      get: function () { return this.max },
      set: function (val) { this.$emit('change-max', val) }
    },
    computedState: {
      get: function () { return this.state },
      set: function (val) { this.$emit('change-state', val) }
    }
  },
  props: [ 'label', 'state', 'min', 'max' ]
};
</script>
