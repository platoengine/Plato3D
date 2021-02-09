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
          </v-col>
        </v-container>
        <v-btn block text @click="dialog = false; create()">Create</v-btn>
      </v-card>
      <v-btn block text @click="dialog = false; clear()">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'new-optimization',
  data: function () {
    return {name: '', description: '', dialog: false}
  },
  computed: {
    rules () {
      const rules = []
      const rule = v => (this.isUnique(v)) || 'Optimization already exists'
      rules.push(rule)
      return rules
    }
  },
  methods: {
    isUnique (name) {
      const optimizationIndex = this.$store.state.optimizations.findIndex(m => m.name === name)
      if (optimizationIndex === -1) {
        return true
      }
      return false
    },
    create: function () {
      this.$store.commit('addOptimization', {name: this.name, description: this.description})
      this.clear()
    },
    clear: function () {
      this.name = ''
    }
  }
}
</script>
