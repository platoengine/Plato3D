<template>
  <v-dialog v-model="dialog" persistent max-width=500>
    <template v-slot:activator="{ on }">
      <v-btn x-large block v-on="on" raised> Create </v-btn>
    </template>
    <v-card>
      <v-card class="ma-2" outlined>
        <v-container>
          <v-col>
            <v-text-field autocomplete="off" dense class="ma-0 pa-0" :rules="rules" v-model="name" label="Name"/>
            <v-textarea outlined dense class="ma-0 pa-0" v-model="description" label="Description"/>
            <v-select dense class="ma-0 pa-0" v-model="selectedScenario" :items="availableScenarios()" label="Scenario"/>
          </v-col>
        </v-container>
        <v-btn block text @click="dialog = false; create()" :disabled="this.selectedScenario===''">Create</v-btn>
      </v-card>
      <v-btn block text @click="dialog = false; clear()">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'new-realization',
  props: ['realizations'],
  data: function () {
    return {name: '', description: '', selectedScenario: '', dialog: false}
  },
  computed: {
    rules () {
      const rules = []
      const rule = v => (this.isUnique(v)) || 'Realization already exists'
      rules.push(rule)
      return rules
    }
  },
  methods: {
    availableScenarios: function () {
      return this.$store.state.scenarios.map(s => s.name)
    },
    isUnique (name) {
      const realizationIndex = this.$store.state.realizations.findIndex(m => m.name === name)
      if (realizationIndex === -1) {
        return true
      }
      return false
    },
    create: function () {
      this.$store.commit('addRealization', {name: this.name, description: this.description, scenarioName: this.selectedScenario})
      this.clear()
    },
    clear: function () {
      this.name = ''
    }
  }
}
</script>
