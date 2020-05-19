<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small block v-on="on" raised>
          New Parameter
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">New Parameter</span>
      </v-card-title>
      <v-card-text>
        <v-container>
            <v-col>
              <v-text-field dense class="ma-0 pa-0" :rules="rules" v-model="name" label="Name"/>
              <v-text-field dense class="ma-0 pa-0" v-model="value" label="Value"/>
              <v-textarea outlined dense class="ma-0 pa-0" v-model="description" label="Description"/>
            </v-col>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false; clear()">Cancel</v-btn>
        <v-btn text @click="dialog = false; create()" :disabled="!isValid()">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'new-parameter',
  props: ['parentObject'],
  data: function () {
    return {name: '', value: '', description: '', dialog: false}
  },
  computed: {
    rules () {
      const rules = []
      const rule = v => (this.isUnique(v)) || 'Parameter already exists'
      rules.push(rule)
      return rules
    }
  },
  methods: {
    isValid () {
      return this.name !== '' && this.value !== ''
    },
    isUnique (name) {
      const parameterIndex = this.parentObject.parameters.findIndex(p => p.ParameterName === name)
      if (parameterIndex === -1) {
        return true
      }
      return false
    },
    create: function () {
      this.$store.commit('addParameter',
      {
        parentObject: this.parentObject,
        definition: {
          ParameterName: this.name,
          value: this.value,
          description: this.description
        }
      })
      this.clear()
    },
    clear: function () {
      this.name = ''
      this.value = ''
      this.description = ''
    }
  }
}
</script>
