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
    return {
      stateValue: ''
    , stateDescription: ''
    , indicator : {color : 'red'}
    , value:''
    }
  },
  created: function () {
    this.value = this.parentObject.parameters.find(p => p.ParameterName === this.parameterName).value
    this.stateValue = this.value
  },
  computed: {
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
  watch: {
    value: {
      handler: function() {
        this.stateValue = this.value
        this.emitDisplayColor()
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
    },
    emitDisplayColor: function () {
      if(this.stateValue!= ""){
        this.indicator.color = 'green'
      } else {
        this.indicator.color = 'red'
      }
      this.$emit('change-color', this.indicator)
    }
  }
}
</script>
