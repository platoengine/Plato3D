<template>
  <v-dialog v-model="dialog" persistent max-width=500>
    <template v-slot:activator="{ on }">
      <v-btn x-large block v-on="on" raised> Create/Load </v-btn>
    </template>
    <v-card>
    <v-card class="ma-2" outlined>
    <v-container>
      <v-col>
        <v-text-field dense class="ma-0 pa-0" :rules="rules" v-model="name" label="Name"/>
        <v-textarea outlined dense class="ma-0 pa-0" v-model="description" label="Description"/>
      </v-col>
    </v-container>
    </v-card>
    <v-expansion-panels class="ma-0 pa-2" accordion focusable multiple v-model="openPanel">
    <v-expansion-panel>
      <v-expansion-panel-header>Create</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card outlined>
        <v-container>
          <v-col>
            <v-select dense class="ma-0 pa-0" v-model="type" :items="availableTypes()" label="Type"/>
          </v-col>
        </v-container>
        </v-card>
        <v-btn block text @click="dialog = false; create()" :disabled="this.type===''">Create</v-btn>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>Load</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card outlined>
        <import-scenario :name="name" v-on:close-panel="dialog=false"/>
        <v-spacer></v-spacer>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
    <v-btn block text @click="dialog = false; clear()">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import ImportScenario from './ImportScenario'

export default {
  name: 'new-scenario',
  data: function () {
    return {name: '', description: '', type: '', dialog: false, openPanel: [0]}
  },
  mounted () {
    const availableTypes = this.availableTypes()
    if( availableTypes.length > 0 ) {
      this.type = availableTypes[0]
    }
  },
  watch: {
    openPanel: function (newVal, oldVal) {
      if(oldVal.toString() === [0].toString() && newVal.toString() === [0,1].toString()) this.openPanel = [1]
      if(oldVal.toString() === [1].toString() && newVal.toString() === [1,0].toString()) this.openPanel = [0]
    }
  },
  components: {
    ImportScenario
  },
  computed: {
    rules () {
      const rules = []
      const rule = v => (this.isUnique(v)) || 'Scenario already exists'
      rules.push(rule)
      return rules
    }
  },
  methods: {
    availableTypes: function () {
      return Array.from(this.$store.state.availableScenarioTypes.keys())

    },
    isUnique (name) {
      const scenarioIndex = this.$store.state.scenarios.findIndex(m => m.name === name)
      if (scenarioIndex === -1) {
        return true
      }
      return false
    },
    create: function () {
      this.$store.commit('addScenario', {name: this.name, description: this.description, type: this.type})
      this.clear()
    },
    clear: function () {
      this.name = ''
      this.type = ''
    }
  }
}
</script>
