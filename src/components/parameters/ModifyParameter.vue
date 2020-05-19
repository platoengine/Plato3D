<template>
  <v-card>
    <v-card-text>
      <v-text-field dense class="ma-0 pa-0" v-model="value" label="Value"/>
      <v-textarea outlined dense :no-resize=true rows=3 class="ma-0 pa-0" v-model="description" label="Description"/>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="modify()">Modify</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'modify-parameter',
  props: ['parentObject', 'parameterName'],
  data: function () {
    return {stateValue: '', stateDescription: ''}
  },
  computed: {
    value: {
      get: function () {
        let thisParameter = this.parentObject.parameters.find(p => p.ParameterName === this.parameterName)
        return thisParameter.value
      },
      set: function (newValue) {
        this.stateValue = newValue
      }
    },
    description: {
      get: function () {
        let thisParameter = this.parentObject.parameters.find(p => p.ParameterName === this.parameterName)
        return thisParameter.description
      },
      set: function (newValue) {
        this.stateDescription = newValue
      }
    }
  },
  methods: {
    modify: function () {
      this.$store.commit('modifyParameter',
        {
          parentObject: this.parentObject,
          definition: {
            ParameterName: this.parameterName,
            value: this.stateValue,
            description: this.stateDescription
          }
        }
      )
    }
  }
}
</script>
